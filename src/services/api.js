const API_URL = 'http://localhost:3000/api'

export const registerUser = async (user) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
    }

    return data
}

export const loginUser = async ({ email, password }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Login failed')
    }

    return data
}

export const getCurrentUser = async (token) => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user')
    }

    return data
}

export const getAllUsers = async (token) => {
    const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
    return data;
};

export const getAllProjects = async (token) => {
    const response = await fetch(`${API_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch projects');
    return data;
};

export const getAllProjectsByOwner = async (ownerId, token) => {
    const allProjects = await getAllProjects(token);
    const projectsArray = Array.isArray(allProjects) ? allProjects : allProjects.projects || [];
    return projectsArray.filter(project => project.ownerId === ownerId);
}

export const createProject = async (project, token) => {
    const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(project)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create project');
    return data;
};

export const updateProject = async (id, updates, token) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updates)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update project');
    return data;
};

export const deleteProject = async (id, token) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete project');
};

export const addCollaborator = async (projectId, userId, token) => {
    const response = await fetch(`${API_URL}/projects/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ projectId, userId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add collaborator');
    return data;
};

export const removeCollaborator = async (projectId, userId, token) => {
    const response = await fetch(`${API_URL}/projects/collaborators/${projectId}/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to remove collaborator');
};