import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
const [errors, setErrors] = useState({
  email: "",
  password: "",
});

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
      const fullEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
      if (!fullEmailRegex.test(email)) {
        return "Please enter a valid email address.";
      }
    }
  }

  return "";
};




const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "email") {
    setEmail(value);

    const errorMessage = validateEmailSmartly(value);
    setErrors((prev) => ({
      ...prev,
      email: errorMessage,
    }));
  } else if (name === "password") {
    setPassword(value);

    // If you want to handle password errors here, add logic
    // For now, just clear any password error on typing
    setErrors((prev) => ({
      ...prev,
      password: "",
    }));
  }
};





  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                 onChange={handleChange}
                  className="input-field"
                />
              </div>
               {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                    Register
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