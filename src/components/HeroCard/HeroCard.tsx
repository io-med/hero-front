import React from 'react';
import styles from './HeroCard.module.scss';
import { HeroServer } from '../../types/HeroServer';
import { getImageUrl } from '../../api/images';

type Props = {
  hero: HeroServer;
};

export const HeroCard: React.FC<Props> = ({ hero }) => {
  const mainImage = hero.images.at(-1);
  const imageUlr = mainImage? getImageUrl(mainImage) : undefined;

  return (
    <div className={styles.heroCard}>
      <h2 className={styles.title}>{hero.nickname}</h2>

      <img
        src={imageUlr || './images/question-mark.webp'}
        alt="superhero"
        className={styles.image}
        onError={(e) => (e.currentTarget.src = './images/question-mark.webp')}
      />
    </div>
  );
};
