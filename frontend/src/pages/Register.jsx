// frontend/src/pages/Register.jsx
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: signup } = useAuth();
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      await signup(data);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input {...register("name", { required: true })} className="w-full border rounded p-2" />
          {errors.name && <p className="text-sm text-red-500">Name required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input {...register("email", { required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ ]+$/ })} className="w-full border rounded p-2" />
          {errors.email && <p className="text-sm text-red-500">Valid email required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" {...register("password", { required: true, minLength: 6 })} className="w-full border rounded p-2" />
          {errors.password && <p className="text-sm text-red-500">Min 6 characters</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input type="password" {...register("confirmPassword", { required: true, validate: val => val === password || "Passwords don't match" })} className="w-full border rounded p-2" />
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        {apiError && <p className="text-sm text-red-500">{apiError}</p>}

        <button disabled={loading}
                className="w-full bg-primary text-white rounded py-2 disabled:opacity-50">
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account? <Link to="/login" className="text-primary underline">Sign in</Link>
      </p>
    </div>
  );
}