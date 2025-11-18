"use client";

import MobileMenu from "../../../../header/AdminMobileMenu";
import DashboardHeader from "../../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../../header/DashboardAdminsidebar";
import CopyrightFooter from "../../../CopyrightFooter";
import { Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const Index = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employerId = searchParams.get("id");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const [token, setToken] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // Billing info based on the API response
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(48); // From the response
  const [sgst, setSgst] = useState(0);
  const [sgstPercentage, setSgstPercentage] = useState(9); // From the response
  const [cgst, setCgst] = useState(0);
  const [cgstPercentage, setCgstPercentage] = useState(9); // From the response
  const [total, setTotal] = useState(0);

  // Get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("Super_token");
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch user cart when token and employerId are ready
  useEffect(() => {
    if (token && employerId) {
      (async () => {
        setLoading(true);
        await fetchUserCart();
      })();
    }
  }, [token, employerId]);

  const fetchUserCart = async () => {
    try {
      const response = await axios.post(
        `${apiurl}/api/usercart/list_user_cart_admin`,
        { employer_id: employerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { data, overall_billing, company_name } = response.data;
      setPayments(data);
      setCompanyName(company_name || "N/A");

      // Use API values directly (no calculation needed)
      setSubTotal(parseFloat(overall_billing.subtotal || 0));
      setDiscount(parseFloat(overall_billing.discount || 0));
      setDiscountPercentage(parseFloat(overall_billing.discount_percent || 0));
      setSgst(parseFloat(overall_billing.sgst || 0));
      setSgstPercentage(parseFloat(overall_billing.sgst_percent || 0));
      setCgst(parseFloat(overall_billing.cgst || 0));
      setCgstPercentage(parseFloat(overall_billing.cgst_percent || 0));
      setTotal(parseFloat(overall_billing.total || 0));
    } catch (err) {
      console.error("Error fetching user cart:", err);
      setError("Failed to load user cart");
    } finally {
      setLoading(false);
    }
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      <DashboardHeader />
      <MobileMenu />
      <DashboardEmployerSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <div className="row">
            <div className="col-lg-12">
              <div className="applicants-widget ls-widget">
                <div className="widget-title">
                  <h4>Cart List ({companyName})</h4>
                </div>

                <div className="container">
                  {loading ? (
                    <div className="text-center py-5">
                      {/* Bootstrap Loader */}
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th style={{ textAlign: "center" }}>#</th>
                            <th style={{ textAlign: "center" }}>Name</th>
                            <th style={{ textAlign: "center" }}>
                              Mobile Number
                            </th>
                            <th style={{ textAlign: "center" }}>Pay For</th>
                            <th style={{ textAlign: "center" }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.length > 0 ? (
                            payments.map((payment, index) => (
                              <tr key={payment.id}>
                                <td style={{ textAlign: "center" }}>
                                  {index + 1}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {payment.name}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {payment.mobile || "N/A"}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {payment.payFor || "N/A"}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {payment.amount} INR
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" style={{ textAlign: "center" }}>
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {payments.length > 0 && (
                        <div className="p-3 bg-light rounded">
                          <p className="d-flex justify-content-between mb-1">
                            <span>Sub-Total :</span>{" "}
                            <span>{subTotal.toFixed(2)} INR</span>
                          </p>
                          <p className="d-flex justify-content-between mb-1">
                            <span>Discount ({discountPercentage}%) :</span>{" "}
                            <span>- {discount.toFixed(2)} INR</span>
                          </p>
                          <p className="d-flex justify-content-between mb-1">
                            <span>SGST ({sgstPercentage}%) :</span>{" "}
                            <span>{sgst.toFixed(2)} INR</span>
                          </p>
                          <p className="d-flex justify-content-between mb-1">
                            <span>CGST ({cgstPercentage}%) :</span>{" "}
                            <span>{cgst.toFixed(2)} INR</span>
                          </p>
                          <p className="d-flex justify-content-between fw-bold fs-5">
                            <span>Total :</span>{" "}
                            <span>{total.toFixed(2)} INR</span>
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CopyrightFooter />

      {isModalOpen && (
        <AddCompanyModal show={isModalOpen} onClose={closeModalRH} />
      )}
    </div>
  );
};

export default Index;
