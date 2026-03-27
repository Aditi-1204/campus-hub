import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { label: 'Dashboard', to: '/placement/dashboard', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Internships', to: '/placement/internships', icon: <SchoolIcon fontSize="small" /> },
  { label: 'Jobs', to: '/placement/jobs', icon: <WorkIcon fontSize="small" /> },
  { label: 'Campus Drives', to: '/placement/campus-drives', icon: <DirectionsCarIcon fontSize="small" /> },
  { label: 'Workshops', to: '/placement/workshops', icon: <BuildIcon fontSize="small" /> },
  { label: 'Conferences', to: '/placement/conferences', icon: <EmojiEventsIcon fontSize="small" /> },
];

export default function PlacementLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'placement') return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 min-h-screen bg-emerald-900 text-white flex flex-col shadow-2xl">
        <div className="px-6 py-5 border-b border-emerald-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <WorkIcon sx={{ fontSize: 20, color: 'white' }} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">CampusHub</p>
              <p className="text-xs text-emerald-300">Placement Cell</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider px-3 mb-3">Menu</p>
          {NAV.map(({ label, to, icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-300 hover:bg-emerald-800 hover:text-white'
                }`
              }
            >
              {icon}{label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-emerald-700/60">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-emerald-400 truncate">{user?.email}</p>
            </div>
          </div>
          <Tooltip title="Logout" placement="right">
            <button onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
              <LogoutIcon fontSize="small" /> Logout
            </button>
          </Tooltip>
        </div>
      </aside>

      <main className="flex-1 p-8 bg-slate-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
