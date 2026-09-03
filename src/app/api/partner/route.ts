const MAX = { name: 120, email: 200, org: 160, role: 60, message: 4000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = Partial<Record<'name' | 'email' | 'org' | 'role' | 'message' | 'trap', string>>;

function bad(error: string) {
  return Response.json({ ok: false, error }, { status: 400 });
}

function clean(value: string | undefined, max: number) {
  return (value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return bad('Could not read the submitted form.');
  }

  // Honeypot: a hidden field only automated submitters fill in. Accept silently
  // so bots get no signal, but never forward it.
  if (clean(body.trap, 20)) return Response.json({ ok: true });

  const email = clean(body.email, MAX.email);
  if (!email) return bad('An email address is required.');
  if (!EMAIL_RE.test(email)) return bad('That email address does not look valid.');

  const name = clean(body.name, MAX.name);
  const org = clean(body.org, MAX.org);
  const role = clean(body.role, MAX.role);
  const message = clean(body.message, MAX.message);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.PARTNER_INQUIRY_TO || 'novanextgencorp@outlook.com';
  const from = process.env.PARTNER_INQUIRY_FROM || 'NOVA Website <onboarding@resend.dev>';

  // No mail provider wired up yet: tell the client so it can offer the visitor a
  // prefilled email instead of silently dropping the enquiry.
  if (!apiKey) {
    return Response.json({ ok: false, reason: 'not_configured' }, { status: 503 });
  }

  const lines = [
    'New partnership enquiry from the NOVA website.',
    '',
    `Name:         ${name || '—'}`,
    `Email:        ${email}`,
    `Organization: ${org || '—'}`,
    `Represents:   ${role || '—'}`,
    '',
    'Message:',
    message || '—',
  ];

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Partnership enquiry — ${org || name || email}`,
        text: lines.join('\n'),
      }),
    });

    if (!res.ok) {
      console.error('Resend rejected the partnership enquiry:', res.status, await res.text());
      return Response.json({ ok: false, reason: 'send_failed' }, { status: 502 });
    }
  } catch (err) {
    console.error('Could not reach the mail provider:', err);
    return Response.json({ ok: false, reason: 'send_failed' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
