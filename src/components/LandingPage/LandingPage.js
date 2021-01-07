import React from 'react'
import './LandingPage.css'
import transfer from './images/transfer.png'
import onedrive from './images/onedrive.png'
import increase from './images/increase.png'
import dropbox from './images/dropbox.jpg'

function LandingPage() {
  return (
    <section className='flex-column full-height justify-evenly'>
      <div className="lp-section flex-column align-center">
        <p className='lp-paragraph'>Stay within your data caps by remotely uploading files from the internet</p>
        <img id='lp-transfer' src={transfer} alt='internet cloud folder graphic' />
      </div>
      <div className="lp-section flex-column align-center">
        <p className='lp-paragraph'>Any public link on the web can be sent directly to your OneDrive or Dropbox</p>
        <div id='cloud-container' className='flex-row justify-evenly flex-wrap align-center'>
          <img id='lp-onedrive' src={onedrive} alt='onedrive logo' />
          <img id='lp-dropbox' src={dropbox} alt='dropbox logo' />
        </div>
      </div>
      <div className="lp-section flex-column align-center">
        <p className='lp-paragraph'>Non-registered users can upload 2 files per hour. If you register, it's increased to 5.</p>
        <img id='lp-increase' src={increase} alt='increasing line chart' />
      </div>
    </section>
  )
}

export default LandingPage