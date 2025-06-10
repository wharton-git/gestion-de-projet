const API_URL = 'http://localhost:3001/api'

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