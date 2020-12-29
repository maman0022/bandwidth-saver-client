import React from 'react'
import TokenService from '../../services/TokenService'
import { Route } from 'react-router-dom'

function PublicOrPrivateRoute(props) {
  if (TokenService.verifyToken()) {
    return (
      <Route path={props.path} render={(props) => { props.history.replace('/courses') }} />
    )
  }
  return (
    <Route {...props} />
  )
}

export default PublicOrPrivateRoute