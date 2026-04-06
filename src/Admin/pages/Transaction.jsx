import React, { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { useUpdateTransactionStatusMutation, useGetTransactionInfoQuery } from "../Redux/Api";
import { useParams } from "react-router-dom";

const Transaction = () => {
  const { id } = useParams();
  const {
    data: transactionData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTransactionInfoQuery(id, { skip: !id });

  const [status, setStatus] = useState("PENDING");
  const [showReasonTooltip, setShowReasonTooltip] = useState(false);
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();

  // RTK Query puts the JSON body directly on `data` (not `data.data`).
  const data = transactionData ?? {};
  const transactions = data?.transactions;
  const upiAccountDetails = data?.upiAccountDetails;
  const bankAccountDetails = data?.bankAccountDetails;

  useEffect(() => {
    if (transactions?.status) {
      setStatus(transactions.status);
    }
  }, [transactions?.status]);

  const handleUpdateTransactionStatus = (newStatus) => {
    setStatus(newStatus);
  };

  // Backend `PUT /wallet/updateTransactionstatus` only accepts SUCCESS or CANCELLED.
  const handleStatusUpdate = async (action) => {
    if (!id) return;
    if (action === "ON HOLD") {
      window.alert(
        "On Hold is not supported by the wallet status API yet. Use backend support or map to a status."
      );
      return;
    }
    const apiStatus = action === "REJECT" ? "CANCELLED" : "SUCCESS";
    try {
      await updateTransactionStatus({
        transactionId: id,
        status: apiStatus,
      }).unwrap();
      setStatus(apiStatus === "CANCELLED" ? "CANCELLED" : "SUCCESS");
      refetch();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const method = String(
    transactions?.withdrawalDetails?.method || ""
  ).toUpperCase();
  const isBank = method === "BANK";
  const isUPI = method === "UPI";

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <p className="text-gray-600">No transaction id in URL.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-gray-700">Loading transaction…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <p className="text-red-600">
          Failed to load transaction
          {error?.data?.message ? `: ${error.data.message}` : ""}
        </p>
      </div>
    );
  }

  const amount = Number(transactions?.amount ?? 0);
  const givenAmount = Number(transactions?.givenAmount ?? 0);
  const balanceAfter = Number(transactions?.balanceTransaction ?? 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Transfer Amount</h2>
              <span
                className={`px-4 py-2 rounded text-sm font-bold ${
                  status === "SUCCESS" || status === "COMPLETED"
                    ? "bg-green-200 text-green-900"
                    : status === "PROCESSING" || status === "PENDING"
                      ? "bg-yellow-300 text-black"
                      : status === "CANCELLED" || status === "REJECTED"
                        ? "bg-red-200 text-red-900"
                        : "bg-gray-200 text-gray-900"
                }`}
              >
                {status}
              </span>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-gray-500 mb-1">Withdrawal amount</p>
                <p className="text-xl font-semibold">₹{amount.toFixed(2)}</p>
              </div>
              <div className="text-2xl font-bold hidden sm:block">|</div>
              <div>
                <p className="text-gray-500 mb-1">Given amount</p>
                <p className="text-xl font-semibold">₹{givenAmount.toFixed(2)}</p>
              </div>
              <div className="text-2xl font-bold hidden sm:block">|</div>
              <div>
                <p className="text-gray-500 mb-1">Balance after</p>
                <p className="text-xl font-semibold">₹{balanceAfter.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold mb-4">Transaction Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-500 mb-1">Type</p>
                <p className="text-lg font-semibold">
                  {transactions?.type ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Method</p>
                <p className="text-lg font-semibold">
                  {method || "—"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className="text-gray-500 mb-1">Description</p>
                <p className="text-lg font-semibold">
                  {transactions?.description ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {isBank && bankAccountDetails && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Bank account details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 mb-1">Account number</p>
                  <p className="text-lg font-semibold">
                    {bankAccountDetails?.accountNumber ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Bank name</p>
                  <p className="text-lg font-semibold">
                    {bankAccountDetails?.bankName ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">IFSC</p>
                  <p className="text-lg font-semibold">
                    {bankAccountDetails?.ifscCode ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isUPI && upiAccountDetails && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold mb-4">UPI Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-500 mb-1">UPI Holder Name</p>
                  <p className="text-lg font-semibold">
                    {upiAccountDetails?.upiHolderName ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">UPI Number</p>
                  <p className="text-lg font-semibold">
                    {upiAccountDetails?.upiphoneNumber || "—"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">UPI ID</p>
                <p className="text-lg font-semibold">
                  {upiAccountDetails?.upiId ?? "—"}
                </p>
              </div>
            </div>
          )}

          <div className="p-6 flex flex-wrap justify-center items-center gap-4 relative">
            <button
              type="button"
              onClick={() => handleStatusUpdate("SUCCESS")}
              className="px-6 py-3 rounded text-white font-bold bg-green-500 hover:bg-green-600"
            >
              SUCCESS
            </button>
            <div className="text-2xl font-bold">|</div>
            <div className="relative">
              <button
                type="button"
                onClick={() => handleStatusUpdate("REJECT")}
                className="px-6 py-3 rounded text-white font-bold bg-red-600 hover:bg-red-700"
                onMouseEnter={() => setShowReasonTooltip(true)}
                onMouseLeave={() => setShowReasonTooltip(false)}
              >
                REJECT
              </button>
              {showReasonTooltip && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-orange-400 text-white px-4 py-2 rounded z-10">
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-400 rotate-45" />
                  With reason
                </div>
              )}
            </div>
            <div className="text-2xl font-bold">|</div>
            <button
              type="button"
              onClick={() => handleStatusUpdate("ON HOLD")}
              className="px-6 py-3 rounded text-black font-bold bg-yellow-400 hover:bg-yellow-500"
            >
              ON HOLD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
