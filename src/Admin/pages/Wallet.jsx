import React, { useMemo,useState } from "react";
import {
  Wallet as WalletIcon,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  View,
  Filter,
  Download,
  CreditCard,
  TrendingUp,
  Percent,
} from "lucide-react";
import {
  useGetWithdrawRequestQuery,
  useUpdateTransactionStatusMutation,
} from "../Redux/Api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar";

const Wallet = () => {
  const { data } = useGetWithdrawRequestQuery();
  const navigate = useNavigate();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
      const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  

  // Filter only withdrawal transactions
  const withdrawalTransactions = useMemo(() => {
    console.log(data);
    
    if (!data?.withdrawRequests) return [];
    return data.withdrawRequests.filter(item => 
      item.transaction?.type === "WITHDRAWAL" || 
      item.transaction?.transactionType === "WITHDRAWAL" ||
      item.transaction?.category === "WITHDRAWAL" ||
      // If no specific type field, filter by amount being negative or description containing withdraw
      (item.transaction?.amount < 0 || 
       item.transaction?.description?.toLowerCase().includes('withdraw'))
    );
  }, [data?.withdrawRequests]);

  // Calculate withdrawal statistics
  const withdrawalStats = useMemo(() => {
    if (!withdrawalTransactions.length) return {
      totalTransactions: 0,
      totalAmount: 0,
      pendingCount: 0,
      completedCount: 0,
      rejectedCount: 0
    };

    return {
      totalTransactions: withdrawalTransactions.length,
      totalAmount: withdrawalTransactions.reduce((sum, item) => 
        sum + Math.abs(item.transaction?.amount || 0), 0),
      pendingCount: withdrawalTransactions.filter(item => 
        item.transaction?.status === "PROCESSING" || 
        item.transaction?.status === "PENDING").length,
      completedCount: withdrawalTransactions.filter(item => 
        item.transaction?.status === "SUCCESS" || 
        item.transaction?.status === "COMPLETED").length,
      rejectedCount: withdrawalTransactions.filter(item => 
        item.transaction?.status === "REJECTED" || 
        item.transaction?.status === "CANCELLED").length,
    };
  }, [withdrawalTransactions]);

  const handleStatusUpdate = async (transactionId, newStatus) => {
    try {
      const putdata = {
        transactionId: transactionId,
        status: newStatus,
      };
      await updateTransactionStatus(putdata);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Navigation to other transaction pages
  const navigateToTransactionPage = (type) => {
    switch(type) {
      case 'credit':
        navigate('/transactions/credit');
        break;
      case 'debit':
        navigate('/transactions/debit');
        break;
      case 'percentage':
        navigate('/transactions/percentage');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      
        <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
  <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'} p-6`}>
        {/* Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <WalletIcon className="w-8 h-8 text-blue-500" />
              Withdrawal Requests ({withdrawalStats.totalTransactions})
            </h1>
            
            {/* Transaction Type Navigation */}
            <div className="flex space-x-2">
              <button
                onClick={() => navigateToTransactionPage('credit')}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Credit
              </button>
              <button
                onClick={() => navigateToTransactionPage('debit')}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Debit
              </button>
              <button
                onClick={() => navigateToTransactionPage('percentage')}
                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
              >
                <Percent className="w-4 h-4" />
                Percentage
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <WalletIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
                <p className="text-2xl font-bold text-gray-900">{withdrawalStats.totalTransactions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{withdrawalStats.completedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Filter className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{withdrawalStats.pendingCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{withdrawalStats.rejectedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Withdrawal Transactions</h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S N
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Withdrawal Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transfer via
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawalTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-12 text-center text-gray-500">
                      <WalletIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No withdrawal transactions found</p>
                      <p className="text-sm">Withdrawal requests will appear here when available.</p>
                    </td>
                  </tr>
                ) : (
                  withdrawalTransactions.map((item, index) => (
                    <tr key={item.transaction._id} className={`hover:bg-gray-50 ${
                      item.transaction?.status === "SUCCESS" ? "bg-green-50" :
                      item.transaction?.status === "PROCESSING" ? "bg-yellow-50" :
                      item.transaction?.status === "REJECTED" ? "bg-red-50" :
                      item.transaction?.status === "ON_HOLD" ? "bg-orange-50" : ""
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(withdrawalStats.totalTransactions - index).toString().padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <a href="#" className="hover:underline">#{item.userDetails?.userId || "ZA0342"}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p>{item.userDetails?.firstName} {item.userDetails?.lastName}</p>
                          <p className="text-blue-600">{item.userDetails?.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.userDetails?.role || "Driver Partner"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-red-600">
                        -₹{Math.abs(item.transaction?.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> 
                        {item.transaction?.paymentMethod || "UPI"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> 
                        {new Date(item.transaction?.createdAt).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> 
                        {item.transaction?.description || "Withdraw via UPI"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-sm ${
                          item.transaction?.status === "COMPLETED" || item.transaction?.status === "SUCCESS" 
                            ? "bg-green-500 text-white"
                            : item.transaction?.status === "CANCELLED" || item.transaction?.status === "REJECTED"
                              ? "bg-red-500 text-white" 
                              : item.transaction?.status === "ON_HOLD"
                                ? "bg-orange-500 text-white"
                                : "bg-yellow-500 text-white"
                        }`}>
                          {item.transaction?.status === "COMPLETED" ? "Success" : 
                           item.transaction?.status === "SUCCESS" ? "Success" :
                           item.transaction?.status === "CANCELLED" ? "Reject" :
                           item.transaction?.status === "REJECTED" ? "Reject" :
                           item.transaction?.status === "ON_HOLD" ? "On Hold" : "Processing"}
                        </span>
                      </td>
                      <td className="px-6 gap-3 flex py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => navigate(`/transaction/${item.transaction._id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(item.transaction._id, "CANCELLED")}
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

export default Wallet;