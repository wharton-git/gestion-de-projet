import React, { useState } from 'react'
import { createProject } from '../services/project'
import { getUser } from '../utils/auth'

const ProjectForm = ({ onProjectCreated }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = getUser()
        if (!user) return

        const newProject = {
            title,
            description,
            status: 'en cours',
            ownerId: user.id,
        }

        try {
            const created = await createProject(newProject)
            onProjectCreated(created)
            setTitle('')
            setDescription('')
            setError(null)
        } catch (err) {
            setError('Erreur lors de la création du projet', err)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-base-200 p-4 rounded shadow space-y-3">
            <h2 className="text-lg font-semibold">Créer un projet</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                placeholder="Titre"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Description"
                className="textarea textarea-bordered w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <button className="btn btn-primary w-full">Créer</button>
        </form>
    )
}

export default ProjectForm
