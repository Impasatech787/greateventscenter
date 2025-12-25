import { SeatType } from "@/app/generated/prisma";

interface Cinema {
  name: string;
  location: string;
  phone: string;
  email: string;
}
export interface TicketData {
  movieTitle: string;
  movieDurationMinutes?: number;
  movieRating?: string;
  movieGenre?: string;
  moviePosterUrl: string;
  auditoriumName: string;
  cinema: Cinema;
  startAt: string;
  seats: string[];
  items: TicketItem[];
  invoiceId: number;
  bookingId: number;
  totalPriceCents: number;
  instructions: string[];
}
interface TicketItem {
  seatType: string | null;
  priceCents: number;
  quantity?: number;
}
export function generateTicket({ show }: { show: TicketData }): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Movie Ticket</title>
 <style>
      :root {
        --brand: #c61f26; /* red */
        --brand-dark: #a6161c;
        --bg: #f4f5f7;
        --card: #ffffff;
        --muted: #6b7280;
        --text: #111827;
        --border: #e5e7eb;
        --shadow: 0 18px 45px rgba(17, 24, 39, 0.12);
      }

      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
          Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        background: var(--bg);
        color: var(--text);
        display: grid;
        place-items: center;
        padding: 28px 14px;
      }

      /* Outer rounded "phone-like" frame */
      .ticket-shell {
        width: min(420px, 100%);
        border-radius: 28px;
        overflow: hidden;
        box-shadow: var(--shadow);
        background: var(--card);
        border: 1px solid rgba(0, 0, 0, 0.06);
      }

      /* Top header area */
      .ticket-header {
        background: linear-gradient(
          180deg,
          var(--brand) 0%,
          var(--brand-dark) 100%
        );
        color: #fff;
        padding: 22px 18px 64px;
      }

      .venue-title {
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
        text-align: center;
        font-size: 20px;
        margin: 0;
      }

      .venue-meta {
        margin: 10px auto 0;
        text-align: center;
        font-size: 12px;
        line-height: 1.4;
        opacity: 0.95;
      }

      /* Main white card content "floats" into header */
      .ticket-card {
        background: var(--card);
        margin-top: -42px;
        border-radius: 27px;
        border: 1px solid rgba(0, 0, 0, 0.06);
        overflow: hidden;
      }

      /* Movie block */
      .movie {
        display: grid;
        grid-template-columns: 84px 1fr;
        gap: 14px;
        padding: 16px;
        align-items: center;
      }

      .poster {
        width: 84px;
        height: 84px;
        border-radius: 14px;
        background: #f3f4f6;
        border: 1px solid var(--border);
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
      }
      .poster img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .movie h2 {
        margin: 0;
        font-size: 20px;
        line-height: 1.1;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--brand);
        font-weight: 900;
      }

      .movie .sub {
        margin-top: 6px;
        font-size: 13px;
        color: var(--muted);
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: #fafafa;
        color: #374151;
        font-size: 12px;
        font-weight: 600;
      }

      /* Date/Time/Seats band */
      .triplet {
        margin: 0 16px 14px;
        border-radius: 14px;
        border: 1px solid var(--border);
        background: #fff;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        overflow: hidden;
      }
      .triplet > div {
        padding: 12px 10px;
        text-align: center;
      }
      .triplet > div:not(:last-child) {
        border-right: 1px solid var(--border);
      }
      .k {
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #9ca3af;
        font-weight: 800;
      }
      .v {
        margin-top: 6px;
        font-size: 15px;
        font-weight: 900;
        color: #111827;
      }
      .v.red {
        color: var(--brand);
      }

      /* Perforation line */
      .perforation {
        position: relative;
        margin: 10px 0 0;
        height: 24px;
      }
      .perforation:before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        border-top: 2px dashed #d1d5db;
      }
      .perforation .notch {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: var(--bg);
        border: 1px solid rgba(0, 0, 0, 0.06);
      }
      .perforation .notch.left {
        left: -14px;
      }
      .perforation .notch.right {
        right: -14px;
      }

      /* QR area */
      .qr-area {
        padding: 14px 16px 6px;
      }

      .qr-box {
        border-radius: 16px;
        border: 1px solid var(--border);
        background: #f8f8f8;
        padding: 14px;
        display: grid;
        grid-template-columns: 112px 1fr;
        gap: 14px;
        align-items: center;
      }

      .qr {
        width: 112px;
        height: 112px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: #fff;
        display: grid;
        place-items: center;
        overflow: hidden;
      }
      .qr img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .scan {
        text-align: right;
      }
      .scan .label {
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #9ca3af;
        font-weight: 800;
      }
      .scan .code {
        margin-top: 6px;
        font-size: 18px;
        font-weight: 900;
        color: #111827;
      }
      .scan .stamp {
        margin-top: 6px;
        font-size: 12px;
        color: var(--muted);
      }

      /* Items table */
      .items {
        padding: 10px 16px 14px;
      }
      .items-header {
        display: grid;
        grid-template-columns: 1fr 60px 84px;
        gap: 10px;
        color: #9ca3af;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1px;
        text-transform: uppercase;
        padding: 8px 0;
      }
      .item-row {
        display: grid;
        grid-template-columns: 1fr 60px 84px;
        gap: 10px;
        padding: 7px 0;
        font-size: 13px;
        align-items: baseline;
      }
      .item-row .name {
        color: #111827;
        font-weight: 600;
      }
      .item-row .qty {
        text-align: center;
        color: #374151;
        font-weight: 700;
      }
      .item-row .price {
        text-align: right;
        color: #111827;
        font-weight: 800;
      }
      .items-divider {
        border-top: 1px solid var(--border);
        margin: 10px 0;
      }

      .grand {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 6px;
      }
      .grand .label {
        color: var(--brand);
        font-weight: 900;
        letter-spacing: 0.5px;
      }
      .grand .amount {
        color: var(--brand);
        font-weight: 1000;
        font-size: 16px;
      }

      /* Instructions */
      .instructions {
        margin: 0 16px 16px;
        border-radius: 16px;
        border: 1px solid var(--border);
        background: #fff;
        padding: 14px 14px 12px;
      }
      .instructions h3 {
        margin: 0 0 10px;
        font-size: 12px;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: var(--brand);
        font-weight: 900;
      }
      .instructions ul {
        margin: 0;
        padding-left: 18px;
        color: #6b7280;
        font-size: 12.5px;
        line-height: 1.45;
      }

      /* Small helper footer (optional) */
      .footer-space {
        height: 10px;
      }
    </style>
