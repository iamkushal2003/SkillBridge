import React, { useState, useEffect } from 'react';
import { fetchSessions } from '../api';

export default function BookingForm({ onCreate }) {
  const [form, setForm] = useState({ title: '', description: '', mentorId: '', scheduledAt: '', durationMinutes: 60 });
  const [mentors, setMentors] = useState([]);

  // Small helper: fetch mentors from sessions list (or ideally an API /users?role=mentor)
  useEffect(() => {
    // In this basic version we attempt to pull mentors from existing sessions (fallback)
    // In production create endpoint GET /api/users?role=mentor
    (async () => {
      try {
        const sessions = await fetchSessions();
        const m = [];
        sessions.forEach(s => {
          if (s.mentor && !m.find(x => x._id === s.mentor._id)) {
            m.push(s.mentor);
          }
        });
        setMentors(m);
      } catch (e) {
        setMentors([]);
      }
    })();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onCreate(form);
    setForm({ title: '', description: '', mentorId: '', scheduledAt: '', durationMinutes: 60 });
  };

  return (
    <form onSubmit={submit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full mb-2 p-2 border rounded" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full mb-2 p-2 border rounded" />
      <select name="mentorId" value={form.mentorId} onChange={handleChange} className="w-full mb-2 p-2 border rounded" required>
        <option value="">Select Mentor</option>
        {mentors.length ? mentors.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>) : <option disabled>No mentors available</option>}
      </select>
      <input type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={handleChange} className="w-full mb-2 p-2 border rounded" required />
      <input type="number" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
      <button className="w-full p-2 bg-blue-600 text-white rounded" type="submit">Request Session</button>
    </form>
  );
}
