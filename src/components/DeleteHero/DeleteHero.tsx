import React from 'react';
import styles from './DeleteHero.module.scss';
import { HeroServer } from '../../types/HeroServer';
import { deleteHero } from '../../api/heroes';

type Props = {
  setHeroes: React.Dispatch<React.SetStateAction<HeroServer[]>>;
  id: number;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
};

export const DeleteHero: React.FC<Props> = ({
  setHeroes,
  id,
  setErrorMessage,
  setIsLoading,
  close,
}) => {
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteHero(id);

      setHeroes((curHeroes: HeroServer[]) => {
        return curHeroes.filter((curHero: HeroServer) => curHero.id !== id);
      });

      close();
    } catch (error) {
      setErrorMessage(`${error}. Hero wasn\'t deleted`);
    }

    setIsLoading(false);
  };

  return (
    <button className={styles.deleteHero} tabIndex={0} onClick={handleDelete}>
      delete
    </button>
  );
};
