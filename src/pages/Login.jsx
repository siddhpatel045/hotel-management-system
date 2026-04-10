import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", form);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      login(data);
      navigate(data.role === "admin" ? "/admin?tab=dashboard" : "/");
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-10">
        <h2 className="text-3xl font-serif text-center mb-2 text-[#8B6B2E]">Welcome Back</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Sign in to your Aurevia account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm mb-4 p-3 rounded-xl text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
          <input type="email" placeholder="your@email.com" required
            className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Password</label>
          <input type="password" placeholder="Your password" required
            className="w-full border border-gray-300 p-3 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

          <button type="submit" disabled={loading}
            className="w-full bg-[#C9A24D] hover:bg-[#b8913f] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition">
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#C9A24D] font-semibold hover:underline">Register Now</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
