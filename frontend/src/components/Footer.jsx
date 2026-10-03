import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10">
      <div className="mx-auto max-w-7xl px-6 text-sm text-slate-400">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <p className="text-white">TechBlog</p>
            <p>Personal portfolio and technical blog.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/about" className="hover:text-white">
              About
            </Link>
            <Link to="/blog" className="hover:text-white">
              Blog
            </Link>
            <Link to="/projects" className="hover:text-white">
              Projects
            </Link>
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
        <p className="mt-8 text-slate-500">© {new Date().getFullYear()} Personal Tech Blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
