import React, { useEffect, useState, useRef } from 'react';
import { fetchSessions, createSession, updateSessionStatus } from '../api';
import BookingForm from '../components/BookingForm';
import SessionList from '../components/SessionList';

export default function Dashboard({ user, onLogout }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchSessions();
    setSessions(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();

    // polling for "real-time" updates every 8 seconds
    pollRef.current = setInterval(() => {
      load();
    }, 8000);

    return () => clearInterval(pollRef.current);
  }, []);

  const handleCreate = async (payload) => {
    const resp = await createSession(payload);
    if (resp._id) {
      // optimistic refresh
      load();
    } else {
      alert(resp.message || 'Error creating session');
    }
  };

  const handleChangeStatus = async (id, status) => {
    const resp = await updateSessionStatus(id, status);
    if (resp._id) {
      load();
    } else {
      alert(resp.message || 'Error updating status');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">SkillBridge — Dashboard</h1>
          <div>
            <span className="mr-4">{user.name} ({user.role})</span>
            <button className="bg-gray-200 px-3 py-1 rounded" onClick={onLogout}>Logout</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Sessions</h2>
            {loading ? <div>Loading...</div> :
              <SessionList sessions={sessions} user={user} onChangeStatus={handleChangeStatus} />
            }
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Book a session (Learner)</h2>
            {user.role === 'learner' ? <BookingForm onCreate={handleCreate} /> : <div>Only learners can book sessions.</div>}
            <hr className="my-4" />
            <div>
              <h3 className="font-semibold mb-2">Quick actions</h3>
              <p className="text-sm">Future: Integrate with Zoom or other video API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
