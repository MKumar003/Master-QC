import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { calculateSectionProgress } from '../lib/checklistData'
import ChecklistItem from './ChecklistItem'

export default function ChecklistSection({ sectionKey, section, onItemChange, aiSuggestions, readOnly }) {
  const [open, setOpen] = useState(true)
  const { checked, total, percent } = calculateSectionProgress(section.items)

  return (
    <div className="checklist-section">
      <div className="checklist-section-header" onClick={() => setOpen(!open)}>
        <span className="checklist-section-icon">{section.icon}</span>
        <span className="checklist-section-title">{section.sectionName}</span>
        <span className="checklist-section-count">{checked}/{total}</span>
        <div className="checklist-section-progress">
          <div className="checklist-section-progress-fill" style={{ width: `${percent}%` }}></div>
        </div>
        <ChevronDown size={18} className={`checklist-section-chevron ${open ? 'open' : ''}`} />
      </div>
      <div className={`checklist-section-body ${open ? 'open' : ''}`}>
        <div className="checklist-section-items">
          {section.items.map((item, idx) => (
            <ChecklistItem
              key={idx}
              item={item}
              onChange={(updated) => onItemChange?.(sectionKey, idx, updated)}
              aiSuggestion={aiSuggestions?.[`${sectionKey}.${idx}`]}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
