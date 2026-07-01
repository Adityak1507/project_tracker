import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const DEFAULT_TIMELINE = [
  { name: 'Requirement Analysis', targetDate: '', completed: false },
  { name: 'Planning', targetDate: '', completed: false },
  { name: 'Software Design', targetDate: '', completed: false },
  { name: 'Software Development', targetDate: '', completed: false },
  { name: 'Testing', targetDate: '', completed: false },
  { name: 'Deployment', targetDate: '', completed: false },
  { name: 'Maintenance', targetDate: '', completed: false }
];

export default function ProjectForm({ onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    project_name: '',
    client_name: '',
    target_date: '',
    stage: 'start',
    description: '',
    sdlc_timeline: JSON.parse(JSON.stringify(DEFAULT_TIMELINE))
  });

  useEffect(() => {
    if (initialData) {
      const date = new Date(initialData.target_date);
      const formattedDate = !isNaN(date.getTime()) 
        ? date.toISOString().split('T')[0] 
        : '';
        
      let parsedTimeline = initialData.sdlc_timeline;
      // Handle MySQL JSON strings if not parsed automatically
      if (typeof parsedTimeline === 'string') {
        try { parsedTimeline = JSON.parse(parsedTimeline); } catch (e) {}
      }
      
      setFormData({
        ...initialData,
        target_date: formattedDate,
        sdlc_timeline: Array.isArray(parsedTimeline) && parsedTimeline.length > 0 
          ? parsedTimeline 
          : JSON.parse(JSON.stringify(DEFAULT_TIMELINE))
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimelineChange = (index, field, value) => {
    setFormData(prev => {
      const newTimeline = [...prev.sdlc_timeline];
      newTimeline[index] = { ...newTimeline[index], [field]: value };
      
      // Strict rule: if unchecked, uncheck all subsequent stages
      if (field === 'completed' && value === false) {
        for (let i = index + 1; i < newTimeline.length; i++) {
          newTimeline[i].completed = false;
        }
      }
      
      return { ...prev, sdlc_timeline: newTimeline };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{initialData ? 'Edit Project' : 'New Project'}</h2>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              required 
              placeholder="e.g. Website Redesign"
            />
          </div>

          <div className="form-group">
            <label>Client Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required 
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Final Target Date</label>
              <input 
                type="date" 
                className="form-control" 
                name="target_date"
                value={formData.target_date}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select 
                className="form-control" 
                name="stage"
                value={formData.stage}
                onChange={handleChange}
              >
                <option value="start">Start (Active)</option>
                <option value="on hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description / Comments</label>
            <textarea 
              className="form-control" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ minHeight: '60px' }}
              placeholder="Add notes about ongoing work..."
            ></textarea>
          </div>

          {formData.stage === 'start' && (
            <div className="timeline-setup">
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>
                SDLC Timeline (Strict Progression)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {formData.sdlc_timeline.map((stage, index) => {
                  const isPreviousCompleted = index === 0 || formData.sdlc_timeline[index - 1].completed;
                  const isDisabled = !isPreviousCompleted;
                  
                  return (
                    <div key={stage.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: isDisabled ? 0.5 : 1 }}>
                      
                      <div style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%', 
                          background: stage.completed ? 'var(--success-color)' : 'var(--surface-border)',
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem'
                        }}>
                          {stage.completed ? <Check size={14} /> : (index + 1)}
                        </div>
                        <span style={{ fontWeight: 500, minWidth: '140px' }}>{stage.name}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input 
                          type="date"
                          className="form-control"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: '130px' }}
                          value={stage.targetDate || ''}
                          disabled={isDisabled}
                          onChange={(e) => handleTimelineChange(index, 'targetDate', e.target.value)}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: isDisabled ? 'not-allowed' : 'pointer', margin: 0 }}>
                          <input 
                            type="checkbox"
                            checked={stage.completed}
                            disabled={isDisabled}
                            onChange={(e) => handleTimelineChange(index, 'completed', e.target.checked)}
                          />
                          Done
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="modal-header" style={{ marginBottom: 0, marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
