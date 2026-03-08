import React from "react"

import type { ThemePreset } from "~utils/themes"

interface ThemePreviewProps {
  preset: ThemePreset
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ preset }) => {
  const vars = preset.variables

  // Extract colors with fallbacks
  const bg = vars["--gh-bg"] || "#ffffff"
  const headerBg = vars["--gh-header-bg"] || vars["--gh-primary"] || "#4285f4"
  const borderColor = vars["--gh-border"] || "#e5e7eb"
  const primary = vars["--gh-primary"] || "#4285f4"
  const text = vars["--gh-text"] || "#374151"
  const textSecondary = vars["--gh-text-secondary"] || "#9ca3af"
  const sidebarBg = vars["--gh-bg-secondary"] || "#f3f4f6"

  return (
    <div
      className="theme-preview-layout"
      style={{
        backgroundColor: bg,
        borderColor: borderColor,
      }}>
      {/* Header */}
      <div className="theme-preview-header" style={{ backgroundColor: headerBg }}>
        <div className="theme-preview-dot" />
        <div className="theme-preview-dot delay-1" />
        <div className="theme-preview-dot delay-2" />
      </div>

      {/* Main Body */}
      <div className="theme-preview-body">
        {/* Sidebar */}
        <div
          className="theme-preview-sidebar"
          style={{
            backgroundColor: sidebarBg,
            borderColor: borderColor,
          }}>
          <div
            className="theme-preview-line short"
            style={{ backgroundColor: textSecondary, opacity: 0.3 }}
          />
          <div
            className="theme-preview-line"
            style={{ backgroundColor: textSecondary, opacity: 0.3 }}
          />
          <div
            className="theme-preview-line"
            style={{ backgroundColor: textSecondary, opacity: 0.3 }}
          />

          {/* Active Item */}
          <div
            className="theme-preview-active-item"
            style={{
              backgroundColor: primary,
              opacity: 0.15,
            }}
          />
        </div>

        {/* Content */}
        <div className="theme-preview-content">
          <div className="theme-preview-hero" style={{ backgroundColor: primary, opacity: 0.1 }} />

          <div className="theme-preview-row">
            <div
              className="theme-preview-avatar"
              style={{ backgroundColor: textSecondary, opacity: 0.2 }}
            />
            <div style={{ flex: 1 }}>
              <div
                className="theme-preview-line"
                style={{ backgroundColor: text, opacity: 0.6, marginBottom: 4 }}
              />
              <div
                className="theme-preview-line short"
                style={{ backgroundColor: textSecondary, opacity: 0.4 }}
              />
            </div>
          </div>

          <div className="theme-preview-button" style={{ backgroundColor: primary }}></div>
        </div>
      </div>
    </div>
  )
}
