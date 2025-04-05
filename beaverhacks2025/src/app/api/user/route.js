// /pages/api/user.js (or app/api/user/route.js with modifications for App Router)
import { verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ username: decoded.username });
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
