import logo from './logo.svg';
import './App.css';
import HomePage from './page/Home';
import ManaUser from './page/ManaUser';
import ManaCompany from './page/ManaCompany';
import ManaJobs from './page/ManaJob';
import NotFound from './page/NotFound';

import Layout from './component/layout';
import { Routes, Route, Link, Outlet } from "react-router-dom";

function App() {
  return (

    <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="users" element={<ManaUser />} />
        <Route path="company" element={<ManaCompany />} />
        <Route path="jobs" element={<ManaJobs />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
    
  );
}

export default App;
