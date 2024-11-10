import React from 'react';
import styles from './Backdrop.module.scss';

type Props = {
  close: () => void;
};

export const Backdrop: React.FC<Props> = ({ close }) => {
  return (
    <div className={styles.backdrop} onClick={close} />
  );
};
