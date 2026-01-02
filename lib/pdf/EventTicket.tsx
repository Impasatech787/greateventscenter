/* eslint-disable jsx-a11y/alt-text */

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

export interface EventTicketData {
  eventTitle: string;
  eventCategory: string;
  thumbnailUrl?: string;
  venueName: string;
  venueLocation?: string | null;
  dateLabel: string;
  timeLabel: string;
  bookingId: number;
  quantity: number;
  priceCents: number;
  qrImageUrl?: string;
}

const TRANSPARENT_PNG_1X1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2zWq8AAAAASUVORK5CYII=";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: "Helvetica",
    width: 240,
    backgroundColor: "#fff",
  },
  shell: { overflow: "hidden", backgroundColor: "#fff" },
  header: { padding: 14, backgroundColor: "#0f172a", color: "#fff" },
  title: { fontSize: 12, fontWeight: 700, textAlign: "center" },
  meta: { fontSize: 8, marginTop: 4, textAlign: "center" },
  card: { padding: 12 },
  hero: { flexDirection: "row", gap: 10 },
  poster: { width: 52, height: 52, borderRadius: 10 },
  eventTitle: { fontSize: 12, fontWeight: 700, color: "#1d4ed8" },
  muted: { color: "#6b7280", marginTop: 3 },
  triplet: {
    flexDirection: "row",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
  },
  cell: { flex: 1, padding: 8, alignItems: "center" },
  k: { fontSize: 8, color: "#9ca3af" },
  v: { marginTop: 3, fontSize: 9, fontWeight: 600 },
  qrBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#f8fafc",
  },
  qr: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#fff" },
  footer: { marginTop: 10, fontSize: 8, color: "#9ca3af" },
});

export function EventTicketPdf({ data }: { data: EventTicketData }) {
  const qrImageUrl = data.qrImageUrl ?? TRANSPARENT_PNG_1X1;
  const posterUrl =
    data.thumbnailUrl ||
    "https://via.placeholder.com/200x200.png?text=Event";

  return (
    <Document>
      <Page size={{ width: 260, height: 520 }} style={styles.page}>
        <View style={styles.shell}>
          <View style={styles.header}>
            <Text style={styles.title}>{data.venueName}</Text>
            {data.venueLocation && (
              <Text style={styles.meta}>{data.venueLocation}</Text>
            )}
            <Text style={styles.meta}>Event Ticket</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.hero}>
              <Image style={styles.poster} src={posterUrl} />
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{data.eventTitle}</Text>
                <Text style={styles.muted}>{data.eventCategory}</Text>
                <Text style={styles.muted}>
                  Qty: {data.quantity} • ${(data.priceCents / 100).toFixed(2)}
                </Text>
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
                <Text style={styles.v}>{data.dateLabel}</Text>
              </View>
              <View
                style={[
                  styles.cell,
                  { borderRightWidth: 1, borderRightColor: "#e5e7eb" },
                ]}
              >
                <Text style={styles.k}>TIME</Text>
                <Text style={styles.v}>{data.timeLabel}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.k}>BOOKING</Text>
                <Text style={styles.v}>#{data.bookingId}</Text>
              </View>
            </View>

            <View style={styles.qrBox}>
              <Image style={styles.qr} src={qrImageUrl} />
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.k}>SCAN AT ENTRY</Text>
                <Text style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
                  {data.bookingId}
                </Text>
                <Text style={styles.muted}>
                  {new Date().toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>

            <Text style={styles.footer}>
              Please arrive 20 minutes early and bring a valid ID.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
