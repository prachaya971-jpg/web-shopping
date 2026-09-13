import { useEffect, useState, useRef } from "react";
import axios from "../api";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

// ----- Chart.js Register -----
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

// สีสำหรับแท่งหมวดหมู่สินค้า
const CHART_COLORS = [
  "#4F46E5", "#06B6D4", "#10B981", "#F59E0B", 
  "#EF4444", "#EC4899", "#8B5CF6", "#64748B"
];

export default function ProductChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. ตรวจสอบ Token ถ้าไม่มีให้ดีดไปหน้า login ทันที
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // 2. เรียก API: ใช้ "/stats" เพราะใน api.js มี baseURL เป็น "/api" อยู่แล้ว
    axios
      .get("/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const rawData = Array.isArray(res.data) ? res.data : [];
        const labels = rawData.map((item) => item.category || "Uncategorized");
        const data = rawData.map((item) => Number(item.total || 0));

        const backgroundColors = labels.map(
          (_, idx) => CHART_COLORS[idx % CHART_COLORS.length]
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "จำนวนสินค้า (ชิ้น)",
              data,
              backgroundColor: backgroundColors,
              borderRadius: 6,
            },
          ],
        });
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  // ----- Options -----
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { 
        display: true, 
        text: "จำนวนสินค้าแยกตามหมวดหมู่ (Products by Category)",
        font: { size: 16 }
      },
      legend: { display: false },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { stepSize: 1, precision: 0 } 
      },
    },
  };

  // ----- Handle Click บนแท่งกราฟ -----
  const onBarClick = (evt) => {
    const chart = chartRef.current;
    if (!chart) return;

    const points = chart.getElementsAtEventForMode(
      evt,
      "nearest",
      { intersect: true },
      false
    );

    if (points.length) {
      const idx = points[0].index;
      const category = chart.data.labels[idx];
      navigate(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72 text-slate-500 text-sm">
        กำลังโหลดข้อมูลสถิติ...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
        เกิดข้อผิดพลาดในการโหลดกราฟ: {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div style={{ height: 360 }}>
        <Bar
          ref={chartRef}
          data={chartData}
          options={options}
          onClick={onBarClick}
        />
      </div>
    </div>
  );
}