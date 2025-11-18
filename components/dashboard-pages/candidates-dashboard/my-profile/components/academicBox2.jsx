"use client";

import { useState } from "react";

import DetailModal from "./modal/DetailModal";
//import UploadButton  from "./academicBox_component/UploadButton.jsx";
import {
  colleges,
  courses,
  diploma_st_uni,
  savedAcademicData,
  university,
} from "./academicbox_component/academicData";
import SearchableInput from "./academicbox_component/SearchableInput";

const AcademicBox = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [academicData, setAcademicData] = useState([]);
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [filteredColleges, setFilteredColleges] = useState(colleges);
  const [filteredCourses, setFilteredCourses] = useState(courses);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleRemove = (id) => {
    setAcademicData(academicData.filter((item) => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setAcademicData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, data: { ...item.data, [field]: value } }
          : item,
      ),
    );
  };
  const handleAdd = () => {
    if (!selectedLevel) return;
    setAcademicData([
      ...academicData,
      { id: Date.now(), level: selectedLevel, data: {} },
    ]);
  };

  const handleSubmit = (id) => {
    const entry = academicData.find((item) => item.id === id);
    console.log("Submitted Data for Level:", entry);
    alert(`Data for ${entry.level.toUpperCase()} submitted! Check console.`);
  };

  // Open modal with specific item data
  const openModal = (item) => {
    setModalData(item);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };
  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    if (level) {
      setAcademicData([{ id: Date.now(), level, data: {} }]);
    } else {
      setAcademicData([]);
    }
  };

  // Search Handlers
  const handleCollegeSearch = (e) => {
    const value = e.target.value;
    setCollegeSearch(value);
    setFilteredColleges(
      colleges.filter((college) =>
        college.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  const handleCourseSearch = (e) => {
    const value = e.target.value;
    setCourseSearch(value);
    setFilteredCourses(
      courses.filter((course) =>
        course.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  // Selection Handlers
  const handleCollegeSelect = (college) => {
    setCollegeSearch(college);
    setFilteredColleges([]);
  };

  const handleCourseSelect = (course) => {
    setCourseSearch(course);
    setFilteredCourses([]);
  };
  const calPercentage = (id, cgpa) => {
    const percentage = cgpa ? (parseFloat(cgpa) * 9.5).toFixed(2) : "";
    handleChange(id, "percentage", percentage);
  };

  //some field may not be available
  const not_able = {
    /*   "tenth": "10th Standard",
      "twelfth": "12th Standard", */
  };

  // Format level name for display
  const formatLevelName = (level) => {
    const levelMap = {
      tenth: "10th Standard",
      twelfth: "12th Standard",
      diploma: "Diploma",
      undergraduate: "Undergraduate",
      postgraduate: "Postgraduate",
    };
    return levelMap[level] || level.charAt(0).toUpperCase() + level.slice(1);
  };
  //button
  const UploadButton = ({
    label,
    id,
    file,
    onChange,
    accept,
    width = "340px",
  }) => (
    <div className="form-group col-lg-4 col-md-12">
      <label htmlFor={id}>{label}</label>
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
          {file ? file.name : `Browse ${label}..`}
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* User's saved data summary section with eye buttons */}
      <div className="mb-4">
        <h3 className="mb-3">Your Academic Qualifications</h3>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>Level</th>
                {/* <th>Status</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {savedAcademicData.map((item) => (
                <tr key={item.id}>
                  <td>{formatLevelName(item.level)}</td>
                  {/* <td>
                    <span className="badge badge-success">Verified</span>
                  </td> */}
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => openModal(item)}
                      title="View Details"
                    >
                      <i className="fa fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for displaying full details */}
      <DetailModal item={modalData} show={showModal} onClose={closeModal} />

      {/* Form section for adding new academic data */}
      <form className="default-form">
        {academicData.map((item) => (
          <div key={item.id} className="border p-3 mb-3">
            <h4 className="text-center">{formatLevelName(item.level)}</h4>

            {["tenth", "twelfth"].includes(item.level) && (
              <div className="row">
                {/* State */}
                <div className="form-group col-lg-4">
                  <label>State</label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      handleChange(item.id, "state", e.target.value)
                    }
                  >
                    <option>Select State</option>
                    <option>West Bengal</option>
                    <option>Delhi</option>
                    <option>Uttar Pradesh</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                  </select>
                </div>

                {/* Board */}
                <div className="form-group col-lg-4">
                  <label>Board</label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      handleChange(item.id, "board", e.target.value)
                    }
                  >
                    <option>Select Board</option>
                    <option>CBSE</option>
                    <option>ICSE</option>
                    <option>State Board</option>
                  </select>
                </div>

                {/* School name - fixed the onChange handler */}
                <div className="form-group col-lg-4">
                  <label>Institute name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter School Name"
                    onChange={(e) =>
                      handleChange(item.id, "schoolName", e.target.value)
                    }
                  />
                </div>

                {/* Year of Passing*/}
                <div className="form-group col-lg-4">
                  <label>Year of Passing</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Year"
                    onChange={(e) =>
                      handleChange(item.id, "year", e.target.value)
                    }
                  />
                </div>

                {/* Total Marks */}
                <div className="form-group col-lg-4">
                  <label>Total Marks</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Total Marks"
                    onChange={(e) =>
                      handleChange(item.id, "totalMarks", e.target.value)
                    }
                  />
                </div>

                {/* Marks Obtain*/}
                <div className="form-group col-lg-4">
                  <label>Marks Obtain</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Marks Obtain"
                    onChange={(e) =>
                      handleChange(item.id, "marksObtain", e.target.value)
                    }
                  />
                </div>

                {/* Percentage */}
                <div className="form-group col-lg-4">
                  <label>Percentage</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Percentage"
                    onChange={(e) =>
                      handleChange(item.id, "percentage", e.target.value)
                    }
                  />
                </div>

                {/* Fixed upload buttons with unique IDs and separate state variables */}
                <UploadButton
                  label="Transcript"
                  id={`transcript-${item.id}`}
                  file={transcriptFile}
                  onChange={(e) => setTranscriptFile(e.target.files[0])}
                  accept="image/*, .pdf"
                />

                <UploadButton
                  label="Certificate"
                  id={`certificate-${item.id}`}
                  file={certificateFile}
                  onChange={(e) => setCertificateFile(e.target.files[0])}
                  accept="image/*, .pdf"
                />
              </div>
            )}

            {["diploma", "undergraduate", "postgraduate"].includes(
              item.level,
            ) && (
              <div className="row">
                {/* State */}
                <div className="form-group col-lg-4">
                  <label>State</label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      handleChange(item.id, "state", e.target.value)
                    }
                  >
                    <option>Select State</option>
                    <option>West Bengal</option>
                    <option>Delhi</option>
                    <option>Uttar Pradesh</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                  </select>
                </div>

                {/* if diploma */}
                {item.level === "diploma" && (
                  <div className="form-group col-lg-4">
                    <label>University / Board</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        handleChange(item.id, "university", e.target.value)
                      }
                    >
                      <option>Select University</option>
                      {diploma_st_uni.map((uni) => (
                        <option key={uni} value={uni}>
                          {uni}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* if undergraduate or postgraduate */}
                {["undergraduate", "postgraduate"].includes(item.level) && (
                  <div className="form-group col-lg-4">
                    <label>University Name</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        handleChange(item.id, "university", e.target.value)
                      }
                    >
                      <option>Select University</option>
                      {university.map((uni) => (
                        <option key={uni} value={uni}>
                          {uni}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* College Name (Searchable) */}
                <SearchableInput
                  label="Institute name"
                  value={collegeSearch}
                  onChange={handleCollegeSearch}
                  options={filteredColleges}
                  onSelect={handleCollegeSelect}
                />
                <SearchableInput
                  label="Course Name"
                  value={courseSearch}
                  onChange={handleCourseSearch}
                  options={filteredCourses}
                  onSelect={handleCourseSelect}
                />

                {/* Year of Passing*/}
                <div className="form-group col-lg-4">
                  <label>Year of Passing</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Year"
                    onChange={(e) =>
                      handleChange(item.id, "year", e.target.value)
                    }
                  />
                </div>

                {/* CGPA */}
                <div className="form-group col-lg-4">
                  <label>CGPA</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter CGPA"
                    /*     onChange={(e) => {
      let cgpa = e.target.value;
      if (cgpa !== "" && (isNaN(cgpa) || parseFloat(cgpa) > 10)) {
        alert("CGPA must be a number between 0 and 10");
        return;
      }
      handleChange(item.id, "cgpa", cgpa);
      calPercentage(item.id, cgpa);
    }} */
                  />
                </div>

                {/* Percentage */}
                <div className="form-group col-lg-4">
                  <label>Percentage</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Percentage"
                    /* value={item.data.percentage} */
                    onChange={(e) =>
                      handleChange(item.id, "percentage", e.target.value)
                    }
                  />
                </div>

                <UploadButton
                  label="Transcript"
                  id={`transcript-${item.id}`}
                  file={transcriptFile}
                  onChange={(e) => setTranscriptFile(e.target.files[0])}
                  accept="image/*, .pdf"
                />

                <UploadButton
                  label="Certificate"
                  id={`certificate-${item.id}`}
                  file={transcriptFile}
                  onChange={(e) => setTranscriptFile(e.target.files[0])}
                  accept="image/*, .pdf"
                />
              </div>
            )}

            <button
              type="button"
              className="btn btn-danger mt-2"
              onClick={() => handleRemove(item.id)}
            >
              Remove
            </button>

            <button
              type="button"
              className="btn btn-success mt-2 ml-2"
              onClick={() => handleSubmit(item.id)}
            >
              Submit
            </button>
          </div>
        ))}
        {/*     const not_able = {
      "tenth": "10th Standard",
      "twelfth": "12th Standard",
      "undergraduate": "Undergraduate",
    }
  

  // Format level name for display
  const formatLevelName = (level) => {
    const levelMap = {
      "tenth": "10th Standard",
      "twelfth": "12th Standard",
      "diploma": "Diploma",
      "undergraduate": "Undergraduate",
      "postgraduate": "Postgraduate"
    };
    return levelMap[level] || level.charAt(0).toUpperCase() + level.slice(1);
  }; */}
        <div className="form-group">
          <label>Select Level</label>
          <select
            className="form-control"
            value={selectedLevel}
            onChange={(e) => handleLevelChange(e.target.value)}
          >
            <option value="">Select Level</option>
            {Object.entries({
              tenth: "10th",
              twelfth: "12th",
              diploma: "Diploma",
              undergraduate: "Undergraduate",
              postgraduate: "Postgraduate",
            }).map(([key, label]) => (
              <option key={key} value={key} disabled={not_able[key]}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/*  {selectedLevel && (
          <button type="button" className="btn btn-primary mb-3" onClick={handleAdd}>
            Add Data
          </button>
        )} */}
      </form>
    </>
  );
};

export default AcademicBox;
