import "@tanstack/react-start/server-only";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

type RuntimeEnv = Record<string, string | undefined> | unknown;

type AuthEmailAction =
  | "signup"
  | "recovery"
  | "magic-link"
  | "resend-verification";

type ContactEmailPayload = {
  name: string;
  phone: string;
  email?: string;
  service: string;
  propertyType?: string;
  budget?: string;
  message: string;
};

type PropertyEnquiryPayload = {
  name: string;
  phone: string;
  email?: string;
  role: string;
  propertyName: string;
  propertyLocation?: string;
  message: string;
};

const authSignupSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
  username: z.string().trim().min(3).max(64).optional(),
});

const authEmailSchema = z.object({
  email: z.string().trim().email(),
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().optional().or(z.literal("")),
  service: z.string().trim().min(1).max(120),
  propertyType: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
});

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().optional().or(z.literal("")),
  role: z.string().trim().min(1).max(80),
  propertyName: z.string().trim().min(1).max(180),
  propertyLocation: z.string().trim().max(180).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
});

function readConfigValue(env: RuntimeEnv, keys: string[]): string {
  if (env && typeof env === "object") {
    const record = env as Record<string, unknown>;
    for (const key of keys) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  if (typeof process !== "undefined" && process.env) {
    for (const key of keys) {
      const value = process.env[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  return "";
}

function normalizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value.replace(/\/+$/, "");
  }
  return `https://${value.replace(/\/+$/, "")}`;
}

function getSiteUrl(env: RuntimeEnv): string {
  const fromEnv = readConfigValue(env, ["VITE_SITE_URL", "SITE_URL", "PUBLIC_SITE_URL"]);
  if (fromEnv) return normalizeUrl(fromEnv);
  return "http://localhost:3000";
}

function getSupabaseUrl(env: RuntimeEnv): string {
  const fromEnv = readConfigValue(env, ["SUPABASE_URL", "VITE_SUPABASE_URL"]);
  return normalizeUrl(fromEnv);
}

function getServiceRoleKey(env: RuntimeEnv): string {
  return readConfigValue(env, ["SUPABASE_SERVICE_ROLE_KEY"]);
}

function getResendApiKey(env: RuntimeEnv): string {
  return readConfigValue(env, ["RESEND_API_KEY"]);
}

function getResendFromEmail(env: RuntimeEnv): string {
  return readConfigValue(env, ["RESEND_FROM_EMAIL"]);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraph(text: string) {
  return `<p style="margin:0 0 14px;color:#334155;line-height:1.7;font-size:15px;">${escapeHtml(text)}</p>`;
}

function emailShell(args: {
  title: string;
  preheader: string;
  heading: string;
  intro: string;
  body?: string[];
  ctaText?: string;
  ctaUrl?: string;
  footer?: string;
}): { html: string; text: string } {
  const bodyHtml = (args.body ?? []).map(paragraph).join("");
  const ctaHtml = args.ctaText && args.ctaUrl
    ? `<div style="margin:28px 0 12px;"><a href="${escapeHtml(args.ctaUrl)}" style="display:inline-block;background:#d4a43a;color:#0b1220;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:12px;">${escapeHtml(args.ctaText)}</a></div>`
    : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f7f3ea;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(args.preheader)}</div>
    <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;">
        <div style="background:#0b1f5b;color:#fff;padding:26px 28px;">
          <div style="font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;opacity:.8;">Dang Dream Property</div>
          <h1 style="margin:8px 0 0;font-size:26px;line-height:1.2;">${escapeHtml(args.heading)}</h1>
        </div>
        <div style="padding:28px;">
          ${paragraph(args.intro)}
          ${bodyHtml}
          ${ctaHtml}
          <p style="margin:18px 0 0;color:#64748b;font-size:12px;line-height:1.6;">${escapeHtml(args.footer ?? "If the button does not open, copy and paste the full link into your browser.")}</p>
        </div>
      </div>
    </div>
  </body>
</html>`;

  const text = [
    args.preheader,
    "",
    args.heading,
    "",
    args.intro,
    ...(args.body ?? []),
    ...(args.ctaUrl ? [`Link: ${args.ctaUrl}`] : []),
    "",
    args.footer ?? "If the button does not open, copy and paste the full link into your browser.",
  ].join("\n");

  return { html, text };
}

async function sendResendEmail(
  env: RuntimeEnv,
  args: {
    to: string | string[];
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
  }
) {
  const apiKey = getResendApiKey(env);
  const from = getResendFromEmail(env);

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }
  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is missing.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      ...(args.replyTo ? { reply_to: args.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend request failed (${response.status}): ${detail || response.statusText}`);
  }

  return response.json();
}

