import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || 'QuickSite <onboarding@resend.dev>';

function baseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || `http://${process.env.PLATFORM_DOMAIN || 'localhost:3000'}`;
}

// ─── Shared email layout matching the login page design ───

function layout(content: string) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f6f7fb;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:40px 16px;">
    <tr><td align="center">

      <!-- Card -->
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
        
        <!-- Header bar -->
        <tr>
          <td style="background:linear-gradient(135deg,#635BFF 0%,#7A73FF 100%);padding:28px 32px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="background:rgba(255,255,255,0.15);border-radius:12px;padding:8px 12px;">
                  <span style="color:#fff;font-weight:bold;font-size:20px;">⚡</span>
                </td>
                <td style="padding-right:12px;">
                  <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">QuickSite</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:32px 32px 24px;color:#0A2540;direction:rtl;text-align:right;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:0 32px 28px;text-align:center;">
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />
            <p style="font-size:11px;color:#94a3b8;margin:0;line-height:1.6;">
              © ${new Date().getFullYear()} QuickSite. כל הזכויות שמורות.
            </p>
          </td>
        </tr>

      </table>

    </td></tr>
  </table>

</body>
</html>`;
}

function heading(text: string) {
  return `<h2 style="font-size:20px;font-weight:700;color:#0A2540;margin:0 0 8px;">${text}</h2>`;
}

function paragraph(text: string) {
  return `<p style="font-size:14px;color:#64748b;line-height:1.8;margin:0 0 20px;">${text}</p>`;
}

function button(label: string, href: string) {
  return `
    <div style="text-align:center;margin:24px 0;">
      <a href="${href}" style="display:inline-block;background:#635BFF;color:#ffffff;text-decoration:none;padding:12px 36px;border-radius:12px;font-size:14px;font-weight:600;">
        ${label}
      </a>
    </div>`;
}

function featureRow(icon: string, title: string, desc: string) {
  return `
    <tr>
      <td style="padding:6px 0 6px 12px;vertical-align:top;width:36px;">
        <div style="background:${icon === '✓' ? 'rgba(16,185,129,0.1)' : 'rgba(99,91,255,0.1)'};width:32px;height:32px;border-radius:50%;text-align:center;line-height:32px;font-size:14px;">
          ${icon}
        </div>
      </td>
      <td style="padding:6px 0;vertical-align:top;">
        <strong style="font-size:13px;color:#0A2540;">${title}</strong>
        <br/><span style="font-size:12px;color:#94a3b8;">${desc}</span>
      </td>
    </tr>`;
}

function muted(text: string) {
  return `<p style="font-size:12px;color:#94a3b8;line-height:1.7;margin:16px 0 0;">${text}</p>`;
}

// ─── Email functions ───

async function send(to: string, subject: string, html: string) {
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) {
    console.error(`Email failed [${subject}] to ${to}:`, error);
    throw new Error('שליחת המייל נכשלה');
  }
}

/** Password reset */
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await send(to, 'איפוס סיסמה — QuickSite', layout(`
    ${heading('איפוס סיסמה')}
    ${paragraph('קיבלנו בקשה לאפס את הסיסמה שלכם. לחצו על הכפתור למטה כדי לבחור סיסמה חדשה. הקישור תקף ל-60 דקות.')}
    ${button('איפוס סיסמה', resetUrl)}
    ${muted('אם לא ביקשתם לאפס את הסיסמה, התעלמו מהודעה זו.')}
  `));
}

/** Welcome email after registration */
export async function sendWelcomeEmail(to: string, name: string, siteSlug: string) {
  const dashboardUrl = `${baseUrl()}/dashboard`;
  const siteUrl = `https://${siteSlug}.quicksite.co.il`;

  await send(to, 'ברוכים הבאים ל-QuickSite! 🎉', layout(`
    ${heading(`שלום ${name}, ברוכים הבאים!`)}
    ${paragraph('החשבון שלכם נוצר בהצלחה והאתר מוכן. הנה מה שאפשר לעשות עכשיו:')}
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
      ${featureRow('✓', 'ערכו את האתר', 'הוסיפו תוכן, תמונות ועמודים חדשים')}
      ${featureRow('✓', 'חברו דומיין', 'הגדירו דומיין מותאם אישית')}
      ${featureRow('✓', 'פרסמו', 'האתר שלכם כבר באוויר ומוכן לעולם')}
    </table>
    ${button('כנסו לדשבורד', dashboardUrl)}
    ${paragraph(`כתובת האתר שלכם: <a href="${siteUrl}" style="color:#635BFF;text-decoration:none;font-weight:600;">${siteUrl}</a>`)}
  `));
}

