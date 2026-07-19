import { Routes, Route } from 'react-router-dom';
import Landing from './landing/Landing';
import AppShell from './AppShell';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app/smart-api" element={<AppShell />} />
    </Routes>
  );
}
