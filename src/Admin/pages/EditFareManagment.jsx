import React, { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../Component/Sidebar";
import Input from "../Component/Input";
import { Select, Option } from "../Component/Select";
import {
  useAddTripDetailInAdminMutation,
  useAddTripDetailMutation,
  useEditTripDetailMutation,
  useGetCategoriesQuery,
  useGetTripDetailsByIdFromAdminModelQuery,
} from "../Redux/Api";
// Import our custom Select component
import toast, { Toaster } from "react-hot-toast";
import MultiSelectSubCategory from "../Component/MultipleSelectSubCategory";
import { useNavigate, useParams } from "react-router-dom";

const EditFareManagementScreen = () => {
    const {id} = useParams();
     const { data :tripData, error:tripError, isLoading : tripLoading, isFetching : tripIsFetching } = useGetTripDetailsByIdFromAdminModelQuery(id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: categoryData, error: categoryError } = useGetCategoriesQuery();
  const navigate = useNavigate();
   console.log(tripData,"tripData in edit fare management screen")
   const tripInfo = tripData?.trip;


   const formatDateForInput = (isoString) => {
    if (!isoString) return '';  // Return empty if no value
  
    const date = new Date(isoString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return '';  // Return empty string if invalid
    }
    
    return date.toISOString().slice(0, 16);  // Format correctly
  };
  console.log(tripInfo?.vehicleCategory,"tripInfo?.vehicleCategory")
    

  const [selectedCategory, setSelectedCategory] = useState(tripInfo?.vehicleCategory);
  const [subscategories, setSubscategories] = useState(tripInfo?.vehicleSubCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  // Replace this line:
  // With this:
  const [selectedSubCategories, setSelectedSubCategories] = useState(tripInfo?.vehicleSubCategory);

  const [tripType, setTripType] = useState(tripInfo?.tripType);
  const [recommendedFare, setRecommendedFare] = useState(tripInfo?.RecommndedFareKm);
  const [minFare, setMinFare] = useState(tripInfo?.minFareKm);
  const [maxFare, setMaxFare] = useState(tripInfo?.maxFareKm);
  const [tax, setTax] = useState(tripInfo?.GsTtaxinPercentage);
  const [driverRadius, setDriverRadius] = useState(tripInfo?.DriverRadius);
  const [driverMinWallet, setDriverMinWallet] = useState(tripInfo?.DriverMinWalletAmount);
  const [minTripDiffTime, setMinTripDiffTime] = useState(tripInfo?.minTripDifferenceTime);
  const [urgentTimeLimit, setUrgentTimeLimit] = useState(tripInfo?.urgentTimeValue);
  const [perHours, setPerHours] = useState(tripInfo?.Perhours);
  const [bookingFeeType, setBookingFeeType] = useState(tripInfo?.bookingFeeType);
  const [beeokingfeeToKm, setbeeokingfeeToKm] = useState(tripInfo?.beeokingfeeToKm);
  const [beeokingfeeFromKm, setbeeokingfeeFromKm] = useState(tripInfo?.beeokingfeeFromKm);
  const [bookingFee, setBookingFee] = useState(tripInfo?.bookingFee);
  const [FareDate,setFareDate] =useState({
    startDate: tripInfo?.FareStartDate ? formatDateForInput(tripInfo?.FareStartDate) : '',
    endDate: tripInfo?.FareEndDate ? formatDateForInput(tripInfo?.FareEndDate) : '',
  });

  const [FromToTime, setFromToTime]=useState({
    fromTime:tripInfo?.FromDriverPickupTime ? formatDateForInput(tripInfo?.FromDriverPickupTime) : '',
    toTime: tripInfo?.ToDriverPickupTime ? formatDateForInput(tripInfo?.ToDriverPickupTime) : '',
  })

  const [EditTripApiInAdmin] = useEditTripDetailMutation()

  const [AdvanceFare, setAdvanceFare] = useState({
    FareType: tripInfo?.advanceFareType,
    price: tripInfo?.advanceFee,
  });

  const [FareStatus, setFareStatus] = useState(tripInfo?.FareStatus);
  const [DriverPickupTime, setDriverPickupTime] = useState(formatDateForInput(tripInfo?.DriverPickupTime));


 

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    setSelectedCategory(categoryName);
    // Find the selected category object
    const selectedCategoryObj = categoryData?.categories.find(
      (category) => category.categoryName === categoryName
    );
    if (selectedCategoryObj) {
      setSubscategories(selectedCategoryObj.subcategory);
      setSelectedSubCategories([]);
    } else {
      setSubscategories([]);
    }
  };

 


  const handleSubcategoryChange = (e) => {
    const subcategoryName = e.target.value;
    setSelectedSubCategory(subcategoryName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      parseInt(maxFare) < parseInt(recommendedFare) ||
      parseInt(minFare) > parseInt(recommendedFare) ||
      parseInt(maxFare) < parseInt(minFare)
    ) {
      toast.error(
        "Max fare should be greater than recommended fare and min fare should be less than recommended fare"
      );
      return;
    }
    const postdata = {
      // state: selectedState,
      // city: selectedCity,
      tripId:id,
      advanceFee: AdvanceFare?.price,
      advanceFareType: AdvanceFare?.FareType,
      vehicleCategory: selectedCategory,
      vehicleSubCategory: selectedSubCategories,
      tripType: tripType,
      RecommndedFareKm: recommendedFare,
      minFareKm: minFare,
      maxFareKm: maxFare,
      GsTtaxinPercentage: tax,
      bookingFeeType: bookingFeeType,
      beeokingfeeToKm: beeokingfeeToKm,
      beeokingfeeFromKm: beeokingfeeFromKm,
      bookingFee: bookingFee,
      advanceFareType:AdvanceFare?.FareType,
      advanceFee:AdvanceFare?.price,
      FareEndDate :FareDate?.endDate,
      FareStatus : FareStatus,
      FareStartDate : FareDate?.startDate,
      FromDriverPickupTime :FromToTime?.fromTime,
      ToDriverPickupTime : FromToTime?.toTime,
      DriverPickupTime : DriverPickupTime,
      Perhours : perHours,
      DriverRadius :driverRadius,
      minTripDifferenceTime : minTripDiffTime,
      DriverMinWalletAmount : driverMinWallet,
      urgentTimeValue : urgentTimeLimit,
    };
    // const { data, error } = await AddTripApi(postdata);
     const {data : dataInAdmin,error : errorInAdmin} = await EditTripApiInAdmin(postdata);
    if (dataInAdmin) {
      toast.success("Trip Updated successfully!");
      setSelectedSubCategories([]);
      // reset all fields
      setSelectedCategory("");
      setSelectedSubCategory("");
      setTripType("");
      setRecommendedFare("");
      setMinFare("");
      setMaxFare("");
      setTax("");
      setDriverRadius("");
      setDriverMinWallet("");
      setMinTripDiffTime("");
      setUrgentTimeLimit("");
      setPerHours("");
      setBookingFeeType("");
      setbeeokingfeeToKm(0);
      setbeeokingfeeFromKm(0);
      setBookingFee(0);
      setAdvanceFare({
        FareType: "",
        price: 0,
      });
      navigate("/trips");
    } else {
      toast.error("Failed to add trip!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
         className={`flex-1 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <div className="bg-green-500 rounded-lg p-6 text-white">
          <div className="grid grid-cols-3 gap-6">
            {/* First Row */}

            <div className="space-y-2">
              <label className="block text-sm">Trip Type</label>
              <Select
                className="bg-white/90 text-black"
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
              >
                <Option value="">Select</Option>
                <Option value="CityRide">City Ride</Option>
                <Option value="Rental">Rental</Option>
                <Option value="bus">BUS</Option>
                <Option value="CarPool">CarPool</Option>
                <Option value="One-Way">One Way</Option>
                <Option value="Round-Trip">Round Trip</Option>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm">Category</label>
              <Select
                className="bg-white/90 text-black"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <Option value="">Select</Option>
                {categoryData?.categories.map((category) => (
                  <Option
                    key={category.categoryName}
                    value={category.categoryName}
                  >
                    {category.categoryName}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm">Sub-Category</label>
              <MultiSelectSubCategory
                selectedSubCategories={selectedSubCategories}
                subcategories={subscategories}
                disabled={!selectedCategory}
                onChange={setSelectedSubCategories}
                className="bg-white/90 text-black"
              />
            </div>

            {/* Second Row */}
            <div className="space-y-2">
              <label className="block text-sm">Recommended Fare/km</label>
              <Input
                type="number"
                placeholder="Per km"
                min={0}
                className="bg-white/90 text-black"
                value={recommendedFare}
                onChange={(e) => setRecommendedFare(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Min Fare/km</label>
              <Input
                type="number"
                placeholder="Per km"
                className="bg-white/90 text-black"
                value={minFare}
                min={0}
                onChange={(e) => setMinFare(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Max Fare/km</label>
              <Input
                type="number"
                placeholder="Per km"
                className="bg-white/90 text-black"
                value={maxFare}
                min={0}
                onChange={(e) => setMaxFare(e.target.value)}
              />
            </div>

            {/* Third Row */}
            <div className="space-y-2">
              <label className="block text-sm">Tax (GST)</label>
              <Input
                type="number"
                placeholder="%"
                className="bg-white/90 text-black"
                value={tax}
                min={0}
                onChange={(e) => setTax(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Driver radius</label>
              <Input
                type="number"
                placeholder="km"
                className="bg-white/90 text-black"
                value={driverRadius}
                min={0}
                onChange={(e) => setDriverRadius(e.target.value)}
                // disabled={true}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Driver min wallet</label>
              <Input
                type="number"
                defaultValue="500"
                className="bg-white/90 text-black"
                // disabled={true}
                min={0}
                value={driverMinWallet}
                onChange={(e) => setDriverMinWallet(e.target.value)}
              />
            </div>

            {/* Fourth Row */}
            <div className="space-y-2">
              <label className="block text-sm">Min trip difference time</label>
              <Input
                type="number"
                placeholder="minutes"
                min={0}
                className="bg-white/90 text-black"
                value={minTripDiffTime}
                onChange={(e) => setMinTripDiffTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm">Urgent time limit</label>
              <Input
                type="number"
                placeholder="minutes"
                min={0}
                className="bg-white/90 text-black"
                value={urgentTimeLimit}
                onChange={(e) => setUrgentTimeLimit(e.target.value)}
              
                // disabled={true}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm">Per hours</label>
              <Input
                type="number"
                placeholder="Per hours"
                className="bg-white/90 text-black"
                // disabled={true}
                min={0}
                value={perHours}
                onChange={(e) => setPerHours(e.target.value)}
              />
            </div>

            {/* Booking Fee Section */}
            <div className="col-span-3 grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm">Booking fee type (U)</label>
                <Select
                  value={bookingFeeType}
                  onChange={(e) => setBookingFeeType(e.target.value)}
                  className="bg-white/90 text-black"
                >
                  <Option value="Fixed">Fixed</Option>
                  <Option value="PerKm">Per KM</Option>
                  <Option value="Percentage">Percentage</Option>
                </Select>
              </div>
              <div className="space-y-2 flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm">To km</label>
                  <Input
                    type="number"
                    min={0}
                    value={beeokingfeeToKm}
                    onChange={(e) => setbeeokingfeeToKm(e.target.value)}
                    placeholder="Enter to"
                    className="bg-white/90 text-black mt-[6px]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm">From km</label>
                  <Input
                   type="number"
                   min={0}
                    value={beeokingfeeFromKm}
                    onChange={(e) => setbeeokingfeeFromKm(e.target.value)}
                    placeholder="Enter from"
                    className="bg-white/90 text-black"
                  />
                </div>
              </div>
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm">Booking fee</label>
                  <Input
                    type="number"
                    min={0}
                    value={bookingFee}
                    onChange={(e) => setBookingFee(e.target.value)}
                    defaultValue="580"
                    className="bg-white/90 text-black"
                  />
                </div>
                {/* <button className="h-10 px-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md flex items-center justify-center">
                  <Plus className="h-4 w-4" />
                </button> */}
              </div>
            </div>

            {/* AdvanceFare Section */}

            <div className="col-span-3 grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm"> Advance Fare (U)</label>
                <Select
                  value={AdvanceFare.FareType}
                  min={0}
                  onChange={(e) =>
                    setAdvanceFare((prev) => ({
                      ...prev,
                      FareType: e.target.value,
                    }))
                  }
                  className="bg-white/90 text-black"
                >
                  <Option value="Fixed">Fixed</Option>
                  <Option value="PerKm">Per KM</Option>
                  <Option value="Percentage">Percentage</Option>
                </Select>
              </div>
              {/* <div className="space-y-2 flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm">To km</label>
                  <Input
                    type="text"
                    value={beeokingfeeToKm}
                    onChange={(e) => setbeeokingfeeToKm(e.target.value)}
                    placeholder="Enter to"
                    className="bg-white/90 text-black"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm">From km</label>
                  <Input
                    type="text"
                    value={beeokingfeeFromKm}
                    onChange={(e) => setbeeokingfeeFromKm(e.target.value)}
                    placeholder="Enter from"
                    className="bg-white/90 text-black"
                  />
                </div>
              </div> */}
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm">Advance Fare</label>
                  <Input
                    type="number"
                    min={0}
                    value={AdvanceFare?.price}
                    placeholder="Enter Advance Fare price"
                    onChange={(e) =>
                      setAdvanceFare((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    defaultValue="580"
                    className="bg-white/90 text-black"
                  />
                </div>
                {/* <button className="h-10 px-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md flex items-center justify-center">
                  <Plus className="h-4 w-4" />
                </button> */}
              </div>
            </div>

            {/* Trip Pickup Time */}
            <div className="col-span-3 grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm">Trip pickup time</label>
                <Select  value={DriverPickupTime}
                onChange={(e) => setDriverPickupTime(e.target.value)}
                className="bg-white/90 text-black">
                  <Option value="all-time">All time</Option>
                  <Option value="fixed-time">Fixed time</Option>
                  <Option value="female-time">Female time</Option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm">To date & time</label>
                <Input
                  type="datetime-local"
                  className="bg-white/90 text-black"
                  // disabled={true}
                  value={FromToTime?.toTime}
                  onChange={(e) =>
                    setFromToTime((prev) => ({
                      ...prev,
                       toTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm">From date & time</label>
                <Input
                  type="datetime-local"
                  className="bg-white/90 text-black"
                  // disabled={true}
                  value={FromToTime?.fromTime}
                  onChange={(e) =>
                    setFromToTime((prev) => ({
                      ...prev,
                      fromTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Fare Status Section */}
            <div className="col-span-3 grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm">Fare start date</label>
                <Input
                  type="datetime-local"
                  className="bg-white/90 text-black"
                  // disabled={true}
                  value={FareDate?.startDate}
                  onChange={(e) =>
                    setFareDate((prev) => ({
                      ...prev,
                       startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm">Fare end date</label>
                <Input
                  type="datetime-local"
                  className="bg-white/90 text-black"
                  // disabled={true}
                  value={FareDate?.endDate}
                  onChange={(e) =>
                    setFareDate((prev) => ({
                      ...prev,
                       endDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm">Fare status</label>
                <Select 
                value={FareStatus}
                onChange={(e) => setFareStatus(e.target.value)}
                className="bg-white/90 text-black">
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">De-active</Option>
                </Select>
              </div>
            </div>

            <div className="col-span-3">
              <button
                onClick={handleSubmit}
                className="w-full h-10 px-4 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md font-semibold flex items-center justify-center"
              >
                Save
              </button>
            </div>
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFareManagementScreen;
