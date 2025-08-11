import React, { useMemo,useState } from "react";
import { CreditCard } from "lucide-react";
import {
  useGetAllTransactionsQuery,
  useUpdateTransactionStatusMutation,
} from "../../Redux/Api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Component/Sidebar";

const CreditTransactions = () => {
  const { data } = useGetAllTransactionsQuery();
  const navigate = useNavigate();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const creditTransactions = useMemo(() => {
    if (!data) return [];

    const transactions = Array.isArray(data)
      ? data
      : data.transactions || [];

    return transactions.filter(
      (item) =>
        item?.type?.toLowerCase() === "credit" ||
        item?.transactionType?.toLowerCase() === "credit" ||
        item?.category?.toLowerCase() === "credit" ||
        item?.amount > 0 ||
        item?.description?.toLowerCase().includes("credit")
    );
  }, [data]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateTransactionStatus({ id, status }).unwrap();
    } catch (error) {
      console.error("Failed to update status:", error);
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
            <CreditCard className="w-8 h-8 text-green-500" />
            Credit Transactions ({creditTransactions.length})
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Credit Transactions</h2>
            <button
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
              // onClick={() => handleExport()} // Optional CSV export logic
            >
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
                    "Credit Amount",
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
                {creditTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-12 text-center text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No credit transactions found</p>
                      <p className="text-sm">Credits will appear here when available.</p>
                    </td>
                  </tr>
                ) : (
                  creditTransactions.map((item, index) => (
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
                      <td className="px-6 py-4 text-sm">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-6 py-4 text-sm">{item._id}</td>
                      <td className="px-6 py-4 text-sm">{item.userDetails?.userId || "ZA0000"}</td>
                      <td className="px-6 py-4 text-sm">
                        {item.userDetails?.firstName} {item.userDetails?.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm">{item.userDetails?.role || "User"}</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">
                        +₹{item.amount}
                      </td>
                      <td className="px-6 py-4 text-sm">{item.paymentMethod || "Bank Transfer"}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(item.createdAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">{item.description || "Credited to wallet"}</td>
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

export default CreditTransactions;
