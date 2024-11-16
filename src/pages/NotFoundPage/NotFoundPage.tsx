import React from 'react';
import styles from './NotFoundPage.module.scss';
import { Link } from 'react-router-dom';

type Props = {};

export const NotFoundPage: React.FC<Props> = () => {
  return (
    <main className={styles.notFoundPage}>
      We don't know what you are looking for, but it's not here, champ.
      <br/>
      Page not found
      <br />
      404

      <Link to="/" className={styles.link}>back to home</Link>
    </main>
  );
};
