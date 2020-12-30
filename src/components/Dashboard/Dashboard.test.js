import React from 'react'
import ReactDOM from 'react-dom'
import Dashboard from './Dashboard'
import { BrowserRouter } from 'react-router-dom'

it('renders to the DOM', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>, div)
  ReactDOM.unmountComponentAtNode(div)
})