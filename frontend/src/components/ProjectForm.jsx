import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SDLC_STAGES = [
  'Requirement Analysis', 
  'Planning', 
  'Software Design', 
  'Software Development', 
  'Testing', 
  'Deployment', 
  'Maintenance'
];

export default function ProjectForm({ onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    project_name: '',
    client_name: '',
    target_date: '',
    stage: 'start',
    sub_stage: 'Requirement Analysis',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      // Format date for input field
      const date = new Date(initialData.target_date);
      const formattedDate = !isNaN(date.getTime()) 
        ? date.toISOString().split('T')[0] 
        : '';
        
      setFormData({
        ...initialData,
        target_date: formattedDate,
        sub_stage: initialData.sub_stage || 'Requirement Analysis'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clean up sub_stage if stage is not start
    const submitData = { ...formData };
    if (submitData.stage !== 'start') {
      submitData.sub_stage = null;
    }
    onSubmit(submitData);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
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

          <div className="form-group">
            <label>Target Date</label>
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
            <label>Stage</label>
            <select 
              className="form-control" 
              name="stage"
              value={formData.stage}
              onChange={handleChange}
            >
              <option value="start">Start</option>
              <option value="on hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {formData.stage === 'start' && (
            <div className="form-group slide-in">
              <label>SDLC Sub-stage</label>
              <select 
                className="form-control" 
                name="sub_stage"
                value={formData.sub_stage}
                onChange={handleChange}
              >
                {SDLC_STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Description / Comments</label>
            <textarea 
              className="form-control" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add notes about ongoing work..."
            ></textarea>
          </div>

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
