const API_URL = 'http://localhost:3001'

export const registerUser = async (user) => {
    const res = await fetch(`${API_URL}/users?username=${user.username}`)
    const existing = await res.json()
    if (existing.length > 0) {
        throw new Error('Utilisateur déjà existant')
    }

    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    })
    return response.json()
}

export const loginUser = async ({ username, password }) => {
    const res = await fetch(`${API_URL}/users?username=${username}&password=${password}`)
    const users = await res.json()
    if (users.length === 0) throw new Error('Identifiants incorrects')
    return users[0]
}

export const allUser = async () => {
    const users = await fetch(`${API_URL}/users`)
    return users.json()
}
