import { useState } from 'react'
import { Sparkles, MessageSquare } from 'lucide-react'

export default function ChecklistItem({ item, onChange, aiSuggestion, readOnly }) {
  const [showNotes, setShowNotes] = useState(!!item.notes)

  const handleCheck = () => {
    if (readOnly) return
    onChange({ ...item, checked: !item.checked })
  }

  const handleNotes = (e) => {
    onChange({ ...item, notes: e.target.value })
  }

  return (
    <div>
      <label className="checkbox-wrapper">
        <input
          type="checkbox"
          className="checkbox-input"
          checked={item.checked}
          onChange={handleCheck}
          disabled={readOnly}
        />
        <span className="checkbox-custom">
          <svg viewBox="0 0 14 14">
            <polyline points="2 7 5.5 10.5 12 4" />
          </svg>
        </span>
        <span className="checkbox-label">{item.name}</span>

        {aiSuggestion && (
          <span className={`checkbox-ai-badge ${aiSuggestion.type}`}>
            <Sparkles size={10} />
            {aiSuggestion.type === 'issue' ? 'AI Issue' : 'AI OK'}
          </span>
        )}

        {!readOnly && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={(e) => { e.preventDefault(); setShowNotes(!showNotes) }}
            style={{ marginLeft: 'auto', padding: '4px' }}
            title="Add notes"
          >
            <MessageSquare size={14} />
          </button>
        )}
      </label>

      {showNotes && (
        <div style={{ paddingLeft: '46px', paddingBottom: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Add a note..."
            value={item.notes}
            onChange={handleNotes}
            readOnly={readOnly}
            style={{ fontSize: 'var(--font-small)', padding: '6px 12px' }}
          />
          {aiSuggestion?.note && (
            <p style={{ fontSize: 'var(--font-caption)', color: 'var(--status-revision)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={10} /> AI: {aiSuggestion.note}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
