import { createTransporter } from "./email";
import { buildTicketData, renderTicketPdfBuffer } from "./getTicketData";

export const emailTicket = async (
  bookingId: string,
  userMail: string,
  name: string
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fromEmail = process.env.EMAIL_FROM;
  const displayName = process.env.EMAIL_DISPLAY_NAME || "Great Events";
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
  }
  if (!fromEmail) {
    throw new Error("EMAIL_FROM is not configured.");
  }

  const transporter = createTransporter();

  const greetingName = name?.trim() || "there";

  const ticketData = await buildTicketData({ bookingId });
  const ticketPdf = await renderTicketPdfBuffer(ticketData);

  const safeBaseUrl = baseUrl.replace(/\/$/, "");
  const downloadUrl = `${safeBaseUrl}/api/bookings/download-ticket/${encodeURIComponent(
    String(ticketData.bookingId)
  )}`;
  const bookingsUrl = `${safeBaseUrl}/profile/bookings`;

  const showDate = new Date(ticketData.startAt);
  const dateLabel = showDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeLabel = showDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const subject = `Your ticket is confirmed (Booking #${ticketData.bookingId})`;

  const seatsText = ticketData.seats.length ? ticketData.seats.join(", ") : "—";
  const totalText = `$${(ticketData.totalPriceCents / 100).toFixed(2)}`;

  const text = `Hi ${greetingName},

Thanks for your booking at Great Events.

Booking: #${ticketData.bookingId}
Movie: ${ticketData.movieTitle}
Venue: ${ticketData.cinema.name}
Auditorium: ${ticketData.auditoriumName}
When: ${dateLabel} at ${timeLabel}
Seats: ${seatsText}
Total: ${totalText}

Your ticket PDF is attached to this email.
You can also download it here:
${downloadUrl}

Manage your bookings:
${bookingsUrl}

If you did not make this booking, please contact support.`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 12px;">Booking confirmed</h2>
      <p>Hi ${greetingName},</p>
      <p>Thanks for your booking. Your ticket PDF is attached to this email.</p>

      <div style="margin: 16px 0; padding: 14px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
        <p style="margin: 0 0 8px;"><strong>Booking:</strong> #${ticketData.bookingId}</p>
        <p style="margin: 0 0 8px;"><strong>Movie:</strong> ${ticketData.movieTitle}</p>
        <p style="margin: 0 0 8px;"><strong>Venue:</strong> ${ticketData.cinema.name}</p>
        <p style="margin: 0 0 8px;"><strong>Auditorium:</strong> ${ticketData.auditoriumName}</p>
        <p style="margin: 0 0 8px;"><strong>When:</strong> ${dateLabel} • ${timeLabel}</p>
        <p style="margin: 0 0 8px;"><strong>Seats:</strong> ${seatsText}</p>
        <p style="margin: 0;"><strong>Total:</strong> ${totalText}</p>
      </div>


      <p style="font-size: 12px; color: #6b7280; margin-top: 18px;">
        You can view all your bookings here: <a href="${bookingsUrl}">${bookingsUrl}</a>
      </p>
      <p style="font-size: 12px; color: #6b7280;">
        If you did not make this booking, please contact support.
      </p>
    </div>
  `;
  console.log(`Sending ticket email to ${userMail} for booking ${bookingId}`);

  await transporter.sendMail({
    from: `${displayName} <${fromEmail}>`,
    to: userMail,
    subject,
    text,
    html,
    attachments: [
      {
        filename: `ticket-${ticketData.bookingId}.pdf`,
        content: ticketPdf,
        contentType: "application/pdf",
      },
    ],
  });
};
