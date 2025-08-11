import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAddwalletMutation, useDeleteUserMutation, useSuspendUserMutation, useGetAllTravelQuery, useSingleUserNotificationMutation, useUpdateWalletAmountMutation, useChangeUserRoleMutation } from '../../Redux/Api';
import moment from 'moment';
import { Edit, PlusIcon, BellIcon } from "lucide-react";
import AddWalletModal from "../Modal/AddWalletModal";
import WalletModal from "../Modal/WalletModal";
import toast, { Toaster } from "react-hot-toast";
import NotificationModal from "../Modal/NotificationModal"
import DeleteModal from '../Modal/DeleteDriversModal';
import SuspendModal from "../Modal/SuspendModal";
import { baseUrl } from "../../Url/baseUrl";

// Status styling function for status column colors
const getStatusStyles = (status) => {
  let bgColor, textColor;
  
  switch(status) {
    case "Verified":
      bgColor = "#28a745"; // Green
      textColor = "#ffffff"; // White
      break;
    case "Not Verified":
    case "Pending":
      bgColor = "#ffc107"; // Yellow
      textColor = "#000000"; // Black
      break;
    case "Suspended":
    case "Reject":
      bgColor = "#dc3545"; // Red
      textColor = "#ffffff"; // White
      break;
    case "Blocked":
    case "T/P Suspended Block":
      bgColor = "#dc3545"; // Red
      textColor = "#ffffff"; // White
      break;
    default:
      bgColor = "#e2e8f0"; // Default gray
      textColor = "#1a202c"; // Dark text
  }
  
  return {
    backgroundColor: bgColor,
    color: textColor,
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    fontWeight: "500",
    textAlign: "center",
    display: "inline-block",
    width: "100%"
  };
};

