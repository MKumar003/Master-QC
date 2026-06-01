export default function StatusBadge({ status }) {
  const labels = {
    in_progress: 'In Progress',
    pass: 'Pass',
    needs_revision: 'Needs Revision',
    rejected: 'Rejected',
  }

  return (
    <span className={`status-badge ${status}`}>
      <span className="status-dot"></span>
      {labels[status] || status}
    </span>
  )
}
