// frontend/src/pages/Login.jsx
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      await login(data);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input {...register("email", { required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ ]+$/ })}
                 className="w-full border rounded p-2" />
          {errors.email && <p className="text-sm text-red-500">Valid email required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" {...register("password", { required: true })}
                 className="w-full border rounded p-2" />
          {errors.password && <p className="text-sm text-red-500">Password required</p>}
        </div>

        {apiError && <p className="text-sm text-red-500">{apiError}</p>}

        <button disabled={loading}
                className="w-full bg-primary text-white rounded py-2 disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center mt-4">
        No account? <Link to="/register" className="text-primary underline">Register</Link>
      </p>
    </div>
  );
}