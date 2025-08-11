import React, { useState } from "react";
import { useAddUserInfoMutation, useAddUserProfilePictureMutation,useGetStateAndCitiesQuery } from "../Redux/Api";
import { Upload, User, MapPin, Mail, Phone, Calendar } from "lucide-react";
import Sidebar from "../Component/Sidebar";
import toast,{Toaster} from "react-hot-toast";
import { useProvider } from "../Component/Context/Provider";

const AddTravelOwner = () => {
  const [addUserInfo] = useAddUserInfoMutation();
  const [adduserProfilePic] =useAddUserProfilePictureMutation()
  const { data, error } = useGetStateAndCitiesQuery();
  const [step, setStep] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cities, setCities] = useState([]);
  const {state,setState} =useProvider();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    firstName: "",
    lastName: "",
    state: "",
    city: "",
    address: "",
    gender: "",
    dob: "",
    password: "",
    role: "travelOwner",
    firmName: "",
    firmAddress: "",
    gstNumber: "",
    firmOpeningDate: "",
  });
  const [profileImage, setProfileImage] = useState({
    file: null,
    preview: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Direct state update
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStateChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      state: value,
    }));
    const selectedState = data?.state?.find((state) => state.name === value);

    setCities(selectedState?.cities);
  };

  const handleCityChange =(e)=>{
    const { value } = e.target;
    setFormData((prev) => ({
     ...prev,
      city: value,
    }));
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage({
          file: selectedFile,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFirstStepSubmit = async (e) => {
    e.preventDefault();
    // Validation for all fields including DOB
    const {
      phoneNumber,
      email,
      firstName,
      lastName,
      state,
      city,
      address,
      dob,
      gender,
      password,
      role,
      firmAddress,
      firmName,
      gstNumber,
      firmOpeningDate
    } = formData;
    if (
      phoneNumber &&
      email &&
      firstName &&
      lastName &&
      state &&
      city &&
      address &&
      dob &&
      gender &&
      password &&
      role &&
      firmAddress &&
      firmName &&
      gstNumber &&
      firmOpeningDate
    ) {
      const postdata = {
        firstName: firstName,
        lastName: lastName,
        phone: phoneNumber,
        state: state,
        city: city,
        Gender: gender,
        password: password,
        role: role,
        dob: dob,
        email: email,
        address: address,
        firmName :firmName,
        gstNumber :gstNumber,
        firmOpeningDate :firmOpeningDate,
        firmAddress :firmAddress
      };
      const { data, error } = await addUserInfo(postdata);
      console.log(data,error);
      if(data){
        toast.success("Travel Owner added successfully!");

        setState(data?.userId)
        setFormData(
          {
            phoneNumber: "",
            email: "",
            firstName: "",
            lastName: "",
            state: "",
            city: "",
            address: "",
            gender: "",
            dob: "",
            password: "",
            role: "travelOwner",
            firmName: "",
            firmAddress: "",
            gstNumber: "",
            firmOpeningDate: "",
          }
        )
      }
      else{

        toast.error(error.data.message);
      }
      // setStep(2);
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    // Check if profile image is selected
    if (!profileImage.file) {
      alert("Please select a profile picture");
      return;
    }

    try {
      // Prepare form data for submission
      const formDataToSubmit = new FormData();

  

      // Add profile picture
      formDataToSubmit.append("userId",state);
      // Add profile picture
      formDataToSubmit.append("profile_pic", profileImage.file);
      const {data,error}=await adduserProfilePic(formDataToSubmit);

      if(data){
        toast.success("profile picture added successfully")
        setProfileImage({
            file: null,
            preview: null,
          })
          setState(null);
          window.location.reload();
      }
      else{
         toast.error("profile picture failed");
      }
    } catch (error) {
      console.error("Error adding driver:", error);
      alert("Failed to add driver");
    }
  };




  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
    <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} w-full p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Travel Owner</h1>
          <p className="mt-2 text-gray-600">Register a new travel agency owner with complete details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Step Indicators */}
          <div className="flex mb-8">
            <div
              className={`w-1/2 text-center py-4 px-6 transition-all duration-300 ${
                step === 1
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              Step 1: Travel Agency Details
            </div>
            <div
              className={`w-1/2 text-center py-4 px-6 transition-all duration-300 ${
                step === 2
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              Step 2: Profile Picture
            </div>
          </div>

          <div className="p-8">
            {step === 1 && (
              <form onSubmit={handleFirstStepSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      Icon={Phone}
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                    />
                    <InputField
                      Icon={Mail}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                    />
                    <InputField
                      Icon={User}
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                    />
                    <InputField
                      Icon={User}
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                    />
                     <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  >
                
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="female">Other</option>
                  
                  </select>
                    <InputField
                      Icon={Calendar}
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      placeholder="Date of Birth"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Address Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                  >
                     <option value="">Select State</option>
                    {data?.state?.map((stat) => (
                      <option key={stat.id} value={stat.name}>
                        {stat.name}
                      </option>
                    ))}
                  </select>
                  {/* <InputField
                    Icon={MapPin}
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  /> */}

                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleCityChange}
                  >
                     <option value="">Select City</option>
                    {cities?.map((stat) => (
                      <option key={stat.id} value={stat.name}>
                        {stat}
                      </option>
                    ))}
                  </select>
                    <div className="md:col-span-2">
                      <InputField
                        Icon={MapPin}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Complete Address"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      Icon={User}
                      name="firmName"
                      value={formData.firmName}
                      onChange={handleInputChange}
                      placeholder="Firm Name"
                    />
                    <InputField
                      Icon={User}
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      placeholder="GST Number"
                    />
                    <InputField
                      Icon={Calendar}
                      name="firmOpeningDate"
                      type="date"
                      value={formData.firmOpeningDate}
                      onChange={handleInputChange}
                      placeholder="Firm Opening Date"
                    />
                    <InputField
                      Icon={MapPin}
                      name="firmAddress"
                      value={formData.firmAddress}
                      onChange={handleInputChange}
                      placeholder="Firm Address"
                    />
                  </div>
                </div>

                {/* Security Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Security</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      Icon={User}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      type="password"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:ring-4 focus:ring-blue-200"
                  >
                    Next Step
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div className="flex flex-col items-center justify-center p-8">
                  {/* Image Preview */}
                  <div className="mb-6">
                    {profileImage.preview ? (
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                        <img
                          src={profileImage.preview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center">
                        <Upload className="w-16 h-16 text-blue-300" />
                      </div>
                    )}
                  </div>

                  <div className="w-full max-w-md">
                    <input
                      type="file"
                      name="profilePicture"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="w-full text-sm text-gray-500 
                        file:mr-4 file:py-3 file:px-6
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-600
                        hover:file:bg-blue-100
                        cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-8 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:ring-4 focus:ring-blue-200"
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    <Toaster />
  </div>
  );
};

const InputField = ({ Icon, name, value, onChange, placeholder, type = "text" }) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
    />
  </div>
);

export default AddTravelOwner;




































