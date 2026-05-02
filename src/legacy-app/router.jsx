import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from '../components/Shell.jsx';

const Home = lazy(() => import('../pages/Home.jsx'));
const CollegeList = lazy(() => import('../pages/CollegeList.jsx'));
const CheckCutoffs = lazy(() => import('../pages/CheckCutoffs.jsx'));
const Branches = lazy(() => import('../pages/Branches.jsx'));
const Downloads = lazy(() => import('../pages/Downloads.jsx'));
const Contact = lazy(() => import('../pages/Contact.jsx'));
const Chatbot = lazy(() => import('../pages/Chatbot.jsx'));

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Home />} />
        <Route path="/college-list" element={<CollegeList />} />
        <Route path="/check-cutoffs" element={<CheckCutoffs />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
