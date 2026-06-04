/** Legacy midnight job marked past trips as End; show Expired when driver did not end the trip. */
export function getDisplayTripStatus(trip) {
  const status = trip?.tripStatus || "Pending";
  if (status !== "End") return status;

  const driverEndedTrip =
    trip?.EndTripTime ||
    (trip?.endMeterReading != null && Number(trip.endMeterReading) > 0);

  if (driverEndedTrip) return "End";

  const tripDate = new Date(trip?.tripDate || trip?.whenAreYouGoing || 0);
  if (!Number.isNaN(tripDate.getTime()) && tripDate < new Date()) {
    return "Expired";
  }

  return "End";
}

export function getStatusStyles(status) {
  const map = {
    Pending: { backgroundColor: "#ffc107", color: "#000000" },
    Confirmed: { backgroundColor: "#28a745", color: "#ffffff" },
    Completed: { backgroundColor: "#17a2b8", color: "#ffffff" },
    End: { backgroundColor: "#6f42c1", color: "#ffffff" },
    Expired: { backgroundColor: "#6c757d", color: "#ffffff" },
    Canceled: { backgroundColor: "#dc3545", color: "#ffffff" },
    onTheWay: { backgroundColor: "#007bff", color: "#ffffff" },
    Reached: { backgroundColor: "#007bff", color: "#ffffff" },
    StartTrip: { backgroundColor: "#28a745", color: "#ffffff" },
  };

  const base = map[status] || { backgroundColor: "#e2e8f0", color: "#1a202c" };

  return {
    ...base,
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    fontWeight: "500",
    textAlign: "center",
    display: "inline-block",
    minWidth: "5.5rem",
  };
}

export function formatTripIdLabel(tripId) {
  if (!tripId) return "—";
  const num = String(tripId).toLowerCase().replace("#zao", "");
  return `#ZAO-${num}`;
}

export function shortLocation(location) {
  if (!location) return "—";
  const text = String(location).replace(/India/gi, "").trim();
  if (!text) return "—";
  return text.includes(",") ? text.split(",")[0].trim() : text;
}
