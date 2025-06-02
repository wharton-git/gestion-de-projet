import React, { useState } from 'react'
import ProjectForm from './../components/ProjectForm'
import ProjectList from './../components/ProjectList'

const Home = () => {
    const [refreshKey, setRefreshKey] = useState(0)

    const handleProjectCreated = () => {
        setRefreshKey((prev) => prev + 1)
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
            <ProjectForm onProjectCreated={handleProjectCreated} />
            <ProjectList refresh={refreshKey} />
        </div>
    )
}

export default Home
