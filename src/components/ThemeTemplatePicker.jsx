import { THEME_COLORS, TEMPLATES } from '../utils/sampleData'

export default function ThemeTemplatePicker({ theme, template, onThemeChange, onTemplateChange }) {
  return (
    <div className="editor-section">
      <div className="editor-section-head">
        <h3>Appearance</h3>
      </div>

      <div className="field">
        <label className="picker-label">Theme</label>
        <div className="theme-picker">
          {THEME_COLORS.map((t) => (
            <button
              key={t.id}
              type="button"
              title={t.label}
              className={`theme-swatch ${theme === t.id ? 'active' : ''}`}
              style={{ background: t.hex }}
              onClick={() => onThemeChange(t.id)}
            />
          ))}
        </div>
      </div>

      <div className="field">
        <label className="picker-label">Template Style</label>
        <div className="template-picker">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`template-btn ${template === t.id ? 'active' : ''}`}
              onClick={() => onTemplateChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
