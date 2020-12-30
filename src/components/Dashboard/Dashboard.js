import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import UserService from '../../services/UserService'
import ApiService from '../../services/ApiService'
import AddDrive from '../AddDrive/AddDrive'

function Dashboard() {
  const user = UserService.getUser()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [drives, setDrives] = useState([])
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    ApiService.getDrives()
      .then(async response => {
        if (!response.ok) {
          throw new Error((await response.json()).message)
        }
        setDrives(await response.json())
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false))
  }, [])

  function handleAddDrive() {
    setAdding(true)
    setError(null)
  }

  return (
    <section className='flex-column full-height justify-evenly'>
      <h2>{`Hi ${user.first_name},`}</h2>
      <h3>Here are your drives,</h3>
      {error && <h5 className='error-message'>{error}</h5>}
      {!loading && drives.length === 0 && <p className='instructions'>You don't have any drives. Click "Add Drive" to begin.</p>}
      {drives.length > 0 && <ul id='drives-list'>
        {drives.map(drive => (
          <li key={drive.id}>
            {drive.title}
          </li>
        ))}
      </ul>}
      {adding && <AddDrive setAdding={setAdding} />}
      {!adding && <button onClick={handleAddDrive}>Add Drive</button>}
    </section>
  )
}

export default Dashboard