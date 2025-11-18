import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import SearchableInput from "../academicbox_component/SearchableInput";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import { Trash2 } from "lucide-react";
const ItskillModal = ({
  show,
  onClose,
  item = [],
  setError,
  setSuccess,
  setReload,
}) => {
  if (!show) return null;
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  if (!token) {
    console.log("No token");
  }
  const [loading, setLoading] = useState(true);
  const [allskills, setAllskills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState(allskills);

  useEffect(() => {
    fetchskills();
  }, [apiurl]);

  const fetchskills = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/get_tech_skills`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setAllskills(response.data.data);
        setFilteredSkills(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* form */
  const _id = item._id || "";
  const [skillSearch, setSkillSearch] = useState(item.skillSearch || "");
  const [version, setVersion] = useState(item.version || "");
  const [lastUsed, setLastUsed] = useState(item.lastUsed || "");
  const [experienceyear, setExperienceyear] = useState(
    item.experienceyear || ""
  );
  const [experiencemonth, setExperiencemonth] = useState(
    item.experiencemonth || ""
  );

  const handleSearchChange = (e, setSearch, setFiltered, list, key = "") => {
    const value = e.target.value.replace(/\s+/g, " ");

    setSearch(value);

    // Show everything while the box is empty
    if (!value) {
      setFiltered(list);
      return;
    }

    const query = value.toLowerCase();
    const getText = (item) => (key ? item[key] : item).toString().toLowerCase();

    const filtered = list
      .filter((item) => getText(item).includes(query))
      .sort((a, b) => {
        const aText = getText(a);
        const bText = getText(b);

        // 1️⃣ exact match beats everything
        if (aText === query && bText !== query) return -1;
        if (bText === query && aText !== query) return 1;

        // 2️⃣ prefix match comes next
        const aPrefix = aText.startsWith(query);
        const bPrefix = bText.startsWith(query);
        if (aPrefix && !bPrefix) return -1;
        if (!aPrefix && bPrefix) return 1;

        // 3️⃣ otherwise, earlier index wins
        const posDiff = aText.indexOf(query) - bText.indexOf(query);
        if (posDiff !== 0) return posDiff;

        // 4️⃣ finally, alphabetical as a stable tiebreaker
        return aText.localeCompare(bText);
      });

    setFiltered(filtered);
  };

  const handleSelect = (value, setSearch, setFiltered) => {
    setSearch(value);
    setFiltered([]);
  };
  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const validateForm = () => {
    if (!skillSearch || skillSearch.toString().trim() === "") {
      return false;
    }
    return true;
  };
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [skillSearch]);
  const handleSave = async () => {
    if (!isFormValid) {
      return;
    }
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    setSaving(true);
    try {
      let response = null;
      if (_id) {
        response = await axios.put(
          `${apiurl}/api/candidate/itskill/edititskill`,
          {
            _id,
            skillSearch,
            version,
            lastUsed,
            experienceyear,
            experiencemonth,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${apiurl}/api/candidate/itskill/additskill`,
          {
            skillSearch,
            version,
            lastUsed,
            experienceyear,
            experiencemonth,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (response.data.success) {
        setSaving(false);
        onClose();
        setReload(true);
        setSuccess(response.data.message);
      }
    } catch (error) {
      console.error("Error saving personal details:", error);
      setSaving(false);
      setError(error.response.data.message);
    }
  };

  const handleConfirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      handleDelete();
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    if (!item._id) {
      console.error("No education record selected for deletion.");
      return;
    }
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    try {
      setSaving(true);
      const response = await axios.delete(
        `${apiurl}/api/candidate/itskill/deleteitskill`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            _id: item._id,
          },
        }
      );

      if (response.data.success) {
        //setSaving(false);
        onClose();
        setReload(true);
        setLoading(false);
        setSuccess(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting education record:", error);
      setError("An error occurred while deleting the record.Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (experienceyear === "30+") {
      setExperiencemonth("");
    }
  }, [experienceyear]);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">IT skills</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <form className="default-form">
            <div className="modal-body">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "black",
                }}
                className="mb-3"
              >
                <span>
                  Mention skills like programming languages (Java, Python),
                  software (Microsoft Word, Excel), and more to show your
                  technical expertise.
                </span>
                {item._id && (
                  <span style={{ color: "red", cursor: "pointer" }}>
                    <Trash2 size={20} onClick={handleConfirmDelete} />
                  </span>
                )}
              </div>

              <div className="row">
                <div className="col-md-12 mb-2">
                  {/* Software version */}
                  <div className="form-group">
                    <SearchableInput
                      label="Skill / software name"
                      value={skillSearch}
                      onChange={(e) =>
                        handleSearchChange(
                          e,
                          setSkillSearch,
                          setFilteredSkills,
                          allskills
                        )
                      }
                      options={filteredSkills}
                      onSelect={(value) =>
                        handleSelect(value, setSkillSearch, setFilteredSkills)
                      }
                    />
                  </div>
                </div>

                <div className="col-md-6 mb-2">
                  {/* Software version */}
                  <div className="form-group">
                    <label>Software version</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., 1.0.0"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6  mb-2">
                  {/* Last used */}
                  <div className="form-group">
                    <label>Last used</label>
                    {/* dropdown year 2025 to 1940 */}
                    <select
                      className="form-control"
                      value={lastUsed}
                      onChange={(e) => setLastUsed(e.target.value)}
                    >
                      <option>Select year</option>
                      {Array.from({ length: 101 }, (_, i) => i + 1925)
                        .reverse()
                        .map((year) => (
                          <option key={year}>{year}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row form-group">
                <label>Experience</label>
                <div className="col-md-6 mb-2">
                  <div className="form-group">
                    <select
                      className="form-control"
                      value={experienceyear}
                      onChange={(e) => setExperienceyear(e.target.value)}
                    >
                      <option value="" disabled>
                        Select years
                      </option>
                      {Array.from({ length: 30 }, (_, i) => i).map((year) => (
                        <option key={year}>{year}</option>
                      ))}
                      <option>30+</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6  mb-2">
                  <div className="form-group">
                    <select
                      className="form-control"
                      value={experiencemonth}
                      onChange={(e) => setExperiencemonth(e.target.value)}
                      disabled={experienceyear === "30+"}
                    >
                      <option value="" disabled>
                        Select Month
                      </option>
                      {Array.from({ length: 12 }, (_, i) => i + 0)
                        .reverse()
                        .map((year) => (
                          <option key={year}>{year}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <style jsx>{`
              .tooltip-wrapper {
                position: relative;
                display: inline-block;
              }

              .tooltip-wrapper .custom-tooltip {
                visibility: hidden;
                background-color: white;
                color: red;
                font-weight: bold;
                text-align: center;
                border: 1px solid red;
                border-radius: 4px;
                padding: 5px 10px;
                position: absolute;
                bottom: 100%;
                left: 0;
                margin-bottom: 6px;
                z-index: 1;
                white-space: nowrap;
              }

              .tooltip-wrapper:hover .custom-tooltip {
                visibility: visible;
              }
            `}</style>
            <div className="tooltip-wrapper">
              {!isFormValid && (
                <div className="custom-tooltip">
                  Please fill all required fields
                </div>
              )}
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!isFormValid || saving}
              >
                {item._id ? (
                  <>{saving ? "Updating..." : "Update"}</>
                ) : (
                  <>{saving ? "Saving..." : "Save"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItskillModal;
