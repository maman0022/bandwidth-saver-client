import React from 'react'
import TokenService from '../../services/TokenService'
import { Route } from 'react-router-dom'
import Login from '../Login/Login'

function ProtectedRoute(props) {
  if (TokenService.verifyToken()) {
    return (
      <Route {...props} />
    )
  }
  return (
    <Route path={props.path} component={Login} />
  )
}

export default ProtectedRoute