function createSupabaseAdminClient(env: RuntimeEnv) {
  const supabaseUrl = getSupabaseUrl(env);
  const serviceRoleKey = getServiceRoleKey(env);

  if (!supabaseUrl) {
    throw new Error("Supabase URL is missing.");
  }
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function sendAuthEmail(
  env: RuntimeEnv,
  action: AuthEmailAction,
  params: { email: string; username?: string; password?: string }
) {
  const supabase = createSupabaseAdminClient(env);
  const siteUrl = getSiteUrl(env);
  const redirectTo = new URL("/auth/callback", siteUrl).toString();
  const commonFooter = "Dang Dream Property support";

  if (action === "signup") {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "signup",
      email: params.email,
      password: params.password,
      options: {
        data: {
          username: params.username || params.email.split("@")[0],
        },
        redirectTo,
      },
    });

    if (error) throw error;

    const actionLink = data.properties?.action_link;
    if (!actionLink) {
      throw new Error("Supabase did not return a verification link.");
    }

    const payload = emailShell({
      title: "Verify your email",
      preheader: "Verify your Dang Dream Property account",
      heading: "Verify your email address",
      intro: "Thanks for joining Dang Dream Property. Please verify your email address to finish creating your account.",
      body: [
        `Account email: ${params.email}`,
        "Once you verify, you can sign in and continue using the platform.",
      ],
      ctaText: "Verify Email",
      ctaUrl: actionLink,
      footer: commonFooter,
    });

    await sendResendEmail(env, {
      to: params.email,
      subject: "Verify your Dang Dream Property account",
      html: payload.html,
      text: payload.text,
    });
    return { ok: true };
  }

  if (action === "recovery") {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: params.email,
      options: {
        redirectTo,
      },
    });

    if (error) throw error;

    const actionLink = data.properties?.action_link;
    if (!actionLink) {
      throw new Error("Supabase did not return a password reset link.");
    }

    const payload = emailShell({
      title: "Reset your password",
      preheader: "Reset your Dang Dream Property password",
      heading: "Reset your password",
      intro: "We received a request to reset your Dang Dream Property password.",
      body: [
        "If you made this request, use the button below to continue. The link is time-sensitive and will expire for security.",
      ],
      ctaText: "Reset Password",
      ctaUrl: actionLink,
      footer: commonFooter,
    });

    await sendResendEmail(env, {
      to: params.email,
      subject: "Reset your Dang Dream Property password",
      html: payload.html,
      text: payload.text,
    });
    return { ok: true };
  }

  if (action === "magic-link") {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: params.email,
      options: {
        redirectTo,
      },
    });

    if (error) throw error;

    const actionLink = data.properties?.action_link;
    if (!actionLink) {
      throw new Error("Supabase did not return a sign-in link.");
    }

    const payload = emailShell({
      title: "Sign in to your account",
      preheader: "Your Dang Dream Property sign-in link",
      heading: "Sign in to Dang Dream Property",
      intro: "Use this secure link to sign in without entering a password.",
      body: [
        "If you did not request this link, you can ignore this email safely.",
      ],
      ctaText: "Sign In",
      ctaUrl: actionLink,
      footer: commonFooter,
    });

    await sendResendEmail(env, {
      to: params.email,
      subject: "Your Dang Dream Property sign-in link",
      html: payload.html,
      text: payload.text,
    });
    return { ok: true };
  }

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "signup",
    email: params.email,
    options: {
      redirectTo,
    },
  });

  if (error) throw error;

  const actionLink = data.properties?.action_link;
  if (!actionLink) {
    throw new Error("Supabase did not return a verification link.");
  }

  const payload = emailShell({
    title: "Verify your email",
    preheader: "Verify your Dang Dream Property account",
    heading: "Verify your email address",
    intro: "Please verify your email address to finish setting up your Dang Dream Property account.",
    body: ["Use the button below to continue."],
    ctaText: "Verify Email",
    ctaUrl: actionLink,
    footer: commonFooter,
  });

  await sendResendEmail(env, {
    to: params.email,
    subject: "Verify your Dang Dream Property account",
    html: payload.html,
    text: payload.text,
  });
  return { ok: true };
}

