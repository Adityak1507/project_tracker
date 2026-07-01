import { Calendar, User, AlignLeft, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function ProjectList({ projects, onEdit, onDelete }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <AlignLeft size={48} />
        <h3>No projects found</h3>
        <p>Click "New Project" to add one.</p>
      </div>
    );
  }

  const getStageBadgeClass = (stage) => {
    switch(stage) {
      case 'start': return 'badge-start';
      case 'on hold': return 'badge-hold';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge-start';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="projects-list">
      {projects.map(project => (
        <div key={project.id} className="glass-panel project-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">{project.project_name}</h3>
              <div className="card-subtitle">
                <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {project.client_name}
              </div>
            </div>
            <span className={`badge ${getStageBadgeClass(project.stage)}`}>
              {project.stage}
            </span>
          </div>

          {project.stage === 'start' && project.sub_stage && (
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 500 }}>
              ↳ {project.sub_stage}
            </div>
          )}

          <div className="card-meta">
            <div className="card-meta-item">
              <Calendar size={14} />
              {formatDate(project.target_date)}
            </div>
          </div>

          {project.description && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {project.description}
            </div>
          )}

          <div className="card-actions">
            <button className="btn-icon" onClick={() => onEdit(project)} title="Edit Project">
              <Edit size={16} />
            </button>
            <button className="btn-icon" style={{color: 'var(--danger-color)'}} onClick={() => onDelete(project.id)} title="Delete Project">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
