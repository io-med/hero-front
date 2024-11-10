import React from 'react';
import styles from './Logo.module.scss';

type Props = {};

export const Logo: React.FC<Props> = () => {
  return (
    <div className={styles.logo}>
      <div className={styles.bubble}>
        <h1 className={styles.title}>Superheroes</h1>
      </div>
    </div>
  );
};