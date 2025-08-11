import React, { useMemo,useState } from "react";
import { Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useUpdateTransactionStatusMutation,
  useGetPercentageTransactionsQuery,
} from "../../Redux/Api";
import Sidebar from "../../Component/Sidebar";

const PercentageTransactions = () => {
  const { data } = useGetPercentageTransactionsQuery();
  const navigate = useNavigate();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
      const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Normalizing and filtering transactions
  const percentageTransactions = useMemo(() => {
    console.log("Raw data in percentageTransactions:", data);

    if (!data) return [];

    let transactions = [];

    if (Array.isArray(data)) {
      transactions = data;
    } else if (Array.isArray(data.transactions)) {
      transactions = data.transactions;
    } else {
      console.warn("Unexpected data format:", data);
      return [];
    }

    console.log("Normalized transactions array:", transactions);

    return transactions.filter(
      (item) => item?.type?.toLowerCase() === "percentage"
    );
  }, [data]);

  // Handle transaction status update
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateTransactionStatus({ id, status }).unwrap();
      // Optionally show a notification
    } catch (err) {
      console.error("Failed to update transaction status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

<Sidebar
                          isSidebarOpen={isSidebarOpen}
                          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                        />

  <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Percent className="w-8 h-8 text-purple-500" />
            Percentage Transactions ({percentageTransactions.length})
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">All Percentage Transactions</h2>
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1">
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "S/N",
                    "ID",
                    "User ID",
                    "Name",
                    "User Role",
                    "Amount",
                    "Via",
                    "Date",
                    "Description",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {percentageTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-12 text-center text-gray-500">
                      <Percent className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No percentage transactions found</p>
                      <p className="text-sm">Percentage-based transactions will appear here when available.</p>
                    </td>
                  </tr>
                ) : (
                  percentageTransactions.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`hover:bg-gray-50 ${
                        item.status === "SUCCESS"
                          ? "bg-green-50"
                          : item.status === "PROCESSING"
                          ? "bg-yellow-50"
                          : item.status === "REJECTED"
                          ? "bg-red-50"
                          : item.status === "ON_HOLD"
                          ? "bg-orange-50"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-4 text-sm">{item._id}</td>
                      <td className="px-6 py-4 text-sm">
                        {item.userDetails?.userId || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.userDetails?.firstName} {item.userDetails?.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.userDetails?.role || "User"}
                      </td>
                      <td className="px-6 py-4 text-sm text-purple-600 font-medium">
                        ₹{item.amount}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.paymentMethod || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(item.createdAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.description || "Percentage-based transaction"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-sm font-semibold rounded-sm ${
                            item.status === "COMPLETED" || item.status === "SUCCESS"
                              ? "bg-green-500 text-white"
                              : item.status === "REJECTED" || item.status === "CANCELLED"
                              ? "bg-red-500 text-white"
                              : item.status === "ON_HOLD"
                              ? "bg-orange-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}
                        >
                          {item.status || "Processing"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => navigate(`/transaction/${item._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(item._id, "CANCELLED")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentageTransactions;
