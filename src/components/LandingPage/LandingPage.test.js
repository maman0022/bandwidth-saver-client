import * as React from 'react'
import { render } from '@testing-library/react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import LandingPage from './LandingPage'


it('renders to the DOM', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>, div)
  ReactDOM.unmountComponentAtNode(div)
})

it('header is rendered', () => {
  const { container } = render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>)
  const header = container.querySelector('#lp-header')
  expect(header.innerHTML).toEqual('Welcome to Bandwidth Saver')
})