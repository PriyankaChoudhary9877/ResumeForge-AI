import { useState } from 'react'
import { makeId } from '../utils/sampleData'

export default function SkillsSection({ skillCategories, onChange }) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [draftItem, setDraftItem] = useState({})

  function addCategory() {
    if (!newCategoryName.trim()) return
    onChange([...skillCategories, { id: makeId(), name: newCategoryName.trim(), items: [], standard: false }])
    setNewCategoryName('')
  }

  function removeCategory(id) {
    onChange(skillCategories.filter((c) => c.id !== id))
  }

  function renameCategory(id, name) {
    onChange(skillCategories.map((c) => (c.id === id ? { ...c, name } : c)))
  }

  function addItem(catId) {
    const value = (draftItem[catId] || '').trim()
    if (!value) return
    onChange(
      skillCategories.map((c) => (c.id === catId ? { ...c, items: [...c.items, value] } : c))
    )
    setDraftItem({ ...draftItem, [catId]: '' })
  }

  function removeItem(catId, index) {
    onChange(
      skillCategories.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((_, i) => i !== index) } : c
      )
    )
  }

  function handleKeyDown(e, catId) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem(catId)
    }
  }

  return (
    <div className="editor-section">
      <div className="editor-section-head">
        <h3>Skills</h3>
      </div>

      {skillCategories.map((cat) => (
        <div className="entry-card" key={cat.id}>
          <div className="entry-card-row">
            <input
              className="skill-cat-name"
              value={cat.name}
              onChange={(e) => renameCategory(cat.id, e.target.value)}
              placeholder="Category name"
            />
            {!cat.standard && (
              <button type="button" className="btn btn-remove" onClick={() => removeCategory(cat.id)}>
                Remove
              </button>
            )}
          </div>

          <div className="chip-row">
            {cat.items.map((item, i) => (
              <span className="chip" key={i}>
                {item}
                <button type="button" onClick={() => removeItem(cat.id, i)} aria-label={`Remove ${item}`}>
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="entry-card-row">
            <input
              placeholder="Add a skill and press Enter"
              value={draftItem[cat.id] || ''}
              onChange={(e) => setDraftItem({ ...draftItem, [cat.id]: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, cat.id)}
            />
            <button type="button" className="btn btn-add" onClick={() => addItem(cat.id)}>
              Add
            </button>
          </div>
        </div>
      ))}

      <div className="entry-card-row add-category-row">
        <input
          placeholder="Custom category heading (e.g. Languages Spoken)"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
        />
        <button type="button" className="btn btn-add" onClick={addCategory}>
          + Add Category
        </button>
      </div>
    </div>
  )
}
