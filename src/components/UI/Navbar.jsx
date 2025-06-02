import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, logout } from '../../utils/auth'

const Navbar = () => {
    const navigate = useNavigate()
    const user = getUser()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="navbar bg-base-100 shadow-sm fixed">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Project Manager</a>
            </div>
            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Bonjour, {user.username}</span>
                    <button className="btn btn-outline btn-error btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default Navbar
