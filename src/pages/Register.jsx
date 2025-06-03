import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from './../services/api'

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            await registerUser({ username, password })
            navigate('/login')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend px-2">Register</legend>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <label className="label">Username</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label className="label">Password</label>
                <input
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="btn btn-neutral mt-4 w-full" onClick={handleRegister}>
                    Register
                </button>

                <div className="text-center mt-4">
                    <Link to="/login" className="text-sm text-blue-500 hover:underline">
                        Already have an account? Login
                    </Link>
                </div>
            </fieldset>
        </div>
    )
}

export default Register