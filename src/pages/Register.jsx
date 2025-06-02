import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
            <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
                <h2 className="text-xl font-bold">Créer un compte</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    className="input input-bordered w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="input input-bordered w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="btn btn-primary w-full">S’inscrire</button>
            </form>
        </div>
    )
}

export default Register
