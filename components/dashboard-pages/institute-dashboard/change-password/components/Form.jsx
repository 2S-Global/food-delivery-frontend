import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import MessageComponent from "@/components/common/ResponseMsg";

const Form = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
const [errorId, setErrorId] = useState(null);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("Super_token") : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields.");
          setErrorId(Date.now());
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match With Confirm Password.");
          setErrorId(Date.now());
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${apiurl}/api/companyRoutes/change-password`,
        {
          oldPassword,
          newPassword,
          role:3
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setShowPassword({ old: false, new: false, confirm: false });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong.";
      setError(msg);
          setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const toggleIconStyle = {
    position: "absolute",
    top: "50%",
    right: "15px",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#6c757d",
  };

  const renderPasswordInput = (label, name, typeKey) => (
    <div className="form-group col-lg-12 col-md-12">
      <label>{label}</label>
      <div style={inputWrapperStyle}>
        <input
          type={showPassword[typeKey] ? "text" : "password"}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required
          className="w-100"
        />
        <span style={toggleIconStyle} onClick={() => togglePassword(typeKey)}>
          {showPassword[typeKey] ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>
    </div>
  );

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      <MessageComponent error={error} success={success} errorId={errorId}/>

      <div className="row">
        {renderPasswordInput("Old Password", "oldPassword", "old")}
        {renderPasswordInput("New Password", "newPassword", "new")}
        {renderPasswordInput("Confirm Password", "confirmPassword", "confirm")}

        <div className="form-group col-lg-6 col-md-12">
          <button
            type="submit"
            className="theme-btn btn-style-one"
            disabled={loading}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: loading ? "#ccc" : "",
            }}
          >
            {loading ? "Please wait..." : "Update"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
