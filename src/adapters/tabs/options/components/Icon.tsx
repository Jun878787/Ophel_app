import React from "react"

import { SIDEBAR_ICONS } from "~utils/icons"

export interface IconProps {
  name: keyof typeof SIDEBAR_ICONS
  size?: number
  className?: string
  style?: React.CSSProperties
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}>
    <path d={SIDEBAR_ICONS[name] || ""} />
  </svg>
)
