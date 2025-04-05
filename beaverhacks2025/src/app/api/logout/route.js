import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the cookie by setting it to an empty value and expired
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // Immediately expired
  });

  return response;
}
