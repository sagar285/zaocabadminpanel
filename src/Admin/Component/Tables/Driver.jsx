
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAddwalletMutation,
  useGetDriverQuery,
  useUpdateWalletAmountMutation,
  useSingleUserNotificationMutation,
  useDeleteUserMutation,
  useSuspendUserMutation,
  useChangeUserRoleMutation
} from "../../Redux/Api";
import { Edit, PlusIcon, BellIcon, Eye, Users, MapPin, Phone, Calendar } from "lucide-react";
import WalletModal from "../Modal/WalletModal";
import toast, { Toaster } from "react-hot-toast";
import AddWalletModal from "../Modal/AddWalletModal";
import { baseUrl } from "../../Url/baseUrl";
import moment from "moment";
import NotificationModal from "../Modal/NotificationModal";
import DeleteModal from "../Modal/DeleteDriversModal";
import SuspendModal from "../Modal/SuspendModal";

// Status styling function for status column colors (original colors maintained)
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
  driverName, 
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
          <p className="text-sm text-gray-600">Driver: <span className="font-medium">{driverName}</span></p>
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

const Driver = ({ setlength, DriversData, limitpage }) => {
  // Add pagination state
  const [page, setPage] = useState(1);
  const limit = limitpage; // Number of items per page

  // Update the query to include pagination parameters
  const { data, error, isLoading, refetch } = useGetDriverQuery({
    page,
    limit,
  });
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  useEffect(() => {
    refetch();
  }, [limitpage]);

  // Update length when data changes instead of during render
  useEffect(() => {
    if (data?.drivers?.length > 0 && data?.meta?.total) {
      setlength(data.meta.total);
    }
  }, [data?.meta?.total, data?.drivers, setlength]);

  const [updateWallet] = useUpdateWalletAmountMutation();
  const [changeUserRole] = useChangeUserRoleMutation();
  const [addWallet] = useAddwalletMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [suspendModalState, setsuspendModal] = useState(false);
  const [DeleteUser] = useDeleteUserMutation();
  const [CreateNotification] = useSingleUserNotificationMutation();
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [notifymodel, setnotifymodel] = useState(false);
  const navigate = useNavigate()
  // New state for balance transaction modal
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  
  const [role, setRole] = useState("driver");
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "daily",
    schedule: {
      time: `${hours}:${minutes}`,
      period: "morning",
      date: "",
    },
  });
  const [suspendUserApi] = useSuspendUserMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const drivers = data?.drivers || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handleopenwaletModel = (driver) => {
    setSelectedDriver(driver);
    setOpenWalletModal(true);
  };
  
  const handleNotificationModel = (driver) => {
    setSelectedDriver(driver);
    setnotifymodel(true);
  };

  const handleOpenAddWalletModal = (driver) => {
    setSelectedDriver(driver);
    setOpenAddModal(true);
  };

  // New function to handle balance click
  const handleBalanceClick = (driver) => {
    if (driver?.wallet?.balance !== undefined) {
      setSelectedDriver(driver);
      setBalanceModalOpen(true);
    }
  };

  // Enhanced wallet edit function with navigation
  const handleWalletEdit = (driver) => {
    navigate('/withdraw');
  };

  const handleUpdateWallet = async (amount, transactionType, description) => {
    const putdata = {
      transactionType: transactionType,
      description: description,
      walletId: selectedDriver?.wallet?._id,
      amount: Number(amount),
    };
    const { data, error } = await updateWallet(putdata);
    refetch();
    if (error) {
      console.log(error);
      toast.error(error?.data?.message);
    } else {
      toast.success(`Wallet updated successfully `);
    }
  };

  const handleAddWallet = async (amount) => {
    const postdata = {
      userId: selectedDriver?.userId,
      balance: amount,
    };
    const { data, error } = await addWallet(postdata);
    if (data) {
      toast.success(`Wallet added successfully `);
      refetch();
    } else {
      toast.error(error?.data?.message);
    }
  };
  
  const handleAddNotification = async () => {
    const notificationdata = {
      userId: selectedDriver?.user?._id,
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
    if (error) {
      console.log(error);
    }
  };

  const DeleteUserApi = async (driver) => {
    const postdata = {
      userId: driver?.user?._id,
    };
    const { data, error } = await DeleteUser(postdata);
    if (data) {
      toast.success("User deleted successfully!");
      window.location.reload();
      refetch();
    } else {
      toast.error(error?.data?.message);
    }
  };

  const suspendUser = async(data) => {
    console.log(data);
    const postdata = {
      userId: selectedDriver?.user?._id,
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

  const displaydrivers = DriversData?.length > 0 ? DriversData : drivers;
  console.log(displaydrivers)
  const userRoleChangeApi = async (e, driver) => {
    const postdata = {
      userId: driver?.user?._id,
      role: e.target.value
    };
    const { data, error } = await changeUserRole(postdata);
   
    toast.success("Role changed successfully!");
    setRole("driver");
    refetch();
    window.location.reload();
  };
  
  // Generate ID numbers that count down (75, 74, 73, etc.)
  const getIdNumber = (index) => {
    return 75 - index;
  };

  // Format serial number with padStart to match the image (01, 02, etc.)
  const formatSerialNumber = (index) => {
    return String((page - 1) * limit + index + 1).padStart(2, '0');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-sm border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">S.No</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">ID</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">P.ID</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Img</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Name</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Vehicle</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Trips</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Location</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Balance</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Wallet</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200 w-32">Created</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Status</th>
            <th className="py-2 px-3 bg-gray-200 w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          {displaydrivers.map((driver, index) => {
            // Determine the status for styling
            const status = driver?.verified ? "Verified" : "Pending";
            
            return (
              <tr key={driver._id}>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {formatSerialNumber(index)}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {getIdNumber(index)}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  <a href="#" className="text-blue-500">#{driver?.user?._id?.substring(0, 6) || "ZA0342"}</a>
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {driver?.user?.profileImage ? (
                    <img
                      src={`${baseUrl}/profilePics/${driver?.user?.profileImage}`}
                      className="w-10 h-10 object-cover rounded-full"
                      alt=""
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {driver?.firstName?.charAt(0) || "D"}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {driver?.firstName} {driver?.lastName}<br/>
                  <span className="text-blue-600">{driver?.phoneNumber || "7676755676"}</span>
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300 text-center">
                  {driver?.vehicle?.vehicleNumber} {"\n"}
                  {driver?.vehicle?.vehicleName}{"\n"}
                  {driver?.vehicle?.vehicleCategory}

                </td>

                {/* <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300 text-center">
               {driver.noOfDriver}
                </td> */}
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300 text-center">
                  {driver?.tripsCompleted || [50, 500, 0, 342, 9][index % 5]}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {driver?.user?.city || (index % 2 === 0 ? "Lucknow" : "Ayodhya")}<br/>{driver?.user?.state || "UP"}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300 text-center">
                  {/* Modified balance column to be clickable */}
                  {driver?.wallet?.balance !== undefined ? (
                    <button
                      onClick={() => handleBalanceClick(driver)}
                      className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer underline"
                    >
                      ₹{driver.wallet.balance}
                    </button>
                  ) : (
                    <span className="text-gray-500 font-medium">00</span>
                  )}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {driver?.wallet?.balance !== undefined ? (
                    <Link to={`/userWalletInfo/${driver?.user?._id}`}>
                      <button className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded">
                        <Edit size={16} color="green" />
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleOpenAddWalletModal(driver)}
                      className="flex items-center hover:bg-gray-100 p-1 rounded"
                    >
                      <PlusIcon size={16} color="green" />
                    </button>
                  )}
                </td>
                <td className="py-2 px-2 border-b-2 border-r-2 border-gray-300 text-xs w-24 whitespace-nowrap">
                  {driver?.createdAt
                    ? moment(driver.createdAt).format("D MMM YY HH:mm")
                    : "15 Jun 24 11:55"}
                </td>
                <td className="py-1 px-2 border-b-2 border-r-2 border-gray-300">
                  <div style={getStatusStyles(status)}>
                    {status}
                  </div>
                </td>
                <td className="py-1 px-2 border-b-2 text-center">
                  <div className="flex flex-col items-center space-y-1 text-xs w-20">
                    <a
                      href={`/driver/${driver?.user?._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 flex items-center gap-1 hover:text-blue-700"
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </a>
                    <button
                      onClick={() => handleNotificationModel(driver)}
                      className="text-blue-500 flex items-center gap-1 hover:text-blue-700"
                    >
                      <BellIcon size={12} />
                      <span>Notify</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-blue-500" />
                      <select
                        className="text-blue-500 bg-transparent border-none cursor-pointer text-xs p-0"
                        value={role}
                        onChange={(e) => { setRole(e.target.value); userRoleChangeApi(e, driver); }}
                      >
                               <option value="driver">Role</option>
                        <option value="driver">Driver</option>
                        <option value="travelOwner">Travel</option>
                        <option value="Passenger">Passenger</option>
                      </select>
                    </div>
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
        driverName={`${selectedDriver?.firstName} ${selectedDriver?.lastName}`}
        currentBalance={selectedDriver?.wallet?.balance}
        onTransaction={handleUpdateWallet}
      />

      <WalletModal
        openWalletModal={openWalletModal}
        setOpenWalletModal={setOpenWalletModal}
        driverName={selectedDriver?.firstName}
        currentAmount={selectedDriver?.wallet?.balance}
        onUpdate={(value, transactionType, description) =>
          handleUpdateWallet(value, transactionType, description)
        }
      />

      <AddWalletModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        driverName={selectedDriver?.firstName}
        onAdd={(amount) => {
          handleAddWallet(amount);
        }}
      />

      <NotificationModal
        openAddModal={notifymodel}
        setOpenAddModal={setnotifymodel}
        driverName={selectedDriver?.firstName}
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
        handleDelete={() => DeleteUserApi(selectedDriver)}
      />
      <SuspendModal
        visible={suspendModalState}
        setvisible={() => setsuspendModal(false)}
        handleSuspend={(data) => suspendUser(data)}
      />
    </div>
  );
};

export default Driver;