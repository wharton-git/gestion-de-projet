import React, { useEffect, useState } from 'react'
import { fetchProjectsByUser } from '../services/project'
import { getUser } from '../utils/auth'

const ProjectList = ({ refresh }) => {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        const user = getUser()
        if (user) {
            fetchProjectsByUser(user.id).then(setProjects)
        }
    }, [refresh]) // refresh = nouvelle création

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Mes projets</h2>
            <div className="space-y-3">
                {projects.length === 0 ? (
                    <p>Aucun projet pour le moment.</p>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="p-4 border rounded bg-white shadow">
                            <h3 className="font-bold">{project.title}</h3>
                            <p>{project.description}</p>
                            <span className="badge badge-info mt-1">{project.status}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ProjectList
