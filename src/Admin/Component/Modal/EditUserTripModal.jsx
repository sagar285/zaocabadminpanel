import React, { useEffect, useState } from "react";
import moment from "moment";

const toInputDateTime = (value) => {
  if (!value) return "";
  return moment(value).format("YYYY-MM-DDTHH:mm");
};

const boolField = (value) => Boolean(value);

const buildFormFromTrip = (trip) => ({
  tripDate: toInputDateTime(trip?.tripDate),
  pickupLocation: trip?.pickupLocation || "",
  dropLocation: trip?.dropLocation || "",
  dropStops: Array.isArray(trip?.dropStops) ? trip.dropStops.join(", ") : "",
  totalFare: trip?.totalFare ?? "",
  yourcomission: trip?.yourcomission ?? "",
  totalKm: trip?.totalKm ?? "",
  extraperkmhour: trip?.extraperkmhour ?? "",
  extrachargeperkmPassenger: trip?.extrachargeperkmPassenger ?? "",
  extrachargeperkmDriver: trip?.extrachargeperkmDriver ?? "",
  advanceamountfortrip: trip?.advanceamountfortrip ?? trip?.advanceamount ?? "",
  GstTax: trip?.GstTax ?? "",
  whopayDriver: trip?.whopayDriver || "Passenger",
  comment: trip?.comment || "",
  startMeterReading: trip?.startMeterReading ?? "",
  endMeterReading: trip?.endMeterReading ?? "",
  skipPay: trip?.settings?.skipPay ?? "",
  paymentReceivedAt: toInputDateTime(trip?.settings?.paymentReceivedAt),
  hideComment: boolField(trip?.settings?.hideComment),
  isReuqestBestPrice: boolField(trip?.isReuqestBestPrice),
  requireGstBill: boolField(trip?.requireGstBill),
  securemycomission: boolField(trip?.securemycomission),
  negotiatedPrice: boolField(trip?.negotiatedPrice),
  hidemyidentity: boolField(trip?.hidemyidentity),
  ismySelf: boolField(trip?.ismySelf),
  onlydiesel: boolField(trip?.onlydiesel),
  requireAc: boolField(trip?.requireAc),
  LuggageCarrier: boolField(trip?.LuggageCarrier),
  Parking: boolField(trip?.Parking),
  TollTaxes: boolField(trip?.TollTaxes),
  StateTaxes: boolField(trip?.StateTaxes),
  DriverAllowance: boolField(trip?.DriverAllowance),
  contactCall: boolField(trip?.hidemyidentityDetail?.howdriverContact?.includes("Call")),
  contactWhatsapp: boolField(
    trip?.hidemyidentityDetail?.howdriverContact?.includes("Whatsapp Chat")
  ),
  contactAfterConfirm: boolField(trip?.hidemyidentityDetail?.contactAfterCnfirmation),
});

const Section = ({ title, children }) => (
  <div className="border rounded-lg p-4 mb-4 bg-gray-50">
    <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <label className="block mb-3">
    <span className="text-sm text-gray-600 mb-1 block">{label}</span>
    {children}
  </label>
);

const inputClass =
  "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

