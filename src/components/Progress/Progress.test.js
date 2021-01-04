import React from 'react'
import ReactDOM from 'react-dom'
import Progress from './Progress'
import { BrowserRouter } from 'react-router-dom'

it('renders to the DOM', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <Progress />
    </BrowserRouter>, div)
  ReactDOM.unmountComponentAtNode(div)
})