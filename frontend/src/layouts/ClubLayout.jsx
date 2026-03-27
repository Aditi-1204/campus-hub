import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { label: 'Dashboard', to: '/club/dashboard', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Events', to: '/club/events', icon: <EventIcon fontSize="small" /> },
  { label: 'Clubs', to: '/club/clubs', icon: <GroupsIcon fontSize="small" /> },
];

export default function ClubLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'club') return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 min-h-screen bg-purple-900 text-white flex flex-col shadow-2xl">
        <div className="px-6 py-5 border-b border-purple-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
              <GroupsIcon sx={{ fontSize: 20, color: 'white' }} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">CampusHub</p>
              <p className="text-xs text-purple-300">Club Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider px-3 mb-3">Menu</p>
          {NAV.map(({ label, to, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-300 hover:bg-purple-800 hover:text-white'
                }`
              }
            >
              {icon}{label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-purple-700/60">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-purple-400 truncate">{user?.email}</p>
            </div>
          </div>
          <Tooltip title="Logout" placement="right">
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
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
