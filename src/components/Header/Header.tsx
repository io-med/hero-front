import React from 'react';
import styles from './Header.module.scss';
import { Logo } from '../Logo';

type Props = {};

export const Header: React.FC<Props> = () => {
  return (
    <header className={styles.header}>
      <Logo />
    </header>
  );
};
