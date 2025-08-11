import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Shield,
  User,
  Car,
  FileCheck,
  AlertCircle,
  CheckCheckIcon,
  Edit,
  X,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  useGetDriverByIdQuery,
  useUpdateAadharStatusMutation,
  useUpdateLicenseStatusMutation,
  useUpdatePoliceStatusMutation,
  useUpdateVehicleRcStatusMutation,
  useUploadAadharCardMutation,
  useVerifiedDocumentInfoMutation,
  useVerifiedDriverPersonalInfoMutation,
  useVerifiedVehicleInfoMutation,
  useUpdateDriverInfoMutation
} from "../Redux/Api";
import { baseUrl } from "../Url/baseUrl";
import AddDocumentModal from "../Component/Modal/AddDocumentModal";
import AddDrivingLicenseDocumentModal from "../Component/Modal/DrivingLicenseMOdal";
import AddPoliceVerificationDocumentModal from "../Component/Modal/AddPoliceVerification";
import AddVehicleRCDocumentModal from "../Component/Modal/AddVehicleRcModal";
import ImageModal from "../Component/Modal/ImageModal";
import VehicleDriverPage from "./VehicleDriverpage";
import toast, { Toaster } from "react-hot-toast";
import DriverInfoForm from "../Component/Driver/DriverInfo";
import EditDocumentModal from "../Component/Modal/EditDocumentModal"
import Sidebar from "../Component/Sidebar";


