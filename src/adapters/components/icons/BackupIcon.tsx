/**
 * SVG 图标组件 - 备份 (云同步)
 * 风格：Outline (stroke-based)
 */
import React from "react"

interface IconProps {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

export const BackupIcon: React.FC<IconProps> = ({
  size = 20,
  color = "currentColor",
  className = "",
  style,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: "block", ...style }}>
    <path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19 M17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10c-.186 0-.368.012-.547.034C16.402 6.624 13.473 4 10 4c-3.866 0-7 3.134-7 7 0 .34.025.675.074 1.002C1.309 12.544 0 14.12 0 16.002 0 18.21 1.79 20 4 20h13.5" />
  </svg>
)

export default BackupIcon
