import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";

const getComparableDateValue = (year, month) => {
  if (!year || !month) return null;
  return parseInt(year) * 100 + parseInt(month); // e.g., 202405
};
const CareerBreak = ({ formData, setFormData, apiurl, setWrongDate }) => {
  const [careerBreakOptions, setCareerBreakOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

  useEffect(() => {
    /* /api/sql/dropdown/career_break_reason */
    const fetchCareerBreakOptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/career_break_reason`
        );
        setCareerBreakOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching career break options:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCareerBreakOptions();
  }, [apiurl]);

  // Validation logic
  useEffect(() => {
    const startValue = getComparableDateValue(
      formData.career_break_start_year,
      formData.career_break_start_month
    );
    const endValue = getComparableDateValue(
      formData.career_break_end_year,
      formData.career_break_end_month
    );

    if (startValue && endValue) {
      if (startValue > endValue) {
        setError("Break start date cannot be after break end date.");
        setWrongDate(true);
      } else {
        setError("");
        setWrongDate(false);
      }
    }
  }, [
    formData.career_break_start_year,
    formData.career_break_start_month,
    formData.career_break_end_year,
    formData.career_break_end_month,
    formData.currently_on_career_break,
  ]);

  useEffect(() => {
    if (formData.currently_on_career_break) {
      setError("");
    }
  }, [formData.currently_on_career_break]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const generateMonthOptions = (selectedYear) => {
    const maxMonth = selectedYear === currentYear ? currentMonth : 12;
    return monthNames.slice(0, maxMonth).map((month, index) => (
      <option key={index + 1} value={index + 1}>
        {month}
      </option>
    ));
  };

  return (
    <>
      {loading ? (
        <CustomizedProgressBars />
      ) : (
        <>
          {" "}
          <div className="mb-3 form-group">
            <label className="form-label">
              <b>Reason of break</b>
              <span style={{ color: "red" }}>*</span>
            </label>
            <div className="d-flex gap-2 flex-wrap">
              {careerBreakOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={(e) =>
                    setFormData({
                      ...formData,
                      career_break_reason: option.id,
                    })
                  }
                  className={`btn option-btn rounded-pill ${
                    formData.career_break_reason == option.id ? "active" : ""
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
          {/* break start from */}
          <div className="mb-3 form-group row">
            <label className="form-label">
              <b>Break started from</b> <span style={{ color: "red" }}>*</span>
            </label>
            <div className="col-md-6">
              <select
                className="form-select"
                value={formData.career_break_start_year || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    career_break_start_year: e.target.value,
                    career_break_start_month: "", // reset month on year change
                  })
                }
              >
                <option value="">Select Year</option>
                {Array.from({ length: 30 }, (_, i) => {
                  const year = currentYear - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={formData.career_break_start_month || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    career_break_start_month: e.target.value,
                  })
                }
              >
                <option value="">Select Month</option>
                {generateMonthOptions(
                  parseInt(formData.career_break_start_year)
                )}
              </select>
            </div>
          </div>
          {!formData.currently_on_career_break && (
            <>
              <div className="mb-3 form-group row">
                <label className="form-label">
                  <b>Break ended in</b> <span style={{ color: "red" }}>*</span>
                </label>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={formData.career_break_end_year || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        career_break_end_year: e.target.value,
                        career_break_end_month: "", // reset month on year change
                      })
                    }
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 30 }, (_, i) => {
                      const year = currentYear - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={formData.career_break_end_month || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        career_break_end_month: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Month</option>
                    {generateMonthOptions(
                      parseInt(formData.career_break_end_year)
                    )}
                  </select>
                </div>
              </div>
            </>
          )}
          {error && <div className="text-danger mb-3">{error}</div>}
          {formData.currently_on_career_break && (
            <>
              <div className="form-group mb-3 col-md-3">
                <label className="form-label">
                  <b>To</b>
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={"Present"}
                  placeholder="If currently on break, leave this empty"
                  readOnly
                />
              </div>
            </>
          )}
          {/* Currently on career break */}
          <div className="mb-3 form-group">
            <input
              type="checkbox"
              checked={formData.currently_on_career_break}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currently_on_career_break: e.target.checked,
                })
              }
            />
            <label className="form-label ms-2">Currently on a break</label>
            <div></div>
          </div>
          {formData.currently_on_career_break && (
            <div className="alert alert-warning">
              <strong>Note:</strong> If you are currently on a break, please
              ensure to update your profile when you return to work.
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CareerBreak;
