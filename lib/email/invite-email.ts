interface InviteEmailOptions {
  inviterName: string
  workspaceName: string
  role: string
  acceptUrl: string
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  MEMBER: "Miembro",
  OWNER: "Propietario",
}

export function buildInviteEmail({
  inviterName,
  workspaceName,
  role,
  acceptUrl,
}: InviteEmailOptions): { subject: string; html: string; text: string } {
  const roleLabel = ROLE_LABEL[role] ?? role
  const subject = `${inviterName} te invitó a ${workspaceName} en ProjectTrack`

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">

          <!-- Header -->
          <tr>
            <td style="background:#1e40af;padding:28px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#2563eb;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                    <span style="color:#ffffff;font-weight:700;font-size:14px;">PT</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff;font-weight:600;font-size:16px;">ProjectTrack</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
                Te invitaron a colaborar
              </h1>
              <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
                <strong style="color:#0f172a;">${inviterName}</strong> te invitó a unirte al workspace
                <strong style="color:#0f172a;">${workspaceName}</strong> como
                <strong style="color:#0f172a;">${roleLabel}</strong>.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td>
                    <a href="${acceptUrl}"
                       style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 28px;border-radius:8px;">
                      Aceptar invitación →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;">
                O copiá este enlace en tu navegador:
              </p>
              <p style="margin:0;color:#2563eb;font-size:12px;word-break:break-all;">
                ${acceptUrl}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f1f5f9;background:#f8fafc;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.5;">
                Si no esperabas esta invitación podés ignorar este email.
                El enlace expira en 7 días.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `${inviterName} te invitó a unirte a ${workspaceName} en ProjectTrack como ${roleLabel}.\n\nAceptá la invitación acá: ${acceptUrl}\n\nSi no esperabas esta invitación podés ignorar este email.`

  return { subject, html, text }
}
