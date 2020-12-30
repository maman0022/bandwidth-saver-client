import FingerprintJS from '@fingerprintjs/fingerprintjs';

const FingerprintService = {
  saveFingerprint(fingerprint) {
    window.localStorage.setItem('fingerprint', fingerprint)
  },
  getFingerprint() {
    return window.localStorage.getItem('fingerprint')
  },
  clearFingerprint() {
    window.localStorage.removeItem('fingerprint')
  },
  async generateAndSaveFingerprint() {
    const fp = await FingerprintJS.load()
    FingerprintService.saveFingerprint((await fp.get()).visitorId)
  }
}

export default FingerprintService