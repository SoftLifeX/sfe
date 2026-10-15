import Link from 'next/link'
import { NavLink } from './NavLink'
import { UserMenu } from './UserMenu'
import styles from './Navbar.module.css'

const LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/convert', label: 'Convert' },
]

export function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          acme<span className={styles.logoDot}>.</span>wallet
        </Link>
        <nav className={styles.links} aria-label="Main">
          {LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <UserMenu />
      </div>
    </header>
  )
}
