"use client";
// import { queueRequest } from "../helper/queueHelper";
import { queueRequest } from "@/components/dashboard-pages/candidates-dashboard/my-profile/helper/queueHelper";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { useState, useEffect } from "react";
import axios from "axios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useParams, useSearchParams } from "next/navigation";
import { validateDocuments } from "./validatePostJobDocuments";
import MessageComponent from "@/components/common/ResponseMsg";
import dynamic from 'next/dynamic';
import React, { useRef } from "react";
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const PostBoxForm = () => {
  const params = useParams();  // for dynamic route parts like [jobId]
  const searchParams = useSearchParams(); // for query params like ?type=jobTitle
  const id = params.jobId;   // from route /edit/[jobId]
  const type = searchParams.get("type");        // from query string ?type=jobTitle

  const [showBy, setShowBy] = useState("fixed"); // Track dropdown selection
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [jobLocationType, setJobLocationType] = useState(""); // Remote or On-site
  const [advertiseCity, setAdvertiseCity] = useState("No"); // Yes or No
  const [salaryStructure, setSalaryStructure] = useState("");

  const [loading, setLoading] = useState(true);

  const jobTitleRef = useRef();
  const jobDescriptionRef = useRef();
  const getApplicationUpdateEmailRef = useRef();
  const positionAvailableRef = useRef();
  const jobTypeRef = useRef();
  const jobExpiryDateRef = useRef();
  const salaryStructureRef = useRef();
  const careerLevelRef = useRef();
  const industryRef = useRef();
  const qualificationRef = useRef();
  const jobLocationTypeRef = useRef();
  const advertiseCityRef = useRef();
  const advertiseCityNameRef = useRef();
  const countryRef = useRef();
  const cityRef = useRef();
  const branchRef = useRef();
  const addressRef = useRef();
  const experienceLevelRef = useRef();

  const refs = {
    jobTitle: jobTitleRef,
    jobDescription: jobDescriptionRef,
    getApplicationUpdateEmail: getApplicationUpdateEmailRef,
    positionAvailable: positionAvailableRef,
    jobType: jobTypeRef,
    jobExpiryDate: jobExpiryDateRef,
    jobLocationType: jobLocationTypeRef,
    salaryStructure: salaryStructureRef,
    careerLevel: careerLevelRef,
    experienceLevel: experienceLevelRef,
    industry: industryRef,
    qualification: qualificationRef,
    advertiseCity: advertiseCityRef,
    advertiseCityName: advertiseCityNameRef,
    country: countryRef,
    city: cityRef,
    branch: branchRef,
    address: addressRef,
  };

  //main
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("employer_token");
  if (!token) {
    console.log("No token");
  }

  const router = useRouter();

  // API list
  const [specialization, setSpecialization] = useState([]);
  const [jobType, setJobType] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [careerLevel, setCareerLevel] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState([]);
  const [gender, setGender] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [qualification, setQualification] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [branch, setBranch] = useState([]);
  const [jobSkills, setJobSkills] = useState([]);

  // Error Variables
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorId, setErrorId] = useState(0);
  const [errorField, setErrorField] = useState(0);

  // Initilize form data
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    getApplicationUpdateEmail: "",
    specialization: [],
    jobType: [],
    showBy: "fixed",
    expectedHours: "",
    fromHours: "",
    toHours: "",
    contractLength: "",
    contractPeriod: "",
    positionAvailable: "",
    jobExpiryDate: null,
    salary: {
      structure: "range",
      currency: "₹",
      min: null,
      max: null,
      amount: null,
      rate: "per year",
    },
    benefits: [],
    careerLevel: "",
    experienceLevel: "",
    gender: [],
    industry: "",
    qualification: [],
    jobLocationType: "",
    country: "",
    city: "",
    branch: "",
    address: "",
    advertiseCity: "",
    advertiseCityName: "",
    resumeRequired: false,
    jobSkills: []
  });

  useEffect(() => {
    if (!type) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(type);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        if (type !== "all") {
          element.classList.add("highlight");
          setTimeout(() => {
            element.classList.remove("highlight");
          }, 3000);
        }
      }
    }, 200); // small delay (200ms)

    return () => clearTimeout(timeout);
  }, [type, formData.jobLocationType]);


  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${apiurl}/api/jobposting/get_job_posting_details`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              jobId: id,
            },
          });

          if (response.data.success && response.status === 200) {
            const job = response.data.data;
            setFormData({
              jobTitle: job.jobTitle || "",
              jobDescription: job.jobDescription || "",
              getApplicationUpdateEmail: job.getApplicationUpdateEmail || "",

              specialization: job.specialization?.map((s) => s._id) || [],
              jobType: job.jobType?.map((t) => t._id) || [],
              showBy: job.showBy || "fixed",

              expectedHours: job.expectedHours || "",
              fromHours: job.fromHours || "",
              toHours: job.toHours || "",

              contractLength: job.contractLength || "",
              contractPeriod: job.contractPeriod || "",
              positionAvailable: job.positionAvailable || "",

              jobExpiryDate: job.jobExpiryDate
                ? new Date(job.jobExpiryDate).toISOString().split("T")[0]
                : null,

              salary: {
                structure: job.salary?.structure || "range",
                currency: job.salary?.currency || "₹",
                min: job.salary?.min || null,
                max: job.salary?.max || null,
                amount: job.salary?.amount || null,
                rate: job.salary?.rate || "per year",
              },

              benefits: job.benefits?.map((b) => b._id) || [],

              careerLevel: job.careerLevel?._id || "",
              experienceLevel: job.experienceLevel?._id || "",
              gender: job.gender?.map((g) => g._id) || [],

              industry: job.industry || "",
              qualification: job.qualification?.map((q) => q._id) || [],

              jobLocationType: job.jobLocationType || "",
              country: job.country?._id || "",
              city: job.city?._id || "",
              branch: job.branch?._id || "",
              address: job.address || "",

              advertiseCity: job.advertiseCity || "",
              advertiseCityName: job.advertiseCityName || "",
              resumeRequired: job.resumeRequired || false,
              // jobSkills: job.jobSkills?.map((s) => s.Skill) || [],
              jobSkills: job.jobSkills?.map((s) => ({
                value: s.Skill,
                label: s.Skill,
              })) || [],
            });
          }
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    if (date) {
      setFormData({ ...formData, jobExpiryDate: date });
    }
  };

  // For Job Skills

  // ✅ 1. Fetch random skills on mount
  useEffect(() => {
    const fetchRandomSkills = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiurl}/api/sql/dropdown/Random_Skill`);
        const data = res.data.data || [];

        console.log("Here is my all random skills::::'''''", data);
        setJobSkills(
          Array.from(
            new Set(
              data.filter(Boolean).map((s) => s.trim().toLowerCase())
            )
          ).map((skill) => ({
            label: skill.charAt(0).toUpperCase() + skill.slice(1),
            value: skill,
          }))
        );
      } catch (err) {
        console.error("Error fetching random skills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRandomSkills();
  }, [apiurl]);




  const fetchSkills = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return; // avoid too frequent calls
    setLoading(true);
    try {
      const token = localStorage.getItem("candidate_token");

      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/sql/dropdown/matching_Skill?skill_name=${inputValue}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      console.log("Data is coming successfully in the fontend:  ---tiktik outside //", response.data);

      if (response.status === 200 && Array.isArray(response.data.data)) {
        // convert API response to react-select format
        console.log("Data is coming successfully in the fontend:  ---tiktik //", response.data);

        // const formattedOptions = response.data.data.map((skill) => ({
        //   label: skill.charAt(0).toUpperCase() + skill.slice(1),
        //   value: skill,
        // }));
        // // setJobSkills(formattedOptions);
        // setJobSkills(
        //   Array.from(
        //     new Set(
        //       (response.data.data || [])
        //         .filter(Boolean)
        //         .map((skill) => skill.trim().toLowerCase())
        //     )
        //   ).map((skill) => ({
        //     label: skill.charAt(0).toUpperCase() + skill.slice(1),
        //     value: skill,
        //   }))
        // );

        // New Code Starts from here
        const fetched = response.data.data || [];

        // Normalize and remove duplicates
        const normalizedFetched = Array.from(
          new Set(
            fetched
              .filter(Boolean)
              .map((s) => s.trim().toLowerCase())
          )
        ).map((skill) => ({
          label: skill.charAt(0).toUpperCase() + skill.slice(1),
          value: skill,
        }));

        // ✅ Keep old selected options (from formData)
        const selectedOptions = formData.jobSkills.map((skill) => ({
          label: skill.charAt(0).toUpperCase() + skill.slice(1),
          value: skill,
        }));

        // ✅ Merge them so selected options are never lost
        const merged = [
          ...selectedOptions,
          ...normalizedFetched.filter(
            (opt) => !selectedOptions.some((sel) => sel.value === opt.value)
          ),
        ];

        setJobSkills(merged);

      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 When user types
  const handleInputChange = (inputValue) => {
    fetchSkills(inputValue);
  };

  const selectedValues = (formData.jobType || [])
    .map((id) => {
      const option = jobType.find((opt) => opt.value === id);
      return option ? option.label : null;
    })
    .filter(Boolean); // remove nulls if any

  const isPartTime = selectedValues.includes("Part-time");

  const isInternLike = selectedValues.some((v) =>
    ["Internship", "Contractual / Temporary", "Freelance"].includes(v)
  );

  useEffect(() => {
    const fetchSpecialization = async () => {
      // setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/jobposting/all_job_specializations`);
        const data = await response.json();
        setSpecialization(data.data.map((item) => ({ label: item.name, value: item._id })));
      } catch (error) {
        console.error("Error fetching genders:", error);
      } finally {
        // setLoading(false);
      }
    };


    const fetchJobType = async () => {
      // setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/jobposting/all_job_types`
        );
        const data = await response.json();
        setJobType(data.data.map((item) => ({ label: item.name, value: item._id })));
      } catch (error) {
        console.error("Error fetching more info list:", error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchBenefits = async () => {
      // setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/jobposting/all_job_benefits`
        );
        const data = await response.json();
        setBenefits(data.data.map((item) => ({ label: item.name, value: item._id })));
      } catch (error) {
        console.error("Error fetching marriage status list:", error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchCareerLevels = async () => {
      // setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/jobposting/all_job_career_levels`
        );
        const data = await response.json();
        console.log("Career Levels Data by mee :) :", data);
        // setCategories(data.data);
        setCareerLevel(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchExperienceLevel = async () => {
      // setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/jobposting/all_job_experience_levels`);
        const data = await response.json();
        setExperienceLevel(data.data);
      } catch (error) {
        console.error("Error fetching USA visa list:", error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchGender = async () => {
      //  setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_gender`);
        const data = await response.json();
        setGender(
          data.data.map((item) => ({
            label: item.name,
            value: item.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    const fetchIndustry = async () => {
      //  setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/get_industry`);
        const data = await response.json();
        setIndustry(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    const fetchQualification = async () => {
      //  setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/jobposting/all_job_qualifications`);
        const data = await response.json();
        setQualification(data.data.map((item) => ({ label: item.name, value: item._id })));
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    const fetchCountry = async () => {
      //  setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_contry`);
        const data = await response.json();
        setCountry(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    const fetchCity = async () => {
      //  setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/get_india_cities`);
        const data = await response.json();
        setCity(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    const fetchBranches = async () => {
      //  setLoading(true);
      try {
        const response = await axios.get(
          `${apiurl}/api/jobposting/all_company_branches`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Branches Data by mee should only data :) :", response.data.data);
        if (response.status === 200) {
          console.log("All Company Branches fetched successfully");
          setBranch(response.data.data);
        }
        // setCity(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    fetchSpecialization();
    fetchJobType();
    fetchBenefits();
    fetchCareerLevels();
    fetchExperienceLevel();
    fetchGender();
    fetchIndustry();
    fetchQualification();
    fetchCountry();
    fetchCity();
    fetchBranches();
  }, [apiurl]);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  // Map dropdown values → label names
  const labelMap = {
    fixed: "Fixed at",
    rangeFrom: "From",
    rangeTo: "To",
    maximum: "No more than",
    minimum: "No less than",
  };

  const contractLength = [
    { value: "month(s)", label: "month(s)" },
    { value: "week(s)", label: "week(s)" },
    { value: "day(s)", label: "day(s)" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    console.log("Form Data Submitted:", formData);

    const errorMsg = validateDocuments(formData);
    if (errorMsg) {
      const { field, message } = errorMsg;
      setError(message);
      setErrorId(Date.now());
      setErrorField(field); // keep track of which field failed

      // 🧩 Step 2: Focus and highlight the invalid field
      const ref = refs[field];

      console.log("Here is my ref value: ", ref);
      console.log("Here is my ref.current value: ", ref.current);
      if (ref && ref.current) {
        try {
          // For react-select or normal inputs
          if (ref.current.focus) ref.current.focus();
          if (ref.current.select) ref.current.select.focus();
        } catch (err) {
          console.warn("Focus failed for field:", field, err);
        }

        // Add red border highlight temporarily
        // const el = ref.current.controlRef || ref.current;

        const el =
          ref.current?.controlRef ||
          // ref.current?.controlRef?.current ||
          ref.current?.select?.controlRef ||
          ref.current; // fallback

        // console.log("Here is my actual el---dang dang", el);


        // el.classList?.add("error-highlight");
        // setTimeout(() => el.classList?.remove("error-highlight"), 2000);
      }

      return;
    }

    if (!token) {
      setError("Authorization token is missing. Please log in.");
      return;
    }
    try {
      let response;
      if (id) {
        response = await axios.post(
          `${apiurl}/api/jobposting/edit_job_posting_details`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            params: {
              jobId: id,
            },
          },
        );

        if (!response.data.success) {
          setError(response.data.message);
          setErrorId(Date.now());
          return;
        }

        setSuccess("Job post updated successfully!");


      } else {
        response = await axios.post(
          `${apiurl}/api/jobposting/add_job_posting_details`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          setError(response.data.message);
          setErrorId(Date.now());
          return;
        }

        setSuccess("Candidate added successfully!");
      }


      if (response.data.success) {
        console.log("✅ Job posting data is saved successfully:", response.data.data);

        // ✅ Redirect to review page with returned jobId
        const jobId = response.data.jobId; // API returns saved job object
        const status = response.data.data.status; // draft

        // router.push(`/employers-dashboard/post-jobs/review-jobs/${jobId}?status=${status}`);
        router.push(`/employers-dashboard/post-jobs/review-jobs/${jobId}`);
        // router.push(`/employers-dashboard/post-jobs/review-jobs`);
        // OR if you want to pass as query: /review-job?jobId=...&status=...

      } else {
        throw new Error(response.data.message || "An error occurred");
      }

      if (!response.data.success) {
        throw new Error(response.data.message || "An error occurred");
      }

    } catch (error) {
      console.error("Upload failed:", error);

      setError("Failed. Try again.");
      setErrorId(Date.now());

    } finally {
      // setLoading(false);
    }
  };

  return (
    <>
      <form className="default-form" onSubmit={handleSubmit}>
        <MessageComponent
          error={error}
          success={success}
          errorId={errorId}
        />
        <div className="row">
          {/* <!-- Input --> */}
          <div className="form-group col-lg-12 col-md-12 mt-2" id="jobTitleBlock">
            <label htmlFor="jobTitleInput">
              <b>Job Title{" "}</b>
              <span style={{ color: "red" }}>*</span>
            </label>
            <input type="text" name="jobTitle" ref={jobTitleRef} value={formData.jobTitle} onChange={handleChange} id="jobTitleInput" placeholder="Title" />
            {/* {errorField === "jobTitle" && error && (
              <span className="text-danger" style={{ fontSize: "0.9rem" }}>
                {error}
              </span>
            )} */}
          </div>

          {/* <!-- About Company --> */}
          {/* <div className="form-group col-lg-12 col-md-12" id="jobDescriptionBlock">
            <label htmlFor="jobDescription">
              <b>Job Description{" "}</b>
              <span style={{ color: "red" }}>*</span>
            </label>
            <textarea placeholder="Spent several years working on sheep on Wall Street. Had moderate success investing in Yugo's on Wall Street. Managed a small team buying and selling Pogo sticks for farmers. Spent several years licensing licorice in West Palm Beach, FL. Developed several new methods for working it banjos in the aftermarket. Spent a weekend importing banjos in West Palm Beach, FL.In this position, the Software Engineer collaborates with Evention's Development team to continuously enhance our current software solutions as well as create new solutions to eliminate the back-office operations and management challenges present" name="jobDescription" value={formData.jobDescription} ref={jobDescriptionRef} onChange={handleChange} id="jobDescription"></textarea>
          </div> */}

          <div className="form-group col-lg-12 col-md-12" id="jobDescriptionBlock">
            <label htmlFor="jobDescription">
              <b>Job Description{" "}</b>
              <span style={{ color: "red" }}>*</span>
            </label>
            <ReactQuill
              id="jobDescription"
              name="jobDescription"
              theme="snow"
              value={formData.jobDescription}
              ref={jobDescriptionRef}
              onChange={(content) =>
                setFormData((prev) => ({ ...prev, jobDescription: content }))
              }
              placeholder="Write detailed job description here..."
              style={{ height: '250px', marginBottom: '40px' }}
              className="form-group"
            />
          </div>

          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12" id="mailBlock">
            <label htmlFor="getApplicationUpdateEmail">
              <b>Get application updates{" "}</b>
              <span style={{ color: "red" }}>*</span>
            </label>
            <input type="text" name="getApplicationUpdateEmail" ref={getApplicationUpdateEmailRef} id="getApplicationUpdateEmail" value={formData.getApplicationUpdateEmail} onChange={handleChange} placeholder="testing@gmail.com" />
          </div>

          {/* <!-- Search Select --> */}
          <div className="form-group col-lg-6 col-md-12" id="specializationBlock">
            <label >Specialization </label>
            <Select
              isMulti
              name="specialization"
              options={specialization}
              className="basic-multi-select"
              classNamePrefix="select"
              value={specialization.filter(option =>
                formData.specialization.includes(option.value)
              )}
              onChange={(selectedOptions) =>
                setFormData((prev) => ({
                  ...prev,
                  specialization: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }))
              }
            />
          </div>

          {/* <!-- Search Select for Skill Field --> */}
          <div className="form-group col-lg-6 col-md-12" id="specializationBlock">
            <label >Skills </label>
            {/* <Select
              isMulti
              name="jobSkills"
              options={jobSkills}
              className="basic-multi-select"
              classNamePrefix="select"
              value={jobSkills.filter(option =>
                formData.jobSkills.includes(option.value)
              )}
              onChange={(selectedOptions) =>
                setFormData((prev) => ({
                  ...prev,
                  jobSkills: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }))
              }
            /> */}
            <Select
              isMulti
              name="jobSkills"
              options={jobSkills}
              // isLoading={loading}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Type to search skills..."
              value={jobSkills.filter((option) =>
                formData.jobSkills.includes(option.value)
              )}
              onInputChange={handleInputChange}
              onChange={(selectedOptions) =>
                setFormData((prev) => ({
                  ...prev,
                  jobSkills: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }))
              }
            />
          </div>

          <div className="form-group col-lg-6 col-md-12" id="numberOfPositionAvaiable">
            <label htmlFor="positionAvaiable">
              <b>Number of Positions Available{" "}</b>
              <span style={{ color: "red" }}>*</span>
            </label>
            <input type="number" name="positionAvailable" id="positionAvaiable" value={formData.positionAvailable} ref={positionAvailableRef} onChange={handleChange} min={1} placeholder="1" className="form-control" />
          </div>

          {/* Job Type Block started from here -------    */}
          <div className="form-group col-lg-6 col-md-12" id="jobType">
            <label>
              <b>Job Type </b>
              <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              isMulti
              name="jobType"
              ref={jobTypeRef}
              options={jobType}
              // className={`basic-multi-select ${errorField === "jobType" ? "error-highlight" : ""}`}
              className="basic-multi-select"
              classNamePrefix="select"
              value={jobType.filter(option =>
                formData.jobType.includes(option.value)
              )}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions
                  ? selectedOptions.map((opt) => opt.value)
                  : [];

                const selectedLabels = jobType
                  .filter((opt) => selectedValues.includes(opt.value))
                  .map((opt) => opt.label);

                const isPartTimeSelected = selectedLabels.includes("Part-time");

                console.log("print isPartTimeSelected is present or not---", isPartTimeSelected);

                const isInternLikeSelected = selectedValues.some((v) =>
                  ["Internship", "Contractual / Temporary", "Freelance"].includes(v)
                );

                console.log("print isInternLikeSelected is present or not---", isInternLikeSelected);

                setFormData((prev) => ({
                  ...prev,
                  jobType: selectedValues,
                  // reset Part-time fields if deselected
                  expectedHours: isPartTimeSelected ? prev.expectedHours : "",
                  fromHours: isPartTimeSelected ? prev.fromHours : "",
                  toHours: isPartTimeSelected ? prev.toHours : "",
                  showBy: isPartTimeSelected ? prev.showBy : "",
                  // reset Intern/Contract fields if deselected
                  contractLength: isInternLikeSelected ? prev.contractLength : "",
                  contractPeriod: isInternLikeSelected ? prev.contractPeriod : "",
                }));
              }}
            />
          </div>
          {/* Job Type Block ended here --*/}


          {/* Part-time => Expected hours */}
          {/* Fixed Timing for Part Time */}

          {isPartTime && (
            <div className="form-group col-lg-12 col-md-12" id="expectedHoursBlock">
              <label>Expected hours</label>
              <div className="d-flex gap-3">
                {/* Show pay by Dropdown */}
                <div className="flex-fill">
                  <label className="form-label small">Show by</label>
                  <select className="form-select" value={formData.showBy || ""} onChange={(e) => {
                    console.log("Show by value selected -- Chandra Sarkar : ", e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      showBy: e.target.value,
                      expectedHours: "",
                      fromHours: "",
                      toHours: "",
                    }))
                  }
                  }>
                    {/* <option value="">Select</option> */}
                    <option value="">Select</option>
                    <option value="fixed">Fixed hours</option>
                    <option value="range">Range</option>
                    <option value="maximum">Maximum</option>
                    <option value="minimum">Minimum</option>
                  </select>
                </div>

                {/* Single input for Fixed/Maximum/Minimum */}
                {/* Minimum Salary Textfield*/}
                {formData.showBy && formData.showBy !== "range" && (
                  <div className="flex-fill">
                    <label className="form-label small">{labelMap[formData.showBy]}</label>
                    <input
                      type="text"
                      name="expectedHours"
                      className="form-control"
                      placeholder="Enter hours"
                      value={formData.expectedHours ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          expectedHours: val,
                          fromHours: "",
                          toHours: "",
                        }));
                      }
                      }
                    />
                  </div>
                )}

                {/* Two inputs for Range */}
                {formData.showBy === "range" && (
                  <>
                    <div className="flex-fill">
                      <label className="form-label small">From</label>
                      <input
                        type="text"
                        name="fromHours"
                        className="form-control"
                        placeholder="e.g. 4"
                        value={formData.fromHours ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            fromHours: val,
                            expectedHours: "",
                          }));
                        }}
                      />
                    </div>
                    <div className="flex-fill">
                      <label className="form-label small">To</label>
                      <input
                        type="text"
                        name="toHours"
                        className="form-control"
                        placeholder="e.g. 8"
                        value={formData.toHours ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            toHours: val,
                            expectedHours: "",
                          }));
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Add Hours per week */}
                <div style={{ marginTop: "50px" }}>
                  <span className="form-label small mb-0">Hours per week</span>
                </div>

              </div>
            </div>
          )}

          {/* Contract Timings */}
          {isInternLike && (
            <div className="form-group col-lg-12 col-md-12">
              <label>How long is the contract?</label>
              <div className="d-flex gap-3">
                {/* Show pay by Dropdown */}
                <div className="flex-fill">
                  <label className="form-label small">Length</label>
                  <input type="number" name="contractLength" placeholder="" min={1} value={formData.contractLength ?? ""}
                    onChange={(e) => {
                      console.log("Contract Length selected value -- Chandra Sarkar : ", e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        contractLength: e.target.value,
                      }))
                    }
                    } />
                </div>

                {/* Single input for Fixed/Maximum/Minimum */}
                {/* Minimum Salary Textfield*/}
                <div className="flex-fill">
                  <label className="form-label small">Period</label>
                  <select className="form-select" name="contractPeriod" value={formData.contractPeriod ?? ""}
                    onChange={(e) => {
                      console.log("Contract Period selected value -- Chandra Sarkar : ", e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        contractPeriod: e.target.value,
                      }))
                    }
                    }>
                    <option value="" disabled>Select period</option>
                    <option value="month">month(s)</option>
                    <option value="week">week(s)</option>
                    <option value="day">day(s)</option>
                  </select>
                </div>

              </div>
            </div>
          )}


          {/* <!-- Job Expiry Date Previous Format --> */}
          {/*
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Expiry Date123</label>
          <div className="d-flex gap-3">
            <select className="form-select" name="expiryDay">
              <option value="">Day</option>
              {[...Array(31).keys()].map((day) => (
                <option key={day + 1} value={day + 1}>
                  {day + 1}
                </option>
              ))}
            </select>

            <select className="form-select" name="expiryMonth">
              <option value="">Month</option>
              {[
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
              ].map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select className="form-select" name="expiryYear">
              <option value="">Year</option>
              {[...Array(10).keys()].map((i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>  */}


          {/* Date Picker added by me --Chandra Sarkar -- starts from here */}

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/* form-group col-lg-6 col-md-12  -- For Testing */}
            {/* mb-3 form-group   -- Actual */}
            <div className="form-group col-lg-6 col-md-12" id="jobExpiryDateBlock">
              <label htmlFor="jobExpiryDate" className="form-label">
                <b>
                  Job Expiry Date{" "}
                  <span style={{ color: "red" }}>*</span>
                </b>
              </label>
              <DatePicker
                value={formData.jobExpiryDate ? new Date(formData.jobExpiryDate) : null}
                onChange={handleDateChange}
                minDate={new Date()}
                maxDate={new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    inputRef: jobExpiryDateRef,
                    id: "jobExpiryDate",
                    // required: true,
                    placeholder: "dd/mm/yyyy",
                    className: "form-control",
                    style: {
                      backgroundColor: "#f0f5f7",
                      border: "1px solid #f0f5f7",
                      boxSizing: "border-box",
                      borderRadius: "8px",
                      transition: "all 300ms ease",
                    },
                  },
                }}
              />
            </div>
          </LocalizationProvider>

          {/* Date Picker added by me --Chandra Sarkar -- ended here */}

          {/* Salary Part Added By Chandra  starts from here */}

          <div className="form-group col-lg-12 col-md-12" id="salaryBlock">
            <label>
              <b>Salary{" "}</b>
              <span style={{ color: "red" }}>*</span>
            </label>
            <div className="d-flex gap-3">
              {/* Show pay by Dropdown */}
              <div className="flex-fill">
                <label className="form-label small">Show pay by</label>
                <select className="form-select" value={formData.salary.structure} ref={salaryStructureRef}
                  onChange={(e) => {
                    const structure = e.target.value;

                    // Reset fields based on selected structure
                    let newSalary = { ...formData.salary, structure };

                    switch (structure) {
                      case "range":
                        newSalary.min = null;
                        newSalary.max = null;
                        newSalary.amount = null;
                        break;
                      case "starting amount":
                        newSalary.min = null;  // only starting amount relevant
                        newSalary.max = null;
                        newSalary.amount = null;
                        break;
                      case "maximum amount":
                        newSalary.min = null;
                        newSalary.max = null;
                        newSalary.amount = null;
                        break;
                      case "exact amount":
                        newSalary.min = null;
                        newSalary.max = null;
                        newSalary.amount = null;
                        break;
                      default:
                        break;
                    }

                    setFormData({ ...formData, salary: newSalary });
                  }} >
                  <option value="range">Range</option>
                  <option value="starting amount">Starting amount</option>
                  <option value="maximum amount">Maximum amount</option>
                  <option value="exact amount">Exact amount</option>
                </select>
              </div>

              {/* Currency Dropdown */}
              <div className="flex-fill">
                <label className="form-label small">Currency</label>
                <select className="form-select" value={formData.salary.currency} onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary: { ...formData.salary, currency: e.target.value },
                  })
                }>
                  <option value="₹">₹</option>
                  <option value="$">$</option>
                  <option value="€">€</option>
                  <option value="£">£</option>
                </select>
              </div>

              {/* Minimum Salary Textfield*/}
              {(formData.salary.structure === "range") && (
                <div className="flex-fill">
                  <label className="form-label small">Minimum</label>
                  <input
                    type="text"
                    value={formData.salary.min || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary: { ...formData.salary, min: e.target.value },
                      })
                    }
                    className="form-control"
                    placeholder="400000"
                  />
                </div>
              )}
              {/* Maximum Salary Textfield*/}
              <div className="flex-fill">
                <label className="form-label small">{formData.salary.structure === "range" ? "Maximum" : "Amount"}</label>
                <input
                  type="text"
                  value={
                    formData.salary.structure === "range"
                      ? formData.salary.max || ""
                      : formData.salary.amount || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (formData.salary.structure === "range") {
                      setFormData({
                        ...formData,
                        salary: { ...formData.salary, max: value },
                      });
                    } else {
                      setFormData({
                        ...formData,
                        salary: { ...formData.salary, amount: value },
                      });
                    }
                  }}
                  className="form-control"
                  placeholder={
                    formData.salary.structure === "range" || formData.salary.structure === "maximum amount"
                      ? "800000"
                      : "400000"
                  }
                />
              </div>


              {/* Rate Dropdown */}
              <div className="flex-fill">
                <label className="form-label small">Rate</label>
                <select className="form-select" value={formData.salary.rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: { ...formData.salary, rate: e.target.value },
                    })
                  }>
                  <option value="per hour">per hour</option>
                  <option value="per day">per day</option>
                  <option value="per week">per week</option>
                  <option value="per month">per month</option>
                  <option value="per year">per year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Part Added By Chandra ends here */}

          {/* Benefits Added By Chandra starts from here */}
          {/* <!-- Search Select --> */}
          <div className="form-group col-lg-6 col-md-12" id="benefitsBlock">
            <label>Benefits </label>
            <Select
              isMulti
              name="benefits"
              options={benefits}
              className="basic-multi-select"
              classNamePrefix="select"
              // value={formData.benefits}
              // onChange={(selectedOptions) =>
              //   setFormData((prev) => ({
              //     ...prev,
              //     benefits: selectedOptions || [],
              //   }))
              // }
              value={benefits.filter(option =>
                formData.benefits.includes(option.value)
              )} // ensure proper value binding
              onChange={(selectedOptions) =>
                setFormData((prev) => ({
                  ...prev,
                  benefits: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }))
              }
            />
          </div>
          {/* Benefits Part Added By Chandra ends here */}

          <div className="form-group col-lg-6 col-md-12" id="careerLevelBlock">
            <label>
              <b>
                Career Level{" "}
                <span style={{ color: "red" }}>*</span>
              </b>
            </label>
            <select className="form-select" value={formData.careerLevel} onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                careerLevel: e.target.value,
              }));
            }} ref={careerLevelRef}>
              <option value="">Select</option>
              {careerLevel.map((level) => (
                <option key={level._id} value={level._id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12" id="experienceLevelBlock">
            <label>
              <b>
                Experience Level{" "}
                <span style={{ color: "red" }}>*</span>
              </b>
            </label>
            <select className="chosen-single form-select" value={formData.experienceLevel} onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                experienceLevel: e.target.value,
              }));
            }} ref={experienceLevelRef}>
              <option value="">Select</option>
              {experienceLevel.map((level) => (
                <option key={level._id} value={level._id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12" id="genderBlock">
            <label>Gender</label>
            <Select
              isMulti
              name="gender"
              options={gender}
              className="basic-multi-select"
              classNamePrefix="select"
              // value={formData.gender}
              // onChange={(selectedOptions) => {
              //   setFormData((prev) => ({
              //     ...prev,
              //     gender: selectedOptions || [],
              //   }))
              // }
              // }
              value={gender.filter(option =>
                formData.gender.includes(option.value)
              )} // ensure proper value binding
              onChange={(selectedOptions) =>
                setFormData((prev) => ({
                  ...prev,
                  gender: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }))
              }
            />
          </div>

          <div className="form-group col-lg-6 col-md-12" id="industryBlock">
            <label>
              <b>
                Industry{" "}
                <span style={{ color: "red" }}>*</span>
              </b>
            </label>
            <select className="chosen-single form-select" value={formData.industry} onChange={(e) => {
              setFormData((prev) => ({ ...prev, industry: e.target.value }))
            }} ref={industryRef}>
              <option value="">Select</option>
              {industry.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.job_industry}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12" id="qualificationBlock">
            <label>
              <b>
                Qualification{" "}
                <span style={{ color: "red" }}>*</span>
              </b>
            </label>
            <Select
              isMulti
              name="qualification"
              ref={qualificationRef}
              options={qualification}
              className="basic-multi-select"
              classNamePrefix="select"
              // value={formData.qualification}
              // onChange={(selectedOptions) =>
              //   setFormData((prev) => ({
              //     ...prev,
              //     qualification: selectedOptions || [],
              //   }))
              // }
              value={qualification.filter(option =>
                formData.qualification.includes(option.value)
              )} // ensure proper value binding
              onChange={(selectedOptions) =>
                setFormData((prev) => ({
                  ...prev,
                  qualification: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }))
              }
            />
          </div>

          {/* Job Location- Remote or On-site */}
          <div className="form-group col-lg-6 col-md-12">
            <label>
              <b>Which option best describes this job's location?{" "}</b>
              <span style={{ color: "red" }}>*</span>
            </label>
            <select className="chosen-single form-select" value={formData.jobLocationType} ref={jobLocationTypeRef} onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                jobLocationType: e.target.value,
              }));
            }}>
              <option value="">Select</option>
              <option value="remote">Remote</option>
              <option value="on-site">On-site</option>
            </select>
          </div>

          {/* <!-- Input --> */}
          {/* Show when On-site */}
          {formData.jobLocationType === "on-site" && (
            <>
              <div className="form-group col-lg-6 col-md-12" id="countryBlock">
                <label>
                  <b>Country{" "}</b>
                  <span style={{ color: "red" }}>*</span>
                </label>
                <select className="chosen-single form-select" value={formData.country}
                  onChange={(e) => {
                    console.log("Country selected value -- Chandra Sarkar : ", e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  } ref={countryRef}>
                  <option value="">Select</option>
                  {country.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-6 col-md-12" id="cityBlock">
                <label>
                  <b>City{" "}</b>
                  <span style={{ color: "red" }}>*</span>
                </label>
                <select className="chosen-single form-select" value={formData.city}
                  onChange={(e) => {
                    console.log("City selected value -- Chandra Sarkar : ", e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  } ref={cityRef}>
                  <option value="">Select</option>
                  {city.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.city_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* brance dropdown */}
              <div className="form-group col-lg-6 col-md-12" id="branchBlock">
                <label>
                  <b>Branch{" "}</b>
                  <span style={{ color: "red" }}>*</span>
                </label>
                <select className="chosen-single form-select" value={formData.branch}
                  onChange={(e) => {
                    console.log("Branch selected value -- Chandra Sarkar : ", e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      branch: e.target.value,
                    }))
                  }
                  } ref={branchRef}>
                  <option value="">Select</option>
                  {branch.map((level) => (
                    <option key={level._id} value={level._id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* <!-- Input --> */}
              <div className="form-group col-lg-12 col-md-12" id="completeAddressBlock">
                <label>
                  <b>Complete Address{" "}</b>
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  ref={addressRef}
                  placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
                  value={formData.address}
                  onChange={(e) => {
                    console.log("Complete Address selected value -- Chandra Sarkar : ", e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  }
                />
              </div>
            </>
          )}


          {/* Show when Remote */}
          {formData.jobLocationType === "remote" && (
            <div className="form-group col-lg-12 col-md-12" ref={advertiseCityRef}>
              <label className="form-label">
                <b>Do you want to advertise your job in a specific city?{" "}</b>
                <span style={{ color: "red" }}>*</span>
              </label>
              <div className="d-flex gap-3">

                {/* No Option */}
                <label className="form-check-label">
                  <input
                    type="radio"
                    name="advertiseCity"
                    value="No"
                    checked={formData.advertiseCity === "No"}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        advertiseCity: e.target.value,
                        advertiseCityName: "",
                      }))
                    }
                    }
                    className="form-check-input me-2"
                  />
                  No (Anywhere in India)
                </label>

                {/* Yes Option */}
                <label className="form-check-label">
                  <input
                    type="radio"
                    name="advertiseCity"
                    value="Yes"
                    checked={formData.advertiseCity === "Yes"}
                    onChange={(e) => {
                      console.log("Advertise City for Yes Option -- Chandra Sarkar : ", e.target);
                      setFormData((prev) => ({
                        ...prev,
                        advertiseCity: e.target.value,
                      }))
                    }
                    }
                    className="form-check-input me-2"
                  />
                  Yes
                </label>

              </div>
            </div>
          )}
          {/* <!-- Input --> */}
          {/* Show when Remote + Yes */}
          {formData.jobLocationType === "remote" && formData.advertiseCity === "Yes" && (
            <div className="form-group col-lg-6 col-md-12">
              <label>
                <b>Where do you want to advertise this job?{" "}</b>
                <span style={{ color: "red" }}>*</span>
              </label>
              <input type="text" name="advertiseCityName" value={formData.advertiseCityName} onChange={handleChange} placeholder="" ref={advertiseCityNameRef} />
            </div>
          )}

          {/* ckeckbox */}
          <div className="mb-3 form-group" id="requireRemumeBlock">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={formData.resumeRequired}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    resumeRequired: e.target.checked,
                  }))
                }
                }
              />
              <label
                className="form-check-label"
                htmlFor="rememberMe"
              >
                Resume is required
              </label>
            </div>
          </div>

          {/* <!-- Input --> */}
          <div className="form-group col-lg-12 col-md-12 text-right">
            <button className="theme-btn btn-style-one">Next</button>
          </div>

          {/* <div className="form-group col-lg-12 col-md-12 text-right">
            <button type="button" className="theme-btn btn-style-one" onClick={() => {
              console.log("Hello Print", formData);
            }}>Hello Print</button>
          </div> */}
        </div>
      </form >
      <style jsx>{`
      .highlight {
        background-color: #fff89a;
        border-radius: 8px;
        padding: 12px;
        transition: background-color 0.3s ease;
      }
    `}</style>
    </>
  );
};

export default PostBoxForm;