import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  specializations,
  colleges,
  courses,
  diploma_st_uni,
  university,
  grading_systems,
} from "./academicData";
import SearchableInput from "./SearchableInput";

const EducationForm = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [academicData, setAcademicData] = useState([]);
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [filteredColleges, setFilteredColleges] = useState(colleges);
  const [filteredCourses, setFilteredCourses] = useState(courses);

  const [states, useStates] = useState([
    {
      id: 4,
      name: "ANDHRA PRADESH",
    },
    {
      id: 5,
      name: "ARUNACHAL PRADESH",
    },
    {
      id: 6,
      name: "ASSAM",
    },
    {
      id: 7,
      name: "BIHAR",
    },
    {
      id: 8,
      name: "CHHATTISGARH",
    },
    {
      id: 9,
      name: "GOA",
    },
    {
      id: 10,
      name: "GUJARAT",
    },
    {
      id: 11,
      name: "HARYANA",
    },
    {
      id: 12,
      name: "HIMACHAL PRADESH",
    },
    {
      id: 13,
      name: "JAMMU &amp; KASHMIR",
    },
    {
      id: 14,
      name: "JHARKHAND",
    },
    {
      id: 15,
      name: "KARNATAKA",
    },
    {
      id: 16,
      name: "KERALA",
    },
    {
      id: 17,
      name: "MADHYA PRADESH",
    },
    {
      id: 18,
      name: "MAHARASHTRA",
    },
    {
      id: 19,
      name: "MANIPUR",
    },
    {
      id: 20,
      name: "MEGHALAYA",
    },
    {
      id: 21,
      name: "MIZORAM",
    },
    {
      id: 22,
      name: "NAGALAND",
    },
    {
      id: 23,
      name: "ODISHA",
    },
    {
      id: 24,
      name: "PUNJAB",
    },
    {
      id: 25,
      name: "RAJASTHAN",
    },
    {
      id: 26,
      name: "SIKKIM",
    },
    {
      id: 27,
      name: "TAMILNADU",
    },
    {
      id: 28,
      name: "TELANGANA",
    },
    {
      id: 29,
      name: "TRIPURA",
    },
    {
      id: 30,
      name: "UTTAR PRADESH",
    },
    {
      id: 31,
      name: "UTTARAKHAND",
    },
    {
      id: 32,
      name: "WEST BENGAL",
    },
    {
      id: 33,
      name: "NCT OF DELHI",
    },
    {
      id: 34,
      name: "CHANDIGARH",
    },
    {
      id: 35,
      name: "PUDUCHERRY",
    },
    {
      id: 36,
      name: "UT OF LADAKH",
    },
    {
      id: 37,
      name: "KARNATAKA",
    },
    {
      id: 38,
      name: "NEW DELHI",
    },
  ]);

  const [levels, Setlevels] = useState([
    {
      id: 1,
      level: "10th Standard",
      duration: 0,
      type: "",
    },
    {
      id: 2,
      level: "12th Standard",
      duration: 0,
      type: "",
    },
    {
      id: 3,
      level: "Diploma",
      duration: 0,
      type: "",
    },
    {
      id: 4,
      level: "Undergraduate (3 years)",
      duration: 3,
      type: "UG",
    },
    {
      id: 5,
      level: "Undergraduate (4 years)",
      duration: 4,
      type: "UG",
    },
    {
      id: 6,
      level: "Postgraduate (1 Year)",
      duration: 1,
      type: "PG",
    },
    {
      id: 7,
      level: "Postgraduate (2 Years)",
      duration: 2,
      type: "PG",
    },
    {
      id: 8,
      level: "Postgraduate (3 Years)",
      duration: 3,
      type: "PG",
    },
    {
      id: 9,
      level: "doctorate/PhD",
      duration: 0,
      type: "",
    },
  ]);

  const handleRemove = (id) => {
    setAcademicData(academicData.filter((item) => item.id !== id));
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setAcademicData(level ? [{ id: Date.now(), level, data: {} }] : []);
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
  };

  const calPercentage = (id, cgpa) => {
    const percentage = cgpa ? (parseFloat(cgpa) * 9.5).toFixed(2) : "";
    handleChange(id, "percentage", percentage);
  };

  const formatLevelName = (level) => {
    const levelMap = {
      tenth: "10th Standard",
      twelfth: "12th Standard",
      diploma: "Diploma",
      undergraduate: "Undergraduate (3 years)",
      undergraduate4: "Undergraduate (4 years)",
      postgraduate: "Postgraduate (1 Year)",
      postgraduate2: "Postgraduate (2 Years)",
      postgraduate3: "Postgraduate (3 Years)",
      doctoratePhD: "doctorate/PhD",
    };
    return levelMap[level] || level.charAt(0).toUpperCase() + level.slice(1);
  };

  const UploadButton = ({
    label,
    id,
    file,
    onChange,
    accept,
    width = "340px",
  }) => (
    <div className="form-group col-lg-4 col-md-12">
      <div className="uploadButton">
        <input
          className="uploadButton-input"
          type="file"
          id={id}
          accept={accept}
          onChange={onChange}
          required
        />
        <label
          className="uploadButton-button ripple-effect"
          style={{ width }}
          htmlFor={id}
        >
          {file ? file.name : `Browse..`}
        </label>
      </div>
    </div>
  );

  return (
    <form className="default-form">
      <div className="form-group">
        <label>Select Level</label>
        <select
          className="form-control"
          value={selectedLevel}
          onChange={(e) => handleLevelChange(e.target.value)}
        >
          <option value="">Select Level</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.level}
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
              <select
                className="form-control"
                onChange={(e) => handleChange(item.id, "state", e.target.value)}
              >
                <option>Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Board Selection for 10th/12th */}
            {["tenth", "twelfth"].includes(item.level) && (
              <>
                <div className="form-group ">
                  <label>Board</label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      handleChange(item.id, "board", e.target.value)
                    }
                  >
                    <option>Select Board</option>
                    {["CBSE", "ICSE", "State Board"].map((board) => (
                      <option key={board} value={board}>
                        {board}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Year of Passing</label>

                  <select
                    className="form-control"
                    onChange={(e) =>
                      handleChange(item.id, "year_of_passing", e.target.value)
                    }
                  >
                    <option>Select Year</option>
                    {Array.from({ length: 26 }, (_, i) => i + 2000).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
                {/* school medium */}
                <div className="form-group">
                  <label>Medium of Education</label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      handleChange(item.id, "medium", e.target.value)
                    }
                  >
                    <option>Select Medium</option>
                    {["Hindi", "English", "Marathi", "Telugu", "Other"].map(
                      (medium) => (
                        <option key={medium} value={medium}>
                          {medium}
                        </option>
                      )
                    )}
                  </select>
                </div>
                {/* marks */}
                <div className="form-group ">
                  <label>Marks</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Marks"
                    onChange={(e) =>
                      handleChange(item.id, "marks", e.target.value)
                    }
                  />
                </div>

                {/* Upload Buttons */}
                <div className="form-group col-lg-6">
                  <label>Upload Transcript</label>
                  <UploadButton
                    label="Transcript"
                    id={`transcript-${item.id}`}
                    file={transcriptFile}
                    onChange={(e) => setTranscriptFile(e.target.files[0])}
                    accept="image/*, .pdf"
                    width="150px"
                  />
                </div>

                <div className="form-group col-lg-6">
                  <label>Upload Certificate</label>
                  <UploadButton
                    width="150px"
                    label="Certificate"
                    id={`certificate-${item.id}`}
                    file={certificateFile}
                    onChange={(e) => setCertificateFile(e.target.files[0])}
                    accept="image/*, .pdf"
                  />
                </div>
              </>
            )}

            {/* University Selection for Diploma/UG/PG */}
            {[
              "diploma",
              "undergraduate",
              "undergraduate4",
              "postgraduate",
              "postgraduate2",
              "postgraduate3",
              "doctoratePhD",
            ].includes(item.level) && (
              <>
                <div className="form-group ">
                  <label>University Name</label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      handleChange(item.id, "university", e.target.value)
                    }
                  >
                    <option>Select University</option>
                    {(item.level === "diploma"
                      ? diploma_st_uni
                      : university
                    ).map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Searchable Inputs */}
                <SearchableInput
                  label="Institute name"
                  value={collegeSearch}
                  onChange={(e) =>
                    handleSearchChange(
                      e,
                      setCollegeSearch,
                      setFilteredColleges,
                      colleges
                    )
                  }
                  options={filteredColleges}
                  onSelect={(value) =>
                    handleSelect(value, setCollegeSearch, setFilteredColleges)
                  }
                />

                <SearchableInput
                  label="Course Name"
                  value={courseSearch}
                  onChange={(e) =>
                    handleSearchChange(
                      e,
                      setCourseSearch,
                      setFilteredCourses,
                      courses
                    )
                  }
                  options={filteredCourses}
                  onSelect={(value) =>
                    handleSelect(value, setCourseSearch, setFilteredCourses)
                  }
                />
                {/* Specialization */}
                <div className="form-group">
                  <label>Specialization</label>
                  {/* drop down */}
                  <select
                    className="form-control"
                    onChange={(e) =>
                      handleChange(item.id, "specialization", e.target.value)
                    }
                  >
                    <option>Select Specialization</option>
                    {specializations.map((specialization) => (
                      <option key={specialization} value={specialization}>
                        {specialization}
                      </option>
                    ))}
                  </select>
                </div>
                {/* course type radio button */}
                <div className="form-group">
                  <label>Course Type</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`courseType-${item.id}`}
                      id={`courseType-${item.id}-fulltime`}
                      value="Full Time"
                      onChange={(e) =>
                        handleChange(item.id, "course_type", e.target.value)
                      }
                      checked={item.data.course_type === "Full Time"}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`courseType-${item.id}-fulltime`}
                    >
                      Full Time
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`courseType-${item.id}`}
                      id={`courseType-${item.id}-parttime`}
                      value="Part Time"
                      onChange={(e) =>
                        handleChange(item.id, "course_type", e.target.value)
                      }
                      checked={item.data.course_type === "Part Time"}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`courseType-${item.id}-parttime`}
                    >
                      Part Time
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`courseType-${item.id}`}
                      id={`courseType-${item.id}-distance`}
                      value="Correspondence/Distance learning"
                      onChange={(e) =>
                        handleChange(item.id, "course_type", e.target.value)
                      }
                      checked={
                        item.data.course_type ===
                        "Correspondence/Distance learning"
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`courseType-${item.id}-distance`}
                    >
                      Correspondence/Distance Learning
                    </label>
                  </div>
                </div>

                {/* Course Duration */}
                <div className="form-group row align-items-center">
                  <label className="col-12">Course Duration</label>

                  {/* Start Year */}
                  <div className="col-sm-5">
                    <select
                      className="form-control"
                      onChange={(e) =>
                        handleChange(item.id, "start_year", e.target.value)
                      }
                      value={item.data.start_year || ""}
                    >
                      <option value="">Select Year</option>
                      {[...Array(26)].map((_, i) => {
                        const year = 2000 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* "To" centered horizontally & vertically */}
                  <div className="col-sm-2 d-flex justify-content-center align-items-center">
                    <strong>To</strong>
                  </div>

                  {/* End Year - Right Aligned */}
                  <div className="col-sm-5 text-right">
                    <select
                      className="form-control"
                      onChange={(e) =>
                        handleChange(item.id, "end_year", e.target.value)
                      }
                      value={item.data.end_year || ""}
                    >
                      <option value="">Select Year</option>
                      {[...Array(26)].map((_, i) => {
                        const year = 2000 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Grading system drop down */}
                <div className="form-group">
                  <label>Grading System</label>
                  {/* drop down */}
                  <select
                    className="form-control"
                    onChange={(e) =>
                      handleChange(item.id, "grading_system", e.target.value)
                    }
                  >
                    <option>Select Grading System</option>
                    {grading_systems.map((grading_system) => (
                      <option key={grading_system} value={grading_system}>
                        {grading_system}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Marks */}
                <div className="form-group">
                  <label>Marks</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Marks"
                    onChange={(e) =>
                      handleChange(item.id, "marks", e.target.value)
                    }
                  />
                </div>
                {/* checkbox */}
                <div className="form-group">
                  <input type="checkbox" value="1" />
                  <label> Make this as my primary graduation/diploma</label>
                </div>

                {/* Upload Buttons */}
                <div className="form-group col-lg-4">
                  <label>Upload Transcript</label>
                  <UploadButton
                    label="Transcript"
                    id={`transcript-${item.id}`}
                    file={transcriptFile}
                    onChange={(e) => setTranscriptFile(e.target.files[0])}
                    accept="image/*, .pdf"
                    width="120px"
                  />
                </div>

                <div className="form-group col-lg-4">
                  <label>Upload Certificate</label>
                  <UploadButton
                    width="120px"
                    label="Certificate"
                    id={`certificate-${item.id}`}
                    file={certificateFile}
                    onChange={(e) => setCertificateFile(e.target.files[0])}
                    accept="image/*, .pdf"
                  />
                </div>
              </>
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
  );
};

export default EducationForm;
