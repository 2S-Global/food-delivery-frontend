import React, { useState, useEffect, use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomizedProgressBars from "@/components/common/loader";
import axios from "axios";
import { specializations, grading_systems } from "./academicData";
import SearchableInput from "./SearchableInput";
import UploadButton from "./UploadButton";
import SchoolForm from "./schoolform";
import DegreeForm from "./degreeform";

const EducationForm = ({ formData, setFormData }) => {
  const [academicData, setAcademicData] = useState([]);
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [states, useStates] = useState([]);
  const [levels, Setlevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listboard, setListboard] = useState([]);
  const [listmedium, setListmedium] = useState([]);

  const [diploma_st_uni, setDiploma_st_uni] = useState([]);
  const [university, setUniversity] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState(colleges);

  const [coursetype, setCoursetype] = useState([]);

  const [course_mode, setCourseMode] = useState([]);
  const [grading_systems, setGradingSystems] = useState([]);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const [stateselected, setStateselected] = useState(false);
  const [universityselected, setUniversityselected] = useState(false);
  const [collegeselected, setCollegeselected] = useState(false);

  const token = localStorage.getItem("candidate_token");
  if (!token) {
    // console.log("No token");
  }

  useEffect(() => {
    const fetchLevels = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/education_level`
        );

        Setlevels(response.data.data);
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
    if (!formData.university) return;
    const fetchcolleges = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/college_name?university_id=${formData.university}`
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
  }, [formData.university]);

  useEffect(() => {
    if (!formData.institute_name) return;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        /* /api/sql/dropdown/university_course?state_id=32&university_id=1032&college_name=KALYANI%20GOVERNMENT%20ENGINEERING%20COLLEGE&course_type=UG */
        const response = await axios.get(
          `${apiurl}/api/sql/dropdown/university_course?state_id=${formData.state}&university_id=${formData.university}&college_name=${formData.institute_name}&course_type=${coursetype}`
        );
        setCourses(response.data.data);
        setFilteredCourses(response.data.data);
      } catch (error) {
        // console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [formData.institute_name]);

  const handleRemove = (id) => {
    setAcademicData(academicData.filter((item) => item.id !== id));
  };

  const handleLevelChange = (level) => {
    setAcademicData(level ? [{ id: Date.now(), level, data: {} }] : []);

    //map out levels based on selected level
    const levelData = levels.find((lvl) => lvl.id == level);
    if (!levelData) {
      //console.error("Level data not found");
      // return;
    }
    setCoursetype(levelData.type);

    setFormData({
      level,
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
      is_primary: "0",
      transcript: null,
      certificate: null,
    });
  };

  const handleSearchChange = (e, setSearch, setFiltered, list) => {
    const value = e.target.value;
    setSearch(value);
    setFiltered(
      list.filter((item) => item.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleSelect = (value, setSearch, setFiltered) => {
    setSearch(value);
    setFiltered([]);
  };

  const handleChange = (id, field, value) => {
    setAcademicData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, data: { ...item.data, [field]: value } }
          : item
      )
    );
    setFormData({ ...formData, [field]: value });

    if (field === "state") {
      if (value) {
        setStateselected(true);
      } else {
        setStateselected(false);
      }
    }
    if (field === "university") {
      if (value) {
        setUniversityselected(true);
      } else {
        setUniversityselected(false);
      }
    }
    if (field === "institute_name") {
      if (value) {
        setCollegeselected(true);
      } else {
        setCollegeselected(false);
      }
    }
  };
  const formatLevelName = (id) => {
    const levelObj = levels.find((lvl) => lvl.id == id);
    return levelObj ? levelObj.level : "Unknown Level";
  };

  return (
    <>
      {loading ? (
        <CustomizedProgressBars />
      ) : (
        <form className="default-form">
          <div className="form-group">
            <label>
              Select Level (This is form 2)
              <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="form-control"
              value={formData.level}
              onChange={(e) => handleLevelChange(e.target.value)}
            >
              <option value="">Select Level</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {formatLevelName(level.id)}
                </option>
              ))}
            </select>
          </div>
          {academicData.map((item) => (
            <div key={item.id} className="border p-3 mb-3">
              <h4 className="text-center">{formatLevelName(item.level)}</h4>

              <div className="row">
                {/* State Selection */}
                <div className="form-group">
                  <label>State</label>
                  <span style={{ color: "red" }}>*</span>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      handleChange(item.id, "state", e.target.value)
                    }
                    value={formData.state || ""}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                {["1", "2"].includes(String(item.level)) ? (
                  // Board Selection for 10th/12th
                  <SchoolForm
                    item={item}
                    formData={formData}
                    setFormData={setFormData}
                    handleChange={handleChange}
                    transcriptFile={transcriptFile}
                    setTranscriptFile={setTranscriptFile}
                    certificateFile={certificateFile}
                    setCertificateFile={setCertificateFile}
                    listboard={listboard}
                    listmedium={listmedium}
                    stateselected={stateselected}
                  />
                ) : (
                  // University Selection for Diploma/UG/PG/PhD
                  <DegreeForm
                    item={item}
                    handleChange={handleChange}
                    transcriptFile={transcriptFile}
                    setTranscriptFile={setTranscriptFile}
                    certificateFile={certificateFile}
                    setCertificateFile={setCertificateFile}
                    diploma_st_uni={diploma_st_uni}
                    collegeSearch={collegeSearch}
                    setCollegeSearch={setCollegeSearch}
                    courseSearch={courseSearch}
                    setCourseSearch={setCourseSearch}
                    filteredColleges={filteredColleges}
                    setFilteredColleges={setFilteredColleges}
                    filteredCourses={filteredCourses}
                    setFilteredCourses={setFilteredCourses}
                    specializations={specializations}
                    grading_systems={grading_systems}
                    university={university}
                    handleSearchChange={handleSearchChange}
                    handleSelect={handleSelect}
                    colleges={colleges}
                    courses={courses}
                    formData={formData}
                    setFormData={setFormData}
                    course_mode={course_mode}
                    stateselected={stateselected}
                    universityselected={universityselected}
                    collegeselected={collegeselected}
                  />
                )}
              </div>

              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </form>
      )}
    </>
  );
};

export default EducationForm;
