import React, { useMemo, useState } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../Component/Sidebar";
import {
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetStateAndCitiesQuery,
  useGetAllVehicleCategoryQuery,
} from "../Redux/Api";

const EMPTY_PERMISSIONS = {
  passenger: {
    acceptCarpoolTrip: false,
    createVehicleTrip: false,
  },
  driver: {
    acceptFixFare: false,
    acceptPerKm: false,
    acceptLocal: false,
    acceptRental: false,
    acceptOneWay: false,
    acceptRoundTrip: false,
    acceptCarpool: false,
    createCarpool: false,
    createOneWay: false,
  },
};

const defaultForm = {
  orderNumber: 0,
  name: "",
  price: "",
  offerPrice: "",
  durationType: "month",
  durationValue: 1,
  months: 1,
  expirationDate: "",
  Benifits: "",
  tagline: "",
  features: "",
  targetRoles: ["Passenger"],
  vehicleCategory: "All",
  city: "",
  state: "",
  isActive: true,
  permissions: EMPTY_PERMISSIONS,
};

const PASSENGER_OPTIONS = [
  { key: "acceptCarpoolTrip", label: "Accept Carpool Trip" },
  { key: "createVehicleTrip", label: "Create vehicle trip" },
];

const DRIVER_ACCEPT_OPTIONS = [
  { key: "acceptFixFare", label: "Fix Fare" },
  { key: "acceptPerKm", label: "Per KM" },
  { key: "acceptLocal", label: "Local" },
  { key: "acceptRental", label: "Rental" },
  { key: "acceptOneWay", label: "One-way" },
  { key: "acceptRoundTrip", label: "Round Trip" },
  { key: "acceptCarpool", label: "Carpool" },
];

const DRIVER_CREATE_OPTIONS = [
  { key: "createCarpool", label: "Carpool" },
  { key: "createOneWay", label: "One-way" },
];

