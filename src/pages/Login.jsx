import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, allUser } from './../services/api'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const user = await loginUser({ username, password })
            const users = await allUser()
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('allUser', JSON.stringify(users))
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
                <h2 className="text-xl font-bold">Connexion</h2>
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
                <button className="btn btn-primary w-full">Se connecter</button>
                <Link to="/register" className="text-sm text-blue-500 hover:underline block text-center">
                    Créer un compte
                </Link>
            </form>
        </div>
    )
}

export default Login
