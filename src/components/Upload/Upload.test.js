import React from 'react'
import ReactDOM from 'react-dom'
import Upload from './Upload'
import { BrowserRouter } from 'react-router-dom'

it('renders to the DOM', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <Upload />
    </BrowserRouter>, div)
  ReactDOM.unmountComponentAtNode(div)
})