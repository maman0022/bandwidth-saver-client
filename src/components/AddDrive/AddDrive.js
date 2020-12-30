import React, { useState } from 'react'
import ApiService from '../../services/ApiService'

function AddDrive(props) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    console.log(e.target['drive-type'].value);
  }

  function handleCancel() {
    props.setAdding(false)
    setError(null)
    setLoading(false)
  }

  function validateDrive(e) {
    if (e.currentTarget.value.trim() === "") {
      return setError(`Name cannot be empty`)
    }
    setError(null)
  }

  return (
    <form className='flex-column full-width' onSubmit={handleSubmit}>
      <label htmlFor='drive-name'>Name:</label>
      <input type='text' name='drive-name' id='drive-name' onChange={validateDrive} required />
      {!!error && <h5 className='error-message'>{error}</h5>}
      {loading && !error && <h3 className='loading-message'>Loading</h3>}
      <label htmlFor='drive-type'>Cloud Provider:</label>
      <select name='drive-type' id='drive-type' required>
        <option value='dropbox'>Dropbox</option>
        <option value='onedrive'>Onedrive</option>
      </select>
      <div className='flex-row justify-end'>
        <input type='reset' value='Cancel' onClick={handleCancel}/>
        <input type='submit' value='Add'disabled={error} />
      </div>
    </form>
  )
}

export default AddDrive