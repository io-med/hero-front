import React, { useState } from 'react';
import styles from './HeroList.module.scss';
import { HeroCard } from '../HeroCard';
import { HeroServer } from '../../types/HeroServer';
import { Pagination } from '../Pagination';
import clsx from 'clsx';

type Props = {
  heroes: HeroServer[];
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
};

export const HeroList: React.FC<Props> = ({
  heroes,
  setSelected,
  selected,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pagesNumber = Math.ceil(heroes.length / 5);
  const paginatedHeroes = heroes.slice(5 * (currentPage - 1), 5 * currentPage);
  
  if (currentPage > pagesNumber) {
    setCurrentPage(pagesNumber);
  }

  const handleSelection = (id: number) => {
    setSelected(id);
  };

  return (
    <>
      {pagesNumber > 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pagesNumber={pagesNumber}
        />
      )}

      <ul className={styles.heroList}>
        {paginatedHeroes.map(hero => (
          <li
            className={clsx(
              styles.item,
              selected === hero.id && styles.selected,
            )}
            key={hero.id}
            onClick={() => {
              handleSelection(hero.id);
            }}
          >
            <HeroCard hero={hero} />
          </li>
        ))}
      </ul>
    </>
  );
};
