import React from 'react';
import styles from './Loader.module.scss';
import clsx from 'clsx';

type Props = {
  isWhite?: boolean;
};

export const Loader: React.FC<Props> = ({ isWhite = false }) => {
  return (
    <div className={clsx(styles.loader, isWhite && styles.loaderWhite)}>
      <div className={styles.text}>Loading</div>
      <div className={styles.dots}></div>
    </div>
  );
};
