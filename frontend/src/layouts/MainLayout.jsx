import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="bg-slate-950">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
