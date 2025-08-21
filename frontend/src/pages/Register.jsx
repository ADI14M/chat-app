import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({ username:"", email:"", password:"" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch (e) {
      setErr(e?.response?.data?.msg || "Registration failed");
    }
  };

  const on = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white w-96 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        {err && <p className="text-red-600 mb-2">{err}</p>}
        <input className="border w-full p-2 mb-3 rounded" placeholder="Username" value={form.username} onChange={on("username")} />
        <input className="border w-full p-2 mb-3 rounded" placeholder="Email" type="email" value={form.email} onChange={on("email")} />
        <input className="border w-full p-2 mb-4 rounded" placeholder="Password" type="password" value={form.password} onChange={on("password")} />
        <button className="w-full bg-green-600 text-white py-2 rounded">Create account</button>
        <p className="mt-3 text-sm">Have an account? <Link to="/" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  );
}
