import { FilePenLine, FilePlus2, Trash2, Search, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProjectsDetails = () => {
    const { id } = useParams();
    const savedTasks = JSON.parse(localStorage.getItem(`tasks_${id}`));
    const [projects] = useState(JSON.parse(localStorage.getItem('projects')) || []);
    const [allUsers] = useState(JSON.parse(localStorage.getItem('allUser')) || []);
    const [currentUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: [],
        status: 'in progress'
    });
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const navigate = useNavigate()

    const project = projects.find(p => p.id === parseInt(id));
    const projectUsers = [
        { id: project?.ownerId, username: project?.ownerUsername },
        ...(project?.sharedWith?.map(userId => {
            const user = allUsers.find(u => u.id === userId);
            return user || { id: userId, username: userId };
        }) || [])
    ];

    useEffect(() => {
        setTasks(savedTasks || []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        localStorage.setItem(`tasks_${id}`, JSON.stringify(tasks));
    }, [tasks, id]);

    const handleCreateTask = () => {
        if (!newTask.title.trim()) return;

        // Trouver les nouveaux utilisateurs assignés
        const newAssignments = editingTask
            ? newTask.assignedTo.filter(userId => !editingTask.assignedTo.includes(userId))
            : newTask.assignedTo;

        if (editingTask) {
            const updatedTasks = tasks.map(task =>
                task.id === editingTask.id ? { ...newTask, id: editingTask.id } : task
            );
            setTasks(updatedTasks);
            setEditingTask(null);
        } else {
            const task = {
                id: Date.now(),
                ...newTask,
                createdAt: new Date().toISOString(),
                createdBy: currentUser.id
            };
            setTasks([...tasks, task]);
        }

        // Créer des notifications pour les nouveaux assignés
        if (newAssignments.length > 0) {
            const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
            const projectName = project.name;

            newAssignments.forEach(userId => {
                notifications.push({
                    id: Date.now(),
                    userId,
                    type: 'task_assigned',
                    message: `You've been assigned to task "${newTask.title}" in project "${projectName}"`,
                    projectId: id,
                    taskId: editingTask ? editingTask.id : Date.now(),
                    read: false,
                    createdAt: new Date().toISOString()
                });
            });

            localStorage.setItem('notifications', JSON.stringify(notifications));
        }

        resetTaskForm();
        setTaskModalOpen(false);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setNewTask({
            title: task.title,
            description: task.description,
            priority: task.priority,
            assignedTo: [...task.assignedTo],
            status: task.status
        });
        setTaskModalOpen(true);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const updateTaskStatus = (taskId, newStatus) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
        ));
    };

    const toggleAssignedUser = (userId) => {
        setNewTask(prev => {
            if (prev.assignedTo.includes(userId)) {
                return { ...prev, assignedTo: prev.assignedTo.filter(id => id !== userId) };
            } else {
                return { ...prev, assignedTo: [...prev.assignedTo, userId] };
            }
        });
    };

    const resetTaskForm = () => {
        setNewTask({
            title: '',
            description: '',
            priority: 'medium',
            assignedTo: [],
            status: 'in progress'
        });
    };

    const filteredTasks = tasks.filter(task => {
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesSearch = searchTerm === '' ||
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesPriority && matchesStatus && matchesSearch;
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-error';
            case 'medium': return 'bg-warning';
            case 'low': return 'bg-info';
            default: return 'bg-base-300';
        }
    };

    const getStatusbBadgeColor = (status) => {
        switch (status) {
            case 'in progress': return 'badge-accent';
            case 'on hold': return 'badge-warning';
            case 'completed': return 'badge-success';
            default: return 'badge-base-300';
        }
    };

    const toggleExpand = (taskId) => {
        setExpandedTaskId(prev => (prev === taskId ? null : taskId));
    };

    const returnTo = () => {
        navigate("/")
    }

    if (!project) return <div className="w-screen h-screen pt-20 flex justify-center items-center">Project not found</div>;

    return (
        <div className='w-screen h-screen p-10'>
            <div className='flex justify-between items-center mb-6'>
                <div className='btn btn-ghost' onClick={returnTo}>
                    <ArrowLeft />
                </div>
                <div className='w-2/4'>
                    <span className='text-sm text-base-300'>Project</span>
                    <h1 className='text-4xl font-bold'>{project.name}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        className='btn btn-primary'
                        onClick={() => {
                            resetTaskForm();
                            setEditingTask(null);
                            setTaskModalOpen(true);
                        }}
                    >
                        <FilePlus2 />
                        <span>Create Task</span>
                    </button>
                </div>
            </div>

            <div className='flex justify-between gap-4 mb-6'>
                <div className='flex gap-4 w-2/5'>
                    <select
                        className='select select-bordered'
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value='all'>All Priorities</option>
                        <option value='high'>High</option>
                        <option value='medium'>Medium</option>
                        <option value='low'>Low</option>
                    </select>

                    <select
                        className='select select-bordered'
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value='all'>All Statuses</option>
                        <option value='in progress'>In Progress</option>
                        <option value='on hold'>On Hold</option>
                        <option value='completed'>Completed</option>
                    </select>
                </div>
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

            <div className='h-3/4 overflow-y-scroll'>
                <div className='grid gap-3 grid-cols-4 bg-base-200 p-2 rounded-2xl '>
                    {filteredTasks.length === 0 ? (
                        <div className='col-span-full text-center py-10'>No tasks found</div>
                    ) : (
                        filteredTasks.map(task => {
                            const isExpanded = expandedTaskId === task.id;
                            return (
                                <div key={task.id} className={`bg-base-100 text-left shadow-xl  ${isExpanded ? "h-96" : "h-20 "} max-h-56 relative rounded-2xl transition-all duration-300`}>
                                    <div
                                        onClick={() => toggleExpand(task.id)}
                                        className={`cursor-pointer px-4 py-2  ${isExpanded ? "h-96" : "h-20 "}  overflow-hidden max-h-56 transition-all`}
                                    >
                                        <div className="font-semibold">
                                            <h3 className='text-left pt-1 pb-2 text-lg'>{task.title}</h3>
                                            <div className='flex gap-2 items-center'>
                                                {task.status === 'in progress' && (
                                                    <span className={`badge ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                )}
                                                <span className={`badge ${getStatusbBadgeColor(task.status)}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-sm m-2">
                                            <p className='text-gray-500'>{task.description}</p>

                                            <div className='mt-2'>
                                                <h4 className='font-bold text-sm mb-1'>Assigned to:</h4>
                                                <div className='flex flex-wrap gap-1'>
                                                    {task.assignedTo.map(userId => {
                                                        const user = projectUsers.find(u => u.id === userId);
                                                        return (
                                                            <span key={userId} className='badge badge-outline'>
                                                                {user?.username || userId}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className='flex justify-between items-center mt-4'>
                                                <span className='text-sm opacity-70'>
                                                    {new Date(task.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='absolute top-0 right-0 dropdown dropdown-end p-2'>
                                        <div tabIndex={0} role='button' className='btn btn-sm btn-ghost'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </div>
                                        <ul tabIndex={0} className="dropdown-content z-[1] border border-base-200 menu p-2 shadow bg-base-100 rounded-box w-52">
                                            <li><button onClick={() => handleEditTask(task)} className='flex items-center justify-between' ><span>Edit</span><FilePenLine /></button></li>
                                            <li><button onClick={() => handleDeleteTask(task.id)} className='flex items-center justify-between' ><span>Delete</span> <Trash2 /></button></li>
                                            <li><button onClick={() => updateTaskStatus(task.id, 'in progress')}>Mark <span className={`badge badge-soft badge-accent`}>in Progress</span></button></li>
                                            <li><button onClick={() => updateTaskStatus(task.id, 'on hold')}>Mark <span className={`badge badge-soft badge-warning`}>on Hold</span></button></li>
                                            <li><button onClick={() => updateTaskStatus(task.id, 'completed')}>Mark <span className={`badge badge-soft badge-success`}>Completed</span></button></li>
                                        </ul>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Task Modal */}
            {taskModalOpen && (
                <dialog open className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                        </h3>
                        <div className='space-y-4 mt-4'>
                            <input
                                type="text"
                                placeholder="Task title"
                                className="input w-full"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                            <textarea
                                className="textarea w-full"
                                placeholder="Description"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            ></textarea>

                            <div>
                                <label className="label">
                                    <span className="label-text">Priority</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Assign to</span>
                                </label>
                                <div className='flex flex-wrap gap-2'>
                                    {projectUsers.map(user => (
                                        <div key={user.id} className="form-control">
                                            <label className="label cursor-pointer gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={newTask.assignedTo.includes(user.id)}
                                                    onChange={() => toggleAssignedUser(user.id)}
                                                    className="checkbox"
                                                />
                                                <span className="label-text">{user.username}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={() => setTaskModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleCreateTask}>
                                {editingTask ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default ProjectsDetails;