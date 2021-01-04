import './App.css'
import './flex.css'
import 'finally-polyfill'
import { Route, Switch } from 'react-router-dom'
import PublicOrPrivateRoute from '../PublicOrPrivateRoute/PublicOrPrivateRoute'
import Header from '../Header/Header'
import LandingPage from '../LandingPage/LandingPage'
import Login from '../Login/Login'
import Register from '../Register/Register'
import Dashboard from '../Dashboard/Dashboard'
import NotFound from '../NotFound/NotFound'

function App() {
  return (
    <>
      <Route path='/' component={Header} />
      <main>
        <Switch>
          <PublicOrPrivateRoute exact path='/' component={LandingPage} />
          <PublicOrPrivateRoute exact path='/register' component={Register} />
          <PublicOrPrivateRoute exact path='/login' component={Login} />
          <Route exact path='/dashboard' component={Dashboard} />
          <PublicOrPrivateRoute component={NotFound} />
        </Switch>
      </main>
    </>
  )
}

export default App