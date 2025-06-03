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
        <>
            <div className="navbar bg-base-100 shadow-sm fixed">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Project Manager</a>
                </div>
                <div className="flex gap-2">
                    {user && (<div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar avatar-placeholder">
                            <div className="bg-neutral text-neutral-content w-12 rounded-full">
                                <div>{user.username && user.username[0].toUpperCase()}</div>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li><a>Settings</a></li>
                            <li><a onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>)}
                </div>
            </div>
        </>
    )
}

export default Navbar
