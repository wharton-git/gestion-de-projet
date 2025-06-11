import { FilePenLine, LayoutList, Plus, Trash2, UserRoundPlus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const allUsers = JSON.parse(localStorage.getItem('allUser')) || [];
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [allProjects, setAllProjects] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProject, setEditingProject] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [currentShareProject, setCurrentShareProject] = useState(null);
    const [selectedUserToShare, setSelectedUserToShare] = useState('');
    const [selectedUserToShareInput, setSelectedUserToShareInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
        setAllProjects(savedProjects);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(allProjects));
    }, [allProjects]);

    const handleCreateProject = () => {
        if (projectName.trim() === '' || !currentUser) return;

        if (editingProject) {
            const updatedProjects = allProjects.map(project =>
                project.id === editingProject.id
                    ? { ...project, name: projectName, description: projectDescription }
                    : project
            );
            setAllProjects(updatedProjects);
            setEditingProject(null);
        } else {
            const newProject = {
                id: Date.now(),
                name: projectName,
                description: projectDescription,
                status: 'in progress',
                createdAt: new Date().toISOString(),
                ownerId: currentUser.id,
                ownerUsername: currentUser.username,
                sharedWith: []
            };
            setAllProjects([...allProjects, newProject]);
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
        setAllProjects(allProjects.filter(project => project.id !== id));
        setDeleteConfirm(null);
    };

    const handleShareProject = (project) => {
        setCurrentShareProject(project);
        setShareModalOpen(true);
    };

    const confirmShareProject = () => {
        if (!selectedUserToShare || !currentShareProject) return;

        const updatedProjects = allProjects.map(project => {
            if (project.id === currentShareProject.id) {
                if (!project.sharedWith.includes(selectedUserToShare) &&
                    project.ownerId !== selectedUserToShare) {
                    return {
                        ...project,
                        sharedWith: [...project.sharedWith, selectedUserToShare]
                    };
                }
            }
            return project;
        });

        setAllProjects(updatedProjects);
        setShareModalOpen(false);
        setSelectedUserToShare('');
        setSelectedUserToShareInput('');
        setShowSuggestions(false);
        setCurrentShareProject(null);
    };

    const removeSharedUser = (projectId, userId) => {
        const updatedProjects = allProjects.map(project => {
            if (project.id === projectId) {
                return {
                    ...project,
                    sharedWith: project.sharedWith.filter(id => id !== userId)
                };
            }
            return project;
        });
        setAllProjects(updatedProjects);
    };

    const updateProjectStatus = (id, newStatus) => {
        setAllProjects(allProjects.map(project =>
            project.id === id ? { ...project, status: newStatus } : project
        ));
    };

    const resetForm = () => {
        setProjectName('');
        setProjectDescription('');
    };

    const userProjects = allProjects.filter(project =>
        project.ownerId === currentUser?.id ||
        (project.sharedWith && project.sharedWith.includes(currentUser?.id))
    );

    const filteredProjects = userProjects.filter(project => {
        const matchesFilter = filter === 'all' || project.status === filter;
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'in progress': return 'badge-accent';
            case 'on hold': return 'badge-warning';
            case 'completed': return 'badge-success';
            default: return 'badge-base-300';
        }
    };

    const getStat = (tasksKey) => {
        const tasks = JSON.parse(localStorage.getItem(tasksKey)) || [];
        var total = tasks.length;
        var done = tasks.filter(task => task.status === 'completed').length;
        var inProgress = tasks.filter(task => task.status === 'in progress').length;
        var onHold = tasks.filter(task => task.status === 'on hold').length;

        const stat = {
            total: total,
            done: done,
            inProgress: inProgress,
            onHold: onHold
        };
        return stat;
    }

    const goToProject = (id) => {
        navigate(`/project/${id}`);
    };

    return (
        <div className='w-screen h-screen pt-15'>
            <div className='w-full h-full flex'>
                <div className='w-full space-y-7 p-10'>
                    <div className='flex gap-4 justify-evenly'>
                        <div
                            onClick={() => {
                                if (!currentUser) return;
                                resetForm();
                                setEditingProject(null);
                                document.getElementById('projectModal').showModal();
                            }}
                            className='w-2/5 h-20 gap-4 flex items-center justify-center rounded-2xl bg-base-300 hover:bg-primary transition-all cursor-pointer'
                        >
                            <Plus /><span> Create Project</span>
                        </div>
                        <div
                            onClick={() => setFilter('in progress')}
                            className={`w-2/5 h-20 flex items-center justify-center rounded-2xl transition-all cursor-pointer ${filter === 'in progress' ? 'bg-accent' : 'bg-base-300 hover:bg-accent'}`}
                        >
                            Projects in Progress
                        </div>
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
                        <div
                            onClick={() => setFilter('all')}
                            className={`w-2/5 h-20 flex gap-4 items-center justify-center rounded-2xl transition-all cursor-pointer ${filter === 'completed' ? 'bg-primary' : 'bg-base-300 hover:bg-primary'}`}
                        >
                            <LayoutList /><span> All Projects</span>
                        </div>
                    </div>

                    <div className='flex justify-between items-center'>
                        <h2 className='text-xl font-bold'>Project List</h2>
                        <div className='input'>
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input
                                type='text'
                                placeholder='Search...'
                                className='grow'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='bg-base-200 w-full h-8/11 overflow-y-auto rounded-2xl p-4'>
                        {filteredProjects.length === 0 ? (
                            <div className='text-center py-10'>No projects found</div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {filteredProjects.map(project => (
                                    <div
                                        key={project.id}
                                        className={`card bg-base-100 text-base-content shadow-xl hover:shadow-2xl transition-shadow`}
                                    >
                                        <div className='card-body relative'>
                                            <div className='absolute top-0 left-0 w-full h-full' onClick={() => goToProject(project.id)}></div>
                                            <div className='flex justify-between items-start'>
                                                <div>
                                                    <h3 className='card-title'>{project.name}</h3>
                                                    {project.ownerId !== currentUser?.id && (
                                                        <span className='text-xs opacity-70'>Shared by: {project.ownerUsername}</span>
                                                    )}
                                                </div>
                                                <div className='dropdown dropdown-end'>
                                                    <div tabIndex={0} role='button' className='btn btn-sm btn-ghost'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </div>
                                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                        <li><button className='flex justify-between items-center' onClick={(e) => { e.stopPropagation(); handleEditProject(project); }}> <span>Edit</span><FilePenLine /></button></li>
                                                        <li><button className='flex justify-between items-center' onClick={(e) => { e.stopPropagation(); handleShareProject(project); }}> <span>Contributor</span><UserRoundPlus /></button></li>
                                                        {project.ownerId === currentUser?.id && (
                                                            <>
                                                                <li><button className='flex justify-between items-center' onClick={(e) => { e.stopPropagation(); setDeleteConfirm(project.id); }}> <span>Delete</span> <Trash2 /> </button></li>
                                                                <li><button onClick={(e) => { e.stopPropagation(); updateProjectStatus(project.id, 'in progress'); }}>Mark <span className={`badge badge-soft badge-accent`}>in Progress</span></button></li>
                                                                <li><button onClick={(e) => { e.stopPropagation(); updateProjectStatus(project.id, 'on hold'); }}>Mark <span className={`badge badge-soft badge-warning`}>on Hold</span></button></li>
                                                                <li><button onClick={(e) => { e.stopPropagation(); updateProjectStatus(project.id, 'completed'); }}>Mark <span className={`badge badge-soft badge-success`}>Completed</span></button></li>
                                                            </>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className='absolute right-20 space-x-3'>
                                                <span className='badge badge-dash badge-accent'>
                                                    {getStat("tasks_" + project.id).done} / {getStat("tasks_" + project.id).total}
                                                </span>
                                                <div className="radial-progress" style={{ "--value": getStat("tasks_" + project.id).done / getStat("tasks_" + project.id).total * 100 || 0 }}
                                                    aria-valuenow={getStat("tasks_" + project.id).done / getStat("tasks_" + project.id).total * 100 || 0}
                                                    role="progressbar"
                                                >
                                                    {getStat("tasks_" + project.id).done / getStat("tasks_" + project.id).total * 100 || 0}%
                                                </div>
                                            </div>

                                            <p className='text-gray-500'>{project.description}</p>
                                            <div className='flex justify-between items-center mt-4'>
                                                <div className={`badge badge-soft ${getStatusColor(project.status)}`}>{project.status}</div>
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

            {shareModalOpen && (
                <dialog open className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Share Project</h3>
                        <p className="py-4">Share "{currentShareProject?.name}" with:</p>

                        <div className="form-control w-full relative">
                            <label className="label">
                                <span className="label-text">Share with user</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Type username..."
                                className="input input-bordered w-full"
                                value={selectedUserToShareInput}
                                onChange={(e) => {
                                    setSelectedUserToShareInput(e.target.value);
                                    setShowSuggestions(e.target.value.length > 0);
                                }}
                                onFocus={() => selectedUserToShareInput && setShowSuggestions(true)}
                            />
                            {showSuggestions && (
                                <ul className="absolute w-full bg-base-200 menu rounded-2xl mt-1 max-h-60 overflow-y-auto">
                                    {allUsers
                                        .filter(user =>
                                            user.id !== currentUser?.id &&
                                            !currentShareProject?.sharedWith?.includes(user.id) &&
                                            user.username.toLowerCase().includes(selectedUserToShareInput.toLowerCase())
                                        )
                                        .map(user => (
                                            <li key={user.id}>
                                                <button
                                                    type="button"
                                                    className="text-left"
                                                    onClick={() => {
                                                        setSelectedUserToShare(user.id);
                                                        setSelectedUserToShareInput(user.username);
                                                        setShowSuggestions(false);
                                                    }}
                                                >
                                                    {user.username}
                                                </button>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )}
                        </div>

                        {currentShareProject?.sharedWith?.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-bold">Currently shared with:</h4>
                                <ul>
                                    {currentShareProject.sharedWith.map(userId => {
                                        const user = allUsers.find(u => u.id === userId);
                                        return (
                                            <li key={userId} className="flex justify-between items-center py-1">
                                                {user?.username || userId}
                                                <button
                                                    className="btn btn-xs btn-error"
                                                    onClick={() => removeSharedUser(currentShareProject.id, userId)}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        <div className="modal-action">
                            <button className="btn" onClick={() => setShareModalOpen(false)}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={confirmShareProject}
                                disabled={!selectedUserToShare}
                            >
                                Share
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

        </div>
    );
};

export default Home;