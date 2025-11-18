import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import axios from "axios";
import { id } from "date-fns/locale";
const BranchModal = ({
  show,
  onClose,
  setError,
  setErrorId,
  setSuccess,
  setMessageId,
  setRefresh,
  item = {},
}) => {
  if (!show) return null;
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("employer_token");

  const [formData, setFormData] = useState({
    id: item._id || "",
    name: item.name || "",
    country: item.country?._id || "",
    state: item.state?._id || "",
    city: item.city?._id || "",
    address: item.address || "",
    phone: item.phone || "",
    email: item.email || "",
  });

  useEffect(() => {
    FetchCountries();
  }, [apiurl]);

  useEffect(() => {
    if (formData.country) {
      FetchStates(formData.country);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      FetchCities(formData.state);
    }
  }, [formData.state]);

  const FetchCountries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/companyprofile/get_conunty`
      );
      if (response.data.success) {
        const formatted = response.data.data.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setCountries(formatted);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  const FetchStates = async (countryId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/companyprofile/get_state_by_conunty/${countryId}`
      );
      if (response.data.success) {
        const formatted = response.data.data.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setStates(formatted);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoading(false);
    }
  };

  const FetchCities = async (stateId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/companyprofile/get_city_by_state/${stateId}`
      );
      if (response.data.success) {
        const formatted = response.data.data.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setCities(formatted);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handelsubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);

    try {
      // Choose API endpoint based on whether it's an edit or add
      const endpoint = formData.id
        ? `${apiurl}/api/companyprofile/edit_branch`
        : `${apiurl}/api/companyprofile/add_branch`;

      const cleanedData = {
        ...formData,
        city: formData.city || undefined, // remove empty city
        state: formData.state || undefined, // optional if state also isn't mandatory
        country: formData.country || undefined,
      };

      const response = await axios.post(endpoint, cleanedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle success or failure
      if (response.data.success) {
        setSuccess(response.data.message);
        setMessageId(Date.now());

        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(response.data.message || "Operation failed");
        setErrorId(Date.now());
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error saving details, please try again."
      );
      setErrorId(Date.now());
    } finally {
      setRefresh(true);
      setLoading(false);
      setSubmitting(false);
      onClose();
    }
  };

  const isDisabled = loading || submitting;

  return (
    <>
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 1050 }}
        >
          <CustomizedProgressBars />
        </div>
      )}

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Add Branch</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <form
              className="default-form"
              onSubmit={handelsubmit}
              type="multipart/form-data"
              method="post"
            >
              {/* Modal Body */}
              <div className="modal-body">
                <div className="row">
                  {/* Branch Name */}
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group ">
                      <label>
                        Branch Name <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        placeholder="Enter your branch name"
                        className="form-control"
                      />
                    </div>

                    {/* Branch Email */}
                    <div className="form-group ">
                      <label>
                        Branch Email <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="email"
                        name="branchEmail"
                        required
                        placeholder="Enter your branch email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>

                    {/* Branch Phone */}
                    <div className="form-group ">
                      <label>
                        Branch Phone <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="branchPhone"
                        required
                        placeholder="Enter your branch phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Country → State → City stacked in one column */}
                  <div className="col-lg-6 col-md-12">
                    <div className="row">
                      <div className="form-group ">
                        <label>Country</label>
                        <select
                          className="form-select"
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              country: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.value} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group ">
                        <label>State</label>
                        <select
                          className="form-select"
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group ">
                        <label>City</label>
                        <select
                          className="form-select"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                            <option key={city.value} value={city.value}>
                              {city.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="form-group col-lg-12 col-md-12 mt-4">
                    <label>
                      Complete Address{" "}
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <textarea
                      name="address"
                      className="form-control"
                      required
                      rows="2"
                      placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
                      style={{
                        padding: "10px",
                        resize: "vertical",
                        minHeight: "2.5em",
                      }}
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isDisabled}
                  style={{
                    cursor: isDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>{formData.id ? "Update Branch" : "Add Branch"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchModal;
