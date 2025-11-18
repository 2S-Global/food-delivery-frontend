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

  const [pendingcandidates, setAllPendingCandidate] = useState([]);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("Admin_token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    fetchAllPendingCandidate();
  }, [token, apiurl]);

  const fetchAllPendingCandidate = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/api/usercart/list_user_cart_all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("ALL CANDIDATE LIST ==>:", response.data.data);
      setAllPendingCandidate(response.data.data);
    } catch (error) {
      console.error("Error fetching CANDIDATE:", error);
    } finally {
      // setLoading(false);
    }
  };

  const triggerVerificationAPIs = async (pendingcandidate) => {
    try {
      // Ensure selected_verifications exists
      if (!pendingcandidate.selected_verifications) {
        console.warn(
          `No verification types found for ${pendingcandidate.candidate_name}`,
        );
        return;
      }

      // Split verification types correctly
      const verificationTypes =
        pendingcandidate.selected_verifications.split(/\s*,\s*/);

      // console.log(`Verification types for ${pendingcandidate.candidate_name}:`, verificationTypes);

      for (const verificationType of verificationTypes) {
        switch (
          verificationType.trim() // Trim spaces to avoid mismatches
        ) {
          case "PAN":
            const customer_pan_number = pendingcandidate.pan_number;
            const pan_name = pendingcandidate.pan_name;
            const id = pendingcandidate._id;
            console.log(
              `Payment ID: ${id}, Customer PAN Number: ${customer_pan_number}, PAN Name: ${pan_name}`,
            );
            //api call
            console.log("Calling pan Api:", customer_pan_number);
            let pan_response = await axios.post(
              `${apiurl}/api/verify/verifyPAN`,
              {
                customer_pan_number: customer_pan_number,
                pan_holder_name: pan_name,
                id: id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log("PAN Verify Response:", pan_response.data);

            console.log(
              `PAN Verification for ${pendingcandidate.candidate_name}`,
            );
            break;

          case "Aadhar":
            const candidate_aadhaar_number = pendingcandidate.aadhar_number;
            const aadharid = pendingcandidate._id;
            const aadhar_name = pendingcandidate.aadhar_name;

            console.log(
              `Payment ID: ${aadharid}, Candidate Aadhaar Number: ${candidate_aadhaar_number}, Aadhaar Name: ${aadhar_name}`,
            );

            //api call
            console.log("Calling aadhaar Api:", candidate_aadhaar_number);

            let adhar_response = await axios.post(
              `${apiurl}/api/verify/verifyAadhaar`,
              {
                customer_aadhaar_number: candidate_aadhaar_number,
                id: aadharid,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log("Aadhaare Verify Response:", adhar_response.data);

            console.log(
              `Aadhaar Verification for ${pendingcandidate.candidate_name}`,
            );
            break;

          case "EPIC":
            const epic_number = pendingcandidate.epic_number;
            const epicid = pendingcandidate._id;
            const epic_name = pendingcandidate.epic_number;
            console.log(
              `Payment ID: ${epicid}, Epic Number: ${epic_number}, Epic Name: ${epic_name}`,
            );
            //api call
            console.log("Calling epic Api:", epic_number, epic_name);
            const epic_response = await axios.post(
              `${apiurl}/api/verify/verifyEPIC`,
              {
                id: epicid,
                customer_epic_number: epic_number,
                name_to_match: epic_name,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log("Epic Verify Response:", epic_response.data);

            console.log(
              `EPIC Verification for ${pendingcandidate.candidate_name}`,
            );
            break;

          case "Driving Licence":
            const customer_dl_number = pendingcandidate.dl_number;
            const name_to_match = pendingcandidate.dl_name;
            const candidate_dob_og = pendingcandidate.candidate_dob; // Example: "2000-03-27"
            const dob = new Date(candidate_dob_og);
            const customer_dob =
              dob.getDate().toString().padStart(2, "0") +
              "-" +
              (dob.getMonth() + 1).toString().padStart(2, "0") +
              "-" +
              dob.getFullYear();
            const dlid = pendingcandidate._id;
            console.log(
              `Payment ID: ${dlid}, Customer DL Number: ${customer_dl_number}, DL Name: ${name_to_match}, Candidate DOB: ${customer_dob} `,
            );
            //api call
            console.log(
              "Calling dl Api:",
              customer_dl_number,
              name_to_match,
              customer_dob,
            );
            let dl_response = await axios.post(
              `${apiurl}/api/verify/verifyDL`,
              {
                id: dlid,
                customer_dl_number: customer_dl_number,
                name_to_match: name_to_match,
                customer_dob: customer_dob,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log("DL Verify Response:", dl_response.data);

            console.log(
              `Driving Licence Verification for ${pendingcandidate.candidate_name}`,
            );
            break;

          case "Passport":
            const customer_file_number = pendingcandidate.passport_file_number;
            const candidate_name = pendingcandidate.passport_name;
            const passportid = pendingcandidate._id;
            const passportcandidate_dob_og = pendingcandidate.candidate_dob; // Example: "2000-03-27"
            const passportdob = new Date(passportcandidate_dob_og);
            const candidate_dob =
              passportdob.getDate().toString().padStart(2, "0") +
              "-" +
              (passportdob.getMonth() + 1).toString().padStart(2, "0") +
              "-" +
              passportdob.getFullYear();
            console.log(
              `Payment ID: ${passportid}, Customer Passport Number: ${customer_file_number}, Candidate Name: ${candidate_name}, Candidate DOB: ${candidate_dob} `,
            );
            //api call
            console.log(
              "Calling passport Api:",
              customer_file_number,
              candidate_name,
              candidate_dob,
            );
            let passport_response = await axios.post(
              `${apiurl}/api/verify/verifyPassport`,
              {
                id: passportid,
                customer_file_number: customer_file_number,
                name_to_match: candidate_name,
                customer_dob: candidate_dob,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log("Passport Verify Response:", passport_response.data);

            console.log(
              `Passport Verification for ${pendingcandidate.candidate_name}`,
            );
            break;

          default:
            console.warn(`Unknown verification type: "${verificationType}"`);
        }
      }

      //final api call
      /*  try {
                 const finalid = pendingcandidate._id;
                 const final_response = await axios.post(`${apiurl}/api/verify/cloneAndMoveRecordById`,
                     { id: finalid },
                     { headers: { Authorization: `Bearer ${token}`, }, }
                 );
                 console.log("Final response: ", final_response.data);
             }
             catch (error) {
                 console.error("Error while verifying documents:", error);
             } */
    } catch (error) {
      console.error(
        `Error triggering verification APIs for ${pendingcandidate.candidate_name}:`,
        error,
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (pendingcandidates.length > 0) {
      // Wait for all API calls to complete before navigation
      await Promise.all(
        pendingcandidates.map((pendingcandidate) =>
          triggerVerificationAPIs(pendingcandidate),
        ),
      );

      // Navigate to another page after completion
      router.push("/lisdomesticusers");
    } else {
      console.warn("No users available for verification.");
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
                <button className="btn btn-primary me-2" onClick={handleSubmit}>
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
