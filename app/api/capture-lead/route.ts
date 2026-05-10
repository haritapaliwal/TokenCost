import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in ms

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, auditId, teamSize, honeypot } = body;

    // 1. Honeypot check
    if (honeypot) {
      console.warn('Bot detected via honeypot');
      return NextResponse.json({ success: true }); // Silent fail
    }

    // 2. Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 3. Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const limit = rateLimitMap.get(ip);

    if (limit) {
      if (now - limit.lastReset > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
      } else if (limit.count >= RATE_LIMIT_COUNT) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Try again in an hour.' },
          { status: 429 }
        );
      } else {
        limit.count++;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    }

    // 4. Save to Supabase
    const { error: dbError } = await supabaseAdmin.from('leads').insert({
      audit_id: auditId,
      email,
      team_size: teamSize,
    });

    if (dbError) {
      console.error('Supabase capture-lead error:', dbError);
      throw dbError;
    }

    // 5. Send Email via Resend
    try {
      await resend.emails.send({
        from: 'AI Spend Audit <onboarding@resend.dev>',
        to: email,
        subject: 'Your AI Spend Audit Report',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 12px;">
            <h1 style="color: #2563eb;">AI Spend Audit</h1>
            <p>Thanks for using our deterministic audit engine.</p>
            <p>Your report has been saved. You can view it anytime using the link below:</p>
            <p style="margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/audit/${auditId}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                 View My Audit Report
              </a>
            </p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #666;">
              This is an automated report from the AI Spend Audit platform. 
              If you have significant savings identified, a Credex specialist may reach out to help you unlock enterprise-grade credits.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Resend error:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in capture-lead route:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
