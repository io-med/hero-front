import { useCallback, useEffect, useMemo, useState } from 'react';
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

export const HomePage = () => {
  const [heroes, setHeroes] = useState<HeroServer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  const loadHeroes = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const heroesFromServer = await getHeroes();
      setHeroes(heroesFromServer);

      if (heroesFromServer.length === 0) {
        setErrorMessage('I guess we\'ve ran out of heroes. Try adding new ones!');
      }
    } catch (error) {
      setErrorMessage('We can\'t reach heroes! You are in danger, my friend!');
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

  const selectedHero: Hero | null = useMemo(() => {
    const heroToSelect = heroes.find(hero => hero.id === selected) || null;

    if (heroToSelect) {
      return convertFromServerHero(heroToSelect);
    }

    return null;
  }, [selected]);

  useEffect(() => {
    loadHeroes();
  }, []);

  return (
    <main className={styles.homePage}>
      {isLoading && (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}

      {errorMessage && (
        <div className={styles.error}>
          <Error message={errorMessage} />
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
        <HeroModal hero={selectedHero} close={close} setHeroes={setHeroes} />
      )}

      <Add openModal={openModal} />
    </main>
  );
};
