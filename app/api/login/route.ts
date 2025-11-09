import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Placeholder endpoint to accept login attempts during migration.
  // TODO: Replace with real authentication (NextAuth or custom credentials)
  // that validates against the legacy users table and establishes a secure session.
  const body = await req.json().catch(() => ({}));
  const { username } = body ?? {};

  return NextResponse.json(
    {
      ok: false,
      message:
        "Login API not implemented yet. Your UI is working; auth will be wired next.",
      echo: username ? { username } : undefined,
    },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json(
    { ok: false, message: "Method not allowed. Use POST /api/login." },
    { status: 405 }
  );
}
