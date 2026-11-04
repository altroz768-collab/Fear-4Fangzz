import { getAccessToken } from "./gmailAuth";

export interface GmailEmailHeader {
  name: string;
  value: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  bodyText?: string;
  unread?: boolean;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
}

/**
 * Encodes text into a RFC 2822 message in base64url format suitable for Gmail API
 */
function createRawEmail(to: string, subject: string, bodyText: string): string {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    "Content-Type: text/plain; charset=UTF-8",
    "MIME-Version: 1.0",
    "",
    bodyText,
  ];
  const message = messageParts.join("\r\n");
  
  // Convert standard base64 to base64url
  const base64 = btoa(unescape(encodeURIComponent(message)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Lists user's Gmail messages
 */
export async function listGmailMessages(maxResults = 15, query = ""): Promise<GmailMessageSummary[]> {
  const token = await getAccessToken();
  if (!token) throw new Error("No Google access token found. Please sign in with Google.");

  const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
  url.searchParams.set("maxResults", String(maxResults));
  if (query) url.searchParams.set("q", query);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gmail API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const rawList: { id: string; threadId: string }[] = data.messages || [];

  // Fetch summary metadata in parallel for preview
  const summaries = await Promise.all(
    rawList.slice(0, 10).map(async (m) => {
      try {
        return await getGmailMessage(m.id);
      } catch (e) {
        return { id: m.id, threadId: m.threadId, subject: "(Unable to load subject)", snippet: "" };
      }
    })
  );

  return summaries;
}

/**
 * Fetches single Gmail message details
 */
export async function getGmailMessage(messageId: string): Promise<GmailMessageSummary> {
  const token = await getAccessToken();
  if (!token) throw new Error("No Google access token found. Please sign in with Google.");

  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch message ${messageId}`);
  }

  const data = await res.json();
  const headers: GmailEmailHeader[] = data.payload?.headers || [];
  
  const getHeader = (name: string) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || "";

  let bodyText = data.snippet || "";
  
  // Extract body if available
  if (data.payload?.body?.data) {
    try {
      const decoded = decodeURIComponent(escape(atob(data.payload.body.data.replace(/-/g, "+").replace(/_/g, "/"))));
      bodyText = decoded;
    } catch {}
  } else if (data.payload?.parts) {
    const textPart = data.payload.parts.find((p: any) => p.mimeType === "text/plain");
    if (textPart?.body?.data) {
      try {
        const decoded = decodeURIComponent(escape(atob(textPart.body.data.replace(/-/g, "+").replace(/_/g, "/"))));
        bodyText = decoded;
      } catch {}
    }
  }

  const isUnread = Boolean(data.labelIds?.includes("UNREAD"));

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet,
    subject: getHeader("Subject") || "(No Subject)",
    from: getHeader("From") || "Unknown Sender",
    to: getHeader("To") || "",
    date: getHeader("Date") || "",
    bodyText,
    unread: isUnread
  };
}

/**
 * Sends an email through Gmail API on user's behalf
 */
export async function sendGmailEmail(payload: SendEmailPayload): Promise<{ id: string; threadId: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error("No Google access token found. Please sign in with Google.");

  const raw = createRawEmail(payload.to, payload.subject, payload.body);

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to send email: ${err}`);
  }

  return await res.json();
}

/**
 * Permanently deletes an email from Gmail (Destructive action - requires prior user confirmation)
 */
export async function deleteGmailMessage(messageId: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) throw new Error("No Google access token found. Please sign in with Google.");

  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    throw new Error(`Failed to delete message: ${err}`);
  }

  return true;
}
