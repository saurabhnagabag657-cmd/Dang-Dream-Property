type ApiResult<T = unknown> = {
  data: T | null;
  error: { message: string } | null;
};

async function postJson<T = unknown>(path: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
      data?: T;
      ok?: boolean;
    };

    if (!response.ok) {
      return {
        data: null,
        error: { message: payload.error || payload.message || "Request failed. Please try again." },
      };
    }

    return {
      data: (payload.data ?? (payload.ok ? ({} as T) : null)) as T | null,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: { message: "Network error. Please try again." },
    };
  }
}

export function requestSignupEmail(email: string, password: string, username?: string) {
  return postJson("/api/email/auth/signup", { email, password, username });
}

export function requestPasswordResetEmail(email: string) {
  return postJson("/api/email/auth/recovery", { email });
}

export function requestMagicLinkEmail(email: string) {
  return postJson("/api/email/auth/magic-link", { email });
}

export function requestVerificationResendEmail(email: string) {
  return postJson("/api/email/auth/resend-verification", { email });
}

export type ContactEmailInput = {
  name: string;
  phone: string;
  email?: string;
  service: string;
  propertyType?: string;
  budget?: string;
  message: string;
};

export function sendContactEmail(payload: ContactEmailInput) {
  return postJson("/api/email/contact", payload);
}

export type PropertyEnquiryInput = {
  name: string;
  phone: string;
  email?: string;
  role: string;
  propertyName: string;
  propertyLocation?: string;
  message: string;
};

export function sendPropertyEnquiryEmail(payload: PropertyEnquiryInput) {
  return postJson("/api/email/property-enquiry", payload);
}
