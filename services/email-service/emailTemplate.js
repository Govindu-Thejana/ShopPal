// services/email-service/emailTemplate.js

export function buildOrderEmail({
                                    userName = "Customer",
                                    orderId,
                                    items = [],
                                    subtotal = 0,
                                    shipping = 0,
                                    tax = 0,
                                    total = 0,
                                    deliveryEta = "3–5 business days",
                                    supportEmail = "support@shopmate.local",
                                    address = {},
                                }) {
    const money = (n) => Number(n).toFixed(2);

    const addressHtml = `
    ${address.name || userName}<br/>
    ${address.line1 || ""}${address.line2 ? ", " + address.line2 : ""}<br/>
    ${address.city || ""}, ${address.state || ""} ${address.zip || ""}<br/>
    ${address.country || ""}
  `.replace(/\n/g, "").replace(/\s{2,}/g, " ").trim();

    const itemsRows = items.map((it) => `
    <tr>
      <td style="padding:12px 0; font-size:14px; color:#111; line-height:1.4;">
        <div style="font-weight:600;">${it.name}</div>
        <div style="color:#666; font-size:12px;">Qty: ${it.qty || 1}</div>
      </td>
      <td style="padding:12px 0; font-size:14px; color:#111; text-align:right; white-space:nowrap;">
        $${money((it.price || 0) * (it.qty || 1))}
      </td>
    </tr>
    <tr><td colspan="2" style="border-bottom:1px solid #eee;"></td></tr>
  `).join("");

    const subject = `Your ShopMate order ${orderId} is confirmed`;

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${subject}</title>
</head>
<body style="margin:0; padding:0; background:#f6f7fb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7fb;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <!-- Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 2px 16px rgba(17,17,17,.07);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#a855f7,#ec4899); padding:24px 24px;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="color:#fff; font-size:20px; font-weight:800; letter-spacing:.3px;">
                    <!-- Logo (CID) -->
                    <img src="cid:shopmateLogo" alt="ShopMate" width="28" height="28" style="vertical-align:middle; border:none; outline:none;">
                    <span style="margin-left:8px; vertical-align:middle;">ShopMate</span>
                  </td>
                  <td align="right" style="color:#fff; font-size:12px;">
                    Order <span style="font-weight:700;">#${orderId}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:24px 24px 8px 24px; font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
              <div style="font-size:18px; color:#111; font-weight:700;">Hi ${userName},</div>
              <div style="margin-top:6px; color:#444; font-size:14px; line-height:1.6;">
                Thanks for your purchase! We’re preparing your order and will let you know once it ships.
              </div>
            </td>
          </tr>

          <!-- Summary Card -->
          <tr>
            <td style="padding:0 24px 8px 24px;">
              <table role="presentation" width="100%" style="border:1px solid #eee; border-radius:12px; overflow:hidden;">
                <tr>
                  <td style="background:#faf7ff; padding:12px 16px; font-weight:700; color:#6b21a8;">
                    Order Summary
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 16px;">
                    <table role="presentation" width="100%">
                      ${itemsRows || `<tr><td style="padding:12px 0; color:#666; font-size:14px;">(No items)</td></tr>`}
                      <tr><td colspan="2" style="height:8px;"></td></tr>
                      <tr>
                        <td style="padding:6px 0; color:#555; font-size:14px;">Subtotal</td>
                        <td style="padding:6px 0; color:#111; text-align:right;">$${money(subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#555; font-size:14px;">Shipping</td>
                        <td style="padding:6px 0; color:#111; text-align:right;">$${money(shipping)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#555; font-size:14px;">Tax</td>
                        <td style="padding:6px 0; color:#111; text-align:right;">$${money(tax)}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-bottom:1px dashed #e6e6e6; padding-top:6px;"></td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; font-weight:800; color:#111;">Total</td>
                        <td style="padding:10px 0; font-weight:800; color:#111; text-align:right;">$${money(total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping block -->
          <tr>
            <td style="padding:8px 24px;">
              <table role="presentation" width="100%" style="border:1px solid #eee; border-radius:12px; overflow:hidden;">
                <tr>
                  <td style="background:#fff7ed; padding:12px 16px; font-weight:700; color:#9a3412;">
                    Shipping To
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; color:#333; font-size:14px; line-height:1.6;">
                    ${addressHtml || "No address on file"}
                    <div style="margin-top:8px; color:#666;">Estimated delivery: <b>${deliveryEta}</b></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:16px 24px 8px 24px;">
              <a href="https://shopmate.local/orders/${orderId}"
                 style="display:inline-block; background:#111827; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:10px; font-weight:700; font-size:14px;">
                View your order
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 24px 28px 24px; color:#6b7280; font-size:12px; line-height:1.6;">
              If you have any questions, reply to this email or contact us at
              <a href="mailto:${supportEmail}" style="color:#6b21a8; text-decoration:none;">${supportEmail}</a>.
              <br/>© ${new Date().getFullYear()} ShopMate
            </td>
          </tr>
        </table>
        <!-- /Container -->
      </td>
    </tr>
  </table>
</body></html>`;

    const text =
        `Hi ${userName},

Thanks for your purchase! Your order #${orderId} is confirmed.

Items:
${items.map(it => `• ${it.name} x${it.qty || 1} — $${money((it.price||0)*(it.qty||1))}`).join("\n")}

Subtotal: $${money(subtotal)}
Shipping: $${money(shipping)}
Tax:      $${money(tax)}
Total:    $${money(total)}

Ship to:
${addressHtml.replace(/<br\/>/g, "\n").replace(/<[^>]+>/g, "")}

ETA: ${deliveryEta}

View your order: https://shopmate.local/orders/${orderId}
Need help? ${supportEmail}

— ShopMate`;

    return { subject, html, text };
}