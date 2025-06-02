import React from 'react'
import { useParams } from 'react-router-dom';

const ProjectsDetails = () => {

    const { id } = useParams();

    return (
        <div className='w-screen h-screen pt-20'>
            <div>{id}</div>
        </div>

    )
}

export default ProjectsDetails