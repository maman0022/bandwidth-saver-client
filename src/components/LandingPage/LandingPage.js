import React from 'react'
import './LandingPage.css'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <section className='flex-column full-height justify-evenly'>
      <h2 id='lp-header'>
        Welcome to Bandwidth Saver
      </h2>
      <p className='lp-paragraph'>This is an incredible app that lets you upload files directly to your DropBox or OneDrive.</p>
      <p className='lp-paragraph'>You don't have worry about downloading the file and uploading it again.</p>
      <p className='lp-paragraph'>Save on bandwidth and forget about going over your data caps.</p>
      <p className='lp-paragraph'>Create an account and attach a cloud provider to get started.</p>
      <p className='lp-paragraph'>For a demo of how this app works, click <Link to='/demo'>here</Link>.</p>
    </section>
  )
}

export default LandingPage