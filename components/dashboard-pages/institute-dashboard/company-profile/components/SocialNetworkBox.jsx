import { useState, useEffect } from "react";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import axios from "axios";
const socialPlatforms = [
  {
    label: "Facebook",
    name: "facebook",
    placeholder: "https://www.facebook.com/Invision",
  },
  {
    label: "Twitter",
    name: "twitter",
    placeholder: "https://twitter.com/yourhandle",
  },
  {
    label: "LinkedIn",
    name: "linkedin",
    placeholder: "https://linkedin.com/company/yourcompany",
  },
  {
    label: "Instagram",
    name: "instagram",
    placeholder: "https://www.instagram.com/yourhandle",
  },
  {
    label: "YouTube",
    name: "youtube",
    placeholder: "https://www.youtube.com/yourchannel",
  },

  {
    label: "Telegram",
    name: "telegram",
    placeholder: "https://t.me/yourchannel",
  },

  {
    label: "Discord",
    name: "discord",
    placeholder: "https://discord.gg/yourserver",
  },
  {
    label: "GitHub",
    name: "github",
    placeholder: "https://github.com/yourorg",
  },
];

const SocialNetworkBox = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    telegram: "",
    discord: "",
    github: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("Institute_token");

  useEffect(() => {
    FetchSocialDetails();
  }, [apiurl]);

  const FetchSocialDetails = async () => {
    setLoading(true);
    /* /api/companyprofile/get_social */
    try {
      const response = await axios.get(
        `${apiurl}/api/instituteprofile/get_social`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setFormData({
          ...formData,
          facebook: response.data.data.facebook,
          twitter: response.data.data.twitter,
          linkedin: response.data.data.linkedin,
          instagram: response.data.data.instagram,
          youtube: response.data.data.youtube,
          telegram: response.data.data.telegram,
          discord: response.data.data.discord,
          github: response.data.data.github,
        });
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);
    try {
      /* /api/companyprofile/add_or_update_social */
      const response = await axios.post(
        `${apiurl}/api/instituteprofile/add_or_update_social`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccess(response.data.message);
        setMessageId(Date.now());

        /* setTimeout(() => {
          setActiveTab("brance");
        }, 2000); */
      } else {
        setError(response.data.message);
        setErrorId(Date.now());
      }
    } catch (error) {
      setError("please try again");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <MessageComponent
        error={error}
        success={success}
        errorId={errorId}
        message_id={message_id}
      />
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 1050 }}
        >
          <CustomizedProgressBars />
        </div>
      )}
      <form className="default-form" onSubmit={handleSubmit}>
        <div className="row">
          {socialPlatforms.map((platform) => (
            <div key={platform.name} className="form-group col-lg-6 col-md-12">
              <label>{platform.label}</label>
              <input
                type="url"
                name={platform.name}
                placeholder={platform.placeholder}
                value={formData[platform.name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group col-lg-6 col-md-12">
            <button type="submit" className="theme-btn btn-style-one">
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SocialNetworkBox;
