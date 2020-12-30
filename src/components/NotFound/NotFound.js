import React from 'react'
import notFoundImg from './404.jpg'
import './NotFound.css'

function NotFound() {
  return (
    <section className='flex-column'>
      <img id='not-found-img' src={notFoundImg} alt='piece of metal with numbers "404" printed on it'></img>
      <h2 id='not-found-header'>The page you are looking for does not exist.</h2>
    </section>
  )
}

export default NotFound