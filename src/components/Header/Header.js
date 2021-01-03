import './Header.css'
import React from 'react'
import { Link } from 'react-router-dom'
import TokenService from '../../services/TokenService'
import PropTypes from 'prop-types'

function Header(props) {
  function checkIfLoggedIn() {
    if (TokenService.verifyToken()) {
      return (
        <nav id='header-nav'>
          <Link to='' onClick={logout} className='nav-link'>Logout</Link>
        </nav>
      )
    }
    return (
      <nav id='header-nav'>
        <Link to='/dashboard' className='nav-link'>Try It!</Link>
        <Link to='/login' className='nav-link'>Login</Link>
        <Link to='/register' className='nav-link'>Register</Link>
      </nav>
    )
  }

  function logout() {
    TokenService.clearToken()
    props.history.push('/')
  }

  return (
    <header className='flex-row align-center justify-between full-width flex-wrap'>
      <Link to='/' id='main-header' className='flex-row justify-center align-center'>
        <img src={process.env.PUBLIC_URL + '/favicon.ico'} alt='site logo' id='logo' />
        <h1>Bandwidth Saver</h1>
      </Link>
      {checkIfLoggedIn()}
    </header>
  )
}

Header.defaultProps = {
  history: {
    push() { }
  }
}

Header.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
}

export default Header