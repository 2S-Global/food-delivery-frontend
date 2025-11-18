"use client"; // ⬅ Required for Next.js Client Component

import Link from "next/link";
import LoginWithSocial from "./LoginWithSocial";
import { useRouter } from "next/navigation";
import axios from "axios";
import React, { useState } from "react";

//new component
import MessageComponent from "../../ResponseMsg";

const FormContent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${apiurl}/api/auth/login`, formData);

      //check if response is successful
      if (!response.data.success) {
        throw new Error(response.data.message || "An error occurred");
      }
      setSuccess("Log In successful!");
      const token = response.data.token;
      const role = response.data.role;

      //save token to local storage
      if (role == "1") {
        localStorage.setItem("token", token);
        router.push("/candidates-dashboard/dashboard");
      } else if (role == "2") {
        localStorage.setItem("Admin_token", token);
        router.push("/employers-dashboard/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-inner">
      <h3>Login to E²-Score</h3>
      {/* display error */}
      <MessageComponent error={error} success={success} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            id="password-field"
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <div className="field-outer">
            <div className="input-group checkboxes square">
              <input type="checkbox" name="remember-me" id="remember" />
              <label htmlFor="remember" className="remember">
                <span className="custom-checkbox"></span> Remember me
              </label>
            </div>
            <a href="#" className="pwd">
              Forgot password?
            </a>
          </div>
        </div>

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging..." : "Log in"}
          </button>
        </div>

        {/* <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="button"
            onClick={() => handleLogin("/candidates-dashboard/dashboard")}
          >
            Log In (as Candidate)
          </button>

          <button
            className="theme-btn btn-style-one"
            type="button"
            onClick={() => handleLogin("/employers-dashboard/dashboard")}
          >
            Log In (as Employer)
          </button>
        </div> */}
      </form>

      <div className="bottom-box">
        <div className="text">
          Don&apos;t have an account?{" "}
          <Link
            href="#"
            className="call-modal signup"
            data-bs-toggle="modal"
            data-bs-target="#registerModal"
          >
            Signup
          </Link>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <LoginWithSocial />
      </div>
    </div>
  );
};

export default FormContent;
