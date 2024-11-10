import React from 'react';
import styles from './Loader.module.scss';

type Props = {};

export const Loader: React.FC<Props> = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.text}>Loading</div>
      <div className={styles.dots}></div>
    </div>
  );
};
