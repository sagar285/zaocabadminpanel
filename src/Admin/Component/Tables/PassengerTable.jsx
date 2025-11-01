import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Edit, PlusIcon, BellIcon, Eye, Users, MapPin, Phone, Calendar, Ban, UserCheck, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import { useChangeUserRoleMutation } from "../../Redux/Api";



// Status styling function - same as driver table
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

// Balance Transaction Modal Component - same as driver table
const BalanceTransactionModal = ({ 
  isOpen, 
  onClose, 
  passengerName, 
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
          <p className="text-sm text-gray-600">Passenger: <span className="font-medium">{passengerName}</span></p>
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

// Notification Modal Component
const NotificationModal = ({ isOpen, onClose, passengerName, onSend }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill all fields");
      return;
    }
    onSend(title, message);
    setTitle("");
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Send Notification</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">Passenger: <span className="font-medium">{passengerName}</span></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PassengerTable = ({ 
  setlength, 
  PassengersData = [], 
  limitpage = 10, 
  searchTerm = "", 
  onSearchResults 
}) => {
  // Pagination state
  const [page, setPage] = useState(1);
  const limit = limitpage;
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [role, setRole] = useState("passenger");
   const [changeUserRole] = useChangeUserRoleMutation();

  // Filter passengers based on search term
  // const filteredPassengers = useMemo(() => {
  //   const dataToFilter = PassengersData?.length > 0 && PassengersData;
    
  //   if (!searchTerm.trim()) {
  //     return dataToFilter;
  //   }
    
  //   const searchLower = searchTerm.toLowerCase();
  //   return dataToFilter.filter(passenger => {
  //     const fullName = `${passenger?.firstName || ''} ${passenger?.lastName || ''}`.toLowerCase();
  //     const phone = passenger?.phoneNumber || '';
  //     const city = passenger?.user?.city?.toLowerCase() || '';
  //     const state = passenger?.user?.state?.toLowerCase() || '';
  //     const status = passenger?.verified ? 'verified' : 'pending';
  //     const vehicleNumber = passenger?.vehicle?.vehicleNumber || '';
      
  //     return (
  //       fullName.includes(searchLower) ||
  //       phone.includes(searchTerm) ||
  //       city.includes(searchLower) ||
  //       state.includes(searchLower) ||
  //       status.includes(searchLower) ||
  //       vehicleNumber.includes(searchTerm)
  //     );
  //   });
  // }, [PassengersData, searchTerm]);

  // Pagination for filtered results
  const totalPassengers = PassengersData?.length;
  const totalPages = Math.ceil(totalPassengers / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentPassengers = PassengersData?.slice(startIndex, endIndex);

  // Update length when filtered data changes
  useEffect(() => {
    if (setlength) {
      setlength(totalPassengers);
    }
    if (onSearchResults) {
      onSearchResults(totalPassengers);
    }
  }, [totalPassengers, setlength, onSearchResults]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Format serial number with padStart - same as driver table
  const formatSerialNumber = (index) => {
    return String((page - 1) * limit + index + 1).padStart(2, '0');
  };

  // Generate ID numbers that count down - same as driver table
  const getIdNumber = (index) => {
    return 75 - ((page - 1) * limit + index);
  };

  const handleNotificationModal = (passenger) => {
    setSelectedPassenger(passenger);
    setNotificationModalOpen(true);
  };

  const handleBalanceClick = (passenger) => {
    if (passenger?.wallet?.balance !== undefined) {
      setSelectedPassenger(passenger);
      setBalanceModalOpen(true);
    }
  };

  const handleSendNotification = (title, message) => {
    toast.success(`Notification sent to ${selectedPassenger?.firstName}!`);
    console.log('Sending notification:', { title, message, to: selectedPassenger });
  };

  const handleUpdateWallet = (amount, transactionType, description) => {
    toast.success(`Wallet updated successfully for ${selectedPassenger?.firstName}!`);
    console.log('Wallet update:', { amount, transactionType, description });
  };

  const handleAddWallet = (amount) => {
    toast.success(`Wallet added successfully for ${selectedPassenger?.firstName}!`);
    console.log('Wallet added:', { amount });
  };

  const handleOpenAddWalletModal = (passenger) => {
    setSelectedPassenger(passenger);
    toast.info(`Add wallet for ${passenger.firstName}`);
  };

  const userRoleChangeApi = async (e, driver) => {
    console.log(e.target.value,driver,"ooooooooooo")
    try {
      const postdata = {
        userId: driver._id,
        role:  e.target.value
      };
      const { data, error } = await changeUserRole(postdata);
console.log("api callll")
  
    console.log("kkkkkkkkkkhhhhhhhh")
    console.log(data,error)
  console.log("uuuuuuuu")
  //  console.log(data,error,"kkkkkkkkkkkk")
  //   toast.success("Role changed successfully!");
    // setRole("driver");
    // refetch();
    // window.location.reload();
  } catch (error) {
      console.log(error)
  }
  };


  // Empty state when no search results
  if (searchTerm && PassengersData.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No passengers found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No passengers match your search criteria "<strong>{searchTerm}</strong>".
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search terms or check the spelling.
        </p>
      </div>
    );
  }

  // Empty state when no data at all
  if (!searchTerm && PassengersData.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No passengers</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding your first passenger.</p>
      </div>
    );
  }

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
            {/* <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Carpool Vehicle</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Trips Completed</th> */}
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Location</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Balance</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Wallet</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200 w-32">Created</th>
            <th className="py-2 px-3 border-r-2 border-gray-300 bg-gray-200">Status</th>
            <th className="py-2 px-3 bg-gray-200 w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          {PassengersData.map((passenger, index) => {
            // Determine the status for styling - same logic as driver table
            const status = passenger?.verified ? "Verified" : "Pending";
            
            return (
              <tr key={passenger._id}>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {formatSerialNumber(index)}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {getIdNumber(index)}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  <a href="#" className="text-blue-500">#{passenger?._id?.substring(0, 6) || "ZA0342"}</a>
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {passenger?.user?.profileImage ? (
                    <img
                      src={passenger.profileImage}
                      className="w-10 h-10 object-cover rounded-full"
                      alt=""
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {passenger?.firstName?.charAt(0) || "P"}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {passenger?.firstName} {passenger?.lastName}<br/>
                  <span className="text-blue-600">{passenger?.phone || "7676755676"}</span>
                </td>
                {/* <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300 text-center">
                  {passenger?.vehicle?.vehicleNumber || (index % 2 === 0 ? "08" : "07")}
                </td> */}
                {/* <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300 text-center">
                  {passenger?.tripsCompleted || [50, 500, 0, 342, 9][index % 5]}
                </td> */}
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {passenger?.city || (index % 2 === 0 ? "Lucknow" : "Ayodhya")}<br/>{passenger?.state || "UP"}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300 text-center">
                  {/* Modified balance column to be clickable - same as driver table */}
                  {passenger?.wallet?.balance !== undefined ? (
                    <button
                      onClick={() => handleBalanceClick(passenger)}
                      className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer underline"
                    >
                      ₹{passenger.wallet.balance}
                    </button>
                  ) : (
                    <span className="text-gray-500 font-medium">00</span>
                  )}
                </td>
                <td className="py-2 px-3 border-b-2 border-r-2 border-gray-300">
                  {passenger?.wallet?.balance !== undefined ? (
                    <Link to={`/userWalletInfo/${passenger?._id}`}>
                      <button className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded">
                        <Edit size={16} color="green" />
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleOpenAddWalletModal(passenger)}
                      className="flex items-center hover:bg-gray-100 p-1 rounded"
                    >
                      <PlusIcon size={16} color="green" />
                    </button>
                  )}
                </td>
                <td className="py-2 px-2 border-b-2 border-r-2 border-gray-300 text-xs w-24 whitespace-nowrap">
                  {passenger?.createdAt
                    ? moment(passenger.createdAt).format("D MMM YY HH:mm")
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
                      href={`/passenger-travels/${passenger?._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 flex items-center gap-1 hover:text-blue-700"
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </a>
                    <button
                      onClick={() => handleNotificationModal(passenger)}
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
                        onChange={(e) => { setRole(e.target.value); userRoleChangeApi(e, passenger); }}
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

      {/* Pagination Controls - same as driver table */}
      {PassengersData.length > 0 && (
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
      )}

      {/* Balance Transaction Modal - same as driver table */}
      <BalanceTransactionModal
        isOpen={balanceModalOpen}
        onClose={() => setBalanceModalOpen(false)}
        passengerName={`${selectedPassenger?.firstName} ${selectedPassenger?.lastName}`}
        currentBalance={selectedPassenger?.wallet?.balance}
        onTransaction={handleUpdateWallet}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        passengerName={`${selectedPassenger?.firstName} ${selectedPassenger?.lastName}`}
        onSend={handleSendNotification}
      />

      <Toaster />
    </div>
  );
};

export default PassengerTable;