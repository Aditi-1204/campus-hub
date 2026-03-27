// ─── CampusHub Global Theme (CSS variable-based) ─────────────────────────────
// All values reference CSS variables defined in index.css
// Dark mode is applied by adding .dark class to <html> via useDarkMode hook

export const T = {
  navy:       'var(--navy)',
  aqua:       'var(--aqua)',
  aquaDark:   'var(--aqua-dark)',
  aquaLight:  'var(--aqua-light)',
  bg:         'var(--bg)',
  card:       'var(--card)',
  border:     'var(--border)',
  text:       'var(--text)',
  textMuted:  'var(--text-muted)',
  sidebarBg:  'var(--sidebar-bg)',
  inputBg:    'var(--input-bg)',
  hoverRow:   'var(--hover-row)',

  // Sidebar states
  sidebarActive:   { background: 'var(--aqua-light)', color: 'var(--navy)', borderLeft: '3px solid var(--aqua)' },
  sidebarInactive: { background: 'transparent', color: 'var(--text-muted)', borderLeft: '3px solid transparent' },

  // Table header
  tableHead: { background: 'var(--navy)' },

  // Buttons
  btnPrimary: { background: 'var(--aqua)',  color: '#fff' },
  btnNavy:    { background: 'var(--navy)',  color: '#fff' },
};
