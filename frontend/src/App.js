import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem('token');
      // optionally decode token to set user - here we trust login flow sets 'user'
    }
  }, []);

  if (!user) return <Login onLogin={(u) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }} />;

  return <Dashboard user={user} onLogout={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); }} />;
}

export default App;
