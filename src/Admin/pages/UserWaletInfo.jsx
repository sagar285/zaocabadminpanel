import React,{useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import { useGetuserWalletInfoQuery } from "../Redux/Api";
import Sidebar from '../Component/Sidebar'

import {
  Calendar,
  CreditCard,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  ArrowDownCircle,

} from "lucide-react";
import moment  from "moment-timezone"

const WalletDetails = ({ walletData }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case "CREDIT":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "DEBIT":
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case "WITHDRAWAL":
        return <ArrowDownCircle className="w-5 h-5 text-orange-500" />;
      case "REFUND":
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "CREDIT":
        return "text-green-600";
      case "DEBIT":
        return "text-red-600";
      case "WITHDRAWAL":
        return "text-orange-600";
      case "REFUND":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
<div
        className={`flex-1 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Wallet Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Wallet Summary
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-lg font-semibold">
                Current Balance
              </div>
              <div className="text-2xl font-bold">
                ₹{walletData?.currentBalance?.toFixed(2)}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-lg font-semibold">
                Total Credits
              </div>
              <div className="text-2xl font-bold">
                ₹{walletData?.summary?.credits?.toFixed(2)}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-600 text-lg font-semibold">
                Total Debits
              </div>
              <div className="text-2xl font-bold">
                ₹{walletData?.summary?.debits?.toFixed(2)}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-orange-600 text-lg font-semibold">
                Total Withdrawals
              </div>
              <div className="text-2xl font-bold">
                ₹{walletData?.summary?.withdrawals?.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Transaction History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {walletData?.transactions?.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <span
                          className={`ml-2 ${getTransactionColor(
                            transaction?.type
                          )}`}
                        >
                          {transaction?.type}
                          {console.log(transaction)}
                         
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${getTransactionColor(
                        transaction?.type
                      )}`}
                    >
                      {transaction.type === "CREDIT" ||
                      transaction.type === "REFUND"
                        ? "+"
                        : "-"}
                      ₹{transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {transaction.description}
                      </div>
                      {transaction.tripInfo && (
                        <div className="text-xs text-gray-500 mt-1">
                          Trip: {transaction.tripInfo.tripNumber}
                          <br />
                          {transaction.tripInfo.pickupLocation} →{" "}
                          {transaction.tripInfo.dropLocation}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {/* {transaction.createdAt} */}
                        {
                          moment(transaction?.date)
                          .tz("Asia/Kolkata") // India time zone
                          .format("D MMM hh:mm A")
                      }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          transaction.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : transaction.status === "FAILED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
</div>
    </div>
  );
};

const UserWaletInfo = () => {
  const { id } = useParams();
  const { data, error,refetch ,} = useGetuserWalletInfoQuery(id);


  useEffect(()=>{
    refetch();
  },[id])
  console.log(data);
  return <WalletDetails walletData={data?.data}/>;
};

export default UserWaletInfo;
