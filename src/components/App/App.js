import './App.css'
import './flex.css'
import { Route, Switch } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import PublicOrPrivateRoute from '../PublicOrPrivateRoute/PublicOrPrivateRoute'
import Header from '../Header/Header'
import LandingPage from '../LandingPage/LandingPage'
import Login from '../Login/Login'
import Register from '../Register/Register'

function App() {
  return (
    <>
      <Route path='/' component={Header} />
      <main>
        <Switch>
          <PublicOrPrivateRoute exact path='/' component={LandingPage} />
          <PublicOrPrivateRoute exact path='/register' component={Register} />
          <PublicOrPrivateRoute exact path='/login' component={Login} />
        </Switch>
      </main>
    </>
  )
}

export default App