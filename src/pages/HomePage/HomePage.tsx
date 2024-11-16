import { useCallback, useEffect, useState } from 'react';
import styles from './HomePage.module.scss';
import { HeroList } from '../../components/HeroList';
import { Add } from '../../components/Add';
import { getHeroes } from '../../api/heroes';
import { HeroServer } from '../../types/HeroServer';
import { Loader } from '../../components/Loader';
import { Error } from '../../components/Error';
import { Hero } from '../../types/Hero';
import { HeroModal } from '../../components/HeroModal';
import { convertFromServerHero } from '../../utils/convertFromServerHero';
import { useNavigate } from 'react-router-dom';

enum errorMessages {
  NO_HEROES = 'I guess we\'ve ran out of heroes. Look for a button in the bottom corner, champ!',
  LOADING_ERROR = 'We can\'t reach heroes! You are in danger, my friend!',
}

export const HomePage = () => {
  const [heroes, setHeroes] = useState<HeroServer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadHeroes = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const heroesFromServer = await getHeroes();
      setHeroes(heroesFromServer);

      if (heroesFromServer.length === 0) {
        setErrorMessage(errorMessages.NO_HEROES);
      }
    } catch (error) {
      setErrorMessage(errorMessages.LOADING_ERROR);
      throw error;
    }

    setIsLoading(false);
  };

  const close = useCallback(() => {
    setSelected(null);
  }, []);

  const openModal = useCallback(() => {
    setSelected(0);
  }, []);

  useEffect(() => {
    loadHeroes();
  }, []);

  useEffect(() => {
    if (
      heroes.length === 0 &&
      errorMessage !== errorMessages.NO_HEROES &&
      !isLoading
    ) {
      setErrorMessage(errorMessages.NO_HEROES);
      return;
    }

    if (
      heroes.length > 0 &&
      errorMessage === errorMessages.NO_HEROES &&
      !isLoading
    ) {
      setErrorMessage('');
    }
  }, [heroes]);

  const getSelectedHero = (): Hero | null => {
    const heroToSelect = heroes.find(hero => hero.id === selected) || null;

    if (heroToSelect) {
      return convertFromServerHero(heroToSelect);
    }

    return null;
  };

  const selectedHero = getSelectedHero();

  return (
    <main className={styles.homePage}>
      {isLoading && (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}

      {errorMessage && !isLoading && (
        <div className={styles.error}>
          <Error message={errorMessage} />

          {errorMessage === errorMessages.LOADING_ERROR && (
            <button
              className={styles.refresh}
              onClick={() => {
                navigate(0);
              }}
            >
              refresh page
            </button>
          )}
        </div>
      )}

      {!isLoading && !errorMessage && (
        <HeroList
          heroes={heroes}
          selected={selected}
          setSelected={setSelected}
        />
      )}

      {selected !== null && (
        <HeroModal
          selectedHero={selectedHero}
          close={close}
          setHeroes={setHeroes}
          setSelected={setSelected}
        />
      )}

      <Add openModal={openModal} />
    </main>
  );
};