/** New lead notification — sent to site owner */
export async function sendNewLeadEmail(
  to: string,
  ownerName: string,
  lead: { name: string; email: string; phone?: string; message?: string; source?: string },
) {
  const leadsUrl = `${baseUrl()}/dashboard/leads`;

  await send(to, `ליד חדש מהאתר — ${lead.name}`, layout(`
    ${heading('ליד חדש התקבל! 🎯')}
    ${paragraph(`${ownerName}, מישהו השאיר פרטים באתר שלכם:`)}
    <table cellpadding="0" cellspacing="0" width="100%" style="background:#f6f7fb;border-radius:12px;padding:16px;margin-bottom:20px;">
      <tr><td style="padding:8px 12px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding:4px 0;font-size:13px;color:#94a3b8;width:70px;">שם</td>
            <td style="padding:4px 0;font-size:14px;color:#0A2540;font-weight:600;">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:13px;color:#94a3b8;">אימייל</td>
            <td style="padding:4px 0;font-size:14px;color:#0A2540;" dir="ltr">${lead.email}</td>
          </tr>
          ${lead.phone ? `<tr>
            <td style="padding:4px 0;font-size:13px;color:#94a3b8;">טלפון</td>
            <td style="padding:4px 0;font-size:14px;color:#0A2540;" dir="ltr">${lead.phone}</td>
          </tr>` : ''}
          ${lead.message ? `<tr>
            <td style="padding:4px 0;font-size:13px;color:#94a3b8;vertical-align:top;">הודעה</td>
            <td style="padding:4px 0;font-size:14px;color:#0A2540;">${lead.message}</td>
          </tr>` : ''}
        </table>
      </td></tr>
    </table>
    ${button('צפו בלידים', leadsUrl)}
    ${muted('תגובה מהירה מגדילה את הסיכוי לסגירה — כדאי לחזור תוך שעה.')}
  `));
}

/** Lead confirmation — sent to the person who submitted the form */
export async function sendLeadConfirmationEmail(
  to: string,
  leadName: string,
  siteName: string,
) {
  await send(to, `קיבלנו את פנייתכם — ${siteName}`, layout(`
    ${heading(`תודה ${leadName}!`)}
    ${paragraph(`הפנייה שלכם ל-${siteName} התקבלה בהצלחה. ניצור אתכם קשר בהקדם.`)}
    <div style="background:#f6f7fb;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
      <span style="font-size:32px;">📬</span>
      <p style="font-size:14px;color:#64748b;margin:12px 0 0;">הפנייה נשלחה בהצלחה</p>
    </div>
    ${muted('הודעה זו נשלחה אוטומטית. אין צורך להשיב.')}
  `));
}

/** Site published notification */
export async function sendSitePublishedEmail(to: string, name: string, siteUrl: string) {
  await send(to, 'האתר שלכם באוויר! 🚀', layout(`
    ${heading('האתר פורסם בהצלחה!')}
    ${paragraph(`${name}, האתר שלכם עלה לאוויר וזמין לכולם.`)}
    <div style="background:#f6f7fb;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
      <span style="font-size:32px;">🌐</span>
      <p style="font-size:14px;color:#0A2540;font-weight:600;margin:12px 0 4px;">${siteUrl}</p>
      <p style="font-size:12px;color:#94a3b8;margin:0;">האתר שלכם פעיל ומוכן לקבל מבקרים</p>
    </div>
    ${button('צפו באתר', siteUrl)}
    ${paragraph('שתפו את הקישור ברשתות החברתיות כדי להגיע לקהל שלכם.')}
  `));
}

/** Domain verified notification */
export async function sendDomainVerifiedEmail(to: string, name: string, domain: string) {
  await send(to, `הדומיין ${domain} אומת בהצלחה ✅`, layout(`
    ${heading('הדומיין אומת!')}
    ${paragraph(`${name}, הדומיין <strong>${domain}</strong> חובר בהצלחה לאתר שלכם.`)}
    <div style="background:#f0fdf4;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
      <span style="font-size:32px;">✅</span>
      <p style="font-size:14px;color:#16a34a;font-weight:600;margin:12px 0 4px;">${domain}</p>
      <p style="font-size:12px;color:#64748b;margin:0;">הדומיין פעיל ומצביע לאתר שלכם</p>
    </div>
    ${button('נהלו את הדומיין', `${baseUrl()}/dashboard/domains`)}
  `));
}

/** Team member invitation */
export async function sendTeamInviteEmail(to: string, inviterName: string, siteName: string, role: string) {
  const roleLabel = role === 'editor' ? 'עורך' : role === 'viewer' ? 'צופה' : 'בעלים';

  await send(to, `הוזמנתם לנהל את ${siteName}`, layout(`
    ${heading('הוזמנתם לצוות!')}
    ${paragraph(`${inviterName} הזמין אתכם להצטרף כ<strong>${roleLabel}</strong> באתר <strong>${siteName}</strong>.`)}
    <div style="background:#f6f7fb;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
      <span style="font-size:32px;">👥</span>
      <p style="font-size:14px;color:#0A2540;font-weight:600;margin:12px 0 4px;">${siteName}</p>
      <p style="font-size:12px;color:#94a3b8;margin:0;">תפקיד: ${roleLabel}</p>
    </div>
    ${button('כנסו לדשבורד', `${baseUrl()}/dashboard`)}
  `));
}
