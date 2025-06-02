import React, { useState, useEffect } from 'react';

const Home = () => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProject, setEditingProject] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        setProjects(savedProjects);
    }, []);

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    const handleCreateProject = () => {
        if (projectName.trim() === '') return;

        if (editingProject) {
            const updatedProjects = projects.map(project =>
                project.id === editingProject.id
                    ? { ...project, name: projectName, description: projectDescription }
                    : project
            );
            setProjects(updatedProjects);
            setEditingProject(null);
        } else {
            const newProject = {
                id: Date.now(),
                name: projectName,
                description: projectDescription,
                status: 'in progress',
                createdAt: new Date().toISOString()
            };
            setProjects([...projects, newProject]);
        }

        resetForm();
        document.getElementById('projectModal').close();
    };

    const handleEditProject = (project) => {
        setEditingProject(project);
        setProjectName(project.name);
        setProjectDescription(project.description);
        document.getElementById('projectModal').showModal();
    };

    const handleDeleteProject = (id) => {
        setProjects(projects.filter(project => project.id !== id));
        setDeleteConfirm(null);
    };

    const updateProjectStatus = (id, newStatus) => {
        setProjects(projects.map(project =>
            project.id === id ? { ...project, status: newStatus } : project
        ));
    };

    const resetForm = () => {
        setProjectName('');
        setProjectDescription('');
    };

    const filteredProjects = projects.filter(project => {
        const matchesFilter = filter === 'all' || project.status === filter;
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'in progress': return 'bg-accent';
            case 'on hold': return 'bg-warning';
            case 'completed': return 'bg-success';
            default: return 'bg-base-300';
        }
    };

    return (
        <div className='w-screen h-screen pt-20'>
            <div className='w-full h-full flex'>
                <div className='w-48 p-4 bg-base-200'>
                    <h2 className='font-bold text-lg mb-4'>Menu</h2>
                    <ul className='menu'>
                        <li><button onClick={() => setFilter('all')}>All Projects</button></li>
                        <li><button onClick={() => setFilter('in progress')}>In Progress</button></li>
                        <li><button onClick={() => setFilter('on hold')}>On Hold</button></li>
                        <li><button onClick={() => setFilter('completed')}>Completed</button></li>
                    </ul>
                </div>

                <div className="divider divider-horizontal"></div>

                <div className='w-full space-y-7 p-10'>
                    <div className='flex justify-evenly'>
                        <div
                            onClick={() => {
                                resetForm();
                                setEditingProject(null);
                                document.getElementById('projectModal').showModal();
                            }}
                            className='w-2/5 h-20 flex items-center justify-center rounded-2xl bg-base-300 hover:bg-primary transition-all cursor-pointer'
                        >
                            {editingProject ? 'Edit Project' : 'Create Project'}
                        </div>
                        <div
                            onClick={() => setFilter('in progress')}
                            className={`w-2/5 h-20 flex items-center justify-center rounded-2xl transition-all cursor-pointer ${filter === 'in progress' ? 'bg-accent' : 'bg-base-300 hover:bg-accent'}`}
                        >
                            Projects in Progress
                        </div>
                    </div>
                    <div className='flex justify-evenly'>
                        <div
                            onClick={() => setFilter('on hold')}
                            className={`w-2/5 h-20 flex items-center justify-center rounded-2xl transition-all cursor-pointer ${filter === 'on hold' ? 'bg-warning' : 'bg-base-300 hover:bg-warning'}`}
                        >
                            Projects On Hold
                        </div>
                        <div
                            onClick={() => setFilter('completed')}
                            className={`w-2/5 h-20 flex items-center justify-center rounded-2xl transition-all cursor-pointer ${filter === 'completed' ? 'bg-success' : 'bg-base-300 hover:bg-success'}`}
                        >
                            Completed Projects
                        </div>
                    </div>

                    <div className='flex justify-between items-center'>
                        <h2 className='text-xl font-bold'>Project List</h2>
                        <div className='form-control'>
                            <input
                                type='text'
                                placeholder='Search...'
                                className='input input-bordered'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='bg-base-200 w-full h-3/5 overflow-y-auto rounded-2xl p-4'>
                        {filteredProjects.length === 0 ? (
                            <div className='text-center py-10'>No projects found</div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {filteredProjects.map(project => (
                                    <div
                                        key={project.id}
                                        className={`card ${getStatusColor(project.status)} text-base-content shadow-xl hover:shadow-2xl transition-shadow`}
                                    >
                                        <div className='card-body'>
                                            <div className='flex justify-between items-start'>
                                                <h3 className='card-title'>{project.name}</h3>
                                                <div className='dropdown dropdown-end'>
                                                    <div tabIndex={0} role='button' className='btn btn-sm btn-ghost'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </div>
                                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                        <li><button onClick={() => handleEditProject(project)}>Edit</button></li>
                                                        <li><button onClick={() => setDeleteConfirm(project.id)}>Delete</button></li>
                                                        <li><button onClick={() => updateProjectStatus(project.id, 'in progress')}>Mark "In Progress"</button></li>
                                                        <li><button onClick={() => updateProjectStatus(project.id, 'on hold')}>Mark "On Hold"</button></li>
                                                        <li><button onClick={() => updateProjectStatus(project.id, 'completed')}>Mark "Completed"</button></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <p>{project.description}</p>
                                            <div className='flex justify-between items-center mt-4'>
                                                <select
                                                    className='select select-bordered select-sm'
                                                    value={project.status}
                                                    onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                                                >
                                                    <option value='in progress'>In Progress</option>
                                                    <option value='on hold'>On Hold</option>
                                                    <option value='completed'>Completed</option>
                                                </select>
                                                <span className='text-sm opacity-70'>
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <dialog id="projectModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg pb-5">
                        {editingProject ? 'Edit Project' : 'Create New Project'}
                    </h3>
                    <div className='space-y-5'>
                        <input
                            type="text"
                            placeholder="Project name"
                            className="input w-full"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                        <textarea
                            className="textarea w-full"
                            placeholder="Description"
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='w-full flex justify-end gap-2 p-4'>
                        <button
                            className='btn btn-ghost'
                            onClick={() => document.getElementById('projectModal').close()}
                        >
                            Cancel
                        </button>
                        <button
                            className='btn btn-primary'
                            onClick={handleCreateProject}
                        >
                            {editingProject ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={resetForm}>close</button>
                </form>
            </dialog>

            {deleteConfirm && (
                <dialog open className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Deletion</h3>
                        <p className="py-4">Are you sure you want to delete this project? This action cannot be undone.</p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn btn-error" onClick={() => handleDeleteProject(deleteConfirm)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default Home;