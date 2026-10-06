import { profile } from '../content.js'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <p className="footer-name">
          {profile.firstName} {profile.lastName}
        </p>
        <p className="footer-meta">Sequenced with GSAP and Lenis</p>
      </div>
    </footer>
  )
}
