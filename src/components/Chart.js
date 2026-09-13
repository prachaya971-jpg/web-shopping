import React, { useEffect, useState } from "react";
import axios from "../api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// กำหนดชุดสีสำหรับแต่ละแท่งกราฟ
const BAR_COLORS = [
  "#4F46E5", // Indigo
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Rose/Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#6366F1", // Violet
  "#84CC16", // Lime
];

export default function MonthlyOrderChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/stats/monthly-orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const labels = res.data.map((item) => item.month);
        const sales = res.data.map((item) => Number(item.total_sales));

        // แมปสีให้แต่ละแท่งตาม index (ถ้าเดือนเกิน 12 จะวนลูปสีเดิม)
        const backgroundColors = labels.map(
          (_, index) => BAR_COLORS[index % BAR_COLORS.length]
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "ยอดขายรวม (บาท)",
              data: sales,
              backgroundColor: backgroundColors, // กำหนดเป็น Array ของสี
              borderRadius: 6,
            },
          ],
        });
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-slate-500">กำลังโหลดสถิติ...</div>;
  if (error) return <div className="p-4 text-red-500">เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div style={{ height: 350 }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: { display: true, text: "ยอดขายคำสั่งซื้อรายเดือน (Monthly Sales)" },
              legend: { display: false }, // แนะนำปิด legend ด้านบน เพราะแต่ละแท่งสีไม่เหมือนกัน
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
        />
      </div>
    </div>
  );
}