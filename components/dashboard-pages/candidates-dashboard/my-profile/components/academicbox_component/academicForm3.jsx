import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomizedProgressBars from "@/components/common/loader";
import axios from "axios";

import SchoolForm from "./formcomponent/schoolform";
import DegreeForm from "./formcomponent/degreeform";

const EducationForm = ({
  formData,
  setFormData,
  selectedLevel_main,
  edit_id_main,
  loading,
  setLoading,
}) => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  if (!token) {
    // console.log("No token");
  }

  //list
  const [levels, Setlevels] = useState([]);
  const [states, useStates] = useState([]);
  const [course_mode, setCourseMode] = useState([]);
  const [grading_systems, setGradingSystems] = useState([]);
  const [listboard, setListboard] = useState([]);
  const [listmedium, setListmedium] = useState([]);
  const [university, setUniversity] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schools, setSchools] = useState([]); // Added for school level

  //tools
  const [stateselected, setStateselected] = useState(false);
  const [universityselected, setUniversityselected] = useState(false);
  const [collegeselected, setCollegeselected] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState(schools);
  const [filteredColleges, setFilteredColleges] = useState(colleges);
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [filteredUniversity, setFilteredUniversity] = useState(university);
  const [isFocused, setIsFocused] = useState(false);
  const [filteredBoard, setFilteredBoard] = useState(listboard);
  const [boardSearch, setBoardSearch] = useState(formData.board);
  const [courseSearch, setCourseSearch] = useState(formData.course_name);
  const [coursetype, setCoursetype] = useState(formData.level_type);
  const [universitySearch, setUniversitySearch] = useState(formData.university);
  const [collegeSearch, setCollegeSearch] = useState(formData.institute_name);
  const [schoolSearch, setSchoolSearch] = useState(formData.school_name);

  //use Effect
  useEffect(() => {
    setBoardSearch(formData.board);
    setCourseSearch(formData.course_name);
    setUniversitySearch(formData.university);
    setCollegeSearch(formData.institute_name);
  }, [formData]);

  useEffect(() => {
    const fetchLevels = async () => {
      setLoading(true);
      try {
        /* /api/userdata/get_user_level
        for adding
        ${apiurl}/api/sql/dropdown/education_level
        for editing


        */
        if (edit_id_main) {
          const response = await axios.get(
            `${apiurl}/api/sql/dropdown/education_level`
          );
          Setlevels(response.data.data);
        } else {
          const response = await axios.get(
            `${apiurl}/api/userdata/get_user_level`,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Setlevels(response.data.data);
        }
      } catch (error) {
        //  console.error("Error fetching levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [token]);

  useEffect(() => {
    if (!formData.level) return;
    const fetchStates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/all_university_state`
        );
        useStates(response.data.data);
      } catch (error) {
        //  console.error("Error fetching states:", error);
      } finally {
        setLoading(false);
      }
    };
    /* api/sql/dropdown/course_type */
    const fetchCourseMode = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/course_type`
        );
        setCourseMode(response.data.data);
      } catch (error) {
        // console.error("Error fetching course modes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseMode();

    const fetchGradingSystems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/grading_system`
        );
        setGradingSystems(response.data.data);
      } catch (error) {
        // console.error("Error fetching grading systems:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGradingSystems();

    fetchStates();
  }, [formData.level]);

  useEffect(() => {
    if (!formData.state) return;
    const fetchboard = async () => {
      /* setLoading(true); */
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/state_wise_board?state_id=${formData.state}`
        );
        setListboard(response.data.data);
        setFilteredBoard(response.data.data);
      } catch (error) {
        //  console.error("Error fetching boards:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchmedium = async () => {
      /*  setLoading(true); */
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/medium_of_education`
        );
        setListmedium(response.data.data);
      } catch (error) {
        //     console.error("Error fetching mediums:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchuniversity = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/university_state?state_id=${formData.state}`
        );
        setUniversity(response.data.data);
        setFilteredUniversity(response.data.data);
      } catch (error) {
        // console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchuniversity();
    fetchboard();
    fetchmedium();
  }, [formData.state]);

  useEffect(() => {
    const fetchschools = async () => {
      setLoading(true);
      try {
        /* for now using university */
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/get_school_lists?board_name=${formData.board}`
        );
        setSchools(response.data.data);
        setFilteredSchools(response.data.data);
      } catch (error) {
        // console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchschools();
  }, [formData.board]);

  useEffect(() => {
    if (!formData.university) return;
    if (!formData.state) return;
    const fetchcolleges = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/college_name?university_id=${formData.university}&state_id=${formData.state}`
        );
        setColleges(response.data.data);
        setFilteredColleges(response.data.data);
      } catch (error) {
        // console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchcolleges();
  }, [formData.university, formData.state]);

  useEffect(() => {
    if (!formData.institute_name) return;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/university_course?state_id=${formData.state}&university_id=${formData.university}&college_name=${formData.institute_name}&course_type=${coursetype}`
        );
        setCourses(response.data.data);
        setFilteredCourses(response.data.data);
        setCollegeselected(true);
      } catch (error) {
        // console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [formData.institute_name]);

  useEffect(() => {
    setStateselected(!!formData.state);
    setUniversityselected(!!formData.university);
    setCollegeselected(!!formData.institute_name);
  }, [formData.state, formData.university, formData.institute_name]);

  useEffect(() => {
    return () => {
      if (formData.transcriptPreview)
        URL.revokeObjectURL(formData.transcriptPreview);
      if (formData.certificatePreview)
        URL.revokeObjectURL(formData.certificatePreview);
    };
  }, [formData.transcriptPreview, formData.certificatePreview]);

  //chanage level
  const handleLevelChange = (e) => {
    const selectedLevel = e.target.value;
    const levelData = levels.find((lvl) => lvl.id == selectedLevel);
    if (levelData) {
      setCoursetype(levelData.type);
    }

    setFormData({
      level: selectedLevel,
      state: "",
      board: "",
      year_of_passing: "",
      medium: "",
      marks: "",
      eng_marks: "",
      math_marks: "",
      university: "",
      institute_name: "",
      course_name: "",
      course_type: "",
      start_year: "",
      end_year: "",
      grading_system: "",
      is_primary: false,
      transcript: null,
      certificate: null,
    });
  };
  //handel changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle marks: only allow 0-100 numeric
    if (name === "marks" || name === "eng_marks" || name === "math_marks") {
      // Allow digits and at most one decimal point
      let numericValue = value.replace(/[^0-9.]/g, "");

      // Prevent multiple decimal points
      const parts = numericValue.split(".");
      if (parts.length > 2) {
        numericValue = parts[0] + "." + parts.slice(1).join("");
      }

      // Check if empty or <= 100
      if (numericValue === "" || Number(numericValue) <= 100) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
      return; // Stop here for "marks"
    }

    // Update formData normally
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Common toggle logic
    const toggleSetters = {
      state: setStateselected,
      university: setUniversityselected,
      institute_name: setCollegeselected,
    };

    if (toggleSetters[name]) {
      toggleSetters[name](!!value.trim());
    }
  };

  const formatLevelName = (id) => {
    const levelObj = levels.find((lvl) => lvl.id == id);
    return levelObj ? levelObj.level : "Unknown Level";
  };

  const handleSearchChange = (e, setSearch, setFiltered, list, key = "") => {
    const value = e.target.value.trim(); // normalise input
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

  const handleTranscriptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file); // ✅ works for both images and PDFs

    setFormData((prev) => ({
      ...prev,
      transcript: file,
      transcriptPreview: preview,
    }));
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      certificate: file,
      certificatePreview: preview,
    }));
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTimeout(() => setIsFocused(false), 100); // Slight delay for click to register
  };
  return (
    <>
      {/* {loading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.7)", // light overlay
            zIndex: 9999, // make sure it's above everything
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomizedProgressBars />
        </div>
      ) : (
        ""
      )} */}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          //backgroundColor: "rgba(255, 255, 255, 0.7)", // light overlay
          zIndex: 9999, // make sure it's above everything
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          visibility: loading ? "visible" : "hidden",
        }}
      >
        <CustomizedProgressBars />
      </div>
      <>
        <form className="default-form">
          <div className="form-group">
            <label>
              Select Level
              <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="form-control"
              name="level"
              value={formData.level}
              onChange={handleLevelChange}
              required
              disabled={selectedLevel_main}
            >
              <option value="">Select Level</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {formatLevelName(level.id)}
                </option>
              ))}
            </select>
          </div>
          {formData.level ? (
            <div className="border p-3 mb-3">
              <h4 className="text-center">{formatLevelName(formData.level)}</h4>
              <div className="row">
                <div className="form-group">
                  <label>State</label>
                  <span style={{ color: "red" }}>*</span>
                  <select
                    className="form-control"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>

                  {formData.level == 1 || formData.level == 2 ? (
                    <SchoolForm
                      formData={formData}
                      setFormData={setFormData}
                      handleChange={handleChange}
                      listboard={listboard}
                      listmedium={listmedium}
                      stateselected={stateselected}
                      handleTranscriptChange={handleTranscriptChange}
                      handleCertificateChange={handleCertificateChange}
                      handleFocus={handleFocus}
                      handleBlur={handleBlur}
                      isFocused={isFocused}
                      setIsFocused={setIsFocused}
                      handleSearchChange={handleSearchChange}
                      filteredBoard={filteredBoard}
                      setFilteredBoard={setFilteredBoard}
                      boardSearch={boardSearch}
                      setBoardSearch={setBoardSearch}
                      handleSelect={handleSelect}
                      schoolSearch={schoolSearch}
                      setSchoolSearch={setSchoolSearch}
                      filteredSchools={filteredSchools}
                      setFilteredSchools={setFilteredSchools}
                      schools={schools}
                    />
                  ) : (
                    <DegreeForm
                      formData={formData}
                      setFormData={setFormData}
                      handleChange={handleChange}
                      stateselected={stateselected}
                      university={university}
                      handleSearchChange={handleSearchChange}
                      universityselected={universityselected}
                      collegeselected={collegeselected}
                      collegeSearch={collegeSearch}
                      setCollegeSearch={setCollegeSearch}
                      filteredColleges={filteredColleges}
                      setFilteredColleges={setFilteredColleges}
                      colleges={colleges}
                      handleSelect={handleSelect}
                      courseSearch={courseSearch}
                      setCourseSearch={setCourseSearch}
                      setFilteredCourses={setFilteredCourses}
                      filteredCourses={filteredCourses}
                      courses={courses}
                      course_mode={course_mode}
                      grading_systems={grading_systems}
                      handleTranscriptChange={handleTranscriptChange}
                      handleCertificateChange={handleCertificateChange}
                      handleFocus={handleFocus}
                      handleBlur={handleBlur}
                      isFocused={isFocused}
                      setIsFocused={setIsFocused}
                      universitySearch={universitySearch}
                      setUniversitySearch={setUniversitySearch}
                      filteredUniversity={filteredUniversity}
                      setFilteredUniversity={setFilteredUniversity}
                      boardSearch={boardSearch}
                      setBoardSearch={setBoardSearch}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="col-md-12">
                <span style={{ color: "red" }}>Please select a level</span>
              </div>
            </div>
          )}
        </form>
      </>
    </>
  );
};

export default EducationForm;
