const money = (v) => {
  if (v == null || v === "") return "₹ 00";
  const n = Number(v);
  if (!Number.isFinite(n)) return "₹ 00";
  return `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

const BillRow = ({ label, amount, note, highlight }) => (
  <tr className={highlight ? "bg-yellow-50 font-semibold" : "border-b border-gray-100"}>
    <td className="p-2 text-gray-600">
      <div>{label}</div>
      {note ? <div className="text-[10px] text-gray-400 font-normal">{note}</div> : null}
    </td>
    <td className="p-2 text-right whitespace-nowrap">{money(amount)}</td>
  </tr>
);

const Line = ({ label, amount, detail }) => (
  <div className="flex justify-between gap-2 py-1 border-b border-gray-100 text-xs">
    <div>
      <div className="text-gray-700">{label}</div>
      {detail ? <div className="text-gray-400 text-[10px]">{detail}</div> : null}
    </div>
    <div className="font-medium whitespace-nowrap">{money(amount)}</div>
  </div>
);

const Panel = ({ title, lines, total, totalLabel = "Total", footer }) => (
  <div className="bg-white border rounded-lg p-3 h-full">
    <h4 className="font-semibold text-sm mb-2">{title}</h4>
    <div className="space-y-0.5">{lines}</div>
    {total != null && (
      <div className="flex justify-between font-bold text-sm mt-3 pt-2 border-t">
        <span>{totalLabel}</span>
        <span>{money(total)}</span>
      </div>
    )}
    {footer}
  </div>
);

const TripBillDetailsTable = ({ trip, settlement }) => {
  const fare = trip?.fareDetails || {};
  const pb = settlement?.passengerBill || {};
  const hasSettlement = Boolean(settlement?.passengerBill);

  const baseFare = hasSettlement ? pb.baseFare : fare.baseFare ?? trip?.totalFare;
  const bookingFee = hasSettlement ? pb.bookingFee : fare.bookingFee;
  const platformFee = hasSettlement ? pb.platformFee : fare.platformFee;
  const nightCharges = hasSettlement ? pb.nightCharges : fare.nightCharges;
  const surCharges = hasSettlement ? pb.surCharges : fare.surCharges;
  const gstAmount = hasSettlement ? pb.gst : fare.gstAmount;
  const gstPercent = hasSettlement ? pb.gstPercent : fare.gstPercentage ?? trip?.GstTax;
  const finalBill = hasSettlement ? pb.finalBill : fare.totalFare ?? fare.subtotal ?? trip?.totalFare;
  const advance = hasSettlement
    ? pb.passengerAdvance
    : trip?.advanceamountfortrip ?? trip?.advanceamount ?? 0;
  const payable = hasSettlement ? pb.payableAmount : Math.max(0, Number(finalBill) - Number(advance));
  const remainingKm = Number(fare.remainingkmAmount ?? 0);
  const extraKm = hasSettlement ? pb.extraKm : 0;
  const extraKmDetail = pb.extraKmDetail || "";
  const extraTime = hasSettlement ? pb.extraTime : 0;
  const extraTimeDetail = pb.extraTimeDetail || "";
  const waitingTime = hasSettlement ? pb.waitingTime : 0;
  const waitingDetail = pb.waitingDetail || "";

  const kmNote =
    trip?.totalKm != null
      ? `About ${trip.totalKm} KM${trip?.baseFareForTime ? `, ${trip.baseFareForTime} Min` : ""}`
      : "";

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b bg-blue-50">
        <h4 className="font-semibold text-sm text-gray-800">Bill Details</h4>
        <p className="text-[11px] text-gray-500">
          {trip?.tripType}{trip?.passengerFareType === "perkm" ? " · Per KM fare" : ""}
        </p>
      </div>
      <table className="w-full text-xs">
        <tbody>
          <BillRow label="Base Fare" amount={baseFare} note={kmNote} />
          {remainingKm > 0 && (
            <BillRow label="Fare for remaining km" amount={remainingKm} />
          )}
          {extraKm > 0 && (
            <BillRow label="Extra Kms" amount={extraKm} note={extraKmDetail} />
          )}
          {extraTime > 0 && (
            <BillRow label="Extra Time" amount={extraTime} note={extraTimeDetail} />
          )}
          {waitingTime > 0 && (
            <BillRow label="Waiting Time" amount={waitingTime} note={waitingDetail} />
          )}
          <BillRow label="Booking fee (user)" amount={bookingFee} />
          <BillRow label="Platform fee (user)" amount={platformFee} />
          <BillRow label="Night charge" amount={nightCharges} />
          <BillRow label="Surcharges" amount={surCharges} />
          <BillRow
            label={`Taxes ${gstPercent || 0}% GST`}
            amount={gstAmount}
          />
          <BillRow label="Final Bill" amount={finalBill} highlight />
          <BillRow label="Paid for promo" amount={0} />
          <BillRow label="Skip for pay" amount={trip?.settings?.skipPay ?? 0} />
          <BillRow label="Passenger Pay Advance" amount={advance} />
          <BillRow label="Round off" amount={hasSettlement ? pb.roundOff ?? 0 : 0} />
          <BillRow label="Payable amount" amount={payable} highlight />
        </tbody>
      </table>
      <div className="px-4 py-2 border-t bg-blue-50 text-xs flex justify-between">
        <span className="text-gray-600">Payment</span>
        <span className="font-medium">
          {trip?.whopayDriver === "Passenger"
            ? "Cash / Online by Passenger"
            : "Cash / Online by Me"}
        </span>
      </div>
    </div>
  );
};

const UserTripSettlementBreakdown = ({ settlement, trip }) => {
  const pb = settlement?.passengerBill || {};
  const de = settlement?.driverEarnings || {};
  const ai = settlement?.adminIncentive || {};
  const adv = settlement?.advanceSettlement || {};
  const hasSettlement = Boolean(settlement?.passengerBill || settlement?.driverEarnings);

  return (
    <div className="mt-6 space-y-4">
      <TripBillDetailsTable trip={trip} settlement={settlement} />

      {hasSettlement ? (
        <>
          <h3 className="font-semibold text-lg pt-2">Settlement Breakdown</h3>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <Panel
              title="Driver Earnings"
              lines={[
                <Line key="db" label="Base Fare" amount={de.baseFare} />,
                de.extraKm > 0 ? (
                  <Line key="dk" label="Extra KM fare" amount={de.extraKm} detail={de.extraKmDetail} />
                ) : null,
                de.extraTime > 0 ? (
                  <Line key="dt" label="Extra time fare" amount={de.extraTime} detail={de.extraTimeDetail} />
                ) : null,
                de.waitingTime > 0 ? (
                  <Line key="dw" label="Waiting time fare" amount={de.waitingTime} detail={de.waitingDetail} />
                ) : null,
              ].filter(Boolean)}
              total={de.total}
              totalLabel="Total Driver Earnings"
              footer={
                adv.walletCredit > 0 || adv.walletDebit > 0 ? (
                  <div className="mt-2 text-[11px] space-y-1">
                    {adv.walletCredit > 0 && (
                      <div className="text-green-700">Added to wallet: {money(adv.walletCredit)}</div>
                    )}
                    {adv.walletDebit > 0 && (
                      <div className="text-red-600">Deducted from wallet: {money(adv.walletDebit)}</div>
                    )}
                  </div>
                ) : null
              }
            />
            <Panel
              title="Admin Incentive"
              lines={[
                <Line key="ab" label="Base Fare" amount={ai.baseFare} />,
                ai.extraKm > 0 ? <Line key="ak" label="Extra KM fare" amount={ai.extraKm} /> : null,
                ai.extraTime > 0 ? <Line key="at" label="Extra time fare" amount={ai.extraTime} /> : null,
                ai.bookingFee > 0 ? <Line key="bf" label="Booking Fee" amount={ai.bookingFee} /> : null,
                ai.gst > 0 ? <Line key="gst" label="GST" amount={ai.gst} /> : null,
              ].filter(Boolean)}
              total={ai.total}
              totalLabel="Total Admin Incentive"
            />
            <Panel
              title="Partner Incentive"
              lines={[<Line key="pi" label="Partner share" amount={trip?.yourcomission} />]}
              total={trip?.yourcomission}
              totalLabel="Total Partner Incentive"
            />
            <Panel
              title="Admin Advance Received"
              lines={[
                <Line key="pa" label="Passengers (Pay Advance)" amount={adv.passengerAdvance ?? pb.passengerAdvance} />,
                <Line key="da" label="Drivers (Pay Advance)" amount={adv.driverAdvance} />,
                <Line key="ac" label="Admin Commission" amount={adv.adminCommission} />,
              ]}
              total={adv.totalAdvance}
              totalLabel="Admin Received Amount"
              footer={
                adv.walletAdjustment != null ? (
                  <div className="mt-2 text-[11px] text-gray-600">
                    Wallet adjustment: {money(adv.walletAdjustment)}
                  </div>
                ) : null
              }
            />
          </div>

          <div className="bg-gray-200 rounded-lg p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-medium">
            <div>Total Revenue: {money(pb.finalBill)}</div>
            <div>Partner Incentive: {money(trip?.yourcomission)}</div>
            <div>Admin Incentive: {money(ai.total)}</div>
            <div>Driver Earnings: {money(de.total)}</div>
          </div>
        </>
      ) : (
        <p className="text-xs text-gray-500 px-1">
          Full settlement panels appear after a driver is confirmed and trip completes.
        </p>
      )}
    </div>
  );
};

export default UserTripSettlementBreakdown;
