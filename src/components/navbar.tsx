import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navItems}>
        {['home', 'story', 'game', 'swap'].map((item) => (
          <li
            key={item}
            className={`${styles.navItem} ${
              router.pathname === `/${item}` ? styles.active : ''
            }`}
          >
            <Link href={`/${item}`}>
              <a>{item.toUpperCase()}</a>
            </Link>
          </li>
        ))}
        <li className={styles.navItem}>
          <a
            href="https://kibu-1.gitbook.io/kibu"
            target="_blank"
            rel="noopener noreferrer"
           >
            DOCS
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
