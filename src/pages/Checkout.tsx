import { useState, useEffect } from "react";
import { placeOrder, getMyAddresses } from "@/api/axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      const res = await getMyAddresses();
      setAddresses(res || []);
    };
    fetchAddresses();
  }, []);

  const handleOrder = async () => {
    const res = await placeOrder({ addressId: selected });
    navigate(`/track-order/${res.orderNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Checkout
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">
          Select Address
        </h2>

        {addresses.map((addr) => (
          <div key={addr._id} className="mb-3">
            <input
              type="radio"
              value={addr._id}
              onChange={(e) =>
                setSelected(e.target.value)
              }
            />
            <span className="ml-2">
              {addr.addressLine1}, {addr.city}
            </span>
          </div>
        ))}

        <button
          onClick={handleOrder}
          className="bg-green-600 text-white px-6 py-2 rounded mt-4"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;