import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetPackagesQuery,
  useAddPackageMutation,
  useEditPackageMutation,
  useDeletePackageMutation,
} from "../Redux/Api";

import Sidebar from "../Component/Sidebar";

const Packages = () => {
  const { data: packages, isLoading } = useGetPackagesQuery();
  const [addPackage] = useAddPackageMutation();
  const [editPackage] = useEditPackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Add Modal Component
  const AddPackageModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({ name: "", hours: "", km: "", status: 1 });

    const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await addPackage(form).unwrap();
        toast.success("Package added successfully!");
        onClose();
      } catch {
        toast.error("Failed to add package");
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Add Package</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Package Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              name="hours"
              placeholder="Hours"
              value={form.hours}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              name="km"
              placeholder="KM"
              value={form.km}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              name="status"
              type="number"
              placeholder="Status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Edit Modal Component
  const EditPackageModal = ({ isOpen, onClose, packageData }) => {
    const [form, setForm] = useState(packageData || {});

    useEffect(() => {
      setForm(packageData || {});
    }, [packageData]);

    const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await editPackage({ id: form._id, ...form }).unwrap();
        toast.success("Package updated successfully!");
        onClose();
      } catch {
        toast.error("Failed to update package");
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Edit Package</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Package Name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              name="hours"
              placeholder="Hours"
              value={form.hours || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              name="km"
              placeholder="KM"
              value={form.km || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              name="status"
              type="number"
              placeholder="Status"
              value={form.status || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Delete Handler
  const handleDelete = async (id) => {
    try {
      await deletePackage(id).unwrap();
      toast.success("Package deleted successfully!");
    } catch {
      toast.error("Failed to delete package");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Table Component
  const PackageTable = ({ packages }) => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Packages</h2>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Package
        </button>
      </div>
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Hours</th>
            <th className="p-3 text-left">KM</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages?.map((pkg) => (
            <tr key={pkg._id} className="border-t hover:bg-gray-50">
              <td className="p-3">{pkg.name}</td>
              <td className="p-3">{pkg.hours}</td>
              <td className="p-3">{pkg.km}</td>
              <td className="p-3">{pkg.status}</td>
              <td className="p-3 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setIsEditOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
              <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
      <Toaster position="top-right" />
      <PackageTable packages={packages} />
      <AddPackageModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditPackageModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        packageData={selectedPackage}
      />
      </div>
    </div>
  );
};

export default Packages;
