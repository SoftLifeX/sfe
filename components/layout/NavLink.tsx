'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './NavLink.module.css'

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname()
  const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cx(styles.link, active && styles.active)}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}
