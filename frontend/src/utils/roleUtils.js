// Must match ADMIN_EMAILS in backend/routes/auth.js
const ADMIN_EMAILS = [
  'aaditisingh1027@gmail.com',
  'naziaquadri@gmail.com',
  'lipirani@gmail.com',
  'swatishree@gmail.com',
];

// Detect role from email — mirrors backend resolveRole()
export const getRoleFromEmail = (email = '') => {
  const e = email.trim().toLowerCase();
  if (ADMIN_EMAILS.includes(e)) return 'admin';
  if (/^placementcgu@cgu-odisha\.ac\.in$/.test(e)) return 'placement';
  if (/^[0-9]{10}@cgu-odisha\.ac\.in$/.test(e)) return 'student';
  if (e.endsWith('@cgu-odisha.ac.in')) return 'club_leader';
  return 'student';
};

// Get dashboard path by role
export const getDashboardByRole = (role) => {
  switch (role) {
    case 'admin':       return '/admin-dashboard';
    case 'placement':   return '/placement-dashboard';
    case 'club_leader': return '/club-dashboard';
    case 'student':
    default:            return '/student-dashboard';
  }
};
