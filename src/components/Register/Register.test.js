import React from 'react'
import ReactDOM from 'react-dom'
import Register from './Register'
import { BrowserRouter } from 'react-router-dom'

it('renders to the DOM', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>, div)
  ReactDOM.unmountComponentAtNode(div)
})