import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";

const KeySkillsModal = ({
  show,
  onClose,
  selectedSkills,
  setKeySkill,
  setError,
  setSuccess,
}) => {
  const [skills, setSkills] = useState(selectedSkills || []);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [allskills, setAllskills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load random skills on mount
    setLoading(true);
    axios
      .get(`${apiurl}/api/sql/dropdown/Random_Skill`)
      .then((response) => {
        //  setAllskills(response.data.data || []);
        //  setSuggestedSkills((response.data.data || []).slice(0, 5));
      })
      .catch((error) => {
        console.error("Error fetching random skills:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Dynamically fetch matching skills when user types
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const trimmed = newSkill.trim();

      if (trimmed.length > 2) {
        axios
          .get(
            `${apiurl}/api/sql/dropdown/matching_Skill?skill_name=${trimmed}`
          )
          .then((response) => {
            setAllskills(
              (response.data.data || []).map((skill) => {
                const name = skill || "";
                // Capitalize each word (UC First for multi-word strings)
                return name
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ");
              })
            );
          })
          .catch((error) => {
            console.error("Error fetching matching skills:", error);
          });
      } else {
        setAllskills([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [newSkill]);

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSelectSuggested = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleSave = () => {
    if (skills.length === 0) {
      setError("Please specify at least one Key Skill.");
    } else {
      console.log("Saved Skills:", skills);
      const token = localStorage.getItem("candidate_token");
      if (!token) {
        console.log("No token");
        setError("Authorization token is missing. Please log in.");
        return;
      }

      axios
        .post(
          `${apiurl}/api/useraction/keyskills`,
          { skills: skills },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Skills updated successfully:", response.data);
          setKeySkill(skills || []);
          setSuccess("Key Skills updated successfully");
        })
        .catch((error) => {
          console.error("Error updating skills:", error);
          setError("Error updating skills");
        });

      onClose(skills);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewSkill(value);

    if (allskills.includes(value) && !skills.includes(value)) {
      setSkills([...skills, value]);
      setNewSkill("");
      setError("");
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
      `}
      </style>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Key Skills</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => onClose(skills)}
              ></button>
            </div>
            <div className="modal-body">
              {loading ? (
                <CustomizedProgressBars />
              ) : (
                <>
                  <p style={{ color: "black" }}>
                    Add skills that define your expertise (Minimum 1).
                  </p>

                  {/* Selected Skills */}
                  <div
                    className="mb-3"
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        /*  className="me-2 p-2 mt-2 " */
                        style={{
                          padding: "4px 4px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      >
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}{" "}
                        <button
                          className="btn btn-sm btn-light ms-1 "
                          style={{ color: "red" }}
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Input Box with Datalist */}
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control custom-textarea"
                      placeholder="Enter or select a skill"
                      value={newSkill}
                      onChange={handleInputChange}
                      list="skills-list"
                    />
                    <datalist id="skills-list">
                      {allskills.map((skill, index) => (
                        <option key={index} value={skill} />
                      ))}
                    </datalist>
                  </div>

                  {/* Suggested Skills */}
                  {/*   <div className="mt-3">
                    <p style={{ color: "black" }}>
                      Or select from suggested skills:
                    </p>
                    {suggestedSkills.map((skill, index) => (
                      <button
                        key={index}
                        className="btn btn-outline-secondary m-1"
                        onClick={() => handleSelectSuggested(skill)}
                      >
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </button>
                    ))}
                  </div> */}
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => onClose(skills)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={skills.length === 0}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeySkillsModal;