const ViewDriver = () => {
  const { id } = useParams();
  const url = baseUrl;
  const { data, error, loading, refetch } = useGetDriverByIdQuery(id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [updateInfo] = useUpdateDriverInfoMutation();
  const [activeTab, setActiveTab] = useState("personal");
  const [updateAadharStatus] = useUpdateAadharStatusMutation();
  const [updateDriverLicenseStatus] = useUpdateLicenseStatusMutation();
  const [updatePoliceStatus] = useUpdatePoliceStatusMutation();
  const [updateVehicleRcStatus] = useUpdateVehicleRcStatusMutation();
  const [prsonalInfoVerify] = useVerifiedDriverPersonalInfoMutation();
  const [documentVerify] = useVerifiedDocumentInfoMutation();
  const [vehicleVerify] = useVerifiedVehicleInfoMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDocType, setActiveDocType] = useState(null);
  const [uploadAadhar] = useUploadAadharCardMutation();
 
  const [editDocument, setEditDocument] = useState({
    docType: "",
    isvisible: false,
  });
  
  const [verified, setverified] = useState({
    personal: false,
    document: false,
    vehicleinfo: false,
  });

  const [driverStats, setDriverStats] = useState({
    totalTrips: 44,
    expire: 4,
    cancel: 10,
    complete: 30,
    reviews: "4.5 (73)",
  });

  // Suspension state variables
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const navigate = useNavigate()
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendType, setSuspendType] = useState('temporary');
  const [suspendDuration, setSuspendDuration] = useState('');
  const [suspendEndDate, setSuspendEndDate] = useState('');
  const [showConfirmPermanent, setShowConfirmPermanent] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspensionEndTime, setSuspensionEndTime] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');

  const suspendReasons = [
    "Violation of terms of service",
    "Inappropriate behavior with passengers",
    "Safety violations",
    "Multiple trip cancellations",
    "Customer complaints",
    "Document verification issues",
    "Fraudulent activity",
    "Vehicle safety concerns",
    "Unprofessional conduct",
    "Other"
  ];

  const durationOptions = [
    { value: "1", label: "1 Hour" },
    { value: "6", label: "6 Hours" },
    { value: "24", label: "1 Day" },
    { value: "168", label: "1 Week" },
    { value: "720", label: "1 Month" }
  ];

  // Countdown timer effect
  useEffect(() => {
    if (suspensionEndTime && isSuspended) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = suspensionEndTime - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          let countdownText = '';
          
          if (days > 0) {
            countdownText = `${days} DAY ${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes ${seconds.toString().padStart(2, '0')} seconds`;
          } else if (hours > 0) {
            countdownText = `${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes ${seconds.toString().padStart(2, '0')} seconds`;
          } else if (minutes > 0) {
            countdownText = `${minutes.toString().padStart(2, '0')} minutes ${seconds.toString().padStart(2, '0')} seconds`;
          } else {
            countdownText = `${seconds.toString().padStart(2, '0')} seconds`;
          }
          
          setCountdown(countdownText);
        } else {
          setCountdown('');
          setIsSuspended(false);
          setSuspensionEndTime(null);
          setSuspensionReason('');
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [suspensionEndTime, isSuspended]);

  const handlePersonalinfoverified = () => {
    if (
      !data?.DriverInfo?.firstName ||
      !data?.DriverInfo?.lastName ||
      !data?.DriverInfo?.phoneNumber ||
      !data?.DriverInfo?.email ||
      !data?.DriverInfo?.address ||
      !data?.DriverInfo?.userId?.state ||
      !data?.DriverInfo?.userId?.city
    ) {
      setverified({ ...verified, personal: false });
    } else {
      setverified({ ...verified, personal: true });
    }
  };

  const handleDcumentinfoverified = () => {
    if (
      data?.documents?.aadhar?.aadharStatus != "Accepted" ||
      data?.documents?.drivingLicense?.drivingStatus != "Accepted" ||
      data?.documents?.policeVerification?.policeVerificationStatus != "Accepted" ||
      data?.documents?.vehicleRc?.vehicleRcStatus != "Accepted"
    ) {
      setverified({ ...verified, document: false });
    } else {
      setverified({ ...verified, document: true });
    }
  };

  const handleVehicleinfoverified = () => {
    if (
     !data?.vehicle?.vehicleName ||
     !data?.vehicle?.vehicleCategory ||
     !data?.vehicle?.vehicleNumber ||
     !data?.vehicle?.modelYear ||
     !data?.vehicle?.seat ||
     !data?.vehicle?.fuel ||
     !data?.vehicle?.color 
    ) {
      setverified({...verified, vehicleinfo: false });
    } else {
      setverified({...verified, vehicleinfo: true });
    }
  }

  const haldePeronsalifoApi = async () => {
    const postdata = {
      id: id,
    };
    try {
      const { data, error } = await prsonalInfoVerify(postdata);
      if (data) {
        toast.success("updated succesfully");
      }
      if (error) {
        toast.error("error in verified driver");
      }
      refetch();
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    }
  };

  const haldeDocumentinfoApi = async (uid) => {
    const postdata = {
      id: uid,
    };
    try {
      const { data, error } = await documentVerify(postdata);
      if (data) {
        toast.success("updated succesfully");
      }
      if (error) {
        toast.error("error in verified driver");
      }
      refetch();
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    }
  };

  const haldeVehicleinfoApi = async (id) => {
    const postdata = {
      id: id,
    };
    try {
      const { data, error } = await vehicleVerify(postdata);
      if (data) {
        toast.success("updated succesfully");
      }
      if (error) {
        toast.error("error in verified driver");
      }
      refetch();
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    }
  };

  const personalInfoUpdate = async(formData) => {
    const postdata = {
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      phoneNumber: formData?.phoneNumber,
      email: formData?.email,
      address: formData?.address,
      state: formData?.state,
      city: formData?.city,
      id: formData?.id
    }
    try {
      const {data, error} = await updateInfo(postdata); 
      if(data) {
        toast.success("Driver information updated successfully");
      } else {
        toast.error("Failed to update driver information");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Suspension handlers
  const handleSuspendClick = () => {
    setShowSuspendModal(true);
  };

  const handleSuspendSubmit = () => {
    if (!suspendReason) {
      toast.error('Please select a reason for suspension');
      return;
    }

    if (suspendType === 'temporary') {
      if (!suspendDuration) {
        toast.error('Please select suspension duration');
        return;
      }
      
      const hours = parseInt(suspendDuration);
      const endTime = new Date().getTime() + (hours * 60 * 60 * 1000);
      setSuspensionEndTime(endTime);
      setIsSuspended(true);
      setSuspensionReason(suspendReason);
      setShowSuspendModal(false);
      toast.success('User suspended temporarily');
      
      // Reset form
      setSuspendReason('');
      setSuspendDuration('');
    } else {
      setShowConfirmPermanent(true);
    }
  };

  const handlePermanentSuspend = () => {
    setIsSuspended(true);
    setSuspensionEndTime(null);
    setSuspensionReason(suspendReason);
    setShowSuspendModal(false);
    setShowConfirmPermanent(false);
    toast.success('User suspended permanently');
    
    // Reset form
    setSuspendReason('');
  };

  const handleUnsuspend = () => {
    setIsSuspended(false);
    setSuspensionEndTime(null);
    setCountdown('');
    setSuspensionReason('');
    toast.success('User unsuspended successfully');
  };

  useEffect(() => {
    handlePersonalinfoverified();
    handleDcumentinfoverified();
    handleVehicleinfoverified();
  }, [data]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-lg flex items-center">
          <AlertCircle className="text-red-500 mr-2" />
          <span className="text-red-700">Error loading driver data</span>
        </div>
      </div>
    );

  const handleStatusChange = async (docType, status, docId) => {
    try {
      if (docType == "aadhar") {
        const data = {
          documentId: docId,
          status: status,
        };
        const response = await updateAadharStatus(data);
      } else if (docType == "driverLicense") {
        const data = {
          documentId: docId,
          status: status,
        };
        const response = await updateDriverLicenseStatus(data);
      } else if (docType == "policeVerification") {
        const data = {
          documentId: docId,
          status: status,
        };
        const response = await updatePoliceStatus(data);
      } else if (docType == "vehicleRc") {
        const data = {
          documentId: docId,
          status: status,
        };
        const response = await updateVehicleRcStatus(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "accepted":
          return "bg-green-100 text-green-800 border-green-200";
        case "rejected":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
      }
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
          status
        )}`}
      >
        {status || "Pending"}
      </span>
    );
  };

  const DocumentCard = ({
    title,
    frontImage,
    backImage,
    number,
    status,
    docType,
    id,
  }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const openModal = (imageUrl, side) => {
      setSelectedImage({
        url: `${url}/${docType}/${imageUrl}`,
        alt: `${title} ${side}`,
      });
    };

    const closeModal = () => {
      setSelectedImage(null);
    };
    
    const handleEditDocument = () => {
      setActiveDocType(docType);
      setIsModalOpen(true);
    }

    return (
      <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
        className={`flex-1 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <div
                onClick={handleEditDocument}
                className="flex items-center cursor-pointer"
              >
                <Edit
                  size={30}
                  color="green"
                  title="edit"
                />
              </div>
            </div>
            {number && (
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Number: <span className="font-medium">{number}</span>
                </p>
                <StatusBadge status={status} />
              </div>
            )}
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {frontImage && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Front Side</p>
                  <a
                    href={`${url}/${docType}/${frontImage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${url}/${docType}/${frontImage}`}
                      alt={`${title} Front`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
                    />
                  </a>
                </div>
              )}
              {backImage && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Back Side</p>
                  <a
                    href={`${url}/${docType}/${backImage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${url}/${docType}/${backImage}`}
                      alt={`${title} Back`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
                    />
                  </a>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => handleStatusChange(docType, "Accepted", id)}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  status === "Accepted"
                    ? "bg-green-500 text-white"
                    : "bg-white text-green-600 border border-green-500 hover:bg-green-50"
                }`}
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusChange(docType, "Rejected", id)}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  status === "Rejected"
                    ? "bg-red-500 text-white"
                    : "bg-white text-red-600 border border-red-500 hover:bg-red-50"
                }`}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
        <ImageModal
          isOpen={!!selectedImage}
          onClose={closeModal}
          imageUrl={selectedImage?.url}
          altText={selectedImage?.alt}
        />
     
     </div>
      </>
    );
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "documents", label: "Documents", icon: FileCheck },
    { id: "vehicle", label: "Vehicle Info", icon: Car },
  ];

  // Personal Tab UI with suspension functionality
  const PersonalInfoTab = () => {
    const [isVerified, setIsVerified] = useState(data?.DriverInfo?.verified || false);

    const handleVerificationChange = () => {
      setIsVerified(!isVerified);
      if (!isVerified) {
        haldePeronsalifoApi();
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto">
  <div
      
        >



        <h2 className="text-xl font-semibold mb-4">Carpool Driver</h2>
        
        {/* Driver Name */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">{data?.DriverInfo?.firstName} {data?.DriverInfo?.lastName}</h3>
          <p className="text-gray-600">Carpool Driver</p>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          <div className="bg-gray-200 p-4 rounded-md text-center">
            <div className="text-gray-700 font-medium">Total Trip</div>
            <div className="text-2xl font-bold">{driverStats.totalTrips}</div>
          </div>
          <div className="bg-orange-500 p-4 rounded-md text-white text-center">
            <div className="font-medium">Expire</div>
            <div className="text-2xl font-bold">{driverStats.expire}</div>
          </div>
          <div className="bg-red-600 p-4 rounded-md text-white text-center">
            <div className="font-medium">Cancel</div>
            <div className="text-2xl font-bold  " onClick={()=>navigate('/cancel-driver')}>{driverStats.cancel}</div>
          </div>
          <div className="bg-green-500 p-4 rounded-md text-white text-center">
            <div className="font-medium">Complete</div>
            <div className="text-2xl font-bold">{driverStats.complete}</div>
          </div>
          <div className="bg-yellow-400 p-4 rounded-md text-center">
            <div className="font-medium">Reviews</div>
            <div className="text-2xl font-bold" onClick={()=>navigate('/driver-review')} >{driverStats.reviews}</div>
          </div>
        </div>
        
        {/* Personal Information Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-1">
            <div className="bg-orange-200 p-4 rounded-md flex items-center justify-center h-full min-h-[120px]">
              {data?.DriverInfo?.userId?.profileImage ? (
                <img 
                  src={`${url}/profilePics/${data.DriverInfo.userId.profileImage}`}
                  alt="Profile" 
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="text-center text-orange-600 font-medium text-lg">
                  IMAGE
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <select className="w-full p-3 border rounded-md bg-black text-white">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <input 
                type="text" 
                className="w-full p-3 border rounded-md"
                placeholder="First Name"
                defaultValue={data?.DriverInfo?.firstName || ""}
              />
            </div>
            <div>
              <input 
                type="text" 
                className="w-full p-3 border rounded-md"
                placeholder="Last Name"
                defaultValue={data?.DriverInfo?.lastName || ""}
              />
            </div>
            <div>
              <input 
                type="text" 
                className="w-full p-3 border rounded-md"
                placeholder="D/O/B"
              />
            </div>
            <div>
              <input 
                type="text" 
                className="w-full p-3 border rounded-md"
                placeholder="Mobile Number"
                defaultValue={data?.DriverInfo?.phoneNumber || ""}
              />
            </div>
            <div>
              <input 
                type="text" 
                className="w-full p-3 border rounded-md"
                placeholder="Email"
                defaultValue={data?.DriverInfo?.email || ""}
              />
            </div>
            <div>
              <input 
                type="text" 
                className="w-full p-3 border rounded-md"
                placeholder="City"
                defaultValue={data?.DriverInfo?.userId?.city || ""}
              />
            </div>
            <div>
              <input 
                type="text" 
                className="w-full p-3 border rounded-md"
                placeholder="State"
                defaultValue={data?.DriverInfo?.userId?.state || ""}
              />
            </div>
            <div>
              <input 
                type="text" 
                className="w-full p-3 border rounded-md"
                placeholder="Pin"
              />
            </div>
          </div>
        </div>
        
        {/* Address Field */}
        <div className="mb-6">
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            placeholder="Address"
            defaultValue={data?.DriverInfo?.address || ""}
          />
        </div>

        {/* Bank Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <input 
              type="text" 
              className="w-full p-3 border rounded-md"
              placeholder="Bank Details / UPI"
            />
          </div>
          <div>
            <input 
              type="text" 
              className="w-full p-3 border rounded-md"
              placeholder="Bank Name"
            />
          </div>
          <div>
            <input 
              type="text" 
              className="w-full p-3 border rounded-md"
              placeholder="Account Number"
            />
          </div>
          <div>
            <input 
              type="text" 
              className="w-full p-3 border rounded-md"
              placeholder="IFSC"
            />
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <input 
              type="text" 
              className="w-full p-3 border rounded-md"
              placeholder="Emergency Contact"
            />
          </div>
          <div>
            <input 
              type="text" 
              className="w-full p-3 border rounded-md"
              placeholder="01"
            />
          </div>
          <div>
            <input 
              type="text" 
              className="w-full p-3 border rounded-md"
              placeholder="02"
            />
          </div>
          <div>
            <input 
              type="text" 
              className="w-full p-3 border rounded-md"
              placeholder="03"
            />
          </div>
        </div>

        {/* About You Section */}
        <div className="mb-6">
          <textarea 
            className="w-full p-3 border rounded-md h-24 resize-none bg-blue-50"
            placeholder="About you"
          />
        </div>

        {/* Preferences Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <div className="flex items-center justify-between p-3 border rounded-md bg-white">
              <div>
                <div className="font-medium text-sm">Chattiness</div>
                <div className="text-blue-600 text-sm">I love chat</div>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-3 border rounded-md bg-white">
              <div>
                <div className="font-medium text-sm">Music</div>
                <div className="text-blue-600 text-sm">I love music</div>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-3 border rounded-md bg-white">
              <div>
                <div className="font-medium text-sm">Smoking</div>
                <div className="text-blue-600 text-sm">Please, No smoking in the car</div>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-3 border rounded-md bg-white">
              <div>
                <div className="font-medium text-sm">Pets</div>
                <div className="text-blue-600 text-sm">Sorry, Not a pet person</div>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </div>
        </div>

        {/* Suspension Cards */}
        {isSuspended && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {suspensionEndTime ? (
              <div className="bg-white border-2 border-red-500 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-red-500 font-bold text-lg mb-2">!</div>
                  <h3 className="text-red-600 font-semibold mb-2">Account Suspended</h3>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {countdown}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Your account has been temporarily suspended due to {suspensionReason.toLowerCase() || 'violation of our terms of service'}. Please contact support for more information
                  </p>
                  <button className="bg-red-500 text-white px-6 py-2 rounded text-sm font-medium">
                    Contact
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-red-500 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-red-500 font-bold text-lg mb-2">!</div>
                  <h3 className="text-red-600 font-semibold mb-2">Account Suspended</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your account has been permanently suspended due to {suspensionReason.toLowerCase() || 'violation of our terms of service'}. Please contact support for more information
                  </p>
                  <button className="bg-red-500 text-white px-6 py-2 rounded text-sm font-medium">
                    Support
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Verification Status */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="mr-2">Verified profile [ </span>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isVerified}
                onChange={handleVerificationChange}
              />
              <span className={`${isVerified ? 'text-green-500' : 'text-gray-400'} text-xl font-bold`}>
                ✓
              </span>
            </label>
            <span> ]</span>
          </div>
          
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Role Change
            </button>
            {isSuspended ? (
              <button 
                onClick={handleUnsuspend}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Unsuspend
              </button>
            ) : (
              <button 
                onClick={handleSuspendClick}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Suspended
              </button>
            )}
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
              Update
            </button>
          </div>
        </div>
        
        {/* Verification Message */}
        {isVerified && (
          <div className="bg-orange-400 text-center p-3 rounded-md mb-4 text-white">
            Your profile has been verified
          </div>
        )}
        
        <div className="flex justify-end">
          <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
            Update
          </button>
        </div>

        {/* Suspension Modal */}
        {showSuspendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Suspend Account</h3>
                <button 
                  onClick={() => setShowSuspendModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Reason Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Reason for Suspension</label>
                  <select 
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select a reason</option>
                    {suspendReasons.map((reason, index) => (
                      <option key={index} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
                
                {/* Suspension Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Suspension Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        value="temporary" 
                        checked={suspendType === 'temporary'}
                        onChange={(e) => setSuspendType(e.target.value)}
                        className="mr-2"
                      />
                      <Clock size={16} className="mr-1" />
                      Temporary Suspension
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        value="permanent" 
                        checked={suspendType === 'permanent'}
                        onChange={(e) => setSuspendType(e.target.value)}
                        className="mr-2"
                      />
                      <AlertTriangle size={16} className="mr-1" />
                      Permanent Suspension
                    </label>
                  </div>
                </div>
                
                {/* Duration Selection for Temporary */}
                {suspendType === 'temporary' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <select 
                      value={suspendDuration}
                      onChange={(e) => setSuspendDuration(e.target.value)}
                      className="w-full p-3 border rounded-md"
                    >
                      <option value="">Select duration</option>
                      {durationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => setShowSuspendModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSuspendSubmit}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permanent Suspension Confirmation */}
        {showConfirmPermanent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="text-center">
                <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Confirm Permanent Suspension</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to suspend this account permanently? This action cannot be undone.
                </p>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowConfirmPermanent(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePermanentSuspend}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Suspend Permanently
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
              </div>

    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div
        className={`flex-1 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Driver Verification
          </h1>
          <p className="text-gray-600 mt-2">
            Review and verify driver information and documents
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center px-4 py-2 rounded-md flex-1 ${
                activeTab === id
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {activeTab === "personal" && <PersonalInfoTab />}

          {activeTab === "documents" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center">DOCUMENT</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Aadhar Card Section */}
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-lg font-medium">Aadhar Card</h3>
                      <p className="text-gray-500">{data?.documents?.aadhar?.aadharStatus || "Pending"}</p>
                    </div>
                    <button 
                      className="bg-yellow-400 text-black px-4 py-1 rounded font-medium"
                      onClick={() => {
                        setActiveDocType("aadhar");
                        setIsModalOpen(true);
                      }}
                    >
                      UPLOAD
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-orange-200 p-6 rounded flex items-center justify-center text-white">
                      {data?.documents?.aadhar?.aadharFront ? (
                        <img
                          src={`${url}/aadhar/${data?.documents?.aadhar?.aadharFront}`}
                          alt="Aadhar Front"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>Front</span>
                      )}
                    </div>
                    <div className="bg-orange-200 p-6 rounded flex items-center justify-center text-white">
                      {data?.documents?.aadhar?.aadharBack ? (
                        <img
                          src={`${url}/aadhar/${data?.documents?.aadhar?.aadharBack}`}
                          alt="Aadhar Back"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>Back</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="font-medium">Aadhar Number</p>
                    <p className="text-lg">{data?.documents?.aadhar?.aadharNumber || "9 8 7 6 - 5 4 3 2 - 1 9 8 7"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      className={`py-2 rounded font-medium ${
                        data?.documents?.aadhar?.aadharStatus === "Accepted" 
                          ? "bg-green-500 text-white" 
                          : "border border-green-500 text-green-500"
                      }`}
                      onClick={() => handleStatusChange("aadhar", "Accepted", data?.documents?._id)}
                    >
                      VERIFIED
                    </button>
                    <button 
                      className={`py-2 rounded font-medium ${
                        data?.documents?.aadhar?.aadharStatus === "Rejected" 
                          ? "bg-red-500 text-white" 
                          : "border border-red-500 text-red-600"
                      }`}
                      onClick={() => handleStatusChange("aadhar", "Rejected", data?.documents?._id)}
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              
                {/* Driving License Section */}
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-lg font-medium">Driving Licence</h3>
                      <p className="text-gray-500">{data?.documents?.drivingLicense?.drivingStatus || "Pending"}</p>
                    </div>
                    <button 
                      className="bg-yellow-400 text-black px-4 py-1 rounded font-medium"
                      onClick={() => {
                        setActiveDocType("driverLicense");
                        setIsModalOpen(true);
                      }}
                    >
                      UPLOAD
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-orange-200 p-6 rounded flex items-center justify-center text-white">
                      {data?.documents?.drivingLicense?.licenseFront ? (
                        <img
                          src={`${url}/driverLicense/${data?.documents?.drivingLicense?.licenseFront}`}
                          alt="License Front"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>Front</span>
                      )}
                    </div>
                    <div className="bg-orange-200 p-6 rounded flex items-center justify-center text-white">
                      {data?.documents?.drivingLicense?.licenseBack ? (
                        <img
                          src={`${url}/driverLicense/${data?.documents?.drivingLicense?.licenseBack}`}
                          alt="License Back"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>Back</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="font-medium">Licence Number</p>
                    <p className="text-lg">{data?.documents?.drivingLicense?.licenseNumber || "9 8 7 6 5 4 3 2 1 9 8 7"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      className={`py-2 rounded font-medium ${
                        data?.documents?.drivingLicense?.drivingStatus === "Accepted" 
                          ? "bg-green-500 text-white" 
                          : "border border-green-500 text-green-500"
                      }`}
                      onClick={() => handleStatusChange("driverLicense", "Accepted", data?.documents?._id)}
                    >
                      VERIFIED
                    </button>
                    <button 
                      className={`py-2 rounded font-medium ${
                        data?.documents?.drivingLicense?.drivingStatus === "Rejected" 
                          ? "bg-red-500 text-white" 
                          : "border border-red-500 text-red-600"
                      }`}
                      onClick={() => handleStatusChange("driverLicense", "Rejected", data?.documents?._id)}
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              
                {/* Profile Image Section */}
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-lg font-medium">Profile Image</h3>
                      <p className="text-gray-500">Pending</p>
                    </div>
                    <button className="bg-yellow-400 text-black px-4 py-1 rounded font-medium">
                      UPLOAD
                    </button>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-200 p-6 w-32 h-32 rounded flex items-center justify-center text-white">
                      {data?.DriverInfo?.userId?.profileImage ? (
                        <img
                          src={`${url}/profilePics/${data.DriverInfo.userId.profileImage}`}
                          alt="Profile"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span>Image</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-12">
                    <button className="border border-green-500 text-green-500 py-2 rounded font-medium">
                      VERIFIED
                    </button>
                    <button className="border border-red-500 text-red-600 py-2 rounded font-medium">
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Status Messages */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                {data?.documents?.aadhar?.aadharStatus === "Accepted" && (
                  <div className="bg-orange-300 p-3 rounded text-center">
                    Your Aadhaar card has been verified
                  </div>
                )}
                
                {data?.documents?.drivingLicense?.drivingStatus === "Rejected" && (
                  <div className="bg-orange-300 p-3 rounded text-center lg:col-span-2">
                    Your driving license has been rejected Please re-upload clearly and legibly
                  </div>
                )}
                
                {!data?.documents?.verified && (
                  <div className="col-span-full mt-6 flex justify-end">
                    <button
                      className={`bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 ${
                        verified.document
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                      disabled={!verified.document}
                      onClick={() => haldeDocumentinfoApi(data?.documents?._id)}
                    >
                      Verify All Documents
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "vehicle" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Vehicle</h2>
                <div className="grid grid-cols-1  gap-4">
                  {data?.vehicle !== null ? (
                    <VehicleDriverPage 
                      initialData={data?.vehicle}
                      haldeVehicleinfoApi={() => haldeVehicleinfoApi(data?.vehicle?._id)}
                      verified={verified}
                    />
                  ) : (
                    <p className="col-span-full text-center text-gray-500 py-8">
                      No vehicle available
                    </p>
                  )}
                </div>
              </div>
            </div>
            
          )}
        </div>
      </div>
      </div>
      
      {activeDocType == "aadhar" && (
        <AddDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          docType={activeDocType}
          userId={data?.DriverInfo?.userId?._id}
          refetch={refetch}
        />
      )}
      {activeDocType == "driverLicense" && (
        <AddDrivingLicenseDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          docType={activeDocType}
          userId={data?.DriverInfo?.userId?._id}
          refetch={refetch}
        />
      )}
      {activeDocType == "policeVerification" && (
        <AddPoliceVerificationDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          docType={activeDocType}
          userId={data?.DriverInfo?.userId?._id}
          refetch={refetch}
        />
      )}
      {activeDocType == "vehicleRc" && (
        <AddVehicleRCDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          docType={activeDocType}
          userId={data?.DriverInfo?.userId?._id}
          refetch={refetch}
        />
      )}

      <Toaster/>
    </div>
  );


};

export default ViewDriver;