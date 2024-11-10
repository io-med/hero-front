import React from 'react';
import styles from './NotFoundPage.module.scss';

type Props = {};

export const NotFoundPage: React.FC<Props> = () => {
  return (
    <main className={styles.notFoundPage}>
      Page not found
    </main>
  );
};
