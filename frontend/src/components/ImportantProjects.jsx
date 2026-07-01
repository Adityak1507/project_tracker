import { AlertCircle, Calendar } from 'lucide-react';
import { differenceInDays, parseISO, format } from 'date-fns';

export default function ImportantProjects({ projects, onEdit }) {
  const getImportantProjects = () => {
    if (!projects) return [];
    
    return projects.filter(project => {
      // Exclude completed or cancelled
      if (project.stage === 'completed' || project.stage === 'cancelled') return false;
      
      const targetDate = new Date(project.target_date);
      const today = new Date();
      const daysDiff = differenceInDays(targetDate, today);
      
      // Due in less than 7 days, or overdue (negative days)
      return daysDiff <= 7;
    }).sort((a, b) => new Date(a.target_date) - new Date(b.target_date));
  };

  const importantProjects = getImportantProjects();

  if (importantProjects.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '1.5rem', opacity: 0.7 }}>
        <p style={{ fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>No critical projects approaching deadline.</p>
      </div>
    );
  }

  return (
    <div className="important-section">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--danger-color)' }}>
        <AlertCircle size={20} />
        Action Required
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {importantProjects.map(project => {
          const daysLeft = differenceInDays(new Date(project.target_date), new Date());
          const isOverdue = daysLeft < 0;
          
          return (
            <div 
              key={project.id} 
              className="glass-panel important-card" 
              style={{ padding: '1rem', cursor: 'pointer' }}
              onClick={() => onEdit(project)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>{project.project_name}</h4>
                <span className="badge badge-urgent" style={{ fontSize: '0.65rem' }}>
                  {isOverdue ? 'OVERDUE' : `${daysLeft} DAYS LEFT`}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={12} />
                {format(new Date(project.target_date), 'MMM dd, yyyy')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
