import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dpr from './pages/Dpr';
import Dashboard from './pages/Dashboard';

function App() {
  const [apiStatus, setApiStatus] = useState('Checking API...');

  useEffect(() => {
    fetch('http://localhost:5005/api/test')
      .then(res => res.json())
      .then(data => setApiStatus(data.message))
      .catch(() => setApiStatus('API not reachable'));
  }, []);

  return (
    <Router>
      <h1>Urban Storm Water Drainage Scheme</h1>
      <p><strong>Backend status:</strong> {apiStatus}</p>

      <Routes>
      <Route path="/" element={<Login />} /> {/* render Login component */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dpr" element={<Dpr />} />
      </Routes>
    </Router>
  );
}

export default App;
