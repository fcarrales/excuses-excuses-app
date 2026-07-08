import { APP_NAME, APP_VERSION } from "@/lib/appInfo";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_MESSAGE_LENGTH = 5000;
const MAX_NAME_LENGTH = 100;

interface FeedbackBody {
  name?: string;
  email?: string;
  message?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function methodNotAllowed() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export function GET() {
  return methodNotAllowed();
}

export function PUT() {
  return methodNotAllowed();
}

export function PATCH() {
  return methodNotAllowed();
}

export function DELETE() {
  return methodNotAllowed();
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.FEEDBACK_TO_EMAIL;
  const fromEmail = process.env.FEEDBACK_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return NextResponse.json(
      { error: "Feedback is not configured on the server." },
      { status: 503 },
    );
  }

  let body: FeedbackBody;
  try {
    body = (await request.json()) as FeedbackBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message = body.message?.trim() ?? "";
  const name = body.name?.trim().slice(0, MAX_NAME_LENGTH) ?? "";
  const email = body.email?.trim() ?? "";

  if (!message) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 },
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const submittedAt = new Date().toISOString();

  const textLines = [
    `${APP_NAME} feedback`,
    `App version: ${APP_VERSION}`,
    `Submitted: ${submittedAt}`,
    `User agent: ${userAgent}`,
    "",
    name ? `Name: ${name}` : "Name: (not provided)",
    email ? `Email: ${email}` : "Email: (not provided)",
    "",
    "Message:",
    message,
  ];

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      ...(email ? { replyTo: email } : {}),
      subject: `${APP_NAME} feedback (v${APP_VERSION})`,
      text: textLines.join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Could not send feedback. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback send failed:", err);
    return NextResponse.json(
      { error: "Could not send feedback. Please try again later." },
      { status: 500 },
    );
  }
}
