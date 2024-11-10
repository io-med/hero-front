import React from 'react';
import styles from './Add.module.scss';

type Props = {
  openModal: () => void;
};

export const Add: React.FC<Props> = ({ openModal }) => {
  return (
    <button className={styles.add} onClick={openModal}>
      add
    </button>
  );
};
