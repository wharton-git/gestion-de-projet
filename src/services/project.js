const API_URL = 'http://localhost:3001/projects'

export const fetchProjectsByUser = async (userId) => {
    const res = await fetch(`${API_URL}?ownerId=${userId}`)
    return await res.json()
}

export const createProject = async (project) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
    })
    return await res.json()
}
