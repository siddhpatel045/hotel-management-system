import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

function Register() {
  const [form, setForm] = useState({ firstName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 25;
    if (/\d/.test(pass)) score += 25;
    if (/[@$!%*?&]/.test(pass)) score += 25;
    return score;
  };

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const strengthColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-orange-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const strengthLabel = () => {
    if (strength === 0) return "";
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  const validateForm = () => {
    if (!form.firstName.trim()) return "First name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Invalid email format";

    if (form.password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password)) return "Password must include both uppercase and lowercase letters";
    if (!/\d/.test(form.password)) return "Password must include at least one number";
    if (!/[@$!%*?&]/.test(form.password)) return "Password must include at least one special character (@$!%*?&)";

    if (form.password !== form.confirmPassword) return "Passwords do not match";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        firstName: form.firstName,
        email: form.email,
        password: form.password
      });
      const data = await res.json();
      if (!res.ok) { 
        setError(data.error || "Registration failed"); 
        return; 
      }
      login(data);
      navigate("/");
    } catch { 
      setError("Server error. Please try again."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] py-12 px-4">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-10">
        <h2 className="text-3xl font-serif text-center mb-2 text-[#8B6B2E]">Join Aurevia Grand</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Create your account for exclusive access</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm mb-4 p-3 rounded-xl text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">First Name</label>
            <input type="text" placeholder="Your first name" required
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
            <input type="email" placeholder="your@email.com" required
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
            <input type="password" placeholder="Min 8 characters, A-z, 0-9, @$!" required
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            
            {/* Password Strength Meter */}
            {form.password && (
              <div className="mt-2 text-right">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${strengthColor()}`} style={{ width: `${strength}%` }}></div>
                </div>
                <span className={`text-[10px] font-bold uppercase ${strengthColor().replace('bg-', 'text-')}`}>
                  {strengthLabel()}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Confirm Password</label>
            <input type="password" placeholder="Repeat your password" required
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#C9A24D] hover:bg-[#b8913f] disabled:opacity-60 text-white py-4 rounded-xl font-bold transition shadow-lg hover:shadow-xl active:scale-[0.98] mt-4">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#C9A24D] font-bold hover:underline decoration-2 underline-offset-4">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
