import React from 'react'
import { Link } from 'react-router'

function StatusTracking() {
    return (
        <div className='container px-8 p-3 text-sm mb-20'>

            <div className="breadcrumbs mb-5">
                <ul>
                    <li className='text-gray-400 hover:text-black text-xs'>
                        <Link to={"/"}>HOME</Link>
                    </li>
                    <li>STATUS TRACKING</li>
                </ul>
            </div>

            <h2 className='font-semibold text-2xl mb-5'>STATUS TRACKING</h2>
            <h2 className='font-semibold text-2xl mb-5'>Check Your Order Status Here</h2>

            <p className='mb-3'>📦 Track your package with Kerry Express: https://th.kerryexpress.com/th/track/v2/</p>
            <p className='mb-3'>📮 Track your package with EMS (Thailand Post): http://track.thailandpost.co.th/tracking/default.aspx</p>

        </div>
    )
}

export default StatusTracking