import { useEffect, useState } from "react";
import { getCreditStatus } from "@/api/axios";

const CreditStatus = () => {
  const [credit, setCredit] = useState<any>(null);

  useEffect(() => {
    const fetchCredit = async () => {
      const res = await getCreditStatus();
      setCredit(res);
    };
    fetchCredit();
  }, []);

  if (!credit) return <div className="p-6">Loading...</div>;

  const percent =
    (credit.usedCredit / credit.totalLimit) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Credit Status
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-lg font-semibold mb-4">
          Available Credit: ₹ {credit.availableCredit}
        </p>

        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            style={{ width: `${percent}%` }}
            className="bg-green-600 h-3 rounded-full"
          />
        </div>

        <p className="text-sm mt-3 text-gray-600">
          Used ₹ {credit.usedCredit} of ₹ {credit.totalLimit}
        </p>
      </div>
    </div>
  );
};

export default CreditStatus;