import React from 'react';

export default function SessionList({ sessions, user, onChangeStatus }) {
  if (!sessions.length) return <div>No sessions yet.</div>;

  return (
    <div className="space-y-3">
      {sessions.map(s => (
        <div key={s._id} className="p-3 border rounded flex justify-between items-start">
          <div>
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-gray-600">{s.description}</div>
            <div className="text-xs text-gray-500 mt-2">
              Mentor: {s.mentor?.name || '—'} • Learner: {s.learner?.name || '—'}
            </div>
            <div className="text-xs text-gray-500">Scheduled: {new Date(s.scheduledAt).toLocaleString()}</div>
            <div className="text-xs text-gray-500">Status: <strong>{s.status}</strong></div>
          </div>
          <div className="flex flex-col gap-2">
            {user.role === 'mentor' && s.status === 'requested' && (
              <>
                <button onClick={() => onChangeStatus(s._id, 'approved')} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
                <button onClick={() => onChangeStatus(s._id, 'rejected')} className="px-3 py-1 rounded bg-red-600 text-white">Reject</button>
              </>
            )}

            {user.role === 'learner' && s.learner && s.learner._id === user.id && s.status === 'approved' && (
              <button onClick={() => onChangeStatus(s._id, 'completed')} className="px-3 py-1 rounded bg-indigo-600 text-white">Mark Completed</button>
            )}

            {user.role === 'admin' && (
              <>
                <button onClick={() => onChangeStatus(s._id, 'approved')} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
                <button onClick={() => onChangeStatus(s._id, 'rejected')} className="px-3 py-1 rounded bg-red-600 text-white">Reject</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