async function sendContactEmail(env: RuntimeEnv, payload: ContactEmailPayload) {
  const companyEmail = "dangdreamproperty@gmail.com";
  const message = emailShell({
    title: "New contact enquiry",
    preheader: "New contact form submission from Dang Dream Property",
    heading: "New contact enquiry",
    intro: "A visitor has submitted the contact form on the Dang Dream Property website.",
    body: [
      `Name: ${payload.name}`,
      `Phone: ${payload.phone}`,
      payload.email ? `Email: ${payload.email}` : "Email: Not provided",
      `Service: ${payload.service}`,
      payload.propertyType ? `Property type: ${payload.propertyType}` : "Property type: Not provided",
      payload.budget ? `Budget: ${payload.budget}` : "Budget: Not provided",
      "",
      `Message: ${payload.message}`,
    ],
    footer: payload.email || payload.phone ? "Reply directly to the visitor using the contact details above." : "Visitor contact details were not provided.",
  });

  await sendResendEmail(env, {
    to: companyEmail,
    subject: `New contact enquiry from ${payload.name}`,
    html: message.html,
    text: message.text,
    replyTo: payload.email || undefined,
  });

  if (payload.email) {
    const ack = emailShell({
      title: "We received your message",
      preheader: "Thanks for contacting Dang Dream Property",
      heading: "Thanks for reaching out",
      intro: "We received your message and our team will review it shortly.",
      body: [
        "You can expect a response within 24 hours during working hours.",
      ],
      footer: commonFooter,
    });

    await sendResendEmail(env, {
      to: payload.email,
      subject: "We received your message",
      html: ack.html,
      text: ack.text,
    });
  }

  return { ok: true };
}

async function sendPropertyEnquiryEmail(env: RuntimeEnv, payload: PropertyEnquiryPayload) {
  const companyEmail = "dangdreamproperty@gmail.com";
  const message = emailShell({
    title: "New property enquiry",
    preheader: `New enquiry for ${payload.propertyName}`,
    heading: "New property enquiry",
    intro: "A visitor has submitted an enquiry from a property detail page.",
    body: [
      `Property: ${payload.propertyName}`,
      payload.propertyLocation ? `Location: ${payload.propertyLocation}` : "Location: Not provided",
      `Name: ${payload.name}`,
      `Phone: ${payload.phone}`,
      payload.email ? `Email: ${payload.email}` : "Email: Not provided",
      `Interested as: ${payload.role}`,
      "",
      `Message: ${payload.message}`,
    ],
    footer: payload.email || payload.phone ? "Reply using the details above to continue the conversation." : "Visitor contact details were not provided.",
  });

  await sendResendEmail(env, {
    to: companyEmail,
    subject: `Property enquiry: ${payload.propertyName}`,
    html: message.html,
    text: message.text,
    replyTo: payload.email || undefined,
  });

  if (payload.email) {
    const ack = emailShell({
      title: "We received your enquiry",
      preheader: "Thanks for your property enquiry",
      heading: "Thanks for your enquiry",
      intro: `We received your enquiry for ${payload.propertyName}.`,
      body: ["Our team will get back to you soon."],
      footer: commonFooter,
    });

    await sendResendEmail(env, {
      to: payload.email,
      subject: `We received your enquiry for ${payload.propertyName}`,
      html: ack.html,
      text: ack.text,
    });
  }

  return { ok: true };
}

async function readJsonBody(request: Request) {
  const text = await request.text();
  if (!text.trim()) return {};
  return JSON.parse(text) as unknown;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function handleEmailApiRequest(request: Request, env: RuntimeEnv) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/email/")) {
    return null;
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    if (url.pathname === "/api/email/auth/signup") {
      const body = authSignupSchema.parse(await readJsonBody(request));
      return jsonResponse(
        await sendAuthEmail(env, "signup", {
          email: body.email,
          password: body.password,
          username: body.username,
        })
      );
    }

    if (url.pathname === "/api/email/auth/recovery") {
      const body = authEmailSchema.parse(await readJsonBody(request));
      return jsonResponse(
        await sendAuthEmail(env, "recovery", {
          email: body.email,
        })
      );
    }

    if (url.pathname === "/api/email/auth/magic-link") {
      const body = authEmailSchema.parse(await readJsonBody(request));
      return jsonResponse(
        await sendAuthEmail(env, "magic-link", {
          email: body.email,
        })
      );
    }

    if (url.pathname === "/api/email/auth/resend-verification") {
      const body = authEmailSchema.parse(await readJsonBody(request));
      return jsonResponse(
        await sendAuthEmail(env, "resend-verification", {
          email: body.email,
        })
      );
    }

    if (url.pathname === "/api/email/contact") {
      const body = contactSchema.parse(await readJsonBody(request));
      return jsonResponse(await sendContactEmail(env, body));
    }

    if (url.pathname === "/api/email/property-enquiry") {
      const body = enquirySchema.parse(await readJsonBody(request));
      return jsonResponse(await sendPropertyEnquiryEmail(env, body));
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return jsonResponse({ error: message }, 400);
  }
}
