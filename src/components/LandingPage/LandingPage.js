import React, { useEffect } from 'react'
import './LandingPage.css'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <section className='flex-column full-height justify-evenly'>
      <p className='lp-paragraph'>This is an incredible app that lets you upload files directly to your Dropbox or OneDrive.</p>
      <p className='lp-paragraph'>You don't have worry about downloading the file and uploading it again.</p>
      <p className='lp-paragraph'>Save on bandwidth and forget about going over your data caps.</p>
      <p className='lp-paragraph'>As a non-registered user, you can upload 2 files per hour.</p>
      <p className='lp-paragraph'>If you register, your limit will be increased to 5 files per hour.</p>
      <p className='lp-paragraph'>To try the app without creating an account, click <Link to='/demo'>here</Link>.</p>
      <p className='lp-paragraph'>To create an account and start with an increased limit, click <Link to='/register'>here</Link>.</p>
    </section>
  )
}

export default LandingPage