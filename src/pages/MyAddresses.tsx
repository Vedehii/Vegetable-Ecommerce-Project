//import { useEffect, useState } from "react";
//import { getMyAddresses, addAddress } from "@/api/axios";

//const MyAddresses = () => {
//  const [addresses, setAddresses] = useState<any[]>([]);
//  const [form, setForm] = useState<any>({});

//  useEffect(() => {
//    fetchAddresses();
//  }, []);

//  const fetchAddresses = async () => {
//    const res = await getMyAddresses();
//    setAddresses(res || []);
//  };

//  const handleAdd = async () => {
//    await addAddress(form);
//    fetchAddresses();
//  };

//  return (
//    <div className="min-h-screen bg-gray-50 p-6">
//      <h1 className="text-3xl font-bold mb-6">My Addresses</h1>

//      <div className="grid gap-6 md:grid-cols-2">
//        {addresses.map((addr) => (
//          <div
//            key={addr._id}
//            className="bg-white p-5 rounded-xl shadow"
//          >
//            <p className="font-semibold">{addr.fullName}</p>
//            <p className="text-sm text-gray-600">
//              {addr.addressLine1}, {addr.area}, {addr.city}
//            </p>
//            {addr.isDefault && (
//              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded mt-2 inline-block">
//                Default
//              </span>
//            )}
//          </div>
//        ))}
//      </div>

//      <div className="mt-8 bg-white p-6 rounded-xl shadow">
//        <h2 className="font-semibold mb-4">Add New Address</h2>
//        <input
//          placeholder="Full Name"
//          className="border p-2 w-full mb-3 rounded"
//          onChange={(e) =>
//            setForm({ ...form, fullName: e.target.value })
//          }
//        />
//        <button
//          onClick={handleAdd}
//          className="bg-green-600 text-white px-4 py-2 rounded"
//        >
//          Add Address
//        </button>
//      </div>
//    </div>
//  );
//};

//export default MyAddresses;





import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Phone, User } from "lucide-react";
import { getMyAddresses, addAddress } from "@/api/axios";

interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  area: string;
  pincode: string;
  isDefault?: boolean;
}

const MyAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<Address>({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    area: "",
    pincode: "",
    isDefault: false,
  });

  // 🔥 Fetch Addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await getMyAddresses();
      const data = res?.data || res || [];
      setAddresses(data);
    } catch (err) {
      console.log("Address Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // 🔥 Handle Input Change
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔥 Add Address
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await addAddress(formData);
      setShowForm(false);
      setFormData({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        area: "",
        pincode: "",
        isDefault: false,
      });
      fetchAddresses();
    } catch (err) {
      console.log("Add Address Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/40 p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Addresses</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold"
          >
            <Plus size={16} />
            Add Address
          </button>
        </div>

        {/* ADD FORM */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6 grid md:grid-cols-2 gap-4"
          >
            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="input-style"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="input-style"
            />
            <input
              name="addressLine1"
              placeholder="Address Line"
              value={formData.addressLine1}
              onChange={handleChange}
              required
              className="input-style md:col-span-2"
            />
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="input-style"
            />
            <input
              name="area"
              placeholder="Area"
              value={formData.area}
              onChange={handleChange}
              required
              className="input-style"
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="input-style"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              Set as Default Address
            </label>

            <button
              type="submit"
              className="md:col-span-2 bg-primary text-white py-2 rounded-xl font-semibold"
            >
              Save Address
            </button>
          </motion.form>
        )}

        {/* ADDRESS LIST */}
        {loading ? (
          <p>Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <p className="text-muted-foreground">No addresses added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <motion.div
                key={addr._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-md p-5 border border-border"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User size={16} /> {addr.fullName}
                  </h3>
                  {addr.isDefault && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone size={14} /> {addr.phone}
                </p>

                <p className="text-sm mt-2 flex items-start gap-2">
                  <MapPin size={14} />
                  {addr.addressLine1}, {addr.area}, {addr.city} - {addr.pincode}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* SIMPLE INPUT STYLE */}
      <style>
        {`
          .input-style {
            padding: 10px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            font-size: 14px;
          }
          .input-style:focus {
            outline: none;
            border-color: #16a34a;
            background: white;
          }
        `}
      </style>
    </div>
  );
};

export default MyAddresses;