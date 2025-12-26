/* eslint-disable jsx-a11y/alt-text */

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { TicketData } from "../ticketGenerator";

const TRANSPARENT_PNG_1X1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2zWq8AAAAASUVORK5CYII=";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: "Helvetica",
    width: 227,
    backgroundColor: "#fff",
  },
  shell: { overflow: "hidden", backgroundColor: "#fff" },

  header: { padding: 16, backgroundColor: "#c61f26", color: "#fff" },
  title: { fontSize: 12, fontWeight: 700, textAlign: "center" },
  meta: { fontSize: 8, marginTop: 6, textAlign: "center" },

  card: {
    padding: 14,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  movieRow: { flexDirection: "row", gap: 12 },
  poster: { width: 54, height: 64, borderRadius: 12 },
  movieTitle: { fontSize: 12, fontWeight: 700, color: "#c61f26" },
  muted: { color: "#6b7280", marginTop: 4 },

  triplet: {
    flexDirection: "row",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
  },
  cell: { flex: 1, padding: 10, alignItems: "center" },
  k: { fontSize: 9, color: "#9ca3af" },
  v: { marginTop: 4, fontSize: 10, fontWeight: 600 },

  qrBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
  },
  qr: { width: 70, height: 70, borderRadius: 10, backgroundColor: "#fff" },

  itemsHeader: {
    flexDirection: "row",
    marginTop: 14,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  colName: { flex: 1 },
  colQty: { width: 50, textAlign: "center" },
  colPrice: { width: 70, textAlign: "right" },
  row: { flexDirection: "row", paddingVertical: 6 },
});

export function TicketPdf({ show }: { show: TicketData }) {
  const start = new Date(show.startAt);
  const qrImageUrl = show.qrImageUrl ?? TRANSPARENT_PNG_1X1;
  const posterUrl =
    show.moviePosterUrl ||
    "https://via.placeholder.com/240x360.png?text=No+Image";

  return (
    <Document>
      <Page size={{ width: 280, height: 580 }} style={styles.page}>
        <View style={styles.shell}>
          <View style={styles.header}>
            <Text style={styles.title}>{show.cinema.name}</Text>
            <Text style={styles.meta}>{show.cinema.location}</Text>
            <Text style={styles.meta}>
              {show.cinema.phone} • {show.cinema.email}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.movieRow}>
              <Image style={styles.poster} src={posterUrl} />
              <View style={{ flex: 1 }}>
                <Text style={styles.movieTitle}>{show.movieTitle}</Text>
                <Text style={styles.muted}>
                  {show.movieGenre} • 2D • {show.movieRating} •{" "}
                  {show.movieDurationMinutes} min
                </Text>
                <Text style={{ marginTop: 6 }}>{show.auditoriumName}</Text>
              </View>
            </View>

            <View style={styles.triplet}>
              <View
                style={[
                  styles.cell,
                  { borderRightWidth: 1, borderRightColor: "#e5e7eb" },
                ]}
              >
                <Text style={styles.k}>DATE</Text>
                <Text style={styles.v}>
                  {start.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </Text>
              </View>
              <View
                style={[
                  styles.cell,
                  { borderRightWidth: 1, borderRightColor: "#e5e7eb" },
                ]}
              >
                <Text style={styles.k}>TIME</Text>
                <Text style={styles.v}>
                  {start.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.k}>SEATS</Text>
                <Text style={styles.v}>{show.seats.join(", ")}</Text>
              </View>
            </View>

            <View style={styles.qrBox}>
              <Image style={styles.qr} src={qrImageUrl} />
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.k}>SCAN AT ENTRANCE</Text>
                <Text style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>
                  {show.bookingId}
                </Text>
                <Text style={styles.muted}>
                  {new Date().toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.itemsHeader}>
              <Text style={styles.colName}>Item</Text>
              <Text style={styles.colQty}>Qty</Text>
              <Text style={styles.colPrice}>Price</Text>
            </View>

            {show.items.map((item, idx: number) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.colName}>{item.seatType ?? "Seat"}</Text>
                <Text style={styles.colQty}>{item.quantity ?? 1}</Text>
                <Text style={styles.colPrice}>
                  ${(item.priceCents / 100).toFixed(2)}
                </Text>
              </View>
            ))}
            {/* Total Amount row */}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#e5e7eb",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 6,
                marginTop: 6,
              }}
            >
              <Text style={{ color: "#BC2329", fontWeight: 700 }}>
                Grand Total
              </Text>
              <Text style={{ color: "#BC2329", fontWeight: 700 }}>
                ${(show.totalPriceCents / 100).toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                fontSize: 8,
                color: "#9ca3af",
                textAlign: "left",
                marginTop: 10,
                backgroundColor: "#FCFCFC",
                padding: 8,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <Text
                style={{ fontWeight: 700, marginBottom: 6, color: "#BC2329" }}
              >
                Important Instructions:
              </Text>
              {show.instructions &&
                show.instructions.map((inst, idx) => (
                  <Text key={idx} style={{ marginBottom: 4 }}>
                    {inst}
                  </Text>
                ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
