import React from 'react';
import styles from './Error.module.scss';

type Props = {
  message: string;
};

export const Error: React.FC<Props> = ({ message }) => {
  return (
    <div className={styles.error}>
      <div className={styles.message}>
        {message}
      </div>
    </div>
  );
};
