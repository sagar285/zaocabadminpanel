import React, { useEffect, useState } from "react";
import {
  Image,
  Loader2,
  Pencil,
  Plus,
  Power,
  Trash2,
  Upload,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../Component/Sidebar";
import {
  useCreateHomeBannerMutation,
  useDeleteHomeBannerMutation,
  useGetAllHomeBannersQuery,
  useToggleHomeBannerStatusMutation,
  useUpdateHomeBannerMutation,
  useUploadHomeBannerImageMutation,
} from "../Redux/Api";

const MIN_BANNER_IMAGES = 3;

const createEmptyImageSlots = () => Array.from({ length: MIN_BANNER_IMAGES }, () => "");

const getBannerImagesFromData = (banner) => {
  if (!banner) return createEmptyImageSlots();

  const gallery = Array.isArray(banner.galleryImages)
    ? banner.galleryImages.filter(Boolean)
    : [];

  if (gallery.length >= MIN_BANNER_IMAGES) {
    return gallery;
  }

  const merged = [];
  if (banner.imageUrl) merged.push(banner.imageUrl);
  gallery.forEach((url) => {
    if (url && !merged.includes(url)) merged.push(url);
  });

  while (merged.length < MIN_BANNER_IMAGES) {
    merged.push("");
  }

  return merged;
};

const getCityNameFromEntry = (entry) => {
  if (typeof entry === "string") return entry.trim();
  if (!entry || typeof entry !== "object") return "";

  let rawName = entry.name ?? entry.city ?? "";
  if (rawName && typeof rawName === "object") {
    rawName = rawName.name ?? rawName.city ?? "";
  }

  return String(rawName || "").trim();
};

const getCityEntriesFromBanner = (banner) => {
  if (!banner?.cities?.length) return [];

  return banner.cities
    .map((entry) => {
      const name = getCityNameFromEntry(entry);
      if (!name) return null;

      const isActive =
        typeof entry === "object" && entry?.isActive === false ? false : true;

      return { name, isActive };
    })
    .filter(Boolean);
};

const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const formatExpiryLabel = (dateValue) => {
  if (!dateValue) return "No expiry";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "No expiry";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isExpiredBanner = (dateValue) => {
  if (!dateValue) return false;
  const expiry = new Date(dateValue);
  if (Number.isNaN(expiry.getTime())) return false;
  const endOfExpiryDay = new Date(expiry);
  endOfExpiryDay.setHours(23, 59, 59, 999);
  return new Date() > endOfExpiryDay;
};

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  bannerImages: createEmptyImageSlots(),
  link: "",
  googleMap: "",
  website: "",
  callNumber: "",
  facebook: "",
  instagram: "",
  youtube: "",
  twitter: "",
  targetApp: "passenger",
  showAllCities: false,
  cityEntries: [],
  sortOrder: 0,
  expiryDate: "",
  isActive: true,
};

const targetAppLabel = {
  passenger: "Passenger",
  driver: "Driver / Travel Owner",
  both: "Both",
};

const BannerFormModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSaving,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [cityInput, setCityInput] = useState("");
  const [uploadHomeBannerImage] = useUploadHomeBannerImageMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        bannerImages: getBannerImagesFromData(initialData),
        link: initialData.link || "",
        googleMap: initialData.googleMap || "",
        website: initialData.website || "",
        callNumber: initialData.callNumber || "",
        facebook: initialData.socialMedia?.facebook || "",
        instagram: initialData.socialMedia?.instagram || "",
        youtube: initialData.socialMedia?.youtube || "",
        twitter: initialData.socialMedia?.twitter || "",
        targetApp: initialData.targetApp || "passenger",
        showAllCities: Boolean(initialData.showAllCities),
        cityEntries: getCityEntriesFromBanner(initialData),
        sortOrder: initialData.sortOrder || 0,
        expiryDate: formatDateForInput(initialData.expiryDate),
        isActive: initialData.isActive !== false,
      });
      setCityInput("");
    } else {
      setForm({
        ...emptyForm,
        bannerImages: createEmptyImageSlots(),
        cityEntries: [],
      });
      setCityInput("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG images are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller");
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      setUploadingIndex(index);
      const formData = new FormData();
      formData.append("banner_image", file);
      const response = await uploadHomeBannerImage(formData);

      if (response?.data?.imageUrl) {
        setForm((prev) => {
          const nextImages = [...prev.bannerImages];
          nextImages[index] = response.data.imageUrl;
          return { ...prev, bannerImages: nextImages };
        });
        toast.success(`Image ${index + 1} uploaded`);
      } else {
        toast.error(response?.error?.data?.error || "Image upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadingIndex(null);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    if (form.bannerImages.length <= MIN_BANNER_IMAGES) {
      setForm((prev) => {
        const nextImages = [...prev.bannerImages];
        nextImages[index] = "";
        return { ...prev, bannerImages: nextImages };
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      bannerImages: prev.bannerImages.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const handleAddImageSlot = () => {
    setForm((prev) => ({
      ...prev,
      bannerImages: [...prev.bannerImages, ""],
    }));
  };

  const handleAddCities = () => {
    const names = cityInput
      .split(",")
      .map((city) => city.trim())
      .filter(Boolean);

    if (!names.length) return;

    setForm((prev) => {
      const existing = new Set(
        prev.cityEntries.map((entry) => entry.name.toLowerCase())
      );
      const nextEntries = [...prev.cityEntries];

      names.forEach((name) => {
        if (!existing.has(name.toLowerCase())) {
          nextEntries.push({ name, isActive: true });
          existing.add(name.toLowerCase());
        }
      });

      return { ...prev, cityEntries: nextEntries };
    });
    setCityInput("");
  };

  const handleToggleCityStatus = (index) => {
    setForm((prev) => ({
      ...prev,
      cityEntries: prev.cityEntries.map((entry, entryIndex) =>
        entryIndex === index
          ? { ...entry, isActive: !entry.isActive }
          : entry
      ),
    }));
  };

  const handleRemoveCity = (index) => {
    setForm((prev) => ({
      ...prev,
      cityEntries: prev.cityEntries.filter((_, entryIndex) => entryIndex !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const galleryImages = form.bannerImages.map((image) => image.trim()).filter(Boolean);
    if (galleryImages.length < MIN_BANNER_IMAGES) {
      toast.error(`Please upload at least ${MIN_BANNER_IMAGES} images`);
      return;
    }

    if (!form.showAllCities && form.cityEntries.length === 0) {
      toast.error("Add at least one city or enable Show in all cities");
      return;
    }

    onSubmit({
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      galleryImages,
      imageUrl: galleryImages[0],
      link: form.link,
      googleMap: form.googleMap,
      website: form.website,
      callNumber: form.callNumber,
      socialMedia: {
        facebook: form.facebook,
        instagram: form.instagram,
        youtube: form.youtube,
        twitter: form.twitter,
      },
      targetApp: form.targetApp,
      showAllCities: form.showAllCities,
      isActive: form.isActive,
      cities: form.cityEntries.map((entry) => ({
        name: entry.name.trim(),
        isActive: entry.isActive !== false,
      })),
      expiryDate: form.expiryDate || null,
      sortOrder: Number(form.sortOrder) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">
          {initialData ? "Edit Home Banner" : "Add Home Banner"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border p-2"
              placeholder="Book Your Ride"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Subtitle</label>
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full rounded-lg border p-2"
              placeholder="Fast & Reliable Service"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border p-2"
              rows={4}
              placeholder="Detailed information shown on banner detail page"
            />
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Banner Images</p>
                <p className="text-xs text-gray-500">
                  Minimum {MIN_BANNER_IMAGES} images required. Image 1 shows on home screen. All images slide on detail page.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddImageSlot}
                className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
              >
                + Add Image
              </button>
            </div>

            <div className="space-y-3">
              {form.bannerImages.map((imageUrl, index) => (
                <div
                  key={`banner-image-${index}`}
                  className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-[120px]">
                    <p className="text-sm font-medium">
                      Image {index + 1}
                      {index === 0 ? " (Home Screen)" : ""}
                    </p>
                  </div>

                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                    <Upload size={14} />
                    {isUploading && uploadingIndex === index
                      ? "Uploading..."
                      : imageUrl
                        ? "Replace"
                        : "Upload"}
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(event) => handleImageUpload(event, index)}
                      disabled={isUploading}
                    />
                  </label>

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`Banner ${index + 1}`}
                      className="h-16 w-28 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No image uploaded</span>
                  )}

                  {(form.bannerImages.length > MIN_BANNER_IMAGES || imageUrl) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="rounded-lg border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      {form.bannerImages.length > MIN_BANNER_IMAGES ? "Remove" : "Clear"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Link</label>
              <input
                name="link"
                value={form.link}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
                placeholder="https://example.com/page"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Website</label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Google Map</label>
              <input
                name="googleMap"
                value={form.googleMap}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
                placeholder="https://maps.google.com/..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Call Number</label>
              <input
                name="callNumber"
                value={form.callNumber}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <p className="mb-3 text-sm font-semibold">Social Media Links</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
                placeholder="Facebook URL"
              />
              <input
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
                placeholder="Instagram URL"
              />
              <input
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
                placeholder="YouTube URL"
              />
              <input
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
                placeholder="Twitter / X URL"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Only icons with a link will appear in the app.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Show On</label>
            <select
              name="targetApp"
              value={form.targetApp}
              onChange={handleChange}
              className="w-full rounded-lg border p-2"
            >
              <option value="passenger">Passenger App</option>
              <option value="driver">Driver / Travel Owner App</option>
              <option value="both">Both Passenger & Driver</option>
            </select>
          </div>

          <div className="rounded-lg border p-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="showAllCities"
                checked={form.showAllCities}
                onChange={handleChange}
              />
              Show in all cities
            </label>
          </div>

          {!form.showAllCities ? (
            <div className="rounded-lg border p-4">
              <label className="mb-2 block text-sm font-medium">
                Select Cities
              </label>
              <div className="mb-3 flex gap-2">
                <input
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="w-full rounded-lg border p-2"
                  placeholder="Lucknow, Delhi, Mumbai"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCities();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCities}
                  className="whitespace-nowrap rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                >
                  Add City
                </button>
              </div>

              {form.cityEntries.length > 0 ? (
                <div className="overflow-hidden rounded-lg border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-3 py-2">S. No.</th>
                        <th className="px-3 py-2">City</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.cityEntries.map((city, index) => (
                        <tr key={`${city.name}-${index}`} className="border-t">
                          <td className="px-3 py-2">{index + 1}</td>
                          <td className="px-3 py-2 font-medium">{city.name}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                city.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {city.isActive ? "Active" : "De-active"}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleCityStatus(index)}
                                className={`rounded-md px-3 py-1 text-xs font-medium ${
                                  city.isActive
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                              >
                                {city.isActive ? "De-active" : "Active"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveCity(index)}
                                className="rounded-md border px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Add cities and set each city Active or De-active.
                </p>
              )}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Banner hides from app after this date. Leave empty for no expiry.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const HomeBannerManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const { data, isLoading, refetch } = useGetAllHomeBannersQuery();
  const [createHomeBanner, { isLoading: isCreating }] =
    useCreateHomeBannerMutation();
  const [updateHomeBanner, { isLoading: isUpdating }] =
    useUpdateHomeBannerMutation();
  const [deleteHomeBanner] = useDeleteHomeBannerMutation();
  const [toggleHomeBannerStatus] = useToggleHomeBannerStatusMutation();

  const banners = data?.banners || [];

  const handleSave = async (formData) => {
    try {
      if (selectedBanner?._id) {
        await updateHomeBanner({ id: selectedBanner._id, ...formData }).unwrap();
        toast.success("Banner updated");
      } else {
        await createHomeBanner(formData).unwrap();
        toast.success("Banner created");
      }
      setIsModalOpen(false);
      setSelectedBanner(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.error || "Failed to save banner");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await deleteHomeBanner(id).unwrap();
      toast.success("Banner deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const handleToggleCityInBanner = async (banner, cityName) => {
    try {
      const nextCities = getCityEntriesFromBanner(banner).map((entry) =>
        entry.name === cityName
          ? { ...entry, isActive: !entry.isActive }
          : entry
      );

      await updateHomeBanner({
        id: banner._id,
        cities: nextCities,
      }).unwrap();
      refetch();
      toast.success("City status updated");
    } catch (error) {
      toast.error(error?.data?.error || "Failed to update city status");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleHomeBannerStatus(id).unwrap();
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } p-6`}
      >
        <Toaster />
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Home Banner Slider</h1>
            <p className="text-sm text-gray-600">
              Manage main home screen slider banners by city and app side.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedBanner(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Banner
          </button>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-gray-500">
              <Loader2 className="animate-spin" size={18} />
              Loading banners...
            </div>
          ) : banners.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No banners added yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3">Images</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Show On</th>
                    <th className="px-4 py-3">Cities</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Expiry</th>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner._id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              getBannerImagesFromData(banner)[0] || banner.imageUrl
                            }
                            alt={banner.title}
                            className="h-14 w-24 rounded object-cover"
                          />
                          <span className="text-xs text-gray-500">
                            {getBannerImagesFromData(banner).filter(Boolean).length} imgs
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{banner.title}</div>
                        <div className="text-xs text-gray-500">
                          {banner.subtitle}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {targetAppLabel[banner.targetApp] || banner.targetApp}
                      </td>
                      <td className="px-4 py-3">
                        {banner.showAllCities ? (
                          "All cities"
                        ) : getCityEntriesFromBanner(banner).length ? (
                          <div className="space-y-2">
                            {getCityEntriesFromBanner(banner).map((city) => (
                              <div
                                key={`${banner._id}-${city.name}`}
                                className="flex items-center gap-2"
                              >
                                <span className="min-w-[80px] font-medium">
                                  {city.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleCityInBanner(banner, city.name)
                                  }
                                  className={`rounded-md px-2 py-1 text-xs font-medium ${
                                    city.isActive
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {city.isActive ? "Active" : "De-active"}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(banner._id)}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                            banner.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          <Power size={12} />
                          {banner.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium ${
                            isExpiredBanner(banner.expiryDate)
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {formatExpiryLabel(banner.expiryDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{banner.sortOrder ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedBanner(banner);
                              setIsModalOpen(true);
                            }}
                            className="rounded-lg border p-2 hover:bg-gray-50"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(banner._id)}
                            className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
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
          )}
        </div>
      </div>

      <BannerFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBanner(null);
        }}
        initialData={selectedBanner}
        onSubmit={handleSave}
        isSaving={isCreating || isUpdating}
      />
    </div>
  );
};

export default HomeBannerManagement;
