"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { se } from "date-fns/locale";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Common chart options
const options = {
  responsive: true,

  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
};

const optionsPie = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
      labels: {
        color: "#333",
        boxWidth: 20,
        padding: 15,
      },
    },
    title: {
      display: false,
      text: "User Distribution by Month",
    },
  },
};

const fakeLineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Total Payments for Institute",
      data: [10, 20, 40, 35, 60, 80],
      backgroundColor: "#1967d2",
      borderColor: "#1967d2",
      tension: 0.4,
    },
  ],
};

const fakeCandidateChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Total Candidate Statistics",
      data: [5, 25, 15, 40, 35, 50],
      backgroundColor: "#ff6d01",
      borderColor: "#ff6d01",
      tension: 0.4,
    },
  ],
};

const ProfileChart = () => {
  const [loading, setLoading] = useState(true);
  const [pieChart1, setPieChart1] = useState({ labels: [], datasets: [] });
  const [pieChart2, setPieChart2] = useState({ labels: [], datasets: [] });

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartData2, setChartData2] = useState({ labels: [], datasets: [] });
  const [token, setToken] = useState(null);

  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [candidateChartData, setCandidateChartData] = useState({
    labels: [],
    datasets: [],
  });

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

useEffect(() => {
  const storedToken = localStorage.getItem("Super_token");
  setToken(storedToken);
}, []);

  useEffect(() => {

     if (!token) return;
    const fetchPieChart1 = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/api/dashboard/getMonthlyCompanyDetails`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success && Array.isArray(response.data.data)) {
          const rawData = response.data.data; // should already be sorted from backend

          // Extract dynamic month labels and values
          const labels = rawData.map(
            (item) => `${item.monthName} ${item.year} (${item.percentage}%)`
          );
          const values = rawData.map((item) => item.total);

          const colorPalette = [
            "#1967d2",
            "#34a853",
            "#fbbc05",
            "#ff6d01",
            "#9c27b0",
            "#00acc1",
            "#ef5350",
            "#ab47bc",
            "#5c6bc0",
            "#29b6f6",
            "#66bb6a",
            "#ffa726",
          ];

          const pieData = {
            labels, // now includes month + year (e.g., "May 2024")
            datasets: [
              {
                label: "Monthly Company User",
                data: values,
                backgroundColor: colorPalette.slice(0, values.length),
                borderWidth: 1,
              },
            ],
          };

          setPieChart1(pieData);
        } else {
          console.error("API data format unexpected", response.data);
        }
      } catch (error) {
        console.error("Error fetching chart data", error);
      }
    };

    const fetchPieChart2 = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/api/dashboard/getMonthlyInstitutionsDetails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;
        if (response.data.success && Array.isArray(response.data.data)) {
          const labels = data.map((item) => `${item.monthName} ${item.year} (${item.percentage}%)`);
          const values = data.map((item) => item.total);
          const colorPalette = [
            "#FF6B6B",
            "#6BCB77",
            "#4D96FF",
            "#FFD93D",
            "#845EC2",
            "#FF9671",
            "#00C9A7",
            "#FFC75F",
            "#F9F871",
            "#A178DF",
            "#FF5C58",
            "#3AB0FF",
          ];

          const pieData2 = {
            labels,
            datasets: [
              {
                label: "Monthly Institute Users",
                data: values,
                backgroundColor: colorPalette.slice(0, values.length),
                borderWidth: 1,
              },
            ],
          };

          setPieChart2(pieData2);
        }
      } catch (error) {
        console.error("Error fetching chart data", error);
        setLoading(false);
      }
    };

    const fetchLinechartData = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/api/dashboard/getMonthlyCandidateDetails`,
           {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;

        if (response.data.success && Array.isArray(response.data.data)) {
          const labels = data.map((item) => item.monthName);
          const values = data.map((item) => item.total);

          const chartData = {
            labels,
            datasets: [
              {
                label: "Total Candidate Statistics",
                data: values,
                backgroundColor: "#ff6d01",
                borderColor: "#ff6d01",
                tension: 0.4,
              },
            ],
          };

          setChartData(chartData);
        }
      } catch (error) {
        console.error("Error fetching line chart data", error);
        setLoading(false);
      }
    };

const chartData2 = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Total User Statistics",
      data: [100, 150, 180, 210, 267], // 👈 Static values
      backgroundColor: "#7490fa",
      borderColor: "#ff6d01",
      tension: 0.4,
    },
  ],
};
setChartData2(chartData2);
    // Simulate loading
    setTimeout(() => {
      // setChartData(fakeBarChartData);
      setLineChartData(fakeLineChartData);
      setCandidateChartData(fakeCandidateChartData);
      // setLoading(false);
    }, 500);

    const fetchAll = async () => {
      try {
          

        await Promise.allSettled([
          fetchPieChart1(),
          fetchPieChart2(),
          fetchLinechartData(),
       
        ]);
      } catch (error) {
        console.error("Error fetching one or more chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const barChart1 = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Company",
        data: [12000, 15000, 14000, 16000, 17000],
        backgroundColor: "rgba(0, 102, 204, 0.85)", // Deep Blue
      },
      {
        label: "Institute",
        data: [10000, 13000, 12500, 13500, 35000],
        backgroundColor: "rgba(204, 153, 0, 0.85)", // Deep Yellow-Gold
      },
      {
        label: "Candidate",
        data: [8000, 9000, 9500, 10000, 11000],
        backgroundColor: "rgba(0, 153, 102, 0.85)", // Deep Teal-Green
      },
    ],
  };

  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row space-y-10">
          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> Payments History</h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Bar options={options} data={barChart1} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> Payments from Company</h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Line options={options} data={lineChartData} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> Payments from Institute</h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Line options={options} data={lineChartData} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> Payments from Candidate</h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Line options={options} data={lineChartData} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> User In Company</h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Pie data={pieChart1} options={optionsPie} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> User In Institute </h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Pie data={pieChart2} options={optionsPie} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> Candidate Statistics</h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Line options={options} data={chartData} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4>Verification Statistics</h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Line options={options} data={chartData2} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileChart;
