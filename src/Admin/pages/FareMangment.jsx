import React, { useEffect, useState } from "react";
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

const FareManagementScreen = () => {
  const [perKmFare, setPerKmFare] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCarpool, setIsCarpool] = useState(true);
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

  ///////////////////////////////////////////////////

  const [platformFeeDriverType, setPlatformFeeDriverType] = useState("Fixed");
  const [platformFeeDriverAmount, setPlatformFeeDriverAmount] = useState("");
  const [platformFeeUserType, setPlatformFeeUserType] = useState("Fixed");
  const [platformFeeUserAmount, setPlatformFeeUserAmount] = useState("");
  const [advanceDriverCommissionType, setAdvanceDriverCommissionType] =
    useState("Fixed");
  const [advanceDriverCommissionAmount, setAdvanceDriverCommissionAmount] =
    useState("");
  const [
    advanceDriverCommissionWalletType,
    setAdvanceDriverCommissionWalletType,
  ] = useState("Fixed");
  const [
    advanceDriverCommissionWalletAmount,
    setAdvanceDriverCommissionWalletAmount,
  ] = useState("");
  const [advanceUserCommissionType, setAdvanceUserCommissionType] =
    useState("Fixed");
  const [advanceUserCommissionAmount, setAdvanceUserCommissionAmount] =
    useState("");
  const [advanceUserCommissionWalletType, setAdvanceUserCommissionWalletType] =
    useState("Fixed");
  const [
    advanceUserCommissionWalletAmount,
    setAdvanceUserCommissionWalletAmount,
  ] = useState("");

  // Booking Fee Rows State
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

  // Additional state for missing sections
  const [commissionRows, setCommissionRows] = useState([
    { fromKm: "", toKm: "", amount: "" },
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

  // Tables State - NEW ADDITION
  const [carpoolFares, setCarpoolFares] = useState([
    {
      id: 1,
      state: "Uttar Pradesh",
      city: "Lucknow",
      category: "Sedan",
      subCategory: "Zest",
      tripType: "Outstation, One-way",
      action: "Active",
    },
    {
      id: 2,
      state: "Uttar Pradesh",
      city: "Ayodhya",
      category: "Sedan",
      subCategory: "Zest",
      tripType: "Outstation, One-way",
      action: "Active",
    },
    {
      id: 3,
      state: "Uttar Pradesh",
      city: "Varanasi",
      category: "Sedan",
      subCategory: "Zest",
      tripType: "Outstation, One-way",
      action: "Active",
    },
    {
      id: 4,
      state: "Bihar",
      city: "Patna",
      category: "Sedan",
      subCategory: "Zest",
      tripType: "Outstation, One-way",
      action: "Active",
    },
  ]);

  const [otherFares, setOtherFares] = useState([
    {
      id: 1,
      state: "Uttar Pradesh",
      city: "Lucknow",
      category: "Sedan",
      subCategory: "Zest",
      tripType: "Outstation, One-way",
      action: "Active",
    },
    {
      id: 2,
      state: "Uttar Pradesh",
      city: "Ayodhya",
      category: "Sedan",
      subCategory: "Zest",
      tripType: "Outstation, One-way",
      action: "Active",
    },
    {
      id: 3,
      state: "Uttar Pradesh",
      city: "Varanasi",
      category: "Sedan",
      subCategory: "Zest",
      tripType: "Outstation, One-way",
      action: "Active",
    },
    {
      id: 4,
      state: "Bihar",
      city: "Patna",
      category: "Sedan",
      subCategory: "Zest",
      tripType: "Outstation, One-way",
      action: "Active",
    },
  ]);

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

  const toggleSetting = (settingKey) => {
    setSettings((prev) => ({
      ...prev,
      [settingKey]: !prev[settingKey],
    }));
  };

  const [newOtherFare, setNewOtherFare] = useState({
    state: "",
    city: "",
    category: "",
    subCategory: "",
    tripType: "",
    action: "Active",
  });

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

  const ToggleButton = ({ label, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`ml-10 px-4 py-2 rounded-lg   border-blue-500 transition-all duration-200 min-w-[140px] ${
        isSelected
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-300 bg-gray-100 text-gray-600 hover:border-gray-400"
      }`}
    >
      <div className="flex items-center justify-between ">
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
        // Yahan subcategory set karein
        setSubscategories(categoriesDataa);
      }
    }, [categoriesDataa, shouldFetchCategories]);

    console.log(subscategories,"subscategories subscategories subscategories")
    



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

  const handleRentalPackageChange = (e) => {
    setselectedRentalPkg(e.target.value);
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    const selectedStateObj = data?.state.find(
      (state) => state.name === stateName
    );
    console.log(selectedStateObj, "selected state object");
    if (selectedStateObj) {
      setCities(selectedStateObj.cities);
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (onCityChange) onCityChange(city);
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryName = e.target.value;
    setSelectedSubCategory(subcategoryName);
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

  // Table Management Functions - NEW ADDITION
  const handleAddCarpoolFare = () => {
    if (
      newCarpoolFare.state &&
      newCarpoolFare.city &&
      newCarpoolFare.category
    ) {
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (
  //     parseInt(maxFare) < parseInt(recommendedFare) ||
  //     parseInt(minFare) > parseInt(recommendedFare) ||
  //     parseInt(maxFare) < parseInt(minFare)
  //   ) {
  //     toast.error(
  //       "Max fare should be greater than recommended fare and min fare should be less than recommended fare"
  //     );
  //     return;
  //   }
  //   const postdata = {
  //     advanceFee: AdvanceFare?.price,
  //     advanceFareType: AdvanceFare?.FareType,
  //     vehicleCategory: selectedCategory,
  //     vehicleSubCategory: selectedSubCategories,
  //     tripType: tripType,
  //     RecommndedFareKm: recommendedFare,
  //     minFareKm: minFare,
  //     maxFareKm: maxFare,
  //     GsTtaxinPercentage: tax,
  //     bookingFeeRows: bookingFeeRows,
  //     advanceFareType: AdvanceFare?.FareType,
  //     advanceFee: AdvanceFare?.price,
  //     FareEndDate: FareDate?.endDate,
  //     FareStatus: FareStatus,
  //     FareStartDate: FareDate?.startDate,
  //     FromDriverPickupTime: FromToTime?.fromTime,
  //     ToDriverPickupTime: FromToTime?.toTime,
  //     DriverPickupTime: DriverPickupTime,
  //     Perhours: perHours,
  //     DriverRadius: driverRadius,
  //     minTripDifferenceTime: minTripDiffTime,
  //     DriverMinWalletAmount: driverMinWallet,
  //     urgentTimeValue: urgentTimeLimit,
  //     // Package data
  //     selectedPackage: selectedPackage,
  //     packageName: packageName,
  //     packageDetails: showPackageForm ? packageDetails : null,
  //     // Additional fields for new sections
  //     commissionRows: commissionRows,
  //     distanceVoice: distanceVoice,
  //     timeVoice: timeVoice,
  //     platformFeeU: platformFeeU,
  //     platformFeeD: platformFeeD,
  //     platformFeePercentage: platformFeePercentage,
  //     acConfiguration: {
  //       acFixed: acFixed,
  //       advanceAcD: advanceAcD,
  //       fixedPercentage: fixedPercentage,
  //       addWalletAcD: addWalletAcD,
  //       acAmount: acAmount,
  //       acAdminCommission: acAdminCommission,
  //     },
  //     termsConditions: termsConditions,
  //     fareRules: fareRules,
  //     // Tables data
  //     carpoolFares: carpoolFares,
  //     otherFares: otherFares,
  //   };

  //   console.log(postdata)

  //   const { data: dataInAdmin, error: errorInAdmin } = await AddTripApiInAdmin(
  //     postdata
  //   );
  //   if (dataInAdmin) {
  //     toast.success("Trip added successfully!");
  //     // Reset all fields
  //     setSelectedSubCategories([]);
  //     setSelectedState("");
  //     setSelectedCity("");
  //     setSelectedCategory("");
  //     setSelectedSubCategory("");
  //     setTripType("");
  //     setRecommendedFare("");
  //     setMinFare("");
  //     setMaxFare("");
  //     setTax("");
  //     setDriverRadius("");
  //     setDriverMinWallet("");
  //     setMinTripDiffTime("");
  //     setUrgentTimeLimit("");
  //     setPerHours("");
  //     setBookingFeeRows([
  //       {
  //         bookingFeeType: "PerKm",
  //         beeokingfeeFromKm: 0,
  //         beeokingfeeToKm: 0,
  //         bookingFee: 0,
  //       },
  //     ]);
  //     setAdvanceFare({
  //       FareType: "",
  //       price: 0,
  //     });
  //     setSelectedPackage("");
  //     setPackageName("");
  //     setShowPackageForm(false);
  //     setPackageDetails({
  //       packageName: "",
  //       description: "",
  //       validity: "",
  //       features: "",
  //       price: "",
  //       discountPercentage: "",
  //       maxTrips: "",
  //       packageType: "Basic",
  //     });
  //     // Reset new fields
  //     setCommissionRows([{ fromKm: "", toKm: "", amount: "" }]);
  //     setDistanceVoice("");
  //     setTimeVoice("");
  //     setPlatformFeeU("");
  //     setPlatformFeeD("");
  //     setPlatformFeePercentage("");
  //     setAcFixed("");
  //     setAdvanceAcD("");
  //     setFixedPercentage("");
  //     setAddWalletAcD("");
  //     setAcAmount("");
  //     setAcAdminCommission("");
  //     setTermsConditions("");
  //     setFareRules("");
  //   } else {
  //     toast.error("Failed to add trip!");
  //   }
  // };

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

    // Map booking fee rows to the required format
    const bookingFeeConfiguration = bookingFeeRows.map((row) => ({
      bookingFeeType: row.bookingFeeType,
      beeokingfeeFromKm: parseInt(row.beeokingfeeFromKm) || 0,
      beeokingfeeToKm: parseInt(row.beeokingfeeToKm) || 0,
      bookingFee: parseInt(row.bookingFee) || 0,
    }));

    // Map commission rows to the required format
    const AdminComissionConfiguration = commissionRows.map((row) => ({
      driverComissionType: row.driverComissionType || "Fixed",
      driverComissionFromkm: parseInt(row.fromKm) || 0,
      drivercomissionTokm: parseInt(row.toKm) || 0,
      driverComissionValue: parseInt(row.amount) || 0,
    }));

    // Create the API payload according to required structure
    const postdata = {
      tripFor:tripFor,
      perKmFare: false,
      tripType: tripType,
      vehicleCategory: selectedCategory,
      vehicleSubCategory: selectedSubCategories.join(","), // Convert array to string
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
      AdvanceDriverComissionAmount:
        parseInt(advanceDriverCommissionAmount) || 0,
        FareStatus:FareStatus,
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
      settings:settings
    };
    try {
      const { data: dataInAdmin, error: errorInAdmin } =
        await AddTripApiInAdmin(postdata);
      if (dataInAdmin) {
        toast.success("Trip added successfully!");
        // Reset all fields (keep your existing reset logic)
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
      } else {
        toast.error(errorInAdmin?.message || "Failed to add trip!");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("An error occurred while adding trip!");
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold">Add Fare Configuration</h1>
          </div>

          <div className="mb-2 mt-4 ">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip For
                    </label>
                    <Select
                      className="w-full"
                      value={tripType}
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
                  <label className="block  text-sm font-medium text-black mb-2">
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

              {/* Fare Configuration Section */}
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

              {/* Driver & System Settings */}
              <div className="border border-gray-200 rounded-lg p-6 bg-purple-50">
                <h3 className="text-lg font-semibold text-purple-700 mb-4">
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
                      Minimum time different
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
                          value={row.driverComissionType || "Fixed"}
                          onChange={(e) =>
                            updateCommissionRow(
                              index,
                              "driverComissionType",
                              e.target.value
                            )
                          }
                        >
                          <Option value="">All</Option>
                          <Option value="CityRide">Fixed</Option>
                          <Option value="Rental">Percentage</Option>
                        </Select>
                      </div>

                      {tripType === "CarPool" ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Carpool Commission
                          </label>
                          <Select
                            className="w-full"
                            value={row.carpoolCommissionType || "PerTrip"}
                            onChange={(e) =>
                              updateCommissionRow(
                                index,
                                "carpoolCommissionType",
                                e.target.value
                              )
                            }
                          >
                            <Option value="PerTrip">Per/trip</Option>
                            <Option value="PerSeat">Per/seat</Option>
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
                          type="number"
                          min={0}
                          placeholder="0"
                          className="w-full"
                          value={row.fromKm}
                          onChange={(e) =>
                            updateCommissionRow(index, "fromKm", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To/km{" "}
                        </label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
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
                          placeholder="00"
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
                      Amount
                    </label>
                    <Input
                      type="number"
                      placeholder="00"
                      className="w-full"
                      value={platformFeeDriverAmount}
                      onChange={(e) =>
                        setPlatformFeeDriverAmount(e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform fee User
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
                      Amount
                    </label>
                    <Input
                      type="number"
                      placeholder="00"
                      className="w-full"
                      value={platformFeeUserAmount}
                      onChange={(e) => setPlatformFeeUserAmount(e.target.value)}
                    />
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
                    <Select
                      className="w-full"
                      value={advanceDriverCommissionType}
                      onChange={(e) =>
                        setAdvanceDriverCommissionType(e.target.value)
                      }
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
                      type="number"
                      placeholder="00"
                      className="w-full"
                      value={advanceDriverCommissionAmount}
                      onChange={(e) =>
                        setAdvanceDriverCommissionAmount(e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      wallet
                    </label>
                    <Select
                      className="w-full"
                      value={advanceDriverCommissionWalletType}
                      onChange={(e) =>
                        setAdvanceDriverCommissionWalletType(e.target.value)
                      }
                    >
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
                      placeholder="00"
                      className="w-full"
                      value={advanceDriverCommissionWalletAmount}
                      onChange={(e) =>
                        setAdvanceDriverCommissionWalletAmount(e.target.value)
                      }
                    />
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
                      value={advanceUserCommissionType}
                      onChange={(e) =>
                        setAdvanceUserCommissionType(e.target.value)
                      }
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
                      type="number"
                      placeholder="00"
                      className="w-full"
                      value={advanceUserCommissionAmount}
                      onChange={(e) =>
                        setAdvanceUserCommissionAmount(e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      wallet
                    </label>
                    <Select
                      className="w-full"
                      value={advanceUserCommissionWalletType}
                      onChange={(e) =>
                        setAdvanceUserCommissionWalletType(e.target.value)
                      }
                    >
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
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
                >
                  Save Fare Configuration
                </button>
              </div>
            </form>

            {/* TABLES SECTION - NEW ADDITION */}
            <div className="mt-12 space-y-8">
              {/* Carpool Fare Table - Green */}
              <div className="border border-gray-200 rounded-lg bg-white shadow-lg">
                <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      className="bg-green-700 px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
                      onClick={() => {
                        /* Handle Connected */
                      }}
                    >
                      Connected
                    </button>
                    <button
                      className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                      onClick={() => {
                        /* Handle City List */
                      }}
                    >
                      CITY LIST
                    </button>
                    <button
                      className="bg-green-400 px-4 py-2 rounded-md hover:bg-green-500 transition-colors text-green-900"
                      onClick={() => setShowCarpoolForm(true)}
                    >
                      <Plus size={16} className="inline mr-1" />
                      ADD CITY
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold">Carpool Fare</h3>
                </div>

                {/* Add/Edit Carpool Form */}
                {showCarpoolForm && (
                  <div className="bg-green-50 border-b border-green-200 p-4">
                    <h4 className="text-md font-semibold text-green-700 mb-3">
                      {editingCarpool
                        ? "Edit Carpool Fare"
                        : "Add New Carpool Fare"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <Select
                          value={newCarpoolFare.state}
                          onChange={(e) =>
                            setNewCarpoolFare({
                              ...newCarpoolFare,
                              state: e.target.value,
                            })
                          }
                          className="w-full"
                        >
                          <Option value="">Select State</Option>
                          <Option value="Uttar Pradesh">Uttar Pradesh</Option>
                          <Option value="Bihar">Bihar</Option>
                          <Option value="Maharashtra">Maharashtra</Option>
                          <Option value="Delhi">Delhi</Option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter city"
                          className="w-full"
                          value={newCarpoolFare.city}
                          onChange={(e) =>
                            setNewCarpoolFare({
                              ...newCarpoolFare,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <Select
                          value={newCarpoolFare.category}
                          onChange={(e) =>
                            setNewCarpoolFare({
                              ...newCarpoolFare,
                              category: e.target.value,
                            })
                          }
                          className="w-full"
                        >
                          <Option value="">Select Category</Option>
                          <Option value="Sedan">Sedan</Option>
                          <Option value="SUV">SUV</Option>
                          <Option value="Hatchback">Hatchback</Option>
                        </Select>
                      </div>
                      <div className="">
                        <label className="block-1 text-sm font-medium text-gray-700 mb-1">
                          Sub-category
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter sub-category"
                          className="w-full"
                          value={newCarpoolFare.subCategory}
                          onChange={(e) =>
                            setNewCarpoolFare({
                              ...newCarpoolFare,
                              subCategory: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trip type
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter trip type"
                          className="w-full"
                          value={newCarpoolFare.tripType}
                          onChange={(e) =>
                            setNewCarpoolFare({
                              ...newCarpoolFare,
                              tripType: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Action
                        </label>
                        <Select
                          value={newCarpoolFare.action}
                          onChange={(e) =>
                            setNewCarpoolFare({
                              ...newCarpoolFare,
                              action: e.target.value,
                            })
                          }
                          className="w-full"
                        >
                          <Option value="Active">Active</Option>
                          <Option value="De-active">De-active</Option>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={
                          editingCarpool
                            ? handleUpdateCarpoolFare
                            : handleAddCarpoolFare
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        {editingCarpool ? "Update" : "Add"} Carpool Fare
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCarpoolForm(false);
                          setEditingCarpool(null);
                          setNewCarpoolFare({
                            state: "",
                            city: "",
                            category: "",
                            subCategory: "",
                            tripType: "",
                            action: "Active",
                          });
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Carpool Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 border-r border-green-200">
                          S. No.
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 border-r border-green-200">
                          State
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 border-r border-green-200">
                          City
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 border-r border-green-200">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 border-r border-green-200">
                          Sub-category
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 border-r border-green-200">
                          Trip type
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-green-800">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {carpoolFares.map((fare, index) => (
                        <tr
                          key={fare.id}
                          className={
                            index % 2 === 0 ? "bg-green-25" : "bg-white"
                          }
                        >
                          <td className="px-4 py-3 text-sm border-r border-green-100">
                            {String(index + 1).padStart(2, "0")}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-green-100">
                            {fare.state}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-green-100">
                            {fare.city}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-green-100">
                            {fare.category}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-green-100">
                            {fare.subCategory}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-green-100">
                            {fare.tripType}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleCarpoolStatus(fare.id)}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  fare.action === "Active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                }`}
                              >
                                {fare.action}
                              </button>
                              <button
                                onClick={() => handleEditCarpoolFare(fare)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteCarpoolFare(fare.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Other Fare Table - Red */}
              <div className="border border-gray-200 rounded-lg bg-white shadow-lg">
                <div className="bg-red-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      className="bg-red-700 px-4 py-2 rounded-md hover:bg-red-800 transition-colors"
                      onClick={() => {
                        /* Handle Connected */
                      }}
                    >
                      Connected
                    </button>
                    <button
                      className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                      onClick={() => {
                        /* Handle City List */
                      }}
                    >
                      CITY LIST
                    </button>
                    <button
                      className="bg-red-400 px-4 py-2 rounded-md hover:bg-red-500 transition-colors text-red-900"
                      onClick={() => setShowOtherForm(true)}
                    >
                      <Plus size={16} className="inline mr-1" />
                      ADD CITY
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold">Other Fare</h3>
                </div>

                {/* Add/Edit Other Form */}
                {showOtherForm && (
                  <div className="bg-red-50 border-b border-red-200 p-4">
                    <h4 className="text-md font-semibold text-red-700 mb-3">
                      {editingOther ? "Edit Other Fare" : "Add New Other Fare"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <Select
                          value={newOtherFare.state}
                          onChange={(e) =>
                            setNewOtherFare({
                              ...newOtherFare,
                              state: e.target.value,
                            })
                          }
                          className="w-full"
                        >
                          <Option value="">Select State</Option>
                          <Option value="Uttar Pradesh">Uttar Pradesh</Option>
                          <Option value="Bihar">Bihar</Option>
                          <Option value="Maharashtra">Maharashtra</Option>
                          <Option value="Delhi">Delhi</Option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter city"
                          className="w-full"
                          value={newOtherFare.city}
                          onChange={(e) =>
                            setNewOtherFare({
                              ...newOtherFare,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <Select
                          value={newOtherFare.category}
                          onChange={(e) =>
                            setNewOtherFare({
                              ...newOtherFare,
                              category: e.target.value,
                            })
                          }
                          className="w-full"
                        >
                          <Option value="">Select Category</Option>
                          <Option value="Sedan">Sedan</Option>
                          <Option value="SUV">SUV</Option>
                          <Option value="Hatchback">Hatchback</Option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sub-category
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter sub-category"
                          className="w-full"
                          value={newOtherFare.subCategory}
                          onChange={(e) =>
                            setNewOtherFare({
                              ...newOtherFare,
                              subCategory: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trip type
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter trip type"
                          className="w-full"
                          value={newOtherFare.tripType}
                          onChange={(e) =>
                            setNewOtherFare({
                              ...newOtherFare,
                              tripType: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Action
                        </label>
                        <Select
                          value={newOtherFare.action}
                          onChange={(e) =>
                            setNewOtherFare({
                              ...newOtherFare,
                              action: e.target.value,
                            })
                          }
                          className="w-full"
                        >
                          <Option value="Active">Active</Option>
                          <Option value="De-active">De-active</Option>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={
                          editingOther
                            ? handleUpdateOtherFare
                            : handleAddOtherFare
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        {editingOther ? "Update" : "Add"} Other Fare
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowOtherForm(false);
                          setEditingOther(null);
                          setNewOtherFare({
                            state: "",
                            city: "",
                            category: "",
                            subCategory: "",
                            tripType: "",
                            action: "Active",
                          });
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Other Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-red-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-red-800 border-r border-red-200">
                          S. No.
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-red-800 border-r border-red-200">
                          State
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-red-800 border-r border-red-200">
                          City
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-red-800 border-r border-red-200">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-red-800 border-r border-red-200">
                          Sub-category
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-red-800 border-r border-red-200">
                          Trip type
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-red-800">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherFares.map((fare, index) => (
                        <tr
                          key={fare.id}
                          className={index % 2 === 0 ? "bg-red-25" : "bg-white"}
                        >
                          <td className="px-4 py-3 text-sm border-r border-red-100">
                            {String(index + 1).padStart(2, "0")}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-red-100">
                            {fare.state}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-red-100">
                            {fare.city}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-red-100">
                            {fare.category}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-red-100">
                            {fare.subCategory}
                          </td>
                          <td className="px-4 py-3 text-sm border-r border-red-100">
                            {fare.tripType}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleOtherStatus(fare.id)}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  fare.action === "Active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                }`}
                              >
                                {fare.action}
                              </button>
                              <button
                                onClick={() => handleEditOtherFare(fare)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteOtherFare(fare.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default FareManagementScreen;
