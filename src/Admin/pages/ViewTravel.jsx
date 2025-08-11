import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Shield,
  User,
  Car,
  FileCheck,
  AlertCircle,
  CheckCheckIcon,
  Edit,
} from "lucide-react";
import {
  useGetDriverByIdQuery,
  useGetTravelInfoByIdQuery,
  useUpdateAadharStatusMutation,
  useUpdateLicenseStatusMutation,
  useUpdatePoliceStatusMutation,
  useUpdateVehicleRcStatusMutation,
  useVerifiedVehicleInfoMutation,
  useVerifiedDocumentInfoMutation,
  useVerifiedTravelPersonalInfoMutation,
  useUpdateTravelInfoMutation,
} from "../Redux/Api";
import { baseUrl } from "../Url/baseUrl";
import moment from "moment";
import DriversTable from "../Component/Tables/DriversTable";
import AddDocumentModal from "../Component/Modal/AddDocumentModal";
import AddDrivingLicenseDocumentModal from "../Component/Modal/DrivingLicenseMOdal";
import AddPoliceVerificationDocumentModal from "../Component/Modal/AddPoliceVerification";
import AddVehicleRCDocumentModal from "../Component/Modal/AddVehicleRcModal";
import ImageModal from "../Component/Modal/ImageModal";
import VehicleInfo from "../Component/Tables/VehicleInfoTable";
import TravelInfoForm from "../Component/Travel/TravelInfo";