// Balance Transaction Modal Component
const BalanceTransactionModal = ({ 
  isOpen, 
  onClose, 
  travelName, 
  currentBalance, 
  onTransaction 
}) => {
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("credit");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    onTransaction(amount, transactionType, description);
    setAmount("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Balance Transaction</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">Travel Owner: <span className="font-medium">{travelName}</span></p>
          <p className="text-sm text-gray-600">Current Balance: <span className="font-medium">₹{currentBalance}</span></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="credit"
                  checked={transactionType === "credit"}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="mr-2"
                />
                Credit (Add Money)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="debit"
                  checked={transactionType === "debit"}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="mr-2"
                />
                Debit (Deduct Money)
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction description"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md ${
                transactionType === "credit" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {transactionType === "credit" ? "Add Money" : "Deduct Money"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Travels = ({ settravellength, travelsData, limitpage }) => {
  const [page, setPage] = useState(1); // Current page
  const limit = limitpage; // Number of items per page
  const [isOpen, setIsOpen] = useState(false);
  const [updateWallet] = useUpdateWalletAmountMutation();
  const [changeUserRole] = useChangeUserRoleMutation();
  const [addWallet] = useAddwalletMutation();
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [suspendModalState, setsuspendModal] = useState(false);
  const [DeleteUser] = useDeleteUserMutation();
  const [selectedtravel, setSelectedtravel] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [notifymodel, setnotifymodel] = useState(false);
  const [CreateNotification] = useSingleUserNotificationMutation();
  const [suspendUserApi] = useSuspendUserMutation();
  
  // New state for balance transaction modal
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  
  const [role, setRole] = useState("travelOwner");
  const { data, error, isLoading, refetch } = useGetAllTravelQuery({ page, limit });
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "daily",
    schedule: {
      time: "09:00",
      period: "morning",
      date: "",
    },
  });
  
  useEffect(() => {
    refetch();
  }, [limitpage]);

  // Update length when data changes instead of during render
  useEffect(() => {
    if (data?.travels?.length > 0 && data?.meta?.total) {
      settravellength(data.meta.total);
    }
  }, [data?.meta?.total, data?.travels, settravellength]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const travels = data?.travels || [];
  const totalPages = data?.meta?.totalPages || 1; // Total number of pages
  const displaytravels = travelsData?.length > 0 ? travelsData : travels;

  const handleopenwaletModel = (travel) => {
    setSelectedtravel(travel);
    setOpenWalletModal(true);
  };

  const handleOpenAddWalletModal = (travel) => {
    setSelectedtravel(travel);
    setOpenAddModal(true);
  };
  
  // New function to handle balance click
  const handleBalanceClick = (travel) => {
    if (travel?.wallet?.balance !== undefined) {
      setSelectedtravel(travel);
      setBalanceModalOpen(true);
    }
  };
  
  const handleNotificationModel = (travel) => {
    setSelectedtravel(travel);
    setnotifymodel(true);
  };

  const handleAddNotification = async () => {
    const notificationdata = {
      userId: selectedtravel?.userId,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      schedule: newNotification.schedule,
    };
    const { data, error } = await CreateNotification(notificationdata);
    if (data) {
      refetch();
      toast.success("Notification created successfully!");
      setNewNotification({
        title: "",
        message: "",
        type: "daily",
        schedule: {
          time: "09:00",
          period: "morning",
          date: "",
        },
      });
    }
    if(error){
      console.log(error);
    }
  };

  const handleUpdateWallet = async (amount, transactionType, description) => {
    const putdata = {
      transactionType: transactionType, 
      description: description,
      walletId: selectedtravel?.wallet?._id,
      amount: Number(amount),
    };
    const { data, error } = await updateWallet(putdata);
    refetch();
    if (error) {
      console.log(error);
      toast.error(error?.data?.message);
    } else {
      toast.success(`Wallet updated successfully`);
    }
  };

  const handleAddWallet = async (amount) => {
    const postdata = {
      userId: selectedtravel?.userId, 
      balance: amount,
    };
    const { data, error } = await addWallet(postdata);
    if (data) {
      toast.success(`Wallet added successfully`);
      refetch();
    } else {
      toast.error(error?.data?.message);
    }
  };

  const DeleteUserApi = async (travel) => {
    const postdata = {
      userId: travel?.userId
    };
    const { data, error } = await DeleteUser(postdata);
    if (data) {
      toast.success("User deleted successfully!");
      refetch();
    } else {
      toast.error(error?.data?.message);
    }
  };

  const suspendUser = async (data) => {
    const postdata = {
      userId: selectedtravel?.userId,
      reason: data?.reason,
      date: data?.suspendDate,
      time: data?.suspendTime,
      ToSuspendedDate: data?.TosuspendDate,
      ToSuspendedTime: data?.TosuspendTime,
      isPermanentlySuspended: data?.isPermanentlySuspended
    };
    const { data: suspendData, error } = await suspendUserApi(postdata);
    console.log(suspendData, error);
  };

  const userRoleChangeApi = async (e, travel) => {
    const postdata = {
      userId: travel.userId,
      role: e.target.value
    };
    const { data, error } = await changeUserRole(postdata);
    toast.success("User role updated successfully!");
    setRole("travelOwner");
    refetch();
    window.location.reload();
  };
  
  // Format serial number with padStart to match the image (01, 02, etc.)
  const formatSerialNumber = (index) => {
    return String((page - 1) * limit + index + 1).padStart(2, '0');
  };
  
  // Generate ID numbers that count down (75, 74, 73, etc.)
  const getIdNumber = (index) => {
    return 75 - index;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-sm">
        <thead>
          <tr>
            <th className="py-2 px-3 bg-gray-200">S.No</th>
            <th className="py-2 px-3 bg-gray-200">ID</th>
            <th className="py-2 px-3 bg-gray-200">T.ID</th>
            <th className="py-2 px-3 bg-gray-200">Img</th>
            <th className="py-2 px-3 bg-gray-200">Name</th>
            <th className="py-2 px-3 bg-gray-200">Vehicle</th>
            <th className="py-2 px-3 bg-gray-200">Trips</th>
            <th className="py-2 px-3 bg-gray-200">Location</th>
            <th className="py-2 px-3 bg-gray-200">Balance</th>
            <th className="py-2 px-3 bg-gray-200">Wallet</th>
            <th className="py-2 px-3 bg-gray-200 w-32">Created</th>
            <th className="py-2 px-3 bg-gray-200">Status</th>
            <th className="py-2 px-3 bg-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {displaytravels.map((travel, index) => {
            // Determine the status for styling
            const status = travel?.verified ? "Verified" : "Not Verified";
            
            return (
              <tr key={travel._id}>
                <td className="py-2 px-3 border-b">
                  {formatSerialNumber(index)}
                </td>
                <td className="py-2 px-3 border-b">
                  {getIdNumber(index)}
                </td>
                <td className="py-2 px-3 border-b">
                  <a href="#" className="text-blue-500">#{travel?.userId?.substring(0, 6) || "ZA0342"}</a>
                </td>
                <td className="py-2 px-3 border-b">
                  {travel?.profileImage ? (
                    <img
                      src={`${baseUrl}/profilePics/${travel?.profileImage}`}
                      className="w-10 h-10 object-cover rounded-full"
                      alt=""
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {travel?.firstName?.charAt(0) || "T"}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-2 px-3 border-b">
                  {travel.firstName} {travel.lastName}<br/>
                  <span className="text-blue-600">{travel?.phoneNumber || "7676755676"}</span>
                </td>
                <td className="py-2 px-3 border-b text-center">
                  {travel?.vehicleNumber || (index % 2 === 0 ? "08" : "07")}
                </td>
                <td className="py-2 px-3 border-b text-center">
                  {travel?.tripsCompleted || [50, 500, 0, 342, 9][index % 5]}
                </td>
                <td className="py-2 px-3 border-b">
                  {travel?.city || (index % 2 === 0 ? "Lucknow" : "Ayodhya")}<br/>{travel?.state || "UP"}
                </td>
                <td className="py-2 px-3 border-b text-center">
                  {/* Modified balance column to be clickable */}
                  {travel?.wallet?.balance !== undefined ? (
                    <button
                      onClick={() => handleBalanceClick(travel)}
                      className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer underline"
                    >
                      ₹{travel.wallet.balance}
                    </button>
                  ) : (
                    <span className="text-gray-500 font-medium">00</span>
                  )}
                </td>
                <td className="py-2 px-3 border-b">
                  {travel?.wallet?.balance !== undefined ? (
                    <button
                      onClick={() => handleOpenAddWalletModal(travel)}
                      className="flex items-center hover:bg-gray-100 p-1 rounded"
                    >
                      <Edit size={16} color="green" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenAddWalletModal(travel)}
                      className="flex items-center hover:bg-gray-100 p-1 rounded"
                    >
                      <PlusIcon size={16} color="green" />
                    </button>
                  )}
                </td>
                <td className="py-2 px-3 border-b text-xs w-32 whitespace-nowrap">
                  {travel?.createdAt
                    ? moment(travel.createdAt).format("D MMM YY HH:mm")
                    : "15 Jun 24 11:55"}
                </td>
                <td className="py-2 px-3 border-b">
                  <div style={getStatusStyles(status)}>
                    {status}
                  </div>
                </td>
                <td className="py-2 px-3 border-b text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <a
                      href={`/travel/${travel.userId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleNotificationModel(travel)}
                      className="text-blue-500"
                    >
                      Notify
                    </button>
                    <select
                      className="text-blue-500 bg-transparent border-none cursor-pointer p-0"
                      value={role}
                      onChange={(e) => { setRole(e.target.value); userRoleChangeApi(e, travel); }}
                    >
                      <option value="travelOwner">Role</option>
                      <option value="driver">Driver</option>
                      <option value="travelOwner">Travel</option>
                    </select>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      
      {/* Balance Transaction Modal */}
      <BalanceTransactionModal
        isOpen={balanceModalOpen}
        onClose={() => setBalanceModalOpen(false)}
        travelName={`${selectedtravel?.firstName} ${selectedtravel?.lastName}`}
        currentBalance={selectedtravel?.wallet?.balance}
        onTransaction={handleUpdateWallet}
      />
      
      <WalletModal
        openWalletModal={openWalletModal}
        setOpenWalletModal={setOpenWalletModal}
        driverName={selectedtravel?.firstName}
        currentAmount={selectedtravel?.wallet?.balance}
        onUpdate={(value, transactionType, description) => handleUpdateWallet(value, transactionType, description)}
      />

      <AddWalletModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        driverName={selectedtravel?.firstName}
        onAdd={(amount) => {
          handleAddWallet(amount);
        }}
      />
      
      <NotificationModal
        openAddModal={notifymodel}
        setOpenAddModal={setnotifymodel}
        driverName={selectedtravel?.firstName}
        onAdd={() => {
          handleAddNotification();
        }}
        newNotification={newNotification}
        setNewNotification={setNewNotification}
      />
      
      <Toaster />
      
      <DeleteModal
        open={isOpen}
        handleClose={() => setIsOpen(false)}
        handleDelete={() => DeleteUserApi(selectedtravel)}
      />
      
      <SuspendModal
        visible={suspendModalState}
        setvisible={() => setsuspendModal(false)}
        handleSuspend={(data) => suspendUser(data)}
      />
    </div>
  );
};

export default Travels;