const SubscriptionPackages = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: subscriptions, isLoading, isError } = useGetSubscriptionsQuery();
  const { data: statesData } = useGetStateAndCitiesQuery();
  const { data: categoriesData } = useGetAllVehicleCategoryQuery();
  const [createSubscription] = useCreateSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const states = statesData?.state || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const citiesForState = useMemo(() => {
    const match = Array.isArray(states)
      ? states.find(
          (s) =>
            String(s?.name || s?.state || "").toLowerCase() ===
            String(formData.state || "").toLowerCase(),
        )
      : null;
    return match?.cities || [];
  }, [states, formData.state]);

  const openForm = (pkg = null) => {
    if (pkg) {
      setEditingId(pkg._id);
      setFormData({
        orderNumber: pkg.orderNumber || 0,
        name: pkg.name || "",
        price: pkg.price ?? "",
        offerPrice: pkg.offerPrice ?? "",
        durationType: pkg.durationType || "month",
        durationValue: pkg.durationValue || pkg.months || 1,
        months: pkg.months || pkg.durationValue || 1,
        expirationDate: pkg.expirationDate?.slice(0, 10) || "",
        Benifits: pkg.Benifits || "",
        tagline: pkg.tagline || "",
        features: (pkg.features || []).join(", "),
        targetRoles: pkg.targetRoles?.length
          ? pkg.targetRoles
          : ["Passenger"],
        vehicleCategory: pkg.vehicleCategory || "All",
        city: pkg.city || "",
        state: pkg.state || "",
        isActive: pkg.isActive !== false,
        permissions: {
          passenger: {
            ...EMPTY_PERMISSIONS.passenger,
            ...(pkg.permissions?.passenger || {}),
          },
          driver: {
            ...EMPTY_PERMISSIONS.driver,
            ...(pkg.permissions?.driver || {}),
          },
        },
      });
    } else {
      setEditingId(null);
      setFormData(defaultForm);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(defaultForm);
  };

  const toggleRole = (role) => {
    setFormData((prev) => {
      const exists = prev.targetRoles.includes(role);
      return {
        ...prev,
        targetRoles: exists
          ? prev.targetRoles.filter((r) => r !== role)
          : [...prev.targetRoles, role],
      };
    });
  };

  const togglePermission = (group, key) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [group]: {
          ...prev.permissions[group],
          [key]: !prev.permissions[group][key],
        },
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.targetRoles.length) {
      toast.error("Select at least one role");
      return;
    }

    const payload = {
      ...formData,
      orderNumber: Number(formData.orderNumber) || 0,
      price: Number(formData.price),
      offerPrice: Number(formData.offerPrice),
      durationValue: Number(formData.durationValue) || 1,
      months: Number(formData.durationValue) || Number(formData.months) || 1,
      features: formData.features
        ? formData.features.split(",").map((f) => f.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingId) {
        await updateSubscription({ id: editingId, ...payload }).unwrap();
        toast.success("Subscription updated successfully!");
      } else {
        await createSubscription(payload).unwrap();
        toast.success("Subscription created successfully!");
      }
      closeForm();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await deleteSubscription(id).unwrap();
        toast.success("Deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <Toaster position="top-right" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Subscription Plan</h1>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            <Plus size={18} /> Add Package
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Subscription Plan" : "Create Subscription Plan"}
              </h2>
              <button onClick={closeForm} className="text-gray-600 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-wrap gap-3">
                {["Passenger", "TravelPartner", "Driver"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.targetRoles.includes(role)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {role === "TravelPartner" ? "Travel Partner" : role}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="vehicleCategory"
                  value={formData.vehicleCategory}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id || cat.brandName} value={cat.brandName}>
                      {cat.brandName}
                    </option>
                  ))}
                </select>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="">Select State</option>
                  {Array.isArray(states) &&
                    states.map((state) => (
                      <option key={state._id || state.name} value={state.name || state.state}>
                        {state.name || state.state}
                      </option>
                    ))}
                </select>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="">Select City</option>
                  {citiesForState.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" name="orderNumber" placeholder="Order Number" value={formData.orderNumber} onChange={handleChange} className="border p-2 rounded" />
                <input type="text" name="name" placeholder="Package Name" value={formData.name} onChange={handleChange} className="border p-2 rounded" required />
                <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="border p-2 rounded" required />
                <input type="number" name="offerPrice" placeholder="Offer Price" value={formData.offerPrice} onChange={handleChange} className="border p-2 rounded" required />
                <select name="durationType" value={formData.durationType} onChange={handleChange} className="border p-2 rounded">
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
                <input type="number" name="durationValue" placeholder="Duration Value" value={formData.durationValue} onChange={handleChange} className="border p-2 rounded" min="1" required />
                <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} className="border p-2 rounded" required />
              </div>

              <input type="text" name="Benifits" placeholder="Benefit" value={formData.Benifits} onChange={handleChange} className="w-full border p-2 rounded" required />
              <input type="text" name="features" placeholder="Feature (comma separated)" value={formData.features} onChange={handleChange} className="w-full border p-2 rounded" />
              <input type="text" name="tagline" placeholder="Tagline" value={formData.tagline} onChange={handleChange} className="w-full border p-2 rounded" />

              <div>
                <h3 className="font-semibold mb-2">Passenger</h3>
                <div className="flex flex-wrap gap-4 border rounded-lg p-4">
                  {PASSENGER_OPTIONS.map((opt) => (
                    <label key={opt.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!formData.permissions.passenger[opt.key]}
                        onChange={() => togglePermission("passenger", opt.key)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Driver</h3>
                <div className="border rounded-lg p-4 space-y-4">
                  <div>
                    <p className="font-medium mb-2">Accept Trip</p>
                    <div className="flex flex-wrap gap-4">
                      {DRIVER_ACCEPT_OPTIONS.map((opt) => (
                        <label key={opt.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!formData.permissions.driver[opt.key]}
                            onChange={() => togglePermission("driver", opt.key)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Create Vehicle Trip</p>
                    <div className="flex flex-wrap gap-4">
                      {DRIVER_CREATE_OPTIONS.map((opt) => (
                        <label key={opt.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!formData.permissions.driver[opt.key]}
                            onChange={() => togglePermission("driver", opt.key)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                Active package
              </label>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                {editingId ? "Update" : "Create"}
              </button>
            </form>
          </div>
        )}

        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load data</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-900">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Roles</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Offer</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions?.data?.map((pkg) => (
                  <tr key={pkg._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{pkg.orderNumber || 0}</td>
                    <td className="px-4 py-3">{pkg.name}</td>
                    <td className="px-4 py-3">{(pkg.targetRoles || []).join(", ")}</td>
                    <td className="px-4 py-3">{[pkg.city, pkg.state].filter(Boolean).join(", ") || "All"}</td>
                    <td className="px-4 py-3">{pkg.vehicleCategory || "All"}</td>
                    <td className="px-4 py-3">₹{pkg.price}</td>
                    <td className="px-4 py-3">₹{pkg.offerPrice}</td>
                    <td className="px-4 py-3">{pkg.durationValue || pkg.months} {pkg.durationType || "month"}</td>
                    <td className="px-4 py-3 flex justify-end gap-3">
                      <button onClick={() => openForm(pkg)} className="text-blue-600 hover:text-blue-800">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(pkg._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPackages;