const ViewTravel = () => {
  const { id } = useParams();
  const url = baseUrl;
  const { data, error, loading, refetch } = useGetTravelInfoByIdQuery(id);
  const [activeTab, setActiveTab] = useState("personal");
  const [updateAadharStatus] = useUpdateAadharStatusMutation();
  const [updateDriverLicenseStatus] = useUpdateLicenseStatusMutation();
  const [updatePoliceStatus] = useUpdatePoliceStatusMutation();
  const [updateVehicleRcStatus] = useUpdateVehicleRcStatusMutation();
  const [updateTravelInfo] = useUpdateTravelInfoMutation();
  const [prsonalInfoVerify] = useVerifiedTravelPersonalInfoMutation();
  const [documentVerify] = useVerifiedDocumentInfoMutation();
  const [vehicleVerify] = useVerifiedVehicleInfoMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDocType, setActiveDocType] = useState(null);
  const [verified, setverified] = useState({
    personal: false,
    document: false,
    vehicleinfo: false,
  });

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

  const handlePersonalinfoverified = () => {
    if (
      !data?.travel?.firstName ||
      !data?.travel?.lastName ||
      !data?.travel?.phoneNumber ||
      !data?.travel?.email ||
      !data?.travel?.address ||
      !data?.travel?.firmAddress ||
      !data?.travel?.firmOpeningDate ||
      !data?.travel?.gstNumber ||
      !data?.travel?.userId?.state ||
      !data?.travel?.userId?.city
    ) {
      setverified({ ...verified, personal: false });
    } else {
      setverified({ ...verified, personal: true });
    }
  };

  function handleDcumentinfoverified() {
    if (
      data?.Documentdata?.aadhar?.aadharStatus != "Accepted" ||
      data?.Documentdata?.drivingLicense?.drivingStatus != "Accepted" ||
      data?.Documentdata?.policeVerification?.policeVerificationStatus !=
        "Accepted"
    ) {
      console.log("yeh waala chala");
      setverified({ ...verified, document: false });
    } else {
      console.log("nhi ye waala chala");
      setverified({ ...verified, document: true });
    }
  }

  useEffect(() => {
    handlePersonalinfoverified();
    handleDcumentinfoverified();
    // handleVehicleinfoverified();
  }, [data]);

  const haldePeronsalifoApi = async (uid) => {
    const postdata = {
      id: uid,
    };
    try {
      const { data, error } = await prsonalInfoVerify(postdata);
      console.log(data, error, "pppppop");
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
      refetch();
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
      console.log(data, error, "pppppop");
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

  const handleStatusChange = async (docType, status, docId) => {
    try {
      if (docType == "aadhar") {
        const data = {
          documentId: docId,
          status: status,
        };
        const response = await updateAadharStatus(data);
        console.log(response, "response");
      } else if (docType == "driverLicense") {
        const data = {
          documentId: docId,
          status: status,
        };
        const response = await updateDriverLicenseStatus(data);
        console.log(response, "response");
      } else if (docType == "policeVerification") {
        const data = {
          documentId: docId,
          status: status,
        };
        const response = await updatePoliceStatus(data);
        console.log(response, "response");
      } else if (docType == "vehicleRc") {
        const data = {
          documentId: docId,
          status: status,
        };
        const response = await updateVehicleRcStatus(data);
        console.log(response, "response");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const personalInfoUpdate = async (ata) => {
    const postdata = {
      firstName: ata?.firstName,
      lastName: ata?.lastName,
      phoneNumber: ata?.phoneNumber,
      email: ata?.email,
      address: ata?.address,
      state: ata?.state,
      city: ata?.city,
      firmAddress: ata?.firmAddress,
      firmOpeningDate: ata?.firmOpeningDate,
      gstNumber: ata?.gstNumber,
      id: data?.travel?._id,
    };
    try {
      const { data, error } = await updateTravelInfo(postdata);
      console.log(data, error, "postdaaaaa");
      if (data) {
        toast.success("Travel information updated successfully");
      } else {
        toast.error("Failed to update driver information");
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
    const handleEditDocument = ()=>{
      console.log("main view")
      console.log(title,"pppppppppppppppppppppppppppppppp");
      setActiveDocType(docType);
      setIsModalOpen(true);
    }

    const closeModal = () => {
      setSelectedImage(null);
    };
    return (
      <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <div
                onClick={handleEditDocument}
                className="flex items-center cursor-pointer"
              >
                <Edit size={30} color="green" title="edit" />
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
          <div className="p-4">
            <div
              className={`grid grid-cols-2 gap-4 ${
                status === "pending" ? "mb-4" : ""
              }`}
            >
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
                      // onClick={() => openModal(frontImage, 'Front')}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
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
                      // onClick={() => openModal(backImage, 'Back')}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                    />
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-2">
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
      </>
    );
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "documents", label: "Documents", icon: FileCheck },
    { id: "vehicle", label: "Vehicles", icon: Car },
    { id: "Drivers", label: "Drivers", icon: Car },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Travel Verification
          </h1>
          <p className="text-gray-600 mt-2">
            Review and verify Travel information and documents
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
          {activeTab === "personal" && (
            // <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
            //   <h2 className="text-xl font-semibold mb-4">
            //     Personal Information
            //   </h2>
            //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            //     <div>
            //       <p className="text-sm text-gray-500">Full Name</p>
            //       <p className="text-lg font-medium">
            //         {data?.travel?.firstName} {data?.travel?.lastName}
            //       </p>
            //     </div>

            //     <div>
            //       <p className="text-sm text-gray-500">Age</p>
            //       <p className="text-lg font-medium">
            //         {moment().diff(moment(data?.travel?.dob), "years")}
            //       </p>
            //     </div>
            //     <div>
            //       <p className="text-sm text-gray-500">Phone Number</p>
            //       <p className="text-lg font-medium">
            //         {data?.travel?.phoneNumber}
            //       </p>
            //     </div>
            //     <div>
            //       <p className="text-sm text-gray-500">Email Address</p>
            //       <p className="text-lg font-medium">{data?.travel?.email}</p>
            //     </div>
            //     <div>
            //       <p className="text-sm text-gray-500">Address</p>
            //       <p className="text-lg font-medium">{data?.travel?.address}</p>
            //     </div>

            //     <div>
            //       <p className="text-sm text-gray-500">firmAddress</p>
            //       <p className="text-lg font-medium">
            //         {data?.travel?.firmAddress}
            //       </p>
            //     </div>
            //     <div>
            //       <p className="text-sm text-gray-500">firmOpeningDate</p>
            //       <p className="text-lg font-medium">
            //         {moment(data?.travel?.firmOpeningDate).format(
            //           "YYYY MMM DD"
            //         )}
            //       </p>
            //     </div>
            //     <div>
            //       <p className="text-sm text-gray-500">gstNumber</p>
            //       <p className="text-lg font-medium">
            //         {data?.travel?.gstNumber}
            //       </p>
            //     </div>
            //     <div>
            //       <p className="text-sm text-gray-500">State</p>
            //       <p className="text-lg font-medium">
            //         {data?.travel?.userId?.state}
            //       </p>
            //     </div>
            //     <div>
            //       <p className="text-sm text-gray-500">City</p>
            //       <p className="text-lg font-medium">
            //         {data?.travel?.userId?.city}
            //       </p>
            //     </div>

            //     {!data?.travel?.verified ? (
            //       <div className="mt-auto flex justify-end lg:col-span-4">
            //         <button
            //           className={`bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 ${
            //             verified.personal
            //               ? "cursor-pointer"
            //               : "cursor-not-allowed"
            //           }`}
            //           disabled={!verified.personal}
            //           onClick={() => haldePeronsalifoApi(data?.travel?._id)}
            //         >
            //           Verified
            //         </button>
            //       </div>
            //     ) : (
            //       <div className="mt-auto flex justify-end lg:col-span-4">
            //         <p className="text-green-600 font-medium flex items-center">
            //           Travel Verified
            //           <CheckCheckIcon size={30} color="green" />
            //         </p>
            //       </div>
            //     )}
            //   </div>
            // </div>

            <TravelInfoForm
              data={data}
              verified={verified}
              onUpdate={(personal) => {
                personalInfoUpdate(personal);
              }}
              onVerify={() => haldePeronsalifoApi()}
            />
          )}

          {activeTab === "documents" && (
            <div>
              {data?.Documentdata &&
              Object.keys(data?.Documentdata).length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {data?.Documentdata?.aadhar?.aadharFront ? (
                    <DocumentCard
                      title="Aadhaar Card"
                      frontImage={data?.Documentdata?.aadhar?.aadharFront}
                      backImage={data?.Documentdata?.aadhar?.aadharBack}
                      number={data?.Documentdata?.aadhar?.aadharNumber}
                      status={data?.Documentdata?.aadhar?.aadharStatus}
                      docType="aadhar"
                      id={data?.Documentdata?._id}
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setActiveDocType("aadhar");
                        setIsModalOpen(true);
                      }}
                      className="col-span-full text-center py-3 px-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      Add Aadhar Card
                    </button>
                  )}
                  {data?.Documentdata?.drivingLicense?.licenseNumber ? (
                    <DocumentCard
                      title="Driving License"
                      frontImage={
                        data?.Documentdata?.drivingLicense?.licenseFront
                      }
                      backImage={
                        data?.Documentdata?.drivingLicense?.licenseBack
                      }
                      number={data?.Documentdata?.drivingLicense?.licenseNumber}
                      status={data?.Documentdata?.drivingLicense?.drivingStatus}
                      docType="driverLicense"
                      id={data?.Documentdata?._id}
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setActiveDocType("driverLicense");
                        setIsModalOpen(true);
                      }}
                      className="col-span-full text-center py-3 px-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      Add Driving License
                    </button>
                  )}
                  {data?.Documentdata?.policeVerification?.certificateImage ? (
                    <DocumentCard
                      title="Police Certificate"
                      frontImage={
                        data?.Documentdata?.policeVerification?.certificateImage
                      }
                      status={
                        data?.Documentdata?.policeVerification
                          ?.policeVerificationStatus
                      }
                      docType="policeVerification"
                      id={data?.Documentdata?._id}
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setActiveDocType("policeVerification");
                        setIsModalOpen(true);
                      }}
                      className="col-span-full text-center py-3 px-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      Add Police Certificate
                    </button>
                  )}
                  {/* {data?.Documentdata?.vehicleRc?.rcImage ? (
                    <DocumentCard
                      title="Vehicle RC"
                      frontImage={data?.Documentdata?.vehicleRc?.rcImage}
                      status={data?.Documentdata?.vehicleRc?.vehicleRcStatus}
                      docType="vehicleRc"
                      id={data?.Documentdata?._id}
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setActiveDocType("vehicleRc");
                        setIsModalOpen(true);
                      }}
                      className="col-span-full text-center py-3 px-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      Add Vehicle RC
                    </button>
                  )} */}
                  {!data?.Documentdata?.verified ? (
                    <div className="mt-auto flex justify-end lg:col-span-4">
                      <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 ${
                          verified.document
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        }`}
                        disabled={!verified.document}
                        onClick={() =>
                          haldeDocumentinfoApi(data?.Documentdata?._id)
                        }
                      >
                        Verified
                      </button>
                    </div>
                  ) : (
                    <div className="mt-auto flex justify-end lg:col-span-4">
                      <p className="text-green-600 font-medium flex items-center">
                        Travel Document Verified
                        <CheckCheckIcon size={30} color="green" />
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center h-40 bg-gray-100 rounded-md">
                  <p className="text-gray-600 text-lg font-medium">
                    Oops! No documents found.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "vehicle" && (
            <VehicleInfo vehicleData={data?.Vehicles} />
          )}
          {activeTab === "Drivers" && (
            <DriversTable
              activeTab={activeTab}
              data={data}
              url={url}
              userId={id}
            />
          )}
        </div>
      </div>

      {activeDocType == "aadhar" && (
        <AddDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          docType={activeDocType}
          // onSubmit={handleDocumentSubmit}
          userId={data?.travel?.userId?._id}
          refetch={refetch}
        />
      )}
      {activeDocType == "driverLicense" && (
        <AddDrivingLicenseDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          docType={activeDocType}
          // onSubmit={handleDocumentSubmit}
          userId={data?.travel?.userId?._id}
          refetch={refetch}
        />
      )}
      {activeDocType == "policeVerification" && (
        <AddPoliceVerificationDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          docType={activeDocType}
          // onSubmit={handleDocumentSubmit}
          userId={data?.travel?.userId?._id}
          refetch={refetch}
        />
      )}

      {/* {activeDocType == "vehicleRc" && (
        <AddVehicleRCDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          docType={activeDocType}
          // onSubmit={handleDocumentSubmit}
          userId={data?.travel?.userId?._id}
          refetch={refetch}
        />
      )} */}
    </div>
  );
};

export default ViewTravel;
