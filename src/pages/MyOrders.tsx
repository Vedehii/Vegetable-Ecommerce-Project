import { useEffect, useState } from "react";
import { getMyOrders } from "@/api/axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await getMyOrders();
      setOrders(res || []);
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  Order #{order.orderNumber}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toDateString()}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600 font-semibold">
                {order.status}
              </span>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="font-bold text-lg">
                ₹ {order.totalAmount}
              </p>

              <button
                onClick={() =>
                  navigate(`/track-order/${order.orderNumber}`)
                }
                className="text-green-600 font-semibold hover:underline"
              >
                Track Order →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;