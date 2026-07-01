import { useState, useEffect } from 'react';
import { Plus, LayoutDashboard } from 'lucide-react';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import ImportantProjects from './components/ImportantProjects';

const API_URL = 'http://localhost:5000/api/projects';

function App() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingProject ? `${API_URL}/${editingProject.id}` : API_URL;
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseModal();
        fetchProjects();
      } else {
        console.error('Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchProjects();
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ padding: '0.6rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
            <LayoutDashboard size={28} color="var(--accent-color)" />
          </div>
          <h1 className="app-title">Project Tracker</h1>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          New Project
        </button>
      </header>

      <div className="dashboard-grid">
        <main>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>All Projects</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {projects.length} Total
            </span>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              Loading projects...
            </div>
          ) : (
            <ProjectList 
              projects={projects} 
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          )}
        </main>

        <aside>
          <ImportantProjects 
            projects={projects}
            onEdit={handleOpenModal}
          />
        </aside>
      </div>

      {isModalOpen && (
        <ProjectForm 
          onClose={handleCloseModal} 
          onSubmit={handleSubmit} 
          initialData={editingProject} 
        />
      )}
    </div>
  );
}

export default App;
