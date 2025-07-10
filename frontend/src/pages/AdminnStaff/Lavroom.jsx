import React from 'react'

//components
import { LavRoomCards } from '../../components/cards'

const Lavroom = () => {
  return (
    <div className="min-h-screen bg-white p-6"><h1>Lavroom</h1>
    
    <div className="bg-gray-100 p-6 rounded-lg mt-6">
      <div className="grid grid-cols-3 gap-6">
        <LavRoomCards startTime="10:00" endTime="11:00" room="1" tutor="John Doe" student="Jane Doe" />
        <LavRoomCards startTime="11:00" endTime="12:00" room="2" tutor="John Doe" student="Jane Doe" />  
        <LavRoomCards startTime="12:00" endTime="13:00" room="3" tutor="John Doe" student="Jane Doe" />  
        <LavRoomCards startTime="13:00" endTime="14:00" room="4" tutor="John Doe" student="Jane Doe" />  
      </div>
    </div>

    </div>
  )
}

export default Lavroom