import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { forEach } from "@/data/blogs";
const CardPaymentForm = ({ show, onClose, mainamount }) => {
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(mainamount);
  const [token, setToken] = useState(null);
  const [payments, setPayments] = useState([]);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("Admin_token");
    setToken(storedToken);
  }, []);

  const handlePayNow = async () => {
    // Add 'async' here
    try {
      const response = await axios.get(
        `${apiurl}/api/usercart/list_user_cart_all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setPayments(response.data.data);
        console.log("Updated Payments:", response.data.data);

        response.data.data.forEach(async (payment) => {
          //console.log("PAN Name:", payment.pan_name);

          if (payment.pan_name && payment.pan_number) {
            const customer_pan_number = payment.pan_number;
            const pan_name = payment.pan_name;
            const id = payment._id;
            console.log(
              `Payment ID: ${id}, Customer PAN Number: ${customer_pan_number}, PAN Name: ${pan_name}`,
            );
            //api call
            console.log("Calling pan Api:", customer_pan_number);
            /*    let pan_response = await axios.post(
                              `${apiurl}/api/verify/verifyPAN`,
                              {
                                  customer_pan_number: customer_pan_number,
                                  pan_holder_name: pan_name,
                                  id: id
                              },
                              {
                                  headers: {
                                      Authorization: `Bearer ${token}`,
                                  },
                              }
                          );
                          console.log("PAN Verify Response:", pan_response.data); */
          } else {
            console.log(
              "No PAN payment ID:",
              payment._id,
              payment.candidate_name,
            );
          }

          if (payment.aadhar_name && payment.aadhar_number) {
            const candidate_aadhaar_number = payment.aadhar_number;
            const id = payment._id;
            const aadhar_name = payment.aadhar_name;
            console.log(
              `Payment ID: ${id}, Candidate Aadhaar Number: ${candidate_aadhaar_number}, Aadhaar Name: ${aadhar_name}`,
            );

            //api call
            console.log("Calling aadhaar Api:", candidate_aadhaar_number);

            /* let adhar_response = await axios.post(
                            `${apiurl}/api/verify/verifyAadhaar`,
                            {
                                customer_aadhaar_number: candidate_aadhaar_number,
                                id: id,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        console.log("Aadhaare Verify Response:", adhar_response.data); */
          } else {
            console.log(
              "No Aadhaar payment ID:",
              payment._id,
              payment.candidate_name,
            );
          }

          if (payment.dl_name && payment.dl_number && payment.candidate_dob) {
            const customer_dl_number = payment.dl_number;
            const name_to_match = payment.dl_name;
            const candidate_dob_og = payment.candidate_dob; // Example: "2000-03-27"
            const dob = new Date(candidate_dob_og);
            const customer_dob =
              dob.getDate().toString().padStart(2, "0") +
              "-" +
              (dob.getMonth() + 1).toString().padStart(2, "0") +
              "-" +
              dob.getFullYear();
            const id = payment._id;
            console.log(
              `Payment ID: ${id}, Customer DL Number: ${customer_dl_number}, DL Name: ${name_to_match}, Candidate DOB: ${customer_dob} `,
            );
            //api call
            console.log(
              "Calling dl Api:",
              customer_dl_number,
              name_to_match,
              customer_dob,
            );
            /*   let dl_response = await axios.post(
                              `${apiurl}/api/verify/verifyDL`,
                              {
                                  id,
                                  customer_dl_number: customer_dl_number,
                                  name_to_match: name_to_match,
                                  customer_dob: customer_dob
                              },
                              {
                                  headers: {
                                      Authorization: `Bearer ${token}`,
                                  },
                              }
                          );
                          console.log("DL Verify Response:", dl_response.data); */
          } else {
            console.log(
              "No DL payment ID:",
              payment._id,
              payment.candidate_name,
            );
          }
          if (payment.epic_name && payment.epic_number) {
            const epic_number = payment.epic_number;
            const id = payment._id;
            const epic_name = payment.epic_number;
            console.log(
              `Payment ID: ${id}, Epic Number: ${epic_number}, Epic Name: ${epic_name}`,
            );
            //api call
            /*  console.log("Calling epic Api:", epic_number, epic_name)
                          const epic_response = await axios.post(
                              `${apiurl}/api/verify/verifyEPIC`,
                              {
                                  id,
                                  customer_epic_number: epic_number,
                                  name_to_match: epic_name
                              },
                              {
                                  headers: {
                                      Authorization: `Bearer ${token}`,
                                  },
                              }
                          );
                          console.log("Epic Verify Response:", epic_response.data); */
          } else {
            console.log(
              "No Epic payment ID:",
              payment._id,
              payment.candidate_name,
            );
          }
          if (payment.passport_name && payment.passport_file_number) {
            const customer_file_number = payment.passport_file_number;
            const candidate_name = payment.passport_name;
            const id = payment._id;
            const candidate_dob_og = payment.candidate_dob; // Example: "2000-03-27"
            const dob = new Date(candidate_dob_og);
            const candidate_dob =
              dob.getDate().toString().padStart(2, "0") +
              "-" +
              (dob.getMonth() + 1).toString().padStart(2, "0") +
              "-" +
              dob.getFullYear();
            console.log(
              `Payment ID: ${id}, Customer Passport Number: ${customer_file_number}, Candidate Name: ${candidate_name}, Candidate DOB: ${candidate_dob} `,
            );
            //api call
            console.log(
              "Calling passport Api:",
              customer_file_number,
              candidate_name,
              candidate_dob,
            );
            /*  let passport_response = await axios.post(
                              `${apiurl}/api/verify/verifyPassport`,
                              {
                                  id,
                                  customer_file_number: customer_file_number,
                                  name_to_match: candidate_name,
                                  customer_dob: candidate_dob
                              },
                              {
                                  headers: {
                                      Authorization: `Bearer ${token}`,
                                  },
                              }
                          );
                          console.log("Passport Verify Response:", passport_response.data);
 */
          } else {
            console.log(
              "No Passport payment ID:",
              payment._id,
              payment.candidate_name,
            );
          }

          //final api call
          console.log(
            "Calling Final Api:",
            payment._id,
            payment.candidate_name,
          );
          /*  try {
                        const id = payment._id;
                         const final_response = await axios.post(
                             `${apiurl}/api/verify/cloneAndMoveRecordById`,
                             {
                                 id,
                             },
                             { headers: { Authorization: `Bearer ${token}`, }, }
                         );
                         console.log("Final response: ", final_response.data);
                    }
                    catch (error) {
                        console.error("Error while verifying documents:", error);
                    } */

          //empty payment
          payment = null;
        });
      } else {
        setError("Failed to fetch data.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <style>
        {`
  .custom-textarea::placeholder {
    color: #c7c5c5!important;
    font-size: 15px !important;
  
  }
      .suggestion-btn {
            
            bottom: -0px;
            left: 10;
            display: flex;
            align-items: center;
            gap: 5px;
            background-color: #e8f0fe;
            color: #1a73e8;
            border-radius: 20px;
            padding: 6px 12px;
            border: none;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
          }

          .suggestion-btn:hover {
            background-color: #d2e3fc;
          }

          .suggestion-btn svg {
            width: 16px;
            height: 16px;
          }
`}
      </style>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Card Payment</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Textarea Input */}
              <div className="container">
                <h5 className="mb-3">Input Your Card Details</h5>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Card Holder Name"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                />

                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Card Number (16 digits)"
                      maxLength="16"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="password"
                      className="form-control mb-3"
                      placeholder="CVV"
                      maxLength="3"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <div className="d-flex justify-content-start">
                <button className="btn btn-primary me-2" onClick={handlePayNow}>
                  Pay Now (INR {amount})
                </button>
                <button className="btn btn-secondary" onClick={onClose}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardPaymentForm;
