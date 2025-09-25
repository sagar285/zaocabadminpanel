import React, { useEffect, useState } from "react";
import { Plus, X, Edit, Trash2, Check } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import Input from "../Component/Input";
import { Select, Option } from "../Component/Select";
import {
  useAddTripDetailInAdminMutation,
  useGetAllVehicleCategoryQuery,
  useGetCategoryAllVehicleQuery,
  useGetPackagesQuery,
  useGetStateAndCitiesQuery,
  useGetTripDetailsByIdFromAdminModelQuery,
  useEditTripDetailMutation
} from "../Redux/Api";
import toast, { Toaster } from "react-hot-toast";
import MultiSelectSubCategory from "../Component/MultipleSelectSubCategory";

const FareManagementScreen = () => {
  // Get ID from URL params
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [perKmFare, setPerKmFare] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCarpool, setIsCarpool] = useState(true);
  
  const { data, error } = useGetStateAndCitiesQuery();
  const { data: categoryData, isError, refetch: refetchCategory } = useGetAllVehicleCategoryQuery();
  const { data: packages, isLoading } = useGetPackagesQuery();
  
  // Fetch trip data for editing
  const { data: editTripData, isLoading: isLoadingTrip } = useGetTripDetailsByIdFromAdminModelQuery(id, {
    skip: !isEditMode,
  });

  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRentalPkg, setselectedRentalPkg] = useState(null);
  const [subscategories, setSubscategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [tripType, setTripType] = useState("");
  const [recommendedFare, setRecommendedFare] = useState("");
  const [minFare, setMinFare] = useState("");
  const [maxFare, setMaxFare] = useState("");
  const [tax, setTax] = useState("");
  const [driverRadius, setDriverRadius] = useState("");
  const [driverMinWallet, setDriverMinWallet] = useState("");
  const [minTripDiffTime, setMinTripDiffTime] = useState("");
  const [urgentTimeLimit, setUrgentTimeLimit] = useState("");
  const [perHours, setPerHours] = useState("");

  const [platformFeeDriverType, setPlatformFeeDriverType] = useState("Fixed");
  const [platformFeeDriverAmount, setPlatformFeeDriverAmount] = useState("");
  const [platformFeeUserType, setPlatformFeeUserType] = useState("Fixed");
  const [platformFeeUserAmount, setPlatformFeeUserAmount] = useState("");
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

  const [FareDate, setFareDate] = useState({
    startDate: "",
    endDate: "",
  });

  const [FromToTime, setFromToTime] = useState({
    fromTime: "",
    toTime: "",
  });

  const [AddTripApiInAdmin] = useAddTripDetailInAdminMutation();
  const [UpdateTripApi] = useEditTripDetailMutation();

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

  const [commissionRows, setCommissionRows] = useState([
    { fromKm: "", toKm: "", amount: "", driverComissionType: "Fixed" },
  ]);
  
  const [distanceVoice, setDistanceVoice] = useState("");
  const [timeVoice, setTimeVoice] = useState("");
  const [platformFeeU, setPlatformFeeU] = useState("");
  const [platformFeeD, setPlatformFeeD] = useState("");
  const [platformFeePercentage, setPlatformFeePercentage] = useState("");
  const [tripFor, settripFor] = useState("");
  const [acFixed, setAcFixed] = useState("");
  const [advanceAcD, setAdvanceAcD] = useState("");
  const [fixedPercentage, setFixedPercentage] = useState("");
  const [addWalletAcD, setAddWalletAcD] = useState("");
  const [acAmount, setAcAmount] = useState("");
  const [acAdminCommission, setAcAdminCommission] = useState("");
  const [termsConditions, setTermsConditions] = useState("");
  const [fareRules, setFareRules] = useState("");

  const [carpoolFares, setCarpoolFares] = useState([]);
  const [otherFares, setOtherFares] = useState([]);
  const [showCarpoolForm, setShowCarpoolForm] = useState(false);
  const [showOtherForm, setShowOtherForm] = useState(false);
  const [editingCarpool, setEditingCarpool] = useState(null);
  const [editingOther, setEditingOther] = useState(null);
  const [newCarpoolFare, setNewCarpoolFare] = useState({
    state: "",
    city: "",
    category: "",
    subCategory: "",
    tripType: "",
    action: "Active",
  });

  const [settings, setSettings] = useState({
    hideSeatView: false,
    hideChat: false,
    hideNumber: false,
  });

  const [newOtherFare, setNewOtherFare] = useState({
    state: "",
    city: "",
    category: "",
    subCategory: "",
    tripType: "",
    action: "Active",
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editTripData?.trip) {
      const trip = editTripData.trip;
      
      settripFor(trip.tripFor || '');
      setTripType(trip.tripType || '');
      setSelectedCategory(trip.vehicleCategory || '');
      setSelectedSubCategories(trip.vehicleSubCategory ? trip.vehicleSubCategory.split(',') : []);
      setRecommendedFare(trip.RecommndedFareKm || '');
      setMinFare(trip.minFareKm || '');
      setMaxFare(trip.maxFareKm || '');
      setTax(trip.GsTtaxinPercentage || '');
      setDriverRadius(trip.DriverRadius || '');
      setDriverMinWallet(trip.DriverMinWalletAmount || '');
      setMinTripDiffTime(trip.minTripDifferenceTime || '');
      setUrgentTimeLimit(trip.urgentTimeValue || '');
      setPerHours(trip.Perhours || '');
      
      if (trip.bookingFeeConfiguration?.length > 0) {
        setBookingFeeRows(trip.bookingFeeConfiguration);
      }
      
      if (trip.AdminComissionConfiguration?.length > 0) {
        const mapped = trip.AdminComissionConfiguration.map(c => ({
          driverComissionType: c.driverComissionType || "Fixed",
          fromKm: c.driverComissionFromkm || "",
          toKm: c.drivercomissionTokm || "",
          amount: c.driverComissionValue || "",
        }));
        setCommissionRows(mapped);
      }
      
      setAdvanceFare({
        FareType: trip.advanceFareType || 'Fixed',
        price: trip.advanceFee || 0,
      });
      
      setDistanceVoice(trip.advanceFareDistance || '');
      setTimeVoice(trip.advanceTimeAfter5hours || '');
      
      setPlatformFeeDriverType(trip.platformFeeDriver || 'Fixed');
      setPlatformFeeDriverAmount(trip.paltformFeeDriverAmount || '');
      setPlatformFeeUserType(trip.PlatformFeeUser || 'Fixed');
      setPlatformFeeUserAmount(trip.PlatformFeeUserAmount || '');
      
      if (trip.FareStartDate) {
        const startDate = new Date(trip.FareStartDate).toISOString().slice(0, 16);
        setFareDate(prev => ({ ...prev, startDate }));
      }
      if (trip.FareEndDate) {
        const endDate = new Date(trip.FareEndDate).toISOString().slice(0, 16);
        setFareDate(prev => ({ ...prev, endDate }));
      }
      
      setFareStatus(trip.FareStatus || 'Active');
      
      setAdvanceDriverCommissionType(trip.AdvanceDriverComission || 'Fixed');
      setAdvanceDriverCommissionAmount(trip.AdvanceDriverComissionAmount || '');
      setAdvanceDriverCommissionWalletType(trip.AdvancedrivercomissionWallet || 'Fixed');
      setAdvanceDriverCommissionWalletAmount(trip.AdvancedrivercomissionWalletAmount || '');
      
      setAdvanceUserCommissionType(trip.AdvanceUserComission || 'Fixed');
      setAdvanceUserCommissionAmount(trip.AdvanceUserComissionAmount || '');
      setAdvanceUserCommissionWalletType(trip.AdvanceUsercomissionWallet || 'Fixed');
      setAdvanceUserCommissionWalletAmount(trip.AdvancedUsercomissionWalletAmount || '');
      
      setTermsConditions(trip.TermsCond || '');
      setFareRules(trip.FareRules || '');
      setSelectedPackage(trip.package || '');
      setselectedRentalPkg(trip.Rentalpkg || '');
    }
  }, [isEditMode, editTripData]);

  const toggleSetting = (settingKey) => {
    setSettings((prev) => ({
      ...prev,
      [settingKey]: !prev[settingKey],
    }));
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
          validity: packageValue === "basic" ? "30" : packageValue === "premium" ? "90" : "365",
          features: packageValue === "basic"
              ? "Basic ride features, Standard support"
              : packageValue === "premium"
              ? "Premium features, Priority support, Advanced analytics"
              : "Enterprise features, 24/7 support, Custom analytics, API access",
          price: packageValue === "basic" ? "99" : packageValue === "premium" ? "299" : "999",
          discountPercentage: packageValue === "basic" ? "5" : packageValue === "premium" ? "15" : "25",
          maxTrips: packageValue === "basic" ? "50" : packageValue === "premium" ? "200" : "unlimited",
          packageType: packageValue === "basic" ? "Basic" : packageValue === "premium" ? "Premium" : "Enterprise",
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

  const handlePackageDetailsChange = (field, value) => {
    setPackageDetails((prev) => ({
      ...prev,
      [field]: value,
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

  const handleRentalPackageChange = (e) => {
    setselectedRentalPkg(e.target.value);
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

  const handleSubcategoryChange = (e) => {
    const subcategoryName = e.target.value;
    setSelectedSubCategory(subcategoryName);
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

  const handleAddCarpoolFare = () => {
    if (newCarpoolFare.state && newCarpoolFare.city && newCarpoolFare.category) {
      const newFare = {
        ...newCarpoolFare,
        id: Date.now(),
      };
      setCarpoolFares([...carpoolFares, newFare]);
      setNewCarpoolFare({
        state: "",
        city: "",
        category: "",
        subCategory: "",
        tripType: "",
        action: "Active",
      });
      setShowCarpoolForm(false);
      toast.success("Carpool fare added successfully!");
    } else {
      toast.error("Please fill all required fields!");
    }
  };

  const handleAddOtherFare = () => {
    if (newOtherFare.state && newOtherFare.city && newOtherFare.category) {
      const newFare = {
        ...newOtherFare,
        id: Date.now(),
      };
      setOtherFares([...otherFares, newFare]);
      setNewOtherFare({
        state: "",
        city: "",
        category: "",
        subCategory: "",
        tripType: "",
        action: "Active",
      });
      setShowOtherForm(false);
      toast.success("Other fare added successfully!");
    } else {
      toast.error("Please fill all required fields!");
    }
  };

  const handleDeleteCarpoolFare = (id) => {
    setCarpoolFares(carpoolFares.filter((fare) => fare.id !== id));
    toast.success("Carpool fare deleted successfully!");
  };

  const handleDeleteOtherFare = (id) => {
    setOtherFares(otherFares.filter((fare) => fare.id !== id));
    toast.success("Other fare deleted successfully!");
  };

  const handleEditCarpoolFare = (fare) => {
    setEditingCarpool(fare);
    setNewCarpoolFare(fare);
    setShowCarpoolForm(true);
  };

  const handleEditOtherFare = (fare) => {
    setEditingOther(fare);
    setNewOtherFare(fare);
    setShowOtherForm(true);
  };

  const handleUpdateCarpoolFare = () => {
    if (editingCarpool) {
      setCarpoolFares(
        carpoolFares.map((fare) =>
          fare.id === editingCarpool.id
            ? { ...newCarpoolFare, id: editingCarpool.id }
            : fare
        )
      );
      setEditingCarpool(null);
      setNewCarpoolFare({
        state: "",
        city: "",
        category: "",
        subCategory: "",
        tripType: "",
        action: "Active",
      });
      setShowCarpoolForm(false);
      toast.success("Carpool fare updated successfully!");
    }
  };

  const handleUpdateOtherFare = () => {
    if (editingOther) {
      setOtherFares(
        otherFares.map((fare) =>
          fare.id === editingOther.id
            ? { ...newOtherFare, id: editingOther.id }
            : fare
        )
      );
      setEditingOther(null);
      setNewOtherFare({
        state: "",
        city: "",
        category: "",
        subCategory: "",
        tripType: "",
        action: "Active",
      });
      setShowOtherForm(false);
      toast.success("Other fare updated successfully!");
    }
  };

  const toggleCarpoolStatus = (id) => {
    setCarpoolFares(
      carpoolFares.map((fare) =>
        fare.id === id
          ? {
              ...fare,
              action: fare.action === "Active" ? "De-active" : "Active",
            }
          : fare
      )
    );
  };

  const toggleOtherStatus = (id) => {
    setOtherFares(
      otherFares.map((fare) =>
        fare.id === id
          ? {
              ...fare,
              action: fare.action === "Active" ? "De-active" : "Active",
            }
          : fare
      )
    );
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

    const postdata = {
        tripId:id,
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
      AdvanceDriverComission: advanceDriverCommissionType,
      AdvanceDriverComissionAmount: parseInt(advanceDriverCommissionAmount) || 0,
      FareStatus: FareStatus,
      AdvancedrivercomissionWallet: advanceDriverCommissionWalletType,
      AdvancedrivercomissionWalletAmount: parseInt(advanceDriverCommissionWalletAmount) || 0,
      AdvanceUserComission: advanceUserCommissionType,
      AdvanceUserComissionAmount: parseInt(advanceUserCommissionAmount) || 0,
      AdvanceUsercomissionWallet: advanceUserCommissionWalletType,
      AdvancedUsercomissionWalletAmount: parseInt(advanceUserCommissionWalletAmount) || 0,
      TermsCond: termsConditions,
      FareRules: fareRules,
      advanceFareDistance: parseInt(distanceVoice) || 0,
      advanceTimeAfter5hours: timeVoice,
      package: selectedPackage,
      Rentalpkg: selectedRentalPkg,
    };

    try {
      const { data: responseData, error: responseError } = isEditMode
        ? await UpdateTripApi({ id, ...postdata })
        : await AddTripApiInAdmin(postdata);

      if (responseData) {
        toast.success(isEditMode ? "Trip updated successfully!" : "Trip added successfully!");
        
        if (isEditMode) {
          setTimeout(() => navigate(`/viewtrip/${id}`), 1500);
        } else {
          // Reset form for new entry
          setSelectedSubCategories([]);
          setSelectedState("");
          setSelectedCity("");
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
          setBookingFeeRows([
            {
              bookingFeeType: "PerKm",
              beeokingfeeFromKm: 0,
              beeokingfeeToKm: 0,
              bookingFee: 0,
            },
          ]);
          setAdvanceFare({
            FareType: "Fixed",
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
          setCommissionRows([{ fromKm: "", toKm: "", amount: "", driverComissionType: "Fixed" }]);
          setDistanceVoice("");
          setTimeVoice("");
          setPlatformFeeDriverType("Fixed");
          setPlatformFeeDriverAmount("");
          setPlatformFeeUserType("Fixed");
          setPlatformFeeUserAmount("");
          setAdvanceDriverCommissionType("Fixed");
          setAdvanceDriverCommissionAmount("");
          setAdvanceDriverCommissionWalletType("Fixed");
          setAdvanceDriverCommissionWalletAmount("");
          setAdvanceUserCommissionType("Fixed");
          setAdvanceUserCommissionAmount("");
          setAdvanceUserCommissionWalletType("Fixed");
          setAdvanceUserCommissionWalletAmount("");
          setTermsConditions("");
          setFareRules("");
        }
      } else {
        toast.error(responseError?.message || `Failed to ${isEditMode ? 'update' : 'add'} trip!`);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(`An error occurred while ${isEditMode ? 'updating' : 'adding'} trip!`);
    }
  };

  if (isLoadingTrip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-blue-500 text-lg">Loading trip details...</p>
      </div>
    );
  }

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
              {isEditMode ? 'Edit' : 'Add'} Fare Configuration
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
              {/* Tumhara existing form JSX yahi rahega - same as before */}
              {/* ... rest of your JSX ... */}
              
              {/* Submit Button - bas yahan change hai */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
                >
                  {isEditMode ? 'Update Fare Configuration' : 'Save Fare Configuration'}
                </button>
              </div>
            </form>

            {/* Tables section same rahega */}
          </div>
        </div>

        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default FareManagementScreen;