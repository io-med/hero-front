import React from 'react';
import styles from './Footer.module.scss';

type Props = {};

export const Footer: React.FC<Props> = () => {
  return (
    <footer className={styles.footer}>
      <a
        href="https://github.com/io-med"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        Github
      </a>
    </footer>
  );
};