</head>
<body>
        <div class="ticket-shell" id="ticket">
      <header class="ticket-header">
        <h1 class="venue-title" data-bind="venueName">${show.cinema.name}</h1>
        <div class="venue-meta">
          <div data-bind="venueAddress">
${show.cinema.location}
          </div>
          <div data-bind="venueContact">
            ${show.cinema.phone} • ${show.cinema.email}
          </div>
        </div>
      </header>

      <section class="ticket-card">
        <!-- Movie -->
        <div class="movie">
          <div class="poster">
            <img
              data-bind="moviePosterUrl"
              alt="Poster"
              src="${show.moviePosterUrl}"
            />
          </div>

          <div class="movie-meta">
            <h2 data-bind="movieTitle">${show.movieTitle}</h2>
            <div class="sub">
              <span data-bind="movieMeta">${show.movieGenre}• 2D • ${
    show.movieRating
  } • ${show.movieDurationMinutes} min</span>
              <span class="pill" data-bind="auditorium">${
                show.auditoriumName
              }</span>
            </div>
          </div>
        </div>

        <!-- Date / Time / Seats -->
        <div class="triplet">
          <div>
            <div class="k">Date</div>
            <div class="v" data-bind="dateLabel">${new Date(
              show.startAt
            ).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}</div>
          </div>
          <div>
            <div class="k">Time</div>
            <div class="v red" data-bind="timeLabel">${new Date(
              show.startAt
            ).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}</div>
          </div>
          <div>
            <div class="k">Seats</div>
            <div class="v" data-bind="seatsLabel">${show.seats
              .map((item) => item)
              .join(", ")}</div>
          </div>
        </div>

        <div class="perforation">
          <span class="notch left"></span>
          <span class="notch right"></span>
        </div>

        <!-- QR / Code -->
        <div class="qr-area">
          <div class="qr-box">
            <div class="qr">
              <img
                data-bind="qrImageUrl"
                alt="QR Code"
                src="https://via.placeholder.com/240x240.png?text=QR"
              />
            </div>
            <div class="scan">
              <div class="label">Scan at entrance</div>
              <div class="code" data-bind="bookingCode">${show.bookingId}</div>
              <div class="stamp" data-bind="issuedAt">
                ${new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="items">
          <div class="items-header">
            <div>Item</div>
            <div style="text-align: center">Qty</div>
            <div style="text-align: right">Price</div>
          </div>

          <div id="items">
            ${show.items
              .map(
                (item) => `
            <div class="item-row">
              <div class="name" data-bind="itemName">${
                item.seatType
                  ? item.seatType == SeatType.REGULAR_WHEELCHAIR_ACCESSIBLE
                    ? "Wheelchair Accessible"
                    : item.seatType
                  : "Seat"
              }</div>
              <div class="qty" data-bind="itemQty">${item.quantity ?? 1}</div>
              <div class="price" data-bind="itemPrice">$${
                item.priceCents / 100
              }</div>
            </div>
            `
              )
              .join("")}
          </div>

          <div class="items-divider"></div>

          <div class="grand">
            <div class="label">GRAND TOTAL</div>
            <div class="amount" data-bind="grandTotal">$${
              show.totalPriceCents / 100
            }</div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="instructions">
          <h3>Important instructions</h3>
          <ul id="instructions">
          ${show.instructions
            .map((instruction) => `<li>${instruction}</li>`)
            .join("")}</ul>
          
        </div>

        <div class="footer-space"></div>
      </section>
    </div>
</body>
</html>

    `;
}
