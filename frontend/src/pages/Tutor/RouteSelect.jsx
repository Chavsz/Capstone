import React from 'react'
import { Link } from 'react-router-dom'

const RouteSelect = () => {
  return (
    <div className='space-y-3'>
        <Link to="/dashboard" className='block text-white'>Dashboard</Link>
        <Link to="/dashboard/profile" className='block text-white'>Profile</Link>
        <Link to="/dashboard/schedules" className='block text-white'>Schedules</Link>
        <Link to="/dashboard/switch" className='block text-white'>Switch</Link>
    </div>
  )
}

export default RouteSelect