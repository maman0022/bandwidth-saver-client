import React, { useEffect } from 'react'
import './LandingPage.css'
import transfer from './transfer.png'
import onedrive from './onedrive.png'
import increase from './increase.png'
import dropbox from './dropbox.jpg'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <section className='flex-column full-height justify-evenly'>
      <div class="lp-section flex-column align-center">
        <p className='lp-paragraph'>Stay within your data caps by remotely uploading files from the internet</p>
        <img id='lp-transfer' src={transfer} alt='' />
      </div>
      <div class="lp-section flex-column align-center">
        <p className='lp-paragraph'>Any public link on the web can be directly sent to your OneDrive or Dropbox</p>
        <div id='cloud-container' className='flex-row justify-evenly flex-wrap align-center'>
          <img id='lp-onedrive' src={onedrive} alt='' />
          <img id='lp-dropbox' src={dropbox} alt='' />
        </div>
      </div>
      <div class="lp-section flex-column align-center">
        <p className='lp-paragraph'>Non-registered users can upload 2 files per hour. If you register, it's increased to 5.</p>
          <img id='lp-increase' src={increase} alt='' />
      </div>
    </section>
  )
}

export default LandingPage