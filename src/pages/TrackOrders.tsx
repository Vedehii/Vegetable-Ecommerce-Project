import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { trackOrder } from "@/api/axios";

const steps = ["Placed", "Packed", "Shipped", "Delivered"];

const TrackOrder = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await trackOrder(orderNumber!);
      setOrder(res);
    };
    fetchOrder();
  }, [orderNumber]);

  if (!order) return <div className="p-6">Loading...</div>;

  const currentStep = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Track Order #{order.orderNumber}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step} className="flex-1 text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </div>
              <p className="text-sm mt-2">{step}</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <p className="font-semibold mb-2">Delivery Address</p>
          <p className="text-sm text-gray-600">
            {order.address?.addressLine1}, {order.address?.area},{" "}
            {order.address?.city}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;