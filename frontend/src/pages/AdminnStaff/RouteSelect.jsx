import React from 'react'
import { Link } from 'react-router-dom'

const RouteSelect = () => {
  return (
    <div className='space-y-3'>
        <Link to="/dashboard" className='block text-white'>Dashboard</Link>
        <Link to="/dashboard/landingadmin" className='block text-white'>Landing</Link>
        <Link to="/dashboard/lavroom" className='block text-white'>Lavroom</Link>
        <Link to="/dashboard/switch" className='block text-white'>Switch</Link>
        <Link to="/dashboard/users" className='block text-white'>Users</Link> 
    </div>
  )
}

export default RouteSelect