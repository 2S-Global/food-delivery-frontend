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


const optionsOrderCount = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        callback: function (value) {
          return Number(value.toFixed(0));
        },
      },
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

  // Added By Chandra Sarkar started -----
  const [orderStatusBarData, setOrderStatusBarData] = useState({
    labels: [],
    datasets: [],
  });

  const [orderRevenueLineChartData, setOrderRevenueLineChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [dateWiseRevenueData, setDateWiseRevenueData] = useState({
    labels: [],
    datasets: [],
  });

  const [ordersByDateData, setOrdersByDateData] = useState({
    labels: [],
    datasets: [],
  });

  const [customersGrowthData, setCustomersGrowthData] = useState({
    labels: [],
    datasets: [],
  });

  const [deliveryPartnersData, setDeliveryPartnersData] = useState({
    labels: [],
    datasets: [],
  });
  // Added By Chandra Sarkar ended -----


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

    // Added By Chandra Sarkar started -----

    const fetchOrderStatusBarData = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/api/order/orders-chart-by-status`, // ← your API endpoint
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = response.data.data;

        if (response.data.success && Array.isArray(data)) {

          // Convert API result into chart format
          const labels = data.map(item => item.status);
          const values = data.map(item => item.orderCount);

          const barData = {
            labels,
            datasets: [
              {
                label: "Orders by Status",
                data: values,
                backgroundColor: [
                  "#1967d2",
                  "#34a853",
                  "#fbbc05",
                  "#ff6d01",
                  "#9c27b0",
                  "#00acc1",
                ], // Optional: different color for each bar
                borderWidth: 1,
              },
            ],
          };

          setOrderStatusBarData(barData);
        }
      } catch (error) {
        console.error("Error fetching order status bar chart", error);
      }
    };

    const fetchRevenueByStatuslineChartData = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/api/order/revenue-by-status`, // ← your API endpoint
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = response.data.data;

        if (response.data.success && Array.isArray(data)) {

          // Convert API result into chart format
          const labels = data.map(item => item.status);
          const values = data.map(item => item.totalRevenue);

          const lineData = {
            labels,
            datasets: [
              {
                label: "Revenue by Status",
                data: values,
                borderColor: "#1967d2",
                backgroundColor: "rgba(25, 103, 210, 0.2)",
                tension: 0.4,
                fill: true,
              },
            ],
          };

          setOrderRevenueLineChartData(lineData);
        }
      } catch (error) {
        console.error("Error fetching order status bar chart", error);
      }
    };

    const fetchDateWiseRevenueData = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/api/order/revenue-by-date`, // ← your API endpoint
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = response.data.data;

        if (response.data.success && Array.isArray(data)) {

          // x-axis labels (dates)
          const labels = data.map((item) =>
            new Date(item.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })
          ); // e.g. "03 Dec", "05 Dec"

          // y-axis values (revenue)
          const revenueValues = data.map((item) => item.totalRevenue);
          // Or: const revenueValues = data.map((item) => item.orderCount);

          const chartData = {
            labels,
            datasets: [
              {
                label: "Revenue ( £ )",
                data: revenueValues,
                borderColor: "#1967d2",
                backgroundColor: "#1967d2",
                tension: 0.4,
                fill: false,
              },
            ],
          };

          setDateWiseRevenueData(chartData);
        }
      } catch (error) {
        console.error("Error fetching order status bar chart", error);
      }
    };

    const fetchOrdersByDateData = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/api/order/orders-by-date`, // ← your API endpoint
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = response.data.data;

        if (response.data.success && Array.isArray(data)) {

          // x-axis labels (dates)
          const labels = data.map((item) =>
            new Date(item.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })
          ); // e.g. "03 Dec", "05 Dec"

          // y-axis values (revenue)
          const revenueValues = data.map((item) => item.orderCount);
          // Or: const revenueValues = data.map((item) => item.orderCount);

          const chartData = {
            labels,
            datasets: [
              {
                label: "Orders",
                data: revenueValues,
                borderColor: "#1967d2",
                backgroundColor: "#1967d2",
                tension: 0.4,
                fill: false,
              },
            ],
          };

          setOrdersByDateData(chartData);
        }
      } catch (error) {
        console.error("Error fetching order status bar chart", error);
      }
    };

    const fetchCustomersGrowthData = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/api/order/customers-by-month`, // ← your API endpoint
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = response.data.data;

        if (response.data.success && Array.isArray(data)) {

          const pieChart1 = {
            labels: data.map(item => item.monthName), // e.g. "January 2025"
            datasets: [
              {
                label: "New Customers",
                data: data.map(item => item.customerCount), // [0,0,0,0,0,0,0,0,0,0,6,0]
                // optional: colors, Chart.js will also auto-assign if omitted
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                ],
                borderWidth: 1,
              },
            ],
          };

          setCustomersGrowthData(pieChart1);
        }
      } catch (error) {
        console.error("Error fetching order status bar chart", error);
      }
    };

    const fetchDeliveryPartnersGrowthData = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/api/order/delivery-partners-by-month`, // ← your API endpoint
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = response.data.data;

        if (response.data.success && Array.isArray(data)) {

          const pieChart1 = {
            labels: data.map(item => item.monthName), // e.g. "January 2025"
            datasets: [
              {
                label: "New Delivery Partners",
                data: data.map(item => item.customerCount), // [0,0,0,0,0,0,0,0,0,0,6,0]
                // optional: colors, Chart.js will also auto-assign if omitted
                backgroundColor: [
                  "#FFE0B2",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#FFB74D",
                  "#EC407A",
                  "#FF9F40",
                ],
                borderWidth: 1,
              },
            ],
          };

          setDeliveryPartnersData(pieChart1);
        }
      } catch (error) {
        console.error("Error fetching order status bar chart", error);
      }
    };

    // Added By Chandra Sarkar ended -----


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
          // fetchPieChart1(),
          // fetchPieChart2(),
          // fetchLinechartData(),
          fetchOrderStatusBarData(),
          fetchRevenueByStatuslineChartData(),
          fetchDateWiseRevenueData(),
          fetchOrdersByDateData(),
          fetchCustomersGrowthData(),
          fetchDeliveryPartnersGrowthData(),

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
              <h4> Orders By Status </h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Bar options={options} data={orderStatusBarData} />

              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> Revenue from Status</h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Line options={options} data={orderRevenueLineChartData} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> Revenue By Date - Last 7 days</h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : dateWiseRevenueData.labels.length === 0 ? (
                <p>No data available</p>
              ) : (
                <Line options={options} data={dateWiseRevenueData} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> Orders By Date - Last 7 days</h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Line options={optionsOrderCount} data={ordersByDateData} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> Customers Joined </h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Pie data={customersGrowthData} options={optionsPie} />
              )}
            </div>
          </div>

          <div className="tabs-box col-md-6">
            <div className="widget-title">
              <h4> Delivery Partner Joined </h4>
            </div>
            <div className="widget-content space-y-6">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <Pie data={deliveryPartnersData} options={optionsPie} />
              )}
            </div>
          </div>

          {/* Candidate Statistics */}

          {/* <div className="tabs-box col-md-6">
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
          </div> */}


          {/* Verification Statistics */}

          {/* <div className="tabs-box col-md-6">
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
          </div> */}

        </div>
      )}
    </>
  );
};

export default ProfileChart;