const EditUserTripModal = ({ open, onClose, trip, onSave, saving }) => {
  const [form, setForm] = useState(buildFormFromTrip(trip));

  useEffect(() => {
    if (trip) setForm(buildFormFromTrip(trip));
  }, [trip, open]);

  if (!open) return null;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const howdriverContact = [];
    if (form.contactCall) howdriverContact.push("Call");
    if (form.contactWhatsapp) howdriverContact.push("Whatsapp Chat");

    onSave({
      tripDate: form.tripDate,
      pickupLocation: form.pickupLocation,
      dropLocation: form.dropLocation,
      dropStops: form.dropStops,
      totalFare: Number(form.totalFare) || 0,
      yourcomission: Number(form.yourcomission) || 0,
      totalKm: Number(form.totalKm) || 0,
      extraperkmhour: Number(form.extraperkmhour) || 0,
      extrachargeperkmPassenger: Number(form.extrachargeperkmPassenger) || 0,
      extrachargeperkmDriver: Number(form.extrachargeperkmDriver) || 0,
      advanceamountfortrip: Number(form.advanceamountfortrip) || 0,
      GstTax: Number(form.GstTax) || 0,
      whopayDriver: form.whopayDriver,
      comment: form.comment,
      startMeterReading: form.startMeterReading,
      endMeterReading: form.endMeterReading,
      skipPay: Number(form.skipPay) || 0,
      paymentReceivedAt: form.paymentReceivedAt || null,
      hideComment: form.hideComment,
      isReuqestBestPrice: form.isReuqestBestPrice,
      requireGstBill: form.requireGstBill,
      securemycomission: form.securemycomission,
      negotiatedPrice: form.negotiatedPrice,
      hidemyidentity: form.hidemyidentity,
      ismySelf: form.ismySelf,
      onlydiesel: form.onlydiesel,
      requireAc: form.requireAc,
      LuggageCarrier: form.LuggageCarrier,
      Parking: form.Parking,
      TollTaxes: form.TollTaxes,
      StateTaxes: form.StateTaxes,
      DriverAllowance: form.DriverAllowance,
      hidemyidentityDetail: {
        contactAfterCnfirmation: form.contactAfterConfirm,
        howdriverContact: howdriverContact,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Edit Trip — {trip?.tripId}</h3>
            <p className="text-xs text-gray-500">Update trip details, fare inputs, and admin corrections</p>
          </div>
          <button type="button" onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 flex-1">
          <Section title="Schedule & Route">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Pickup Date & Time">
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={form.tripDate}
                  onChange={(e) => setField("tripDate", e.target.value)}
                />
              </Field>
              <Field label="Pay the driver">
                <select
                  className={inputClass}
                  value={form.whopayDriver}
                  onChange={(e) => setField("whopayDriver", e.target.value)}
                >
                  <option value="Passenger">Passenger</option>
                  <option value="Me">Me</option>
                </select>
              </Field>
              <Field label="Pickup Location">
                <input
                  className={inputClass}
                  value={form.pickupLocation}
                  onChange={(e) => setField("pickupLocation", e.target.value)}
                />
              </Field>
              <Field label="Drop Location">
                <input
                  className={inputClass}
                  value={form.dropLocation}
                  onChange={(e) => setField("dropLocation", e.target.value)}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Drop Stops (comma separated)">
                  <input
                    className={inputClass}
                    value={form.dropStops}
                    onChange={(e) => setField("dropStops", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </Section>

          <Section title="Fare & Rates">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["Total Fare", "totalFare"],
                ["Partner Incentive", "yourcomission"],
                ["KM Limit", "totalKm"],
                ["Extra / hour", "extraperkmhour"],
                ["Extra / KM Passenger", "extrachargeperkmPassenger"],
                ["Extra / KM Driver", "extrachargeperkmDriver"],
                ["Passenger Advance", "advanceamountfortrip"],
                ["GST %", "GstTax"],
                ["Skip for pay", "skipPay"],
              ].map(([label, key]) => (
                <Field key={key} label={label}>
                  <input
                    type="number"
                    className={inputClass}
                    value={form[key]}
                    onChange={(e) => setField(key, e.target.value)}
                  />
                </Field>
              ))}
            </div>
          </Section>

          <Section title="Meter Readings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Start meter reading">
                <input
                  className={inputClass}
                  value={form.startMeterReading}
                  onChange={(e) => setField("startMeterReading", e.target.value)}
                />
              </Field>
              <Field label="End meter reading">
                <input
                  className={inputClass}
                  value={form.endMeterReading}
                  onChange={(e) => setField("endMeterReading", e.target.value)}
                />
              </Field>
              <Field label="Payment received at">
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={form.paymentReceivedAt}
                  onChange={(e) => setField("paymentReceivedAt", e.target.value)}
                />
              </Field>
            </div>
          </Section>

          <Section title="Trip Options">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                ["Request Best Fare", "isReuqestBestPrice"],
                ["Need GST Bill", "requireGstBill"],
                ["Secure incentive", "securemycomission"],
                ["Negotiable Fare", "negotiatedPrice"],
                ["Hide identity", "hidemyidentity"],
                ["Me / My Self", "ismySelf"],
                ["Only Diesel", "onlydiesel"],
                ["Air Condition", "requireAc"],
                ["Luggage Carrier", "LuggageCarrier"],
                ["Parking included", "Parking"],
                ["Toll Taxes included", "TollTaxes"],
                ["State taxes included", "StateTaxes"],
                ["Driver allowance", "DriverAllowance"],
                ["Call allowed", "contactCall"],
                ["Whatsapp allowed", "contactWhatsapp"],
                ["Contact after accept", "contactAfterConfirm"],
                ["Hide comment (admin)", "hideComment"],
              ].map(([label, key]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(form[key])}
                    onChange={(e) => setField(key, e.target.checked)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Comments">
            <Field label="Admin / trip comment">
              <textarea
                className={`${inputClass} min-h-[90px]`}
                value={form.comment}
                onChange={(e) => setField("comment", e.target.value)}
              />
            </Field>
          </Section>
        </form>

        <div className="px-6 py-4 border-t flex gap-3 justify-end bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserTripModal;
