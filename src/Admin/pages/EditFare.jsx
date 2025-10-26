import React, { useEffect, useState } from "react";
import { Plus, X, Edit, Trash2, Check } from "lucide-react";
import Sidebar from "../Component/Sidebar";
import Input from "../Component/Input";
import { Select, Option } from "../Component/Select";
import {
  useAddTripDetailInAdminMutation,
  useGetAllVehicleCategoryQuery,
  useGetPackagesQuery,
  useGetStateAndCitiesQuery,
  useGetTripDetailsByIdFromAdminModelQuery,
  useEditTripDetailMutation,
  useGetCategoryAllVehicleQuery,
} from "../Redux/Api";
import toast, { Toaster } from "react-hot-toast";
import MultiSelectSubCategory from "../Component/MultipleSelectSubCategory";
import { useParams, useNavigate } from "react-router-dom";

const EditFareManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data, error } = useGetStateAndCitiesQuery();
  
  const {
    data: categoryData,
    isError,
    refetch: refetchCategory,
  } = useGetAllVehicleCategoryQuery();

  const { data: packages, isLoading } = useGetPackagesQuery();

  // Fetch trip data for editing
  const { data: editTripData, isLoading: isLoadingTrip } = 
    useGetTripDetailsByIdFromAdminModelQuery(id, {
      skip: !isEditMode,
    });

  const [UpdateTripApi] = useEditTripDetailMutation();

  // Basic Information States
  const [selectedRentalPkg, setselectedRentalPkg] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subscategories, setSubscategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [tripType, setTripType] = useState("");
  const [tripFor, settripFor] = useState("");

  // Per KM Fare States
  const [baseFare, setBaseFare] = useState("");
  const [Extratobepaid, setExtratobepaid] = useState("");
  const [fareInclude, setfareInclude] = useState("");
  const [baseFareForKm, setBaseFareForKm] = useState("");
  const [baseFareForTime, setBaseFareForTime] = useState("");
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState("");
  const [extraPerKmCharges, setExtraPerKmCharges] = useState("");
  const [extraTimeCharges, setExtraTimeCharges] = useState("");
  const [waitingTimeCharges, setWaitingTimeCharges] = useState("");
  const [chargeType, setChargeType] = useState("perHour");
  const [nightTimeCharge, setNightTimeCharge] = useState("");
  const [nightTimeFrom, setNightTimeFrom] = useState("");
  const [nightTimeTo, setNightTimeTo] = useState("");
  const [surcharges, setSurcharges] = useState("");
  const [surchargesFrom, setSurchargesFrom] = useState("");
  const [surchargesTo, setSurchargesTo] = useState("");

  // Fixed Fare States
  const [recommendedFare, setRecommendedFare] = useState("");
  const [minFare, setMinFare] = useState("");
  const [maxFare, setMaxFare] = useState("");

  // Common States
  const [tax, setTax] = useState("");
  const [driverRadius, setDriverRadius] = useState("");
  const [driverMinWallet, setDriverMinWallet] = useState("");
  const [minTripDiffTime, setMinTripDiffTime] = useState("");
  const [urgentTimeLimit, setUrgentTimeLimit] = useState("");
  const [perHours, setPerHours] = useState("");

  // Platform Fee States
  const [platformFeeDriverType, setPlatformFeeDriverType] = useState("Fixed");
  const [platformFeeDriverAmount, setPlatformFeeDriverAmount] = useState("");
  const [platformFeeUserType, setPlatformFeeUserType] = useState("Fixed");
  const [platformFeeUserAmount, setPlatformFeeUserAmount] = useState("");

  // Advance Commission States
  const [advanceDriverCommissionType, setAdvanceDriverCommissionType] = useState("Fixed");
  const [advanceDriverCommissionAmount, setAdvanceDriverCommissionAmount] = useState("");
  const [advanceDriverCommissionWalletType, setAdvanceDriverCommissionWalletType] = useState("Fixed");
  const [advanceDriverCommissionWalletAmount, setAdvanceDriverCommissionWalletAmount] = useState("");
  const [advanceUserCommissionType, setAdvanceUserCommissionType] = useState("Fixed");
  const [advanceUserCommissionAmount, setAdvanceUserCommissionAmount] = useState("");
  const [advanceUserCommissionWalletType, setAdvanceUserCommissionWalletType] = useState("Fixed");
  const [advanceUserCommissionWalletAmount, setAdvanceUserCommissionWalletAmount] = useState("");

  const [bookingFeeRows, setBookingFeeRows] = useState([
    {
      bookingFeeType: "PerKm",
      beeokingfeeFromKm: 0,
      beeokingfeeToKm: 0,
      bookingFee: 0,
    },
  ]);

  const [commissionRows, setCommissionRows] = useState([
    { fromKm: "", toKm: "", amount: "", driverComissionType: "Fixed" },
  ]);

  const [distanceVoice, setDistanceVoice] = useState("");
  const [timeVoice, setTimeVoice] = useState("");
  const [platformFeeU, setPlatformFeeU] = useState("");
  const [platformFeeD, setPlatformFeeD] = useState("");
  const [platformFeePercentage, setPlatformFeePercentage] = useState("");
  const [acFixed, setAcFixed] = useState("");
  const [advanceAcD, setAdvanceAcD] = useState("");
  const [fixedPercentage, setFixedPercentage] = useState("");
  const [addWalletAcD, setAddWalletAcD] = useState("");
  const [acAmount, setAcAmount] = useState("");
  const [acAdminCommission, setAcAdminCommission] = useState("");
  const [termsConditions, setTermsConditions] = useState("");
  const [fareRules, setFareRules] = useState("");

  const [AdvanceFare, setAdvanceFare] = useState({
    FareType: "Fixed",
    price: 0,
  });

  const [FareStatus, setFareStatus] = useState("Active");
  const [DriverPickupTime, setDriverPickupTime] = useState("");

  const [selectedPackage, setSelectedPackage] = useState("");
  const [packageName, setPackageName] = useState("");
  const [showPackageForm, setShowPackageForm] = useState(false);

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

  console.log(editTripData, "editTripData loaded");

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editTripData?.trip) {
      const trip = editTripData.trip;
      
      settripFor(trip.tripFor || '');
      setTripType(trip.tripType || '');
      setSelectedCategory(trip.vehicleCategory || '');
      setSelectedSubCategories(trip.vehicleSubCategory || []);
      
      // Check if it's Per KM fare or Fixed fare
      if (trip.perKmFare) {
        // Per KM Fare fields
        setBaseFare(trip.baseFare || '');
        setExtratobepaid(trip.Extratobepaid || '');
        setfareInclude(trip.fareInclude || '');
        setBaseFareForKm(trip.baseFareForKm || '');
        setBaseFareForTime(trip.baseFareForTime || '');
        setWaitingTimeMinutes(trip.waitingTimeMinutes || '');
        setExtraPerKmCharges(trip.extraPerKmCharges || '');
        setExtraTimeCharges(trip.extraTimeCharges || '');
        setWaitingTimeCharges(trip.waitingTimeCharges || '');
        
        setNightTimeCharge(trip.nightTimeCharge || '');
        setNightTimeFrom(trip.nightTimeFrom || '');
        setNightTimeTo(trip.nightTimeTo || '');
        
        setSurcharges(trip.surcharges || '');
        setSurchargesFrom(trip.surchargesFrom || '');
        setSurchargesTo(trip.surchargesTo || '');
      } else {
        // Fixed Fare fields
        setRecommendedFare(trip.RecommndedFareKm || '');
        setMaxFare(trip.maxFareKm || '');
        setMinFare(trip.minFareKm || '');
      }
      
      // Common fields
      setTax(trip.GsTtaxinPercentage || '');
      setDriverRadius(trip.DriverRadius || '');
      setDriverMinWallet(trip.DriverMinWalletAmount || '');
      setMinTripDiffTime(trip.minTripDifferenceTime || '');
      setUrgentTimeLimit(trip.urgentTimeValue || '');
      setPerHours(trip.Perhours || '');
      
      // Booking Fee Rows
      if (trip.bookingFeeConfiguration?.length > 0) {
        setBookingFeeRows(trip.bookingFeeConfiguration.map(row => ({
          bookingFeeType: row.bookingFeeType || 'PerKm',
          beeokingfeeFromKm: row.beeokingfeeFromKm || 0,
          beeokingfeeToKm: row.beeokingfeeToKm || 0,
          bookingFee: row.bookingFee || 0,
        })));
      } else if (trip.bookingFeeRows?.length > 0) {
        setBookingFeeRows(trip.bookingFeeRows);
      }
      
      // Commission Rows
      if (trip.AdminComissionConfiguration?.length > 0) {
        setCommissionRows(trip.AdminComissionConfiguration.map(row => ({
          driverComissionType: row.driverComissionType || 'Fixed',
          fromKm: row.driverComissionFromkm || '',
          toKm: row.drivercomissionTokm || '',
          amount: row.driverComissionValue || '',
        })));
      } else if (trip.commissionRows?.length > 0) {
        setCommissionRows(trip.commissionRows);
      }
      
      setAdvanceFare({
        FareType: trip.advanceFareType || 'Fixed',
        price: trip.advanceFee || 0,
      });
      
      setDistanceVoice(trip.distanceVoice || trip.advanceFareDistance || '');
      setTimeVoice(trip.timeVoice || trip.advanceTimeAfter5hours || '');
      
      // Platform Fees
      setPlatformFeeDriverType(trip.platformFeeDriver || 'Fixed');
      setPlatformFeeDriverAmount(trip.paltformFeeDriverAmount || '');
      setPlatformFeeUserType(trip.PlatformFeeUser || 'Fixed');
      setPlatformFeeUserAmount(trip.PlatformFeeUserAmount || '');
      
      // Advance Commissions
      setAdvanceDriverCommissionType(trip.AdvanceDriverComission || 'Fixed');
      setAdvanceDriverCommissionAmount(trip.AdvanceDriverComissionAmount || '');
      setAdvanceDriverCommissionWalletType(trip.AdvancedrivercomissionWallet || 'Fixed');
      setAdvanceDriverCommissionWalletAmount(trip.AdvancedrivercomissionWalletAmount || '');
      setAdvanceUserCommissionType(trip.AdvanceUserComission || 'Fixed');
      setAdvanceUserCommissionAmount(trip.AdvanceUserComissionAmount || '');
      setAdvanceUserCommissionWalletType(trip.AdvanceUsercomissionWallet || 'Fixed');
      setAdvanceUserCommissionWalletAmount(trip.AdvancedUsercomissionWalletAmount || '');
      
      if (trip.FareStartDate) {
        const startDate = new Date(trip.FareStartDate).toISOString().slice(0, 16);
        setFareDate(prev => ({ ...prev, startDate }));
      }
      if (trip.FareEndDate) {
        const endDate = new Date(trip.FareEndDate).toISOString().slice(0, 16);
        setFareDate(prev => ({ ...prev, endDate }));
      }
      
      setFareStatus(trip.FareStatus || 'Active');
      setDriverPickupTime(trip.DriverPickupTime || '');
      
      if (trip.FromDriverPickupTime) {
        setFromToTime(prev => ({ ...prev, fromTime: trip.FromDriverPickupTime }));
      }
      if (trip.ToDriverPickupTime) {
        setFromToTime(prev => ({ ...prev, toTime: trip.ToDriverPickupTime }));
      }
      
      setSelectedPackage(trip.selectedPackage || trip.package || '');
      setPackageName(trip.packageName || '');
      
      if (trip.packageDetails) {
        setPackageDetails(trip.packageDetails);
      }
      
      setTermsConditions(trip.termsConditions || trip.TermsCond || '');
      setFareRules(trip.fareRules || trip.FareRules || '');
      
      if (trip.settings) {
        setSettings(trip.settings);
      }
      
      setselectedRentalPkg(trip.Rentalpkg || null);
    }
  }, [isEditMode, editTripData]);

  const toggleSetting = (settingKey) => {
    setSettings((prev) => ({
      ...prev,
      [settingKey]: !prev[settingKey],
    }));
  };

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

  const handlePackageChange = (e) => {
    const packageValue = e.target.value;
    setSelectedPackage(packageValue);

    if (packageValue && packageValue !== "new") {
      const selectedPkg = packageOptions.find(
        (pkg) => pkg.value === packageValue
      );
      if (selectedPkg) {
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
      { fromKm: "", toKm: "", amount: "", driverComissionType: "Fixed" },
    ]);
  };

  const updateCommissionRow = (index, field, value) => {
    const updatedRows = commissionRows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setCommissionRows(updatedRows);
  };

  const getPlaceholder = () => {
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
      type="button"
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
      setSubscategories(categoriesDataa);
    }
  }, [categoriesDataa, shouldFetchCategories]);

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    setSelectedCategory(categoryName);
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
    
    const trip = editTripData?.trip;
    const isPerKmFare = trip?.perKmFare;

    // Validation for Fixed Fare
    if (!isPerKmFare) {
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
    }

    let postdata;

    if (isPerKmFare) {
      // Per KM Fare Update
      postdata = {
        tripId: trip._id,
        Extratobepaid,
        fareInclude,
        tripFor: tripFor,
        perKmFare: true,
        vehicleCategory: selectedCategory,
        vehicleSubCategory: selectedSubCategories,
        tripType: tripType,
        baseFare: baseFare,
        baseFareForKm: parseInt(baseFareForKm) || 0,
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
        selectedPackage: selectedPackage,
        packageName: packageName,
        packageDetails: showPackageForm ? packageDetails : null,
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
      };
    } else {
      // Fixed Fare Update
      const bookingFeeConfiguration = bookingFeeRows.map((row) => ({
        bookingFeeType: row.bookingFeeType,
        beeokingfeeFromKm: parseInt(row.beeokingfeeFromKm) || 0,
        beeokingfeeToKm: parseInt(row.beeokingfeeToKm) || 0,
        bookingFee: parseInt(row.bookingFee) || 0,
      }));

      const AdminComissionConfiguration = commissionRows.map((row) => ({
        driverComissionType: row.driverComissionType || "Fixed",
        driverComissionFromkm: parseInt(row.fromKm) || 0,
        drivercomissionTokm: parseInt(row.toKm) || 0,
        driverComissionValue: parseInt(row.amount) || 0,
      }));

      postdata = {
        tripId: trip._id,
        tripFor: tripFor,
        perKmFare: false,
        tripType: tripType,
        vehicleCategory: selectedCategory,
        vehicleSubCategory: selectedSubCategories.join(","),
        RecommndedFareKm: parseInt(recommendedFare) || 0,
        minFareKm: parseInt(minFare) || 0,
        maxFareKm: parseInt(maxFare) || 0,
        GsTtaxinPercentage: parseInt(tax) || 0,
        bookingFeeConfiguration: bookingFeeConfiguration,
        AdminComissionConfiguration: AdminComissionConfiguration,
        advanceFareType: AdvanceFare?.FareType || "Fixed",
        advanceFee: parseInt(AdvanceFare?.price) || 0,
        DriverRadius: parseInt(driverRadius) || 0,
        DriverMinWalletAmount: parseInt(driverMinWallet) || 0,
        urgentTimeValue: parseInt(urgentTimeLimit) || 0,
        minTripDifferenceTime: parseInt(minTripDiffTime) || 0,
        Perhours: parseInt(perHours) || 0,
        platformFeeDriver: platformFeeDriverType,
        paltformFeeDriverAmount: parseInt(platformFeeDriverAmount) || 0,
        PlatformFeeUser: platformFeeUserType,
        PlatformFeeUserAmount: parseInt(platformFeeUserAmount) || 0,
        FareStartDate: FareDate?.startDate
          ? new Date(FareDate.startDate).toISOString()
          : null,
        FareEndDate: FareDate?.endDate
          ? new Date(FareDate.endDate).toISOString()
          : null,
        FareStatus: FareStatus,
        DriverPickupTime: DriverPickupTime,
        FromDriverPickupTime: FromToTime?.fromTime,
        ToDriverPickupTime: FromToTime?.toTime,
        AdvanceDriverComission: advanceDriverCommissionType,
        AdvanceDriverComissionAmount:
          parseInt(advanceDriverCommissionAmount) || 0,
        AdvancedrivercomissionWallet: advanceDriverCommissionWalletType,
        AdvancedrivercomissionWalletAmount:
          parseInt(advanceDriverCommissionWalletAmount) || 0,
        AdvanceUserComission: advanceUserCommissionType,
        AdvanceUserComissionAmount: parseInt(advanceUserCommissionAmount) || 0,
        AdvanceUsercomissionWallet: advanceUserCommissionWalletType,
        AdvancedUsercomissionWalletAmount:
          parseInt(advanceUserCommissionWalletAmount) || 0,
        TermsCond: termsConditions,
        FareRules: fareRules,
        advanceFareDistance: parseInt(distanceVoice) || 0,
        advanceTimeAfter5hours: timeVoice,
        package: selectedPackage,
        Rentalpkg: selectedRentalPkg,
        settings: settings,
      };
    }

    try {
      const { data: responseData, error: responseError } = await UpdateTripApi(postdata);
      
      if (responseData) {
        toast.success("Fare updated successfully!");
        setTimeout(() => navigate(-1), 1500);
      } else {
        toast.error(responseError?.message || "Failed to update fare!");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Error occurred while updating!");
    }
  };

  if (isLoadingTrip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-green-500 text-lg">Loading fare details...</p>
      </div>
    );
  }

  const isPerKmFare = editTripData?.trip?.perKmFare;

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
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold">
              Edit {isPerKmFare ? 'Per/KM' : 'Fixed'} Fare Configuration
            </h1>
          </div>

          <div className="mb-2 mt-4">
            <div className="flex flex-wrap gap-4">
              {tripType !== "CarPool" && (
                <ToggleButton
                  label="Hide Seat View"
                  isSelected={settings.hideSeatView}
                  onClick={() => toggleSetting("hideSeatView")}
                />
              )}
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

                  {tripType === "Rental" && (
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

              {/* Conditional Rendering Based on Fare Type */}
              {isPerKmFare ? (
                <>
                  {/* Per KM Fare Configuration */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
                    <h3 className="text-lg font-semibold text-green-700 mb-4">
                      Fare Configuration
                    </h3>

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
                          onChange={(e) => setChargeType(e.target.value)}
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
                  </div>

                  {/* Admin Lines */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
                    <h3 className="text-lg font-semibold text-green-700 mb-4">
                      Admin Lines
                    </h3>

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
                  </div>

                  {/* Night Configuration */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-purple-50">
                    <h3 className="text-lg font-semibold text-green-700 mb-4">
                      Night Configuration
                    </h3>

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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                </>
              ) : (
                <>
                  {/* Fixed Fare Configuration */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
                    <h3 className="text-lg font-semibold text-green-700 mb-4">
                      Fare Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum fare per KM
                        </label>
                        <Input
                          type="number"
                          placeholder="Min fare/KM"
                          className="w-full"
                          value={minFare}
                          min={0}
                          onChange={(e) => setMinFare(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum fare per KM
                        </label>
                        <Input
                          type="number"
                          placeholder="Max fare/KM"
                          className="w-full"
                          value={maxFare}
                          min={0}
                          onChange={(e) => setMaxFare(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recommended fare per KM
                        </label>
                        <Input
                          type="number"
                          placeholder="Recommended fare/KM"
                          className="w-full"
                          value={recommendedFare}
                          min={0}
                          onChange={(e) => setRecommendedFare(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
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

              {/* Booking Fee Configuration */}
              <div className="border border-gray-200 rounded-lg p-6 bg-indigo-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Booking Fee Configuration
                  </h3>
                  <button
                    type="button"
                    onClick={addBookingFeeRow}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Row
                  </button>
                </div>
                {bookingFeeRows.map((row, index) => (
                  <div
                    key={index}
                    className="border border-indigo-200 rounded-lg p-4 mb-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-indigo-700">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Booking Fee Type
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
                          From KM
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
                          placeholder="From KM"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To KM
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
                          placeholder="To KM"
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
                          placeholder="Amount"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Commission Configuration */}
              <div className="border border-gray-200 rounded-lg p-6 bg-orange-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-orange-700">
                    Admin Commission Configuration
                  </h3>
                  <button
                    type="button"
                    onClick={addCommissionRow}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Row
                  </button>
                </div>
                {commissionRows.map((row, index) => (
                  <div
                    key={index}
                    className="border border-orange-200 rounded-lg p-4 mb-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-orange-700">
                        Commission Row {index + 1}
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Commission Type
                        </label>
                        <Select
                          className="w-full"
                          value={row.driverComissionType || "Fixed"}
                          onChange={(e) =>
                            updateCommissionRow(
                              index,
                              "driverComissionType",
                              e.target.value
                            )
                          }
                        >
                          <Option value="Fixed">Fixed</Option>
                          <Option value="Percentage">Percentage</Option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From KM
                        </label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="From KM"
                          className="w-full"
                          value={row.fromKm}
                          onChange={(e) =>
                            updateCommissionRow(index, "fromKm", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To KM
                        </label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="To KM"
                          className="w-full"
                          value={row.toKm}
                          onChange={(e) =>
                            updateCommissionRow(index, "toKm", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount
                        </label>
                        <Input
                          type="number"
                          placeholder="Amount"
                          className="w-full"
                          value={row.amount}
                          onChange={(e) =>
                            updateCommissionRow(index, "amount", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Advance Fare Configuration */}
              <div className="border border-gray-200 rounded-lg p-6 bg-yellow-50">
                <h3 className="text-lg font-semibold text-yellow-700 mb-4">
                  Advance Fare Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advance Fare Type
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
                      Distance Voice
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
                      Time Voice
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
                <div className="grid grid-cols-1 gap-4 mt-4">
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

              {/* Platform Fee Configuration */}
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

              {/* Booking Fee Configuration */}
              <div className="border border-gray-200 rounded-lg p-6 bg-indigo-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Booking Fee Configuration
                  </h3>
                  <button
                    type="button"
                    onClick={addBookingFeeRow}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Row
                  </button>
                </div>
                {bookingFeeRows.map((row, index) => (
                  <div
                    key={index}
                    className="border border-indigo-200 rounded-lg p-4 mb-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-indigo-700">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Booking Fee Type
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
                          From KM
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
                          placeholder="From KM"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To KM
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
                          placeholder="To KM"
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
                          placeholder="Amount"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Commission Configuration */}
              <div className="border border-gray-200 rounded-lg p-6 bg-orange-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-orange-700">
                    Admin Commission Configuration
                  </h3>
                  <button
                    type="button"
                    onClick={addCommissionRow}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Row
                  </button>
                </div>
                {commissionRows.map((row, index) => (
                  <div
                    key={index}
                    className="border border-orange-200 rounded-lg p-4 mb-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-orange-700">
                        Commission Row {index + 1}
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Commission Type
                        </label>
                        <Select
                          className="w-full"
                          value={row.driverComissionType || "Fixed"}
                          onChange={(e) =>
                            updateCommissionRow(
                              index,
                              "driverComissionType",
                              e.target.value
                            )
                          }
                        >
                          <Option value="Fixed">Fixed</Option>
                          <Option value="Percentage">Percentage</Option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From KM
                        </label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="From KM"
                          className="w-full"
                          value={row.fromKm}
                          onChange={(e) =>
                            updateCommissionRow(index, "fromKm", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To KM
                        </label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="To KM"
                          className="w-full"
                          value={row.toKm}
                          onChange={(e) =>
                            updateCommissionRow(index, "toKm", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount
                        </label>
                        <Input
                          type="number"
                          placeholder="Amount"
                          className="w-full"
                          value={row.amount}
                          onChange={(e) =>
                            updateCommissionRow(index, "amount", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Advance Fare Configuration */}
              <div className="border border-gray-200 rounded-lg p-6 bg-yellow-50">
                <h3 className="text-lg font-semibold text-yellow-700 mb-4">
                  Advance Fare Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advance Fare Type
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
                      Distance Voice
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
                      Time Voice
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
                <div className="grid grid-cols-1 gap-4 mt-4">
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

              {/* Platform Fee Configuration */}
              <div className="border border-gray-200 rounded-lg p-6 bg-pink-50">
                <h3 className="text-lg font-semibold text-pink-700 mb-4">
                  Platform Fee Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Fee Driver Type
                    </label>
                    <Select
                      className="w-full"
                      value={platformFeeDriverType}
                      onChange={(e) => setPlatformFeeDriverType(e.target.value)}
                    >
                      <Option value="Fixed">Fixed</Option>
                      <Option value="PerKm">Per KM</Option>
                      <Option value="Percentage">Percentage</Option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driver Amount
                    </label>
                    <Input
                      type="number"
                      placeholder="Driver amount"
                      className="w-full"
                      value={platformFeeDriverAmount}
                      onChange={(e) => setPlatformFeeDriverAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Fee User Type
                    </label>
                    <Select
                      className="w-full"
                      value={platformFeeUserType}
                      onChange={(e) => setPlatformFeeUserType(e.target.value)}
                    >
                      <Option value="Fixed">Fixed</Option>
                      <Option value="PerKm">Per KM</Option>
                      <Option value="Percentage">Percentage</Option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Amount
                    </label>
                    <Input
                      type="number"
                      placeholder="User amount"
                      className="w-full"
                      value={platformFeeUserAmount}
                      onChange={(e) => setPlatformFeeUserAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Trip Pickup Time Configuration */}
              <div className="border border-gray-200 rounded-lg p-6 bg-cyan-50">
                <h3 className="text-lg font-semibold text-cyan-700 mb-4">
                  Trip Pickup Time Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Time
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

              {/* Fare Period & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 bg-emerald-50">
                  <h3 className="text-lg font-semibold text-emerald-700 mb-4">
                    Fare Period
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fare Start Date & Time
                      </label>
                      <Input
                        type="datetime-local"
                        className="w-full"
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
                        Fare End Date & Time
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

                <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4">
                    Package & Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
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
                        Package Name
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

              {/* Package Details Form */}
              {selectedPackage && (
                <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-700">
                      {selectedPackage === "new"
                        ? "Create New Package"
                        : `Update ${
                            packageOptions.find((p) => p.value === selectedPackage)
                              ?.label
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
                          handlePackageDetailsChange("packageName", e.target.value)
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
                          handlePackageDetailsChange("packageType", e.target.value)
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
                          handlePackageDetailsChange("description", e.target.value)
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
                        placeholder="Package features..."
                        value={packageDetails.features}
                        onChange={(e) =>
                          handlePackageDetailsChange("features", e.target.value)
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* Advance Admin Commission */}
              <div className="border border-gray-200 rounded-lg p-6 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">
                  Advance Admin Commission
                </h3>
                <h5 className="text-md font-semibold text-slate-600 mb-3">
                  Driver Commission
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commission Type
                    </label>
                    <Select
                      className="w-full"
                      value={advanceDriverCommissionType}
                      onChange={(e) => setAdvanceDriverCommissionType(e.target.value)}
                    >
                      <Option value="Fixed">Fixed</Option>
                      <Option value="Percentage">Percentage</Option>
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
                      value={advanceDriverCommissionAmount}
                      onChange={(e) =>
                        setAdvanceDriverCommissionAmount(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet Type
                    </label>
                    <Select
                      className="w-full"
                      value={advanceDriverCommissionWalletType}
                      onChange={(e) =>
                        setAdvanceDriverCommissionWalletType(e.target.value)
                      }
                    >
                      <Option value="Fixed">Fixed</Option>
                      <Option value="Percentage">Percentage</Option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet Amount
                    </label>
                    <Input
                      type="number"
                      placeholder="Wallet amount"
                      className="w-full"
                      value={advanceDriverCommissionWalletAmount}
                      onChange={(e) =>
                        setAdvanceDriverCommissionWalletAmount(e.target.value)
                      }
                    />
                  </div>
                </div>

                <h5 className="text-md font-semibold text-slate-600 mb-3 mt-6">
                  User Commission
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commission Type
                    </label>
                    <Select
                      className="w-full"
                      value={advanceUserCommissionType}
                      onChange={(e) => setAdvanceUserCommissionType(e.target.value)}
                    >
                      <Option value="Fixed">Fixed</Option>
                      <Option value="Percentage">Percentage</Option>
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
                      value={advanceUserCommissionAmount}
                      onChange={(e) => setAdvanceUserCommissionAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet Type
                    </label>
                    <Select
                      className="w-full"
                      value={advanceUserCommissionWalletType}
                      onChange={(e) =>
                        setAdvanceUserCommissionWalletType(e.target.value)
                      }
                    >
                      <Option value="Fixed">Fixed</Option>
                      <Option value="Percentage">Percentage</Option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet Amount
                    </label>
                    <Input
                      type="number"
                      placeholder="Wallet amount"
                      className="w-full"
                      value={advanceUserCommissionWalletAmount}
                      onChange={(e) =>
                        setAdvanceUserCommissionWalletAmount(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Conditions and Fare Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Terms & Conditions
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
                    Fare Rules
                  </h3>
                  <textarea
                    rows="6"
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
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
                >
                  Update Fare Configuration
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

export default EditFareManagement;