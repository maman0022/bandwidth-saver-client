import React, { useState } from 'react'
import './Login.css'
import TokenService from '../../services/TokenService'
import ApiService from '../../services/ApiService'
import PropTypes from 'prop-types'

function Login(props) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleFormSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { email, password } = e.target
    const userData = {
      email: email.value, password: password.value
    }
    ApiService.login(userData)
      .then(async response => {
        if (!response.ok) {
          throw new Error((await response.json()).message)
        }
        TokenService.saveToken((await response.json()).token)
        props.history.push('/courses')
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false))
  }

  return (
    <section className='flex-column align-center'>
      <h2 className='signin-header'>Login</h2>
      {loading && !error && <h3 className='loading-message'>Loading</h3>}
      <form className='flex-column align-center' onSubmit={handleFormSubmit}>
        {!!error && <h5 className='error-message'>{error}</h5>}
        <div>
          <label htmlFor='email'>Email:</label>
          <input type='email' id='email' name='email' required></input>
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input type='password' id='password' name='password' required></input>
        </div>
        <input type='submit' value='Login'></input>
      </form>
    </section>
  )
}

Login.defaultProps = {
  history: {
    push() { }
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
}

export default Login