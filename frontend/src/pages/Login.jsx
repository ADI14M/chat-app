import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("me", JSON.stringify(data.user));
      navigate("/chat");
    } catch (e) {
      setErr(e?.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white w-96 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {err && <p className="text-red-600 mb-2">{err}</p>}
        <input className="border w-full p-2 mb-3 rounded"
               placeholder="Email" type="email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border w-full p-2 mb-4 rounded"
               placeholder="Password" type="password"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Sign in</button>
        <p className="mt-3 text-sm">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </form>
    </div>
  );
}
