import React, { useState } from 'react';
import { login, register } from '../api';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'learner' });
  const [err, setErr] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const resp = await register(form);
        if (resp.token) {
          localStorage.setItem('token', resp.token);
          onLogin(resp.user);
        } else {
          setErr(resp.message || 'Registration failed');
        }
      } else {
        const resp = await login(form.email, form.password);
        if (resp.token) {
          localStorage.setItem('token', resp.token);
          onLogin(resp.user);
        } else {
          setErr(resp.message || 'Login failed');
        }
      }
    } catch (e) {
      setErr('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
        {err && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{err}</div>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name"
              className="w-full mb-3 p-2 border rounded" />
          )}
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email"
            className="w-full mb-3 p-2 border rounded" />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password"
            className="w-full mb-3 p-2 border rounded" />
          {isRegister && (
            <select name="role" value={form.role} onChange={handleChange} className="w-full mb-3 p-2 border rounded">
              <option value="learner">Learner</option>
              <option value="mentor">Mentor</option>
            </select>
          )}
          <button className="w-full p-2 bg-blue-600 text-white rounded mb-2" type="submit">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <div className="text-sm text-center">
          <button className="text-blue-600" onClick={() => { setErr(''); setIsRegister(!isRegister); }}>
            {isRegister ? 'Have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
