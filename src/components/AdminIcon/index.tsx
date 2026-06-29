import React from 'react'

import '../AdminLogo/index.scss'

const AdminIcon: React.FC = () => (
  <svg
    aria-hidden
    className="crispy-admin-icon graphic-icon"
    fill="none"
    height="25"
    viewBox="0 0 25 25"
    width="25"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="url(#crispy-icon-gradient)" height="25" rx="7" width="25" />
    <path
      d="M7.5 16.5c0-3.59 2.91-6.5 6.5-6.5 1.19 0 2.3.32 3.27.88-.65-2.27-2.75-3.94-5.24-3.94C9.05 7.04 6.5 9.59 6.5 12.84c0 1.63.79 3.09 2.01 4L7.5 16.5Z"
      fill="rgb(255, 247, 237, 0.95)"
    />
    <path
      d="M17.5 9.5c1.52 1.14 2.5 2.95 2.5 4.98 0 3.44-2.79 6.23-6.23 6.23-1.38 0-2.66-.45-3.7-1.21.84 1.44 2.4 2.41 4.18 2.41 3.44 0 6.23-2.79 6.23-6.23 0-2.68-1.7-4.97-4.06-5.85V9.5Z"
      fill="rgb(254, 215, 170, 0.95)"
    />
    <defs>
      <linearGradient gradientUnits="userSpaceOnUse" id="crispy-icon-gradient" x1="4" x2="22" y1="3" y2="23">
        <stop offset="0" />
        <stop offset="1" />
      </linearGradient>
    </defs>
  </svg>
)

export default AdminIcon
