import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [username, setUsername] = useState('')
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        if (username.trim()) {
            localStorage.setItem('user', JSON.stringify({ username }))
            navigate('/')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
                <h2 className="text-xl font-bold">Login</h2>
                <input
                    type="text"
                    placeholder="Enter your name"
                    className="input input-bordered w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button className="btn btn-primary w-full" type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login
