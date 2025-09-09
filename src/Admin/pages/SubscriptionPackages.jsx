import React, { useState } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../Component/Sidebar";
import {
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} from "../Redux/Api";

const SubscriptionPackages = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // RTK Query hooks
  const { data: subscriptions, isLoading, isError } = useGetSubscriptionsQuery();
  const [createSubscription] = useCreateSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();

  // Local state for form/modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    offerPrice: "",
    months: "1",
    expirationDate: "",
    Benifits: "",
    features: "",
  });

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingId(pkg._id);
      setFormData({
        name: pkg.name,
        price: pkg.price,
        offerPrice: pkg.offerPrice,
        months: pkg.months?.toString() || "1",
        expirationDate: pkg.expirationDate?.slice(0, 10),
        Benifits: pkg.Benifits,
        features: pkg.features.join(", "),
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        price: "",
        offerPrice: "",
        months: "1",
        expirationDate: "",
        Benifits: "",
        features: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      offerPrice: Number(formData.offerPrice),
      months: Number(formData.months),
      features: formData.features.split(",").map((f) => f.trim()),
    };

    try {
      if (editingId) {
        await updateSubscription({ id: editingId, ...payload }).unwrap();
        toast.success("Subscription updated successfully!");
      } else {
        await createSubscription(payload).unwrap();
        toast.success("Subscription created successfully!");
      }
      closeModal();
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
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Toaster position="top-right" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Subscription Packages
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            <Plus size={18} /> Add Package
          </button>
        </div>

        {/* Table */}
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load data</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-900">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Offer Price</th>
                  <th className="px-4 py-3">Months</th>
                  <th className="px-4 py-3">Expiration</th>
                  <th className="px-4 py-3">Benifits</th>
                  <th className="px-4 py-3">Features</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions?.data?.map((pkg) => (
                  <tr
                    key={pkg._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{pkg.name}</td>
                    <td className="px-4 py-3">₹{pkg.price}</td>
                    <td className="px-4 py-3">₹{pkg.offerPrice}</td>
                    <td className="px-4 py-3">{pkg.months}</td>
                    <td className="px-4 py-3">
                      {pkg.expirationDate?.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">{pkg.Benifits}</td>
                    <td className="px-4 py-3">{pkg.features.join(", ")}</td>
                    <td className="px-4 py-3 flex justify-end gap-3">
                      <button
                        onClick={() => openModal(pkg)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? "Edit Package" : "Add Package"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Package Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  name="offerPrice"
                  placeholder="Offer Price"
                  value={formData.offerPrice}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
                {/* Months Dropdown */}
                <select
                  name="months"
                  value={formData.months}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m} {m === 1 ? "Month" : "Months"}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="Benifits"
                  placeholder="Benefits"
                  value={formData.Benifits}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="features"
                  placeholder="Features (comma separated)"
                  value={formData.features}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingId ? "Update Package" : "Create Package"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPackages;
