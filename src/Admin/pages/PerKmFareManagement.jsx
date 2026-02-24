import React, { useState,useEffect } from "react";
import { Plus, X, Edit, Trash2, Check } from "lucide-react";
import Sidebar from "../Component/Sidebar";
import Input from "../Component/Input";
import { Select, Option } from "../Component/Select";
import {
  useAddTripDetailInAdminMutation,
  useAddTripDetailMutation,
  useGetAllVehicleCategoryQuery,
  useGetCategoriesQuery,
  useGetCategoryAllVehicleQuery,
  useGetPackagesQuery,
  useGetStateAndCitiesQuery,
} from "../Redux/Api";
import toast, { Toaster } from "react-hot-toast";
import MultiSelectSubCategory from "../Component/MultipleSelectSubCategory";

const PerKmFareManagementScreen = () => {
  const [perKmFare, setPerKmFare] = useState(false);
  const [chargeType, setChargeType] = useState("perHour");
  const [waitingTimeCharge, setWaitingTimeCharge] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data, error } = useGetStateAndCitiesQuery();
  // const { data: categoryData, error: categoryError } = useGetCategoriesQuery();

  const {
    data: categoryData,
    // isLoading,
    isError,
    // error,
    refetch: refetchCategory,
  } = useGetAllVehicleCategoryQuery();
  const { data: packages, isLoading } = useGetPackagesQuery();
  const [selectedRentalPkg, setselectedRentalPkg] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [farename,setfarename] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [subscategories, setSubscategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const [tripType, setTripType] = useState("");
  const [tripFor, settripFor] = useState("");

  // Updated fare configuration fields based on PDF
  const [baseFare, setBaseFare] = useState("");
  const [Extratobepaid, setExtratobepaid] = useState("");
  const [fareInclude, setfareInclude] = useState("");
  const [adminLineStateTax, setAdminLineStateTax] = useState(false);
  const [adminLineTollTax, setAdminLineTollTax] = useState(false);
  const [adminLineParking, setAdminLineParking] = useState(false);
  const [adminLineLuggageCarrier, setAdminLineLuggageCarrier] = useState(false);
  const [baseFareForKm, setBaseFareForKm] = useState("");
  const [baseFareForTime, setBaseFareForTime] = useState("");
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState("");
  const [extraPerKmCharges, setExtraPerKmCharges] = useState("");
  const [extraTimeCharges, setExtraTimeCharges] = useState("");
  const [waitingTimeCharges, setWaitingTimeCharges] = useState("");
  // Night time charges
  const [nightTimeCharge, setNightTimeCharge] = useState("");
  const [nightTimeFrom, setNightTimeFrom] = useState("");
  const [nightTimeTo, setNightTimeTo] = useState("");
  // Surcharges
  const [surcharges, setSurcharges] = useState("");
  const [surchargesFrom, setSurchargesFrom] = useState("");
  const [surchargesTo, setSurchargesTo] = useState("");

  const [tax, setTax] = useState("");
  const [driverRadius, setDriverRadius] = useState("");
  const [driverMinWallet, setDriverMinWallet] = useState("");
  const [minTripDiffTime, setMinTripDiffTime] = useState("");
  const [urgentTimeLimit, setUrgentTimeLimit] = useState("");
  const [perHours, setPerHours] = useState("");

  // Booking Fee Rows State
  const [bookingFeeRows, setBookingFeeRows] = useState([
    {
      bookingFeeType: "PerKm",
      beeokingfeeFromKm: 0,
      beeokingfeeToKm: 0,
      bookingFee: 0,
    },
  ]);

  // Additional state for missing sections
  const [commissionRows, setCommissionRows] = useState([
    { fromKm: "", toKm: "", amount: "" },
  ]);
  const [distanceVoice, setDistanceVoice] = useState("");
  const [timeVoice, setTimeVoice] = useState("");
  const [platformFeeU, setPlatformFeeU] = useState("");
  const [platformFeeD, setPlatformFeeD] = useState("");
 const [PlatformFeeUserAmount,setPlatformFeeUserAmount] =useState(0)
 const [paltformFeeDriverAmount,setpaltformFeeDriverAmount] =useState(0)
  const [platformFeePercentage, setPlatformFeePercentage] = useState("");
  const [acFixed, setAcFixed] = useState("");
  const [advanceAcD, setAdvanceAcD] = useState("");
  const [fixedPercentage, setFixedPercentage] = useState("");
  const [addWalletAcD, setAddWalletAcD] = useState("");
  const [acAmount, setAcAmount] = useState("");
  const [acAdminCommission, setAcAdminCommission] = useState("");
  const [termsConditions, setTermsConditions] = useState("");
  const [fareRules, setFareRules] = useState("");

  // admin comission values 

  const [AdminBaseFarecomission,setAdminBaseFarecommission] = useState(null);
  const [AdminExtraperkmchargescomission,setadminExtraperkmchargescomission] = useState(null)
  const [AdminExtratimechargescomission,setAdminExtratimechargescomission] = useState(null)

  const [AddTripApiInAdmin] = useAddTripDetailInAdminMutation();

  const [AdvanceFare, setAdvanceFare] = useState({
    FareType: "Fixed",
    price: 0,
  });

  const [FareStatus, setFareStatus] = useState("Active");
  const [DriverPickupTime, setDriverPickupTime] = useState("");

  // Package State
  const [selectedPackage, setSelectedPackage] = useState("");
  const [packageName, setPackageName] = useState("");
  const [showPackageForm, setShowPackageForm] = useState(false);

  // Package form fields
  const [packageDetails, setPackageDetails] = useState({
    packageName: "",
    description: "",
    validity: "",
    features: "",
    price: "",
    discountPercentage: "",
    maxTrips: "",
    packageType: "Basic",
  });

  // Package options
  const packageOptions = [
    { value: "basic", label: "Basic Package" },
    { value: "premium", label: "Premium Package" },
    { value: "enterprise", label: "Enterprise Package" },
    { value: "custom", label: "Custom Package" },
    { value: "new", label: "Create New Package" },
  ];

  const [FareDate, setFareDate] = useState({
    startDate: "",
    endDate: "",
  });

  const [FromToTime, setFromToTime] = useState({
    fromTime: "",
    toTime: "",
  });

  const [settings, setSettings] = useState({
    hideSeatView: false,
    hideChat: false,
    hideNumber: false,
  });

  const toggleSetting = (settingKey) => {
    setSettings((prev) => ({
      ...prev,
      [settingKey]: !prev[settingKey],
    }));
  };

  // Booking Fee handlers
  const addBookingFeeRow = () => {
    setBookingFeeRows([
      ...bookingFeeRows,
      {
        bookingFeeType: "PerKm",
        beeokingfeeFromKm: 0,
        beeokingfeeToKm: 0,
        bookingFee: 0,
      },
    ]);
  };

  const handleRentalPackageChange = (e) => {
    setselectedRentalPkg(e.target.value);
  };

  const updateBookingFeeRow = (index, field, value) => {
    const updatedRows = bookingFeeRows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setBookingFeeRows(updatedRows);
  };

  const removeBookingFeeRow = (index) => {
    if (bookingFeeRows.length > 1) {
      const updatedRows = bookingFeeRows.filter((_, i) => i !== index);
      setBookingFeeRows(updatedRows);
    }
  };

  // Package handlers
  const handlePackageChange = (e) => {
    const packageValue = e.target.value;
    setSelectedPackage(packageValue);

    // Load existing package data if not new
    if (packageValue && packageValue !== "new") {
      const selectedPkg = packageOptions.find(
        (pkg) => pkg.value === packageValue
      );
      if (selectedPkg) {
        // Pre-populate form with existing package data
        setPackageDetails({
          packageName: selectedPkg.label,
          description: `${selectedPkg.label} package with premium features`,
          validity:
            packageValue === "basic"
              ? "30"
              : packageValue === "premium"
              ? "90"
              : "365",
          features:
            packageValue === "basic"
              ? "Basic ride features, Standard support"
              : packageValue === "premium"
              ? "Premium features, Priority support, Advanced analytics"
              : "Enterprise features, 24/7 support, Custom analytics, API access",
          price:
            packageValue === "basic"
              ? "99"
              : packageValue === "premium"
              ? "299"
              : "999",
          discountPercentage:
            packageValue === "basic"
              ? "5"
              : packageValue === "premium"
              ? "15"
              : "25",
          maxTrips:
            packageValue === "basic"
              ? "50"
              : packageValue === "premium"
              ? "200"
              : "unlimited",
          packageType:
            packageValue === "basic"
              ? "Basic"
              : packageValue === "premium"
              ? "Premium"
              : "Enterprise",
        });
      }
    } else if (packageValue === "new") {
      // Reset form for new package
      setPackageDetails({
        packageName: "",
        description: "",
        validity: "",
        features: "",
        price: "",
        discountPercentage: "",
        maxTrips: "",
        packageType: "Basic",
      });
    }
  };

  const handlePackageDetailsChange = (field, value) => {
    setPackageDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addCommissionRow = () => {
    setCommissionRows([
      ...commissionRows,
      { fromKm: "", toKm: "", amount: "" },
    ]);
  };

  const updateCommissionRow = (index, field, value) => {
    const updatedRows = commissionRows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setCommissionRows(updatedRows);
  };

  const getPlaceholder = () => {
    console.log(chargeType);
    if (chargeType === "perHour") {
      return "120/hour";
    }
    if (chargeType === "perMin") {
      return "2/min";
    }
    return "Enter amount";
  };

  const ToggleButton = ({ label, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`ml-10 px-4 py-2 rounded-lg border-blue-500 transition-all duration-200 min-w-[140px] ${
        isSelected
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-300 bg-gray-100 text-gray-600 hover:border-gray-400"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {isSelected && <Check size={16} className="text-blue-600 ml-2" />}
      </div>
    </button>
  );

  const shouldFetchCategories = !!selectedCategory;

  const {
    data: categoriesDataa,
    error: fetchErro,
    isLoading: isFetchingCategorie,
    refetch: refetchCategorie,
  } = useGetCategoryAllVehicleQuery(selectedCategory);

  useEffect(() => {
    if (categoriesDataa && shouldFetchCategories) {
      // Yahan subcategory set karein
      setSubscategories(categoriesDataa);
    }
  }, [categoriesDataa, shouldFetchCategories]);



  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    setSelectedCategory(categoryName);
    // const selectedCategoryObj = categoryData?.categories.find(
    //   (category) => category.categoryName === categoryName
    // );
    // if (selectedCategoryObj) {
    //   setSubscategories(selectedCategoryObj.subcategory);
    //   setSelectedSubCategories([]);
    // } else {
    //   setSubscategories([]);
    // }
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);

    const selectedStateObj = data?.state.find(
      (state) => state.name === stateName
    );
    if (selectedStateObj) {
      setCities(selectedStateObj.cities);
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postdata = {
      Extratobepaid,
      fareInclude,
      adminLineStateTax,
      adminLineTollTax,
      adminLineParking,
      adminLineLuggageCarrier,
      tripFor: tripFor,
      perKmFare: true,
      vehicleCategory: selectedCategory,
      vehicleSubCategory: selectedSubCategories,
      tripType: tripType,
      // Updated fare fields
      baseFare: baseFare,
      baseFareForKm: parseInt(baseFareForKm),
      baseFareForTime: baseFareForTime,
      waitingTimeMinutes: waitingTimeMinutes,
      extraPerKmCharges: extraPerKmCharges,
      extraTimeCharges: extraTimeCharges,
      waitingTimeCharges: waitingTimeCharges,
      nightTimeCharge: nightTimeCharge,
      nightTimeFrom: nightTimeFrom,
      nightTimeTo: nightTimeTo,
      surcharges: surcharges,
      surchargesFrom: surchargesFrom,
      surchargesTo: surchargesTo,
      GsTtaxinPercentage: tax,
      bookingFeeRows: bookingFeeRows,
      advanceFareType: AdvanceFare?.FareType,
      advanceFee: AdvanceFare?.price,
      FareEndDate: FareDate?.endDate,
      FareStatus: FareStatus,
      FareStartDate: FareDate?.startDate,
      FromDriverPickupTime: FromToTime?.fromTime,
      ToDriverPickupTime: FromToTime?.toTime,
      DriverPickupTime: DriverPickupTime,
      Perhours: perHours,
      DriverRadius: driverRadius,
      minTripDifferenceTime: minTripDiffTime,
      DriverMinWalletAmount: driverMinWallet,
      urgentTimeValue: urgentTimeLimit,
      PlatformFeeUserAmount:PlatformFeeUserAmount,
      paltformFeeDriverAmount:paltformFeeDriverAmount,
      // Package data
      selectedPackage: selectedPackage,
      packageName: packageName,
      packageDetails: showPackageForm ? packageDetails : null,
      // Additional fields for new sections
      commissionRows: commissionRows,
      distanceVoice: distanceVoice,
      timeVoice: timeVoice,
      platformFeeU: platformFeeU,
      platformFeeD: platformFeeD,
      platformFeePercentage: platformFeePercentage,
      acConfiguration: {
        acFixed: acFixed,
        advanceAcD: advanceAcD,
        fixedPercentage: fixedPercentage,
        addWalletAcD: addWalletAcD,
        acAmount: acAmount,
        acAdminCommission: acAdminCommission,
      },
      termsConditions: termsConditions,
      fareRules: fareRules,
      settings: settings,
      Rentalpkg: selectedRentalPkg,
      AdminBaseFarecomission:AdminBaseFarecomission,
      AdminExtraperkmchargescomission:AdminExtraperkmchargescomission,
      AdminExtratimechargescomission:AdminExtratimechargescomission,
      farename:farename
    };

  

    try {
      const { data: dataInAdmin, error: errorInAdmin } =
        await AddTripApiInAdmin(postdata);
      if (dataInAdmin) {
        toast.success("Per/KM Fare added successfully!");
        // Reset all fields
        setSelectedSubCategories([]);
        setSelectedState("");
        setSelectedCity("");
        setSelectedCategory("");
        setSelectedSubCategory("");
        setTripType("");
        setBaseFare("");
        setBaseFareForKm("");
        setBaseFareForTime("");
        setWaitingTimeMinutes("");
        setExtraPerKmCharges("");
        setExtraTimeCharges("");
        setWaitingTimeCharges("");
        setNightTimeCharge("");
        setNightTimeFrom("");
        setNightTimeTo("");
        setSurcharges("");
        setSurchargesFrom("");
        setSurchargesTo("");
        setTax("");
        setDriverRadius("");
        setDriverMinWallet("");
        setMinTripDiffTime("");
        setUrgentTimeLimit("");
        setPerHours("");
        setBookingFeeRows([
          {
            bookingFeeType: "PerKm",
            beeokingfeeFromKm: 0,
            beeokingfeeToKm: 0,
            bookingFee: 0,
          },
        ]);
        setAdvanceFare({
          FareType: "",
          price: 0,
        });
        setSelectedPackage("");
        setPackageName("");
        setShowPackageForm(false);
        setPackageDetails({
          packageName: "",
          description: "",
          validity: "",
          features: "",
          price: "",
          discountPercentage: "",
          maxTrips: "",
          packageType: "Basic",
        });
        // Reset new fields
        setCommissionRows([{ fromKm: "", toKm: "", amount: "" }]);
        setDistanceVoice("");
        setTimeVoice("");
        setPlatformFeeU("");
        setPlatformFeeD("");
        setPlatformFeePercentage("");
        setAcFixed("");
        setAdvanceAcD("");
        setFixedPercentage("");
        setAddWalletAcD("");
        setAcAmount("");
        setAcAdminCommission("");
        setTermsConditions("");
        setFareRules("");
        setExtratobepaid("");
        setfareInclude("");
        setAdminLineStateTax(false);
        setAdminLineTollTax(false);
        setAdminLineParking(false);
        setAdminLineLuggageCarrier(false);
      } else {
        toast.error("Failed to add per/km fare!");
      }
    } catch (error) {
      toast.error("Error occurred while saving!");
    }
  };

  return (
    <div className="flex min-h-screen items-center bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`flex-1 p-6 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <div className="max-w-10xl bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold">Per/KM Fare Configuration</h1>
          </div>

          <div className="mb-2 mt-4">
            <div className="flex flex-wrap gap-4">
              <ToggleButton
                label="Hide Seat View"
                isSelected={settings.hideSeatView}
                onClick={() => toggleSetting("hideSeatView")}
              />
              <ToggleButton
                label="Hide Chat"
                isSelected={settings.hideChat}
                onClick={() => toggleSetting("hideChat")}
              />
              <ToggleButton
                label="Hide Number"
                isSelected={settings.hideNumber}
                onClick={() => toggleSetting("hideNumber")}
              />
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fare name
                    </label>
                    <Input
                      type="text"
                      placeholder="Passenger Fare / Testing fare"
                      className="w-full"
                      value={farename}
                 
                      onChange={(e) => setfarename(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip For
                    </label>
                    <Select
                      className="w-full"
                      value={tripFor}
                      onChange={(e) => settripFor(e.target.value)}
                    >
                      <Option value="Passenger">Passenger</Option>

                      <Option value="Driver">Driver</Option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Type
                    </label>
                    <Select
                      className="w-full"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select
                      className="w-full"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      <Option value="">Select</Option>
                      {categoryData?.map((category) => (
                        <Option
                          key={category.brandName}
                          value={category.brandName}
                        >
                          {category.brandName}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {tripType == "Rental" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package
                      </label>
                      <Select
                        className="w-full"
                        value={selectedRentalPkg}
                        onChange={handleRentalPackageChange}
                      >
                        <Option value="">Select</Option>
                        {packages?.map((pkg) => (
                          <Option key={pkg.name} value={pkg.name}>
                            {pkg.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    Sub-Category
                  </label>
                  <MultiSelectSubCategory
                    selectedSubCategories={selectedSubCategories}
                    subcategories={subscategories}
                    disabled={!selectedCategory}
                    onChange={setSelectedSubCategories}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Per/KM Fare Configuration Section - Updated */}
              <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
                <h3 className="text-lg font-semibold text-green-700 mb-4">
                  Fare Configuration
                </h3>

                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Fare
                    </label>
                    <Input
                      type="number"
                      placeholder="Base Fare"
                      className="w-full"
                      value={baseFare}
                      min={0}
                      onChange={(e) => setBaseFare(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base fare for km
                    </label>
                    <Input
                      type="number"
                      placeholder="Base fare for km"
                      className="w-full"
                      value={baseFareForKm}
                      min={0}
                      onChange={(e) => setBaseFareForKm(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base fare for time
                    </label>
                    <Input
                      type="number"
                      placeholder="Base fare for time"
                      className="w-full"
                      value={baseFareForTime}
                      min={0}
                      onChange={(e) => setBaseFareForTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waiting time minutes
                    </label>
                    <Input
                      type="number"
                      placeholder="Waiting time minutes"
                      className="w-full"
                      value={waitingTimeMinutes}
                      min={0}
                      onChange={(e) => setWaitingTimeMinutes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra per km charges
                    </label>
                    <Input
                      type="number"
                      placeholder="Extra per km charges"
                      className="w-full"
                      value={extraPerKmCharges}
                      min={0}
                      onChange={(e) => setExtraPerKmCharges(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra time charges
                    </label>
                    <Select
                      value={chargeType}
                      onChange={(e) => setChargeType(e.target.value)} // ✅ e.target.value use करें
                      className="w-full"
                    >
                      <Option value="perHour">per/hour</Option>
                      <Option value="perMin">per/min</Option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <Input
                      type="number"
                      placeholder={getPlaceholder()}
                      className="w-full"
                      value={extraTimeCharges}
                      min={0}
                      onChange={(e) => setExtraTimeCharges(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waiting time charges
                    </label>
                    <Input
                      type="number"
                      placeholder="Waiting time charges"
                      className="w-full"
                      value={waitingTimeCharges}
                      min={0}
                      onChange={(e) => setWaitingTimeCharges(e.target.value)}
                    />
                  </div>
                </div>

                {/* Night Time Row */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-300">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night time charge
                    </label>
                    <Input
                      type="number"
                      placeholder="Night time charge"
                      className="w-full"
                      value={nightTimeCharge}
                      min={0}
                      onChange={(e) => setNightTimeCharge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night time from
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={nightTimeFrom}
                      onChange={(e) => setNightTimeFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night time to
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={nightTimeTo}
                      onChange={(e) => setNightTimeTo(e.target.value)}
                    />
                  </div>
                </div> */}

                {/* Surcharges Row
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-300">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surcharges
                    </label>
                    <Input
                      type="number"
                      placeholder="Surcharges amount"
                      className="w-full"
                      value={surcharges}
                      min={0}
                      onChange={(e) => setSurcharges(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surcharges from
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={surchargesFrom}
                      onChange={(e) => setSurchargesFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surcharges to
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={surchargesTo}
                      onChange={(e) => setSurchargesTo(e.target.value)}
                    />
                  </div>
                </div> */}
              </div>



              <div className="border border-gray-200 rounded-lg p-6 bg-purple-50">
                <h3 className="text-lg font-semibold text-green-700 mb-4">
                  Admin Commission
                </h3>

                {/* Night Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Base Fare co.
                    </label>
                    <Input
                      type="number"
                      placeholder="Admin Base Fare co."
                      className="w-full"
                      value={AdminBaseFarecomission}
                      min={0}
                      onChange={(e) => setAdminBaseFarecommission(e.target.value)}
                    />
                  </div>
                
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Extra/km charges co.
                    </label>
                    <Input
                      type="number"
                      placeholder="Admin Extra/km charges co."
                      className="w-full"
                      value={AdminExtraperkmchargescomission}
                      min={0}
                      onChange={(e) => setadminExtraperkmchargescomission(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Extra time charges co.
                    </label>
                    <Input
                      type="number"
                      placeholder="Admin Extra time charges co."
                      className="w-full"
                      value={AdminExtratimechargescomission}
                      min={0}
                      onChange={(e) => setAdminExtratimechargescomission(e.target.value)}
                    />
                  </div>
            
                </div>

            
              </div>





















              <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
                <h3 className="text-lg font-semibold text-green-700 mb-4">
                  Admin Lines
                </h3>

                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bold Line
                    </label>
                    <Input
                      type="text"
                      placeholder="Extra to be paid by you to driver"
                      className="w-full"
                      value={Extratobepaid}
                      onChange={(e) => setExtratobepaid(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lighter Line
                    </label>
                    <Input
                      type="text"
                      placeholder="your fare does not include"
                      className="w-full"
                      value={fareInclude}
                      onChange={(e) => setfareInclude(e.target.value)}
                    />
                  </div>
                </div>

                {/* Admin Line checkboxes - State Tax, Toll Tax, Parking */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={adminLineStateTax}
                      onChange={(e) => setAdminLineStateTax(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">State Taxes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={adminLineTollTax}
                      onChange={(e) => setAdminLineTollTax(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Toll Taxes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={adminLineParking}
                      onChange={(e) => setAdminLineParking(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Parking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={adminLineLuggageCarrier}
                      onChange={(e) => setAdminLineLuggageCarrier(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Luggage Carrier</span>
                  </label>
                </div>

                {/* Night Time Row */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-300">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night time charge
                    </label>
                    <Input
                      type="number"
                      placeholder="Night time charge"
                      className="w-full"
                      value={nightTimeCharge}
                      min={0}
                      onChange={(e) => setNightTimeCharge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night time from
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={nightTimeFrom}
                      onChange={(e) => setNightTimeFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night time to
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={nightTimeTo}
                      onChange={(e) => setNightTimeTo(e.target.value)}
                    />
                  </div>
                </div> */}

                {/* Surcharges Row
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-300">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surcharges
                    </label>
                    <Input
                      type="number"
                      placeholder="Surcharges amount"
                      className="w-full"
                      value={surcharges}
                      min={0}
                      onChange={(e) => setSurcharges(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surcharges from
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={surchargesFrom}
                      onChange={(e) => setSurchargesFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surcharges to
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={surchargesTo}
                      onChange={(e) => setSurchargesTo(e.target.value)}
                    />
                  </div>
                </div> */}
              </div>

              <div className="border border-gray-200 rounded-lg p-6 bg-purple-50">
                <h3 className="text-lg font-semibold text-green-700 mb-4">
                  Night Configuration
                </h3>

                {/* Night Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night time charge
                    </label>
                    <Input
                      type="number"
                      placeholder="Night time charge"
                      className="w-full"
                      value={nightTimeCharge}
                      min={0}
                      onChange={(e) => setNightTimeCharge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night time from
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={nightTimeFrom}
                      onChange={(e) => setNightTimeFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Night time to
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={nightTimeTo}
                      onChange={(e) => setNightTimeTo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surcharges
                    </label>
                    <Input
                      type="number"
                      placeholder="Surcharges amount"
                      className="w-full"
                      value={surcharges}
                      min={0}
                      onChange={(e) => setSurcharges(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surcharges from
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={surchargesFrom}
                      onChange={(e) => setSurchargesFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surcharges to
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={surchargesTo}
                      onChange={(e) => setSurchargesTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Driver & System Settings */}
              <div className="border border-gray-200 rounded-lg p-6 bg-teal-50">
                <h3 className="text-lg font-semibold text-teal-700 mb-4">
                  Driver & System Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver radius
                    </label>
                    <Input
                      type="number"
                      placeholder="Radius in km"
                      className="w-full"
                      value={driverRadius}
                      min={0}
                      onChange={(e) => setDriverRadius(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver Min wallet
                    </label>
                    <Input
                      type="number"
                      placeholder="Min wallet amount"
                      className="w-full"
                      min={0}
                      value={driverMinWallet}
                      onChange={(e) => setDriverMinWallet(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min time different
                    </label>
                    <Input
                      type="number"
                      placeholder="Time in minutes"
                      className="w-full"
                      min={0}
                      value={minTripDiffTime}
                      onChange={(e) => setMinTripDiffTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST %
                    </label>
                    <Input
                      type="number"
                      placeholder="GST percentage"
                      className="w-full"
                      value={tax}
                      min={0}
                      onChange={(e) => setTax(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgent time limit (minutes)
                    </label>
                    <Input
                      type="number"
                      placeholder="Urgent time in minutes"
                      min={0}
                      className="w-full"
                      value={urgentTimeLimit}
                      onChange={(e) => setUrgentTimeLimit(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per hours
                    </label>
                    <Input
                      type="number"
                      placeholder="Per hours"
                      className="w-full"
                      min={0}
                      value={perHours}
                      onChange={(e) => setPerHours(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Booking Fee Section - Updated with Corrected Structure */}
              <div className="border border-gray-200 rounded-lg p-6 bg-teal-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-teal-700">
                    Booking Fee Configuration
                  </h3>
                  <button
                    type="button"
                    onClick={addBookingFeeRow}
                    className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Row
                  </button>
                </div>
                {bookingFeeRows.map((row, index) => (
                  <div
                    key={index}
                    className="border border-teal-200 rounded-lg p-4 mb-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-teal-700">
                        Booking Fee Row {index + 1}
                      </span>
                      {bookingFeeRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBookingFeeRow(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User Booking fees
                        </label>
                        <Select
                          value={row.bookingFeeType}
                          onChange={(e) =>
                            updateBookingFeeRow(
                              index,
                              "bookingFeeType",
                              e.target.value
                            )
                          }
                          className="w-full"
                        >
                          <Option value="Fixed">Fixed</Option>
                          <Option value="PerKm">Per KM</Option>
                          <Option value="Percentage">Percentage</Option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From/km
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={row.beeokingfeeFromKm}
                          onChange={(e) =>
                            updateBookingFeeRow(
                              index,
                              "beeokingfeeFromKm",
                              e.target.value
                            )
                          }
                          placeholder={`From km / ${index + 1}`}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To/Km
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={row.beeokingfeeToKm}
                          onChange={(e) =>
                            updateBookingFeeRow(
                              index,
                              "beeokingfeeToKm",
                              e.target.value
                            )
                          }
                          placeholder={`To km / ${index + 10}`}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={row.bookingFee}
                          onChange={(e) =>
                            updateBookingFeeRow(
                              index,
                              "bookingFee",
                              e.target.value
                            )
                          }
                          placeholder={`Amount / ${(index + 1) * 100}`}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Commission Section - Updated with Corrected Structure */}
              <div className="border border-gray-200 rounded-lg p-6 bg-indigo-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Admin Commission Configuration
                  </h3>
                  <button
                    type="button"
                    onClick={addCommissionRow}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Row
                  </button>
                </div>
                {commissionRows.map((row, index) => (
                  <div
                    key={index}
                    className="border border-indigo-200 rounded-lg p-4 mb-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-indigo-700">
                        Platform fees Driver{" "}
                      </span>
                      {commissionRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (commissionRows.length > 1) {
                              const updatedRows = commissionRows.filter(
                                (_, i) => i !== index
                              );
                              setCommissionRows(updatedRows);
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Driver Commision{" "}
                        </label>
                        <Select
                          className="w-full"
                          value={tripType}
                          onChange={(e) => setTripType(e.target.value)}
                        >
                          <Option value="">All</Option>
                          <Option value="CityRide">Fixed</Option>
                          <Option value="Rental">Percentage</Option>
                        </Select>
                      </div>

                      {tripType === "CarPool" ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Carpool Commision
                          </label>
                          <Select className="w-full" value={tripType}>
                            <Option value="">Per/trip</Option>
                            <Option value="CityRide">Per/seat</Option>
                          </Select>
                        </div>
                      ) : (
                        ""
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From/km
                        </label>
                        <Input
                          type=""
                          min={0}
                          placeholder="0"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To/km{" "}
                        </label>
                        <Input
                          type=""
                          min={0}
                          placeholder="0"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount
                        </label>
                        <Input
                          type="text"
                          placeholder="00"
                          className="w-full"
                          value={fixedPercentage}
                          onChange={(e) => setFixedPercentage(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Advance Fare Section */}
              <div className="border border-gray-200 rounded-lg p-6 bg-yellow-50">
                <h3 className="text-lg font-semibold text-yellow-700 mb-4">
                  Advance Fare Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advance fare (User){" "}
                    </label>
                    <Select
                      value={AdvanceFare.FareType}
                      onChange={(e) =>
                        setAdvanceFare((prev) => ({
                          ...prev,
                          FareType: e.target.value,
                        }))
                      }
                      className="w-full"
                    >
                      <Option value="Fixed">Fixed</Option>
                      <Option value="PerKm">Per KM</Option>
                      <Option value="Percentage">Percentage</Option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distance voice / 18 km above
                    </label>
                    <Input
                      type="text"
                      placeholder="Distance voice"
                      className="w-full"
                      value={distanceVoice}
                      onChange={(e) => setDistanceVoice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time voice / After 5 hours
                    </label>
                    <Input
                      type="text"
                      placeholder="Time voice"
                      className="w-full"
                      value={timeVoice}
                      onChange={(e) => setTimeVoice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
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
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Platform Fee Section */}
              <div className="border border-gray-200 rounded-lg p-6 bg-orange-50">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">
                  Platform Fee Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform fee Driver
                    </label>
                    <Select
                    value={platformFeeD}
                    onChange={(e)=>setPlatformFeeD(e.target.value)}
                    className="w-full">
                      <Option value="Fixed">Fixed</Option>
                      <Option value="PerKm">Per KM</Option>
                      <Option value="Percentage">Percentage</Option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <Input 
                      value={paltformFeeDriverAmount}
                      onChange={(e)=>setpaltformFeeDriverAmount(e.target.value)}
                    type="number" placeholder="00" className="w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform fee User
                    </label>
                    <Select
                    value={platformFeeU}
                    onChange={(e)=>setPlatformFeeU(e.target.value)}
                    className="w-full">
                      <Option value="Fixed">Fixed</Option>
                      <Option value="PerKm">Per KM</Option>
                      <Option value="Percentage">Percentage</Option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <Input type="number"
                    value={PlatformFeeUserAmount}
                    onChange={(e)=>setPlatformFeeUserAmount(e.target.value)}
                    placeholder="00" className="w-full" />
                  </div>
                </div>
              </div>

              {/* Trip Pickup Time Configuration */}
              <div className="border border-gray-200 rounded-lg p-6 bg-pink-50">
                <h3 className="text-lg font-semibold text-pink-700 mb-4">
                  Trip Pickup Time Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup time
                    </label>
                    <Select
                      value={DriverPickupTime}
                      onChange={(e) => setDriverPickupTime(e.target.value)}
                      className="w-full"
                    >
                      <Option value="all-time">All time</Option>
                      <Option value="fixed-time">Fixed time</Option>
                      <Option value="female-time">Female time</Option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Time
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={FromToTime?.fromTime}
                      onChange={(e) =>
                        setFromToTime((prev) => ({
                          ...prev,
                          fromTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Time
                    </label>
                    <Input
                      type="time"
                      className="w-full"
                      value={FromToTime?.toTime}
                      onChange={(e) =>
                        setFromToTime((prev) => ({
                          ...prev,
                          toTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      24 hours
                    </label>
                    <Input
                      type="text"
                      placeholder="24 hours"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Fare Period & Package Section - Updated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 bg-cyan-50">
                  <h3 className="text-lg font-semibold text-cyan-700 mb-4">
                    Fare Period
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fare start date & time
                      </label>
                      <Input
                        type="datetime-local"
                        className="w-full "
                        value={FareDate?.startDate}
                        onChange={(e) =>
                          setFareDate((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fare end date & time
                      </label>
                      <Input
                        type="datetime-local"
                        className="w-full"
                        value={FareDate?.endDate}
                        onChange={(e) =>
                          setFareDate((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-emerald-50">
                  <h3 className="text-lg font-semibold text-emerald-700 mb-4">
                    Package & Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Active & De-active
                      </label>
                      <Select
                        value={FareStatus}
                        onChange={(e) => setFareStatus(e.target.value)}
                        className="w-full"
                      >
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">De-active</Option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Package name
                      </label>
                      <Select
                        value={selectedPackage}
                        onChange={handlePackageChange}
                        className="w-full"
                      >
                        <Option value="">Select Package</Option>
                        {packageOptions.map((pkg) => (
                          <Option key={pkg.value} value={pkg.value}>
                            {pkg.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Form - Shows when any package is selected */}
              {selectedPackage && (
                <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-700">
                      {selectedPackage === "new"
                        ? "Create New Package"
                        : `Update ${
                            packageOptions.find(
                              (p) => p.value === selectedPackage
                            )?.label
                          }`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPackage("");
                        setPackageDetails({
                          packageName: "",
                          description: "",
                          validity: "",
                          features: "",
                          price: "",
                          discountPercentage: "",
                          maxTrips: "",
                          packageType: "Basic",
                        });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Package Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter package name"
                        className="w-full"
                        value={packageDetails.packageName}
                        onChange={(e) =>
                          handlePackageDetailsChange(
                            "packageName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Package Type
                      </label>
                      <Select
                        value={packageDetails.packageType}
                        onChange={(e) =>
                          handlePackageDetailsChange(
                            "packageType",
                            e.target.value
                          )
                        }
                        className="w-full"
                      >
                        <Option value="Basic">Basic</Option>
                        <Option value="Premium">Premium</Option>
                        <Option value="Enterprise">Enterprise</Option>
                        <Option value="Custom">Custom</Option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <Input
                        type="number"
                        placeholder="Package price"
                        className="w-full"
                        value={packageDetails.price}
                        onChange={(e) =>
                          handlePackageDetailsChange("price", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Percentage
                      </label>
                      <Input
                        type="number"
                        placeholder="Discount %"
                        className="w-full"
                        value={packageDetails.discountPercentage}
                        onChange={(e) =>
                          handlePackageDetailsChange(
                            "discountPercentage",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validity (Days)
                      </label>
                      <Input
                        type="number"
                        placeholder="Validity in days"
                        className="w-full"
                        value={packageDetails.validity}
                        onChange={(e) =>
                          handlePackageDetailsChange("validity", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Trips
                      </label>
                      <Input
                        type="number"
                        placeholder="Maximum trips allowed"
                        className="w-full"
                        value={packageDetails.maxTrips}
                        onChange={(e) =>
                          handlePackageDetailsChange("maxTrips", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Package description..."
                        value={packageDetails.description}
                        onChange={(e) =>
                          handlePackageDetailsChange(
                            "description",
                            e.target.value
                          )
                        }
                      ></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Features
                      </label>
                      <textarea
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Package features (separate with commas)..."
                        value={packageDetails.features}
                        onChange={(e) =>
                          handlePackageDetailsChange("features", e.target.value)
                        }
                      ></textarea>
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-4">
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          // Handle package update/creation
                          toast.success(
                            `Package ${
                              selectedPackage === "new" ? "created" : "updated"
                            } successfully!`
                          );
                        }}
                      >
                        {selectedPackage === "new"
                          ? "Create Package"
                          : "Update Package"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* AC Configuration Section */}
              <div className="border border-gray-200 rounded-lg p-6 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">
                  Advance Admin Commission
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {" "}
                      Advance Driver Commission
                    </label>
                    <Select className="w-full">
                      <Option value="">All</Option>
                      <Option value="CityRide">Fixed</Option>
                      <Option value="Rental">Percentage</Option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <Input type="text" placeholder="00" className="w-full" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      wallet
                    </label>
                    <Select className="w-full">
                      <Option value="CityRide">Fixed</Option>
                      <Option value="Rental">Percentage</Option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <Input type="number" placeholder="00" className="w-full" />
                  </div>
                </div>

                {/* User's Admin Commission Section */}
                <h5 className="text-lg font-semibold text-slate-700 mb-4 mt-8">
                  Advance fare (Users)
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advance User commission
                    </label>
                    <Select
                      className="w-full"
                      value={acFixed}
                      onChange={(e) => setAcFixed(e.target.value)}
                    >
                      <Option value="">All</Option>
                      <Option value="CityRide">Fixed</Option>
                      <Option value="Rental">Percentage</Option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <Input
                      type="text"
                      placeholder="00"
                      className="w-full"
                      value={fixedPercentage}
                      onChange={(e) => setFixedPercentage(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      wallet
                    </label>
                    <Select
                    value={addWalletAcD}
                    onChange={(e)=>setAddWalletAcD(e.target.value)}
                    className="w-full">
                      <Option value="CityRide">Fixed</Option>
                      <Option value="Rental">Percentage</Option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <Input
                      type="number"
                      placeholder="Amount"
                      className="w-full"
                      value={acAmount}
                      onChange={(e) => setAcAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Conditions and Fare Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Term & Condition
                  </h3>
                  <textarea
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Enter terms and conditions..."
                    value={termsConditions}
                    onChange={(e) => setTermsConditions(e.target.value)}
                  ></textarea>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-red-50">
                  <h3 className="text-lg font-semibold text-red-700 mb-4">
                    Fare rules
                  </h3>

                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter fare rules..."
                    value={fareRules}
                    onChange={(e) => setFareRules(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-12 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg"
                >
                  Save Per/KM Fare Configuration
                </button>
              </div>
            </form>
          </div>
        </div>

        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default PerKmFareManagementScreen;
