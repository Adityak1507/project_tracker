import { Calendar, User, AlignLeft, Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';

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

  const parseTimeline = (timelineStr) => {
    if (!timelineStr) return [];
    if (typeof timelineStr === 'string') {
      try { return JSON.parse(timelineStr); } catch(e) { return []; }
    }
    return timelineStr;
  };

  return (
    <div className="projects-list">
      {projects.map(project => {
        const timeline = parseTimeline(project.sdlc_timeline);
        const hasTimeline = Array.isArray(timeline) && timeline.length > 0 && project.stage === 'start';

        return (
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

            {hasTimeline && (
              <div className="project-timeline">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', position: 'relative' }}>
                  {/* Connecting Line */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', height: '2px', background: 'var(--surface-border)', zIndex: 0 }}></div>
                  
                  {timeline.map((stage, idx) => {
                    const isCompleted = stage.completed;
                    const isActive = !isCompleted && (idx === 0 || timeline[idx-1].completed);
                    
                    let dotColor = 'var(--surface-color)';
                    let dotBorder = 'var(--surface-border)';
                    let textColor = 'var(--text-secondary)';
                    
                    if (isCompleted) {
                      dotColor = 'var(--success-color)';
                      dotBorder = 'var(--success-color)';
                    } else if (isActive) {
                      dotColor = 'white';
                      dotBorder = 'var(--accent-color)';
                      textColor = 'var(--text-primary)';
                    }

                    return (
                      <div key={stage.name} className="timeline-step" title={`${stage.name} ${stage.targetDate ? '- ' + formatDate(stage.targetDate) : ''}`}>
                        <div style={{ 
                          width: '20px', height: '20px', borderRadius: '50%', 
                          background: dotColor, border: `2px solid ${dotBorder}`, 
                          position: 'relative', zIndex: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {isCompleted && <CheckCircle2 size={12} color="white" />}
                        </div>
                        <div className="timeline-tooltip">
                          <strong>{stage.name}</strong>
                          {stage.targetDate && <div>{formatDate(stage.targetDate)}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Active Stage Name */}
                {timeline.find(s => !s.completed) && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600, textAlign: 'center' }}>
                    Current: {timeline.find(s => !s.completed).name}
                  </div>
                )}
              </div>
            )}

            <div className="card-meta" style={{ marginTop: hasTimeline ? '0.2rem' : '0.5rem' }}>
              <div className="card-meta-item" title="Final Deadline">
                <Calendar size={14} />
                <span style={{ fontWeight: 500 }}>{formatDate(project.target_date)}</span>
              </div>
            </div>

            {project.description && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', background: '#f9fafb', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--surface-border)' }}>
                {project.description}
              </div>
            )}

            <div className="card-actions">
              <button className="btn-icon" onClick={() => onEdit(project)} title="Edit Project Timeline">
                <Edit size={16} />
              </button>
              <button className="btn-icon" style={{color: 'var(--danger-color)'}} onClick={() => onDelete(project.id)} title="Delete Project">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
