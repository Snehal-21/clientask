import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmailSmartly = (email) => {
    // Reject multiple '@'
    const atCount = (email.match(/@/g) || []).length;
    if (atCount > 1) {
      return "Please enter a valid email address.";
    }

    if (!email.includes("@") || email.endsWith("@")) return "";

    const [localPart, domainPart] = email.split("@");

    if (!domainPart || domainPart.length === 0) return "";

    // Disallow invalid special characters in domain (except . and -)
    if (/[^a-zA-Z0-9.-]/.test(domainPart)) {
      return "Please enter a valid email address.";
    }

    // Reject if domain is only numbers
    if (/^\d+$/.test(domainPart)) {
      return "Please enter a valid email address.";
    }

    if (domainPart.includes(".")) {
      const parts = domainPart.split(".");
      const domainName = parts[0];
      const tld = parts[parts.length - 1];

      if (/^\d+$/.test(domainName)) {
        return "Please enter a valid email address.";
      }

      // ✅ Don't validate if user is still typing TLD (≤ 3 characters)
      if (tld.length > 3) {
        return "Please enter a valid email address.";
      }

      // ✅ Only run regex check if TLD is 2–3 characters
      if (tld.length >= 2 && tld.length <= 3) {
        const fullEmailRegex =
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
        if (!fullEmailRegex.test(email)) {
          return "Please enter a valid email address.";
        }
      }
    }

    return "";
  };

  const validatePassword = (password) => {
    if (password.length === 0) return ""; // no error when empty

    // Optional: only start validating after 4 chars typed
    if (password.length < 4) return "";

    const lengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const numberCheck = /\d/.test(password);

    if (!lengthCheck) {
      return "Password must be at least 8 characters long.";
    }
    if (!uppercaseCheck) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!numberCheck) {
      return "Password must contain at least one number.";
    }
    if (!specialCharCheck) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      const errorMessage = validateEmailSmartly(value);
      setErrors((prev) => ({
        ...prev,
        email: errorMessage,
      }));
    }

    if (name === "password") {
      const errorMessage = validatePassword(value);
      setErrors((prev) => ({
        ...prev,
        password: errorMessage,
      }));
    }

    if (
      name === "confirmPassword" ||
      (name === "password" && formData.confirmPassword)
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          name === "confirmPassword" && value !== formData.password
            ? "Passwords do not match"
            : name === "password" && formData.confirmPassword !== value
            ? "Passwords do not match"
            : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate email before proceeding
    const emailError = validateEmailSmartly(formData.email);
    if (emailError) {
      toast.error(emailError);
      setLoading(false);
      return;
    }
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast.error(passwordError);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
