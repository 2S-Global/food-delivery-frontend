"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import AsyncSelect from "react-select/async";
import { se } from "date-fns/locale/se";

const VerificationFormSection = ({
  formdata,
  setFormData,
  onClose,
  is_complete,
}) => {
  // ✅ Skip rendering when complete
  if (is_complete) return null;

  const defaultOptions = formdata.course_id
    ? [{ value: formdata.course_id, label: formdata.course_name }]
    : [];

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  // =============================
  // 🔹 Local State
  // =============================
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const [courseModes, setCourseModes] = useState([]);
  const [grading_systems, setGradingSystems] = useState([]);

  // =============================
  // 🔹 Handlers (Memoized)
  // =============================
  const handleToggle = useCallback(
    (field) => (e) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.checked,
      }));
    },
    [setFormData]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setFormData]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onClose();
    },
    [onClose]
  );

  // =============================
  // 🔹 Auto-enable related flags
  // =============================
  useEffect(() => {
    if (formdata.is_verified) {
      setFormData((prev) => ({
        ...prev,
        level_verified: true,
        courseType_verified: true,
        courseName_verified: true,
        duration_verified: true,
        gradingSystem_verified: true,
        marks_verified: true,
      }));
    }
  }, [formdata.is_verified, setFormData]);

  // =============================
  // 🔹 Fetch Dropdowns (Levels & Course Modes)
  // =============================
  const fetchDropdowns = useCallback(async () => {
    setLoading(true);
    try {
      const [levelsRes, courseRes] = await Promise.all([
        axios.get(`${apiurl}/api/sql/dropdown/education_level`),
        axios.get(`${apiurl}/api/sql/dropdown/course_type`),
      ]);

      setLevels(levelsRes.data?.data || []);
      setCourseModes(courseRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    } finally {
      setLoading(false);
    }
  }, [apiurl]);

  // =============================
  // 🔹 Fetch Grading Systems
  // =============================
  const fetchGradingSystems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/grading_system`
      );
      setGradingSystems(response.data.data);
    } catch (error) {
      console.error("Error fetching grading systems:", error);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔹 Initial Data Load
  // =============================
  useEffect(() => {
    fetchDropdowns();
    fetchGradingSystems();
  }, [fetchDropdowns]);

  // =============================
  // 🔹 Fetch Matching Courses
  // =============================
  const fetchCourses = async (inputValue) => {
    if (!inputValue || inputValue.trim() === "") return [];

    try {
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/matching_courses`,
        { params: { course_name: inputValue } }
      );

      return (
        response.data?.data?.map((item) => ({
          label: item.name,
          value: item.id,
        })) || []
      );
    } catch (error) {
      console.error("Error loading courses:", error);
      return [];
    }
  };

  // =============================
  // 🔹 Handle Course Selection
  // =============================
  const handleCourseChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      course_id: selectedOption ? selectedOption.value : "",
      course_name: selectedOption ? selectedOption.label : "",
    }));
  };
  // =============================
  // 🔹 JSX
  // =============================
  if (loading) return <CustomizedProgressBars />;

  return (
    <form onSubmit={handleSubmit} className="default-form">
      <div className="row g-3">
        {/* Verified Switch */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="verifiedSwitch"
            checked={!!formdata.is_verified}
            onChange={handleToggle("is_verified")}
          />
          <label className="form-check-label" htmlFor="verifiedSwitch">
            All Details Verified
          </label>
        </div>

        {/* Level Verified Switch */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="levelVerifiedSwitch"
            checked={!!formdata.level_verified}
            disabled={formdata.is_verified}
            onChange={handleToggle("level_verified")}
          />
          <label className="form-check-label" htmlFor="levelVerifiedSwitch">
            Level Verified
          </label>
        </div>

        {/* Level Dropdown */}
        <div className="form-group">
          <label>
            Select Level <span style={{ color: "red" }}>*</span>
          </label>
          <select
            className="form-control"
            name="level"
            value={formdata.level || ""}
            onChange={handleChange}
            required
            disabled={formdata.level_verified}
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.level}
              </option>
            ))}
          </select>
        </div>

        {/* Course Type Verified Switch */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="courseTypeVerifiedSwitch"
            checked={!!formdata.courseType_verified}
            disabled={formdata.is_verified}
            onChange={handleToggle("courseType_verified")}
          />
          <label
            className="form-check-label"
            htmlFor="courseTypeVerifiedSwitch"
          >
            Course Type Verified
          </label>
        </div>

        {/* Course Type */}
        <div className="form-group">
          <label>
            Course Type <span style={{ color: "red" }}>*</span>
          </label>
          {courseModes.map((item) => (
            <div key={item.id} className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="course_type"
                value={item.id}
                disabled={formdata.courseType_verified}
                checked={Number(formdata.course_type) === Number(item.id)}
                onChange={handleChange}
              />
              <label className="form-check-label">{item.name}</label>
            </div>
          ))}
        </div>

        {/* Course Name Verified Switch */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="courseNameVerifiedSwitch"
            checked={!!formdata.courseName_verified}
            disabled={formdata.is_verified}
            onChange={handleToggle("courseName_verified")}
          />
          <label
            className="form-check-label"
            htmlFor="courseNameVerifiedSwitch"
          >
            Course Name Verified
          </label>
        </div>
        {/* Course Name Selector */}
        <div className="form-group">
          <label>
            Course Name <span style={{ color: "red" }}>*</span>
          </label>

          <AsyncSelect
            cacheOptions
            defaultOptions={defaultOptions}
            loadOptions={fetchCourses}
            isClearable
            isSearchable
            onChange={handleCourseChange}
            value={
              formdata.course_id
                ? { label: formdata.course_name, value: formdata.course_id }
                : null
            }
            placeholder="Enter or select a course name"
            isDisabled={formdata.courseName_verified}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#ced4da",
                minHeight: "38px",
                boxShadow: "none",
                "&:hover": { borderColor: "#86b7fe" },
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />
        </div>
        {/* Course Duration Verified Switch */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="courseDurationVerifiedSwitch"
            checked={!!formdata.duration_verified}
            disabled={formdata.is_verified}
            onChange={handleToggle("duration_verified")}
          />
          <label
            className="form-check-label"
            htmlFor="courseDurationVerifiedSwitch"
          >
            Course Duration Verified
          </label>
        </div>

        {/* Course Duration */}
        <div className="form-group row align-items-center">
          <label className="col-12">
            Course Start and End Year
            <span style={{ color: "red" }}>*</span>
          </label>

          {/* Start Year */}
          <div className="col-sm-5">
            <select
              className="form-control"
              onChange={(e) =>
                setFormData({
                  ...formdata,
                  duration: {
                    ...formdata.duration,
                    from: e.target.value,
                  },
                })
              }
              disabled={formdata.duration_verified}
              value={formdata.duration?.from || ""}
            >
              {/*  <option value="">Select Start Year</option> */}
              {Array.from({ length: 50 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                const isDisabled =
                  formdata.duration?.to &&
                  parseInt(year) > parseInt(formdata.duration.to);

                return (
                  !isDisabled && (
                    <option key={year} value={year} disabled={isDisabled}>
                      {year}
                    </option>
                  )
                );
              })}
            </select>
          </div>

          {/* "To" Label */}
          <div className="col-sm-2 d-flex justify-content-center align-items-center">
            <strong>To</strong>
          </div>

          {/* End Year */}
          <div className="col-sm-5 text-right">
            <select
              className="form-control"
              onChange={(e) =>
                setFormData({
                  ...formdata,
                  duration: {
                    ...formdata.duration,
                    to: e.target.value,
                  },
                })
              }
              value={formdata.duration?.to || ""}
            >
              {/*  <option value="">Select End Year</option> */}
              {Array.from({ length: 46 }, (_, i) => {
                const year = new Date().getFullYear() + 5 - i;
                const isDisabled =
                  formdata.duration?.from &&
                  parseInt(year) < parseInt(formdata.duration.from);

                return (
                  !isDisabled && (
                    <option key={year} value={year} disabled={isDisabled}>
                      {year}
                    </option>
                  )
                );
              })}
            </select>
          </div>
        </div>

        {/* Grading System Verified Switch */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="gradingSystemVerifiedSwitch"
            checked={!!formdata.gradingSystem_verified}
            disabled={formdata.is_verified}
            onChange={handleToggle("gradingSystem_verified")}
          />
          <label
            className="form-check-label"
            htmlFor="gradingSystemVerifiedSwitch"
          >
            Grading System Verified
          </label>
        </div>

        <div className="form-group">
          <label>
            Grading System
            <span style={{ color: "red" }}>*</span>
          </label>
          {/* drop down */}
          <select
            className="form-control"
            name="grading_system"
            onChange={handleChange}
            value={formdata.grading_system}
            disabled={formdata.gradingSystem_verified}
          >
            <option>Select Grading System</option>
            {grading_systems.map((grading_system) => (
              <option key={grading_system.id} value={grading_system.id}>
                {grading_system.name}
              </option>
            ))}
          </select>
        </div>

        {/* marks verified switch */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="marksVerifiedSwitch"
            checked={!!formdata.marks_verified}
            disabled={formdata.is_verified}
            onChange={handleToggle("marks_verified")}
          />
          <label className="form-check-label" htmlFor="marksVerifiedSwitch">
            Marks Verified
          </label>
        </div>

        {/* Marks */}
        <div className="form-group">
          <label>
            Marks
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            className="form-control"
            name="marks"
            value={formdata.marks || ""}
            onChange={handleChange}
            disabled={formdata.marks_verified}
          />
        </div>

        {/* Remarks */}
        <div className="col-12 mt-4">
          <label className="form-label">
            <b>Remarks</b>
          </label>
          <textarea
            className="form-control"
            name="remarks"
            rows="4"
            style={{
              resize: "vertical",
              maxHeight: "150px",
              overflowY: "auto",
            }}
            value={formdata.remarks || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="modal-footer mt-4">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default React.memo(VerificationFormSection);
