import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";

const Disability = ({ formData, setFormData, apiurl }) => {
  const [disabilityOptions, setDisabilityOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [other_id, setOtherId] = useState(null);

  useEffect(() => {
    const fetchDisabilityOptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/disability_type`
        );
        setDisabilityOptions(response.data.data);
        setOtherId(
          response.data.data.find((item) => item.name === "Others")?.id
        );
      } catch (error) {
        console.error("Error fetching disability options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisabilityOptions();
  }, [apiurl]);

  return (
    <div>
      {loading ? (
        <CustomizedProgressBars />
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="disabilityType">
              <b>Disability Type</b>
              <span style={{ color: "red" }}>*</span>
            </label>
            <select
              id="disabilityType"
              className="form-control"
              value={formData.disability_type || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  disability_type: e.target.value,
                  disability_description: "", // Reset on change
                })
              }
            >
              <option value="">Select Disability Type</option>
              {disabilityOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {formData.disability_type == other_id && (
            <div className="form-group">
              <label htmlFor="disabilityDescription">
                <b>Disability Description</b>
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="disabilityDescription"
                className="form-control"
                value={formData.disability_description || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    disability_description: e.target.value,
                  })
                }
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="workplaceAssistance">
              <b>Do you need assistance at your workplace?</b>
            </label>
            <textarea
              className="form-control"
              style={{ resize: "both", minHeight: "100px", minWidth: "20px" }}
              rows="4"
              value={formData.workplace_assistance || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workplace_assistance: e.target.value,
                })
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Disability;
