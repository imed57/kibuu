import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const [active, setActive] = useState<string>('home');

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navItems}>
        {['home', 'story', 'game', 'swap', 'docs'].map((item) => (
          <li
            key={item}
            className={`${styles.navItem} ${
              active === item ? styles.active : ''
            }`}
            onClick={() => setActive(item)}
          >
            <Link href={`/${item}`}>
              <a>{item.toUpperCase()}</a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
