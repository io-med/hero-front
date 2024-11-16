import React from 'react';
import styles from './Logo.module.scss';
import { Link } from 'react-router-dom';

type Props = {};

export const Logo: React.FC<Props> = () => {
  return (
    <Link to="/" className={styles.logo}>
      <div className={styles.bubble}>
        <h1 className={styles.title}>Superheroes</h1>
      </div>
    </Link>
  );
};
