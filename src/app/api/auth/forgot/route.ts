import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  const { email } = await request.json();

  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  await prisma.user.update({
    where: { email },
    data: { resetPasswordToken: token, resetPasswordTokenExpiry: tokenExpiry },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset/${token}`;

  await transporter.sendMail({
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Password Reset',
    html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });

  return NextResponse.json({ message: 'Check your email for the reset link' });
}
