import React from "react"

interface PageTitleProps {
  title: string
  Icon?: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, Icon }) => {
  return (
    <h1 className="settings-page-title" style={{ display: "flex", alignItems: "center" }}>
      {Icon && (
        <Icon
          size={28}
          className="settings-page-title-icon"
          style={{
            marginRight: 8,
            color: "var(--gh-primary, #4285f4)",
          }}
        />
      )}
      {title}
    </h1>
  )
}
