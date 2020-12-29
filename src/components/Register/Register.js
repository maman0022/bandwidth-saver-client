import React, { useState } from 'react'
import './Register.css'
import ApiService from '../../services/ApiService'
import PropTypes from 'prop-types'

function Register(props) {
  const [error, setError] = useState(null)
  const [fNameError, setFNameError] = useState()
  const [lNameError, setLNameError] = useState()
  const [emailError, setEmailError] = useState()
  const [passwordError, setPasswordError] = useState()
  const [confirmError, setConfirmError] = useState()
  const [loading, setLoading] = useState(false)

  function handleFormSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { fname, lname, email, password } = e.target
    const userData = {
      fname: fname.value, lname: lname.value, email: email.value, password: password.value
    }
    ApiService.register(userData)
      .then(async response => {
        if (!response.ok) {
          throw new Error((await response.json()).message)
        }
        props.history.push('/login')
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false))
  }

  function validateFName(e) {
    if (e.currentTarget.value.trim() === '' || e.currentTarget.value.trim() !== e.currentTarget.value) {
      return setFNameError(`First name cannot be blank or contain leading or trailing spaces`)
    }
    setFNameError()
  }

  function validateLName(e) {
    if (e.currentTarget.value.trim() === '' || e.currentTarget.value.trim() !== e.currentTarget.value) {
      return setLNameError(`Last name cannot be blank or contain leading or trailing spaces`)
    }
    setLNameError()
  }

  function validateEmail(e) {
    if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(e.currentTarget.value)) {
      return setEmailError(`Invalid email format`)
    }
    setEmailError()
  }

  function validatePassword(e) {
    if (e.currentTarget.value.trim().length < 6 || e.currentTarget.value.trim().length > 72) {
      return setPasswordError('Password must be between 6 and 72 characters and cannot contain leading or trailing spaces')
    }
    setPasswordError()
  }

  function validateConfirm(e) {
    if (e.currentTarget.value !== document.getElementById('password').value) {
      return setConfirmError('Passwords do not match')
    }
    setConfirmError()
  }

  function checkAllAccurate() {
    return (fNameError || lNameError || emailError || passwordError || confirmError)
  }

  return (
    <section className='flex-column align-center'>
      <h2 className='signin-header'>Register</h2>
      <form className='flex-column align-center' onSubmit={handleFormSubmit}>
        {!!error && <h5 className='error-message'>{error}</h5>}
        {loading && !error && <h3 className='loading-message'>Loading</h3>}
        <div className='register-form-div'>
          <label htmlFor='fname'>First Name:</label>
          <input type='text' id='fname' name='fname' required onChange={validateFName}></input>
          {!!fNameError && <h5 className='validation-error'>{fNameError}</h5>}
        </div>
        <div className='register-form-div'>
          <label htmlFor='lname'>Last Name:</label>
          <input type='text' id='lname' name='lname' required onChange={validateLName}></input>
          {!!lNameError && <h5 className='validation-error'>{lNameError}</h5>}
        </div>
        <div className='register-form-div'>
          <label htmlFor='email'>Email:</label>
          <input type='email' id='email' name='email' required onChange={validateEmail}></input>
          {!!emailError && <h5 className='validation-error'>{emailError}</h5>}
        </div>
        <div className='register-form-div'>
          <label htmlFor='password'>Password:</label>
          <input type='password' id='password' name='password' required onChange={validatePassword}></input>
          {!!passwordError && <h5 className='validation-error'>{passwordError}</h5>}
        </div>
        <div className='register-form-div'>
          <label htmlFor='confirm-password'>Confirm Password:</label>
          <input type='password' id='confirm-password' name='confirm-password' required onChange={validateConfirm}></input>
          {!!confirmError && <h5 className='validation-error'>{confirmError}</h5>}
        </div>
        <input type='submit' value='Create Account' id='create-acc-btn' disabled={checkAllAccurate()}></input>
      </form>
    </section>
  )
}

Register.defaultProps = {
  history: {
    push() { }
  }
}

Register.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
}

export default Register