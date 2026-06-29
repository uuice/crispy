import React from 'react'

import './index.scss'

const Mark: React.FC = () => (
  <svg
    aria-hidden
    className="crispy-admin-logo__mark"
    fill="none"
    height="40"
    viewBox="0 0 40 40"
    width="40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="url(#crispy-mark-gradient)" height="40" rx="12" width="40" />
    <path
      d="M12 26c0-6.627 5.373-12 12-12 2.2 0 4.26.59 6.04 1.62-1.2-4.2-5.08-7.28-9.68-7.28C14.477 8.34 10 12.817 10 18.34c0 3.02 1.46 5.7 3.72 7.38L12 26Z"
      fill="rgb(255, 247, 237, 0.95)"
    />
    <path
      d="M28 14.5c2.8 2.1 4.6 5.45 4.6 9.2 0 6.35-5.15 11.5-11.5 11.5-2.55 0-4.9-.83-6.82-2.24 1.95 3.35 5.57 5.59 9.72 5.59 6.35 0 11.5-5.15 11.5-11.5 0-4.95-3.14-9.18-7.5-10.8v-1.75Z"
      fill="rgb(254, 215, 170, 0.95)"
    />
    <defs>
      <linearGradient gradientUnits="userSpaceOnUse" id="crispy-mark-gradient" x1="8" x2="34" y1="6" y2="36">
        <stop offset="0" />
        <stop offset="1" />
      </linearGradient>
    </defs>
  </svg>
)

const AdminLogo: React.FC = () => {
  return (
    <div className="crispy-admin-logo">
      <Mark />
      <div className="crispy-admin-logo__text">
        <span className="crispy-admin-logo__wordmark">Crispy</span>
        <span className="crispy-admin-logo__suffix">CMS</span>
      </div>
    </div>
  )
}

export default AdminLogo
