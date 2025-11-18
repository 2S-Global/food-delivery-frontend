import React, { useState, useEffect } from "react";

const LanguageProficiency = ({ formData, setFormData, apiurl }) => {
  const [languages, setLanguages] = useState(formData.languages || []);

  const [languageOptions, setLanguageOptions] = useState([]);
  const [languageproficiencyOptions, setLanguageproficiencyOptions] = useState(
    []
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, languages }));
  }, [languages]);

  useEffect(() => {
    const fetchLanguageOptions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/language`);
        const data = await response.json();
        setLanguageOptions(data.data);
      } catch (error) {
        console.error("Error fetching language options:", error);
      } finally {
        setLoading(false);
      }
    };
    /* /api/sql/dropdown/language_proficiency */
    const fetchLanguageproficiencyOptions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/sql/dropdown/language_proficiency`
        );
        const data = await response.json();
        setLanguageproficiencyOptions(data.data);
      } catch (error) {
        console.error("Error fetching language proficiency options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguageOptions();
    fetchLanguageproficiencyOptions();
  }, [apiurl]);

  const addLanguage = () => {
    setLanguages([
      ...languages,
      {
        language: "",
        proficiency: "",
        read: false,
        write: false,
        speak: false,
      },
    ]);
  };

  const deleteLanguage = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
  };

  const handleChange = (index, field, value) => {
    const proficiency = languageproficiencyOptions.find(
      (item) => item.id === value
    );
    //console.log("Proficiency:", proficiency);

    const updatedLanguages = [...languages];
    updatedLanguages[index][field] = value;

    if (field === "proficiency") {
      updatedLanguages[index]["read"] = proficiency.read;
      updatedLanguages[index]["write"] = proficiency.write;
      updatedLanguages[index]["speak"] = proficiency.speak;
    }

    setLanguages(updatedLanguages);
  };

  const handleCheckboxChange = (index, field) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index][field] = !updatedLanguages[index][field];
    setLanguages(updatedLanguages);
  };

  return (
    <div>
      <label
        className="form-label"
        style={{ fontWeight: 600, fontSize: "20px" }}
      >
        Language proficiency
      </label>

      <p
        className="text-muted"
        style={{ fontSize: "14px" }}
        onClick={() => {
          console.log("Language :", languages);
        }}
      >
        Strengthen your resume by letting recruiters know you can communicate in
        multiple languages
      </p>

      {languages.map((lang, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">
                <b>Language</b>
                <span style={{ color: "red" }}>*</span>
              </label>
              {/*  <input
                type="text"
                placeholder="Enter language"
                className="form-control"
                value={lang.language}
                onChange={(e) =>
                  handleChange(index, "language", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              /> */}
              <select
                className="form-select"
                value={lang.language}
                onChange={(e) =>
                  handleChange(index, "language", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              >
                <option value="">Select language</option>
                {languageOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">
                <b>Proficiency</b>
                <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="form-select"
                value={lang.proficiency}
                onChange={(e) =>
                  handleChange(index, "proficiency", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              >
                <option value="">Select proficiency</option>
                {languageproficiencyOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={lang.read}
                onChange={() => handleCheckboxChange(index, "read")}
              />{" "}
              Read
            </label>
            <label>
              <input
                type="checkbox"
                checked={lang.write}
                onChange={() => handleCheckboxChange(index, "write")}
              />{" "}
              Write
            </label>
            <label>
              <input
                type="checkbox"
                checked={lang.speak}
                onChange={() => handleCheckboxChange(index, "speak")}
              />{" "}
              Speak
            </label>
            <button
              type="button"
              onClick={() => deleteLanguage(index)}
              style={{
                color: "blue",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addLanguage}
        style={{
          color: "blue",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        Add language
      </button>
    </div>
  );
};

export default LanguageProficiency;
