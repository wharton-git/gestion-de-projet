import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, getCurrentUser } from './../services/api'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const { token } = await loginUser({ email, password })
            const user = await getCurrentUser(token)
            
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend px-2">Login</legend>
                
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                
                <label className="label">Email</label>
                <input 
                    type="email" 
                    className="input input-bordered w-full" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <button type="submit" className="btn btn-neutral mt-4 w-full" onClick={handleLogin}>
                    Login
                </button>

                <div className="text-center mt-4">
                    <Link to="/register" className="text-sm text-blue-500 hover:underline">
                        Create an account
                    </Link>
                </div>
            </fieldset>
        </div>
    )
}

export default Login