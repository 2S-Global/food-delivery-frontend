"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CopyrightFooter from "../../CopyrightFooter";
import { FaEdit } from "react-icons/fa";
import CustomizedProgressBars from "@/components/common/loader";

const Index = () => {
    const router = useRouter();
    const params = useParams();
    const jobId = params.jobId;

    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("employer_token");

    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // start loader
            try {
                const response = await axios.get(`${apiurl}/api/jobposting/get_job_posting_details`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        jobId: jobId,
                        status: "draft",
                    },
                });

                if (response.data.success && response.status === 200) {
                    setData(response.data.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false); // stop loader
            }
        };

        fetchData();
    }, []);

    // Add this function inside your component
    const handleConfirm = async () => {
        setLoading(true);
        try {
            console.log("Handle Confirm is running successfully and token from review-jobs !", token)
            const response = await axios.post(
                `${apiurl}/api/jobposting/confirm_job_posting_details`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        jobId: jobId,
                    },
                }
            );

            if (response.data.success) {
                // Redirect to another page on success
                router.push("/employers-dashboard/manage-jobs"); // Replace with your target page
            } else {
                alert(response.data.message || "Something went wrong!");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setLoading(false); // stop loader
        }
    };


    return (
        <>
            {loading ? (
                <CustomizedProgressBars />
            ) : (
                <div className="review-container">
                    <h1 className="review-title">Review</h1>

                    <div className="job-details">
                        <h2 className="underline">Job Details</h2>

                        {data?.jobTitle && (
                            <div className="detail-row">
                                <div className="detail-label">Job title</div>
                                <div className="detail-value">
                                    {data?.jobTitle || "N/A"}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=jobTitleBlock`);
                                        }}
                                    >
                                        {/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.companyName && (
                            <div className="detail-row">
                                <div className="detail-label">Company for this job</div>
                                <div className="detail-value">
                                    {data.companyName}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=jobDescription`);
                                        }}
                                    >{/* &#9998; */}
                                        {/* {loading ? <CustomizedProgressBars /> : "✎"} */}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.positionAvailable && (
                            <div className="detail-row">
                                <div className="detail-label">Number of openings</div>
                                <div className="detail-value">
                                    {data.positionAvailable}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=numberOfPositionAvaiable`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.country && (
                            <div className="detail-row">
                                <div className="detail-label">Country</div>
                                <div className="detail-value">
                                    {typeof data.country === "object" ? data.country.name : data.country}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=countryBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.city && (
                            <div className="detail-row">
                                <div className="detail-label">City</div>
                                <div className="detail-value">
                                    {data.city.city_name}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=cityBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.branch && (
                            <div className="detail-row">
                                <div className="detail-label">Branch</div>
                                <div className="detail-value">
                                    {data.branch.name}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=branchBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.address && (
                            <div className="detail-row">
                                <div className="detail-label">Complete Address</div>
                                <div className="detail-value">
                                    {data.address}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=completeAddressBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.jobType && (
                            <div className="detail-row">
                                <div className="detail-label">Job Type</div>
                                <div className="detail-value">
                                    {data.jobType.map(item => item.label).join(", ")}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=jobType`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Specilization Blocks */}
                        {data?.specialization && data.specialization.length > 0 && (
                            <div className="detail-row">
                                <div className="detail-label">Specialization</div>
                                <div className="detail-value">
                                    {data.specialization.map(item => item.name).join(", ")}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=specializationBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.expectedHours && (
                            <div className="detail-row">
                                <div className="detail-label">Expected hours per week</div>
                                <div className="detail-value">
                                    {data.expectedHours}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=expectedHoursBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.contractLength && (
                            <div className="detail-row">
                                <div className="detail-label">Contract length</div>
                                <div className="detail-value">
                                    {data.contractLength}{" "}
                                    {data.contractPeriod === "month"
                                        ? data.contractLength > 1
                                            ? "months"
                                            : "month"
                                        : data.contractPeriod === "week"
                                            ? data.contractLength > 1
                                                ? "weeks"
                                                : "week"
                                            : data.contractPeriod === "day"
                                                ? data.contractLength > 1
                                                    ? "days"
                                                    : "day"
                                                : ""}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.salary && (
                            <div className="detail-row">
                                <div className="detail-label">Pay</div>
                                <div className="detail-value">
                                    {(() => {
                                        const { structure, currency, min, max, amount, rate } = data.salary;

                                        switch (structure) {
                                            case "range":
                                                if (currency && min != null && max != null && rate) {
                                                    return (
                                                        <>
                                                            {currency}
                                                            {min.toLocaleString("en-IN", { maximumFractionDigits: 2 })} -{" "}
                                                            {currency}
                                                            {max.toLocaleString("en-IN", { maximumFractionDigits: 2 })} {rate}
                                                        </>
                                                    );
                                                }
                                                return <span>Incomplete salary data</span>;

                                            case "starting amount":
                                                if (currency && amount != null && rate) {
                                                    return (
                                                        <>
                                                            From {currency}
                                                            {amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })} {rate}
                                                        </>
                                                    );
                                                }
                                                return <span>Incomplete salary data</span>;

                                            case "maximum amount":
                                                if (currency && amount != null && rate) {
                                                    return (
                                                        <>
                                                            Up to {currency}
                                                            {amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })} {rate}
                                                        </>
                                                    );
                                                }
                                                return <span>Incomplete salary data</span>;

                                            case "exact amount":
                                                if (currency && amount != null && rate) {
                                                    return (
                                                        <>
                                                            {currency}
                                                            {amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })} {rate}
                                                        </>
                                                    );
                                                }
                                                return <span>Incomplete salary data</span>;

                                            default:
                                                return <span>Salary data not available</span>;
                                        }
                                    })()}

                                    <span
                                        className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(
                                                `/employers-dashboard/post-jobs/edit/${jobId}?type=salaryBlock`
                                            );
                                        }}
                                    >
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}



                        {data?.benefits && data.benefits.length > 0 && (
                            <div className="detail-row">
                                <div className="detail-label">Benefits</div>
                                <div className="detail-value">
                                    {data.benefits.map((item) => item.name).join(", ")}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=benefitsBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Career Level block */}

                        {data?.careerLevel && (
                            <div className="detail-row">
                                <div className="detail-label">Career Level</div>
                                <div className="detail-value">
                                    {data.careerLevel.name}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=careerLevelBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Experience Level block */}
                        {data?.experienceLevel && (
                            <div className="detail-row">
                                <div className="detail-label">Experience Level</div>
                                <div className="detail-value">
                                    {data.experienceLevel.name}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=experienceLevelBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Gender Block */}

                        {data?.gender && data.gender.length > 0 && (
                            <div className="detail-row">
                                <div className="detail-label">Gender</div>
                                <div className="detail-value">
                                    {data.gender.map((item) => item.name).join(", ")}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=genderBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Industry Level block */}

                        {data?.industryName && (
                            <div className="detail-row">
                                <div className="detail-label">Industry</div>
                                <div className="detail-value">
                                    {data.industryName}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=industryBlock`);
                                        }}
                                    >
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Qualification Block */}

                        {data?.qualification && data.qualification.length > 0 && (
                            <div className="detail-row">
                                <div className="detail-label">Qualification</div>
                                <div className="detail-value">
                                    {data.qualification.map((item) => item.name).join(", ")}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=qualificationBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.jobDescription && (
                            <div className="detail-row">
                                <div className="detail-label">Job description</div>
                                <div className="detail-value">
                                    {/* {data.jobDescription} */}
                                    <div
                                        dangerouslySetInnerHTML={{ __html: data.jobDescription }}
                                    />
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=jobDescriptionBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>


                    <hr className="divider" />

                    <div className="job-details">
                        <h2 className="underline">Settings</h2>

                        {data?.getApplicationUpdateEmail && (
                            <div className="detail-row">
                                <div className="detail-label">Application method</div>
                                <div className="detail-value">
                                    Email
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=mailBlock123`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="detail-row">
                            <div className="detail-label">Require resume</div>
                            <div className="detail-value">
                                {data?.resumeRequired ? "Yes" : "No"}
                                <span className="edit-icon"
                                    onClick={async () => {
                                        setLoading(true);
                                        router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=requireRemumeBlock`);
                                    }}
                                >{/* &#9998; */}
                                    {loading ? <CustomizedProgressBars /> : "✎"}
                                </span>
                            </div>
                        </div>

                        {data?.getApplicationUpdateEmail && (
                            <div className="detail-row">
                                <div className="detail-label">Application updates</div>
                                <div className="detail-value">
                                    {data.getApplicationUpdateEmail}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=mailBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.jobExpiryDate && new Date(data.jobExpiryDate).toString() !== "Invalid Date" && (
                            <div className="detail-row">
                                <div className="detail-label">Job Expiry Date</div>
                                <div className="detail-value">
                                    {new Date(data.jobExpiryDate).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}?type=jobExpiryDateBlock`);
                                        }}
                                    >{/* &#9998; */}
                                        {loading ? <CustomizedProgressBars /> : "✎"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="divider" />

                    <div className="job-details">
                        <h2 className="underline">Account</h2>

                        {/* <div className="detail-row">
                        <div className="detail-label">Contact</div>
                        <div className="detail-value">
                            Chandra Sarkar
                            <FaEdit className="edit-icon" />
                        </div>
                    </div> */}

                        {data?.phoneNumber && (
                            <div className="detail-row">
                                <div className="detail-label">Phone number</div>
                                <div className="detail-value">
                                    {data.phoneNumber}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}`);
                                        }}
                                    >{/* &#9998; */}
                                        {/* {loading ? <CustomizedProgressBars /> : "✎"} */}
                                    </span>
                                </div>
                            </div>
                        )}

                        {data?.companyName && (
                            <div className="detail-row">
                                <div className="detail-label">Your company name</div>
                                <div className="detail-value">
                                    {data.companyName}
                                    <span className="edit-icon"
                                        onClick={async () => {
                                            setLoading(true);
                                            router.push(`/employers-dashboard/post-jobs/edit/${jobId}`);
                                        }}
                                    >{/* &#9998; */}
                                        {/* {loading ? <CustomizedProgressBars /> : "✎"} */}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="button-container">
                        <button className="btn back-btn">← Back</button>
                        <div className="right-buttons">
                            <button className="btn preview-btn">Preview</button>
                            <button className="btn confirm-btn" onClick={handleConfirm}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            <CopyrightFooter />

            {/* STYLES */}
            <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        body {
          font-family: 'Poppins', sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 0;
        }

        .review-container {
          max-width: 700px;
          margin: 60px auto;
          padding: 40px 30px;
          background-color: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }

        .review-title {
          font-size: 2.5em;
          font-weight: 700;
          margin-bottom: 40px;
          color: #222;
        }

        .job-details {
          background-color: #f9f9f9;
          padding: 24px;
          border-radius: 10px;
          margin-bottom: 40px;
        }

        .job-details h2 {
          font-size: 1.4em;
          font-weight: 600;
          margin-bottom: 20px;
          color: #363636;
        }

        .detail-row {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .detail-label {
          min-width: 210px;
          font-size: 1em;
          color: #222;
          font-weight: 500;
        }

        .detail-value {
          display: flex;
          align-items: center;
          font-size: 1em;
          color: #525252;
          gap: 10px;
        }

        .edit-icon12 {
          color: #176be6;
          cursor: pointer;
          display: inline-block;
          pointer-events: auto;
          transition: color 0.2s ease;
        }

        .edit-icon {
          margin-left: 16px;
          color: #176be6;
          cursor: pointer;
          font-size: 1.1em;
        }

        .edit-icon:hover {
          color: #004bb5;
        }

        .divider {
          border-top: 2px dashed #c1c1c1;
          margin: 40px 0;
        }

        .button-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
        }

        .right-buttons {
          display: flex;
          gap: 12px;
        }

        .btn {
          font-family: "Poppins", sans-serif;
          font-size: 15px;
          font-weight: 500;
          padding: 10px 24px;
          border-radius: 50px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn {
          background: #fff;
          border: 1px solid #ccc;
          color: #176be6;
        }

        .back-btn:hover {
          background: #f2f7ff;
        }

        .preview-btn {
          background: #fff;
          border: 1px solid #ccc;
          color: #176be6;
        }

        .preview-btn:hover {
          background: #f2f7ff;
        }

        .confirm-btn {
          background: #176be6;
          color: #fff;
        }

        .confirm-btn:hover {
          background: #0f4fb3;
        }
        .underline {
          text-decoration: underline;
        }
        .pointer {
          cursor: pointer;
        }
      `}</style>
        </>
    );
};

export default Index;