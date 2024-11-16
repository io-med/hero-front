import React, { useEffect, useState } from 'react';
import styles from './HeroDetails.module.scss';
import { Hero } from '../../types/Hero';
import { getImageUrl } from '../../api/images';

type Props = {
  selectedHero: Hero;
};

export const HeroDetails: React.FC<Props> = ({ selectedHero }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(
    selectedHero.images ? selectedHero.images.length - 1 : 0,
  );

  const mainImage = selectedHero.images ? selectedHero?.images.at(currentImageIndex) : null;
  const imageUlr = mainImage ? getImageUrl(mainImage) : undefined;

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(curIndex => curIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (!selectedHero) {
      return;
    }

    if (currentImageIndex < (selectedHero.images.length - 1)) {
      setCurrentImageIndex(curIndex => curIndex + 1);
    }
  };

  useEffect(() => {
    setCurrentImageIndex(selectedHero ? selectedHero.images.length - 1 : 0);
  }, [selectedHero.images ? selectedHero?.images.length : 0])

  return (
    <div className={styles.heroDetails}>
          <h2 className={styles.title}>{selectedHero.nickname}</h2>

          <div className={styles.details}>
            <div className={styles.detail}>
              <h3 className={styles.detailTitle}>Real name:</h3>
              <p className={styles.detailInfo}>{selectedHero.realName}</p>
            </div>

            <div className={styles.detail}>
              <h3 className={styles.detailTitle}>Origin:</h3>
              <p className={styles.detailInfo}>{selectedHero.origin}</p>
            </div>

            <div className={styles.detail}>
              <h3 className={styles.detailTitle}>Superpowers:</h3>
              <p className={styles.detailInfo}>{selectedHero.powers}</p>
            </div>

            <div className={styles.detail}>
              <h3 className={styles.detailTitle}>Catch phrase:</h3>
              <p className={styles.detailInfo}>{selectedHero.phrase}</p>
            </div>
          </div>

          <img
            src={imageUlr || './images/question-mark.webp'}
            alt="superhero"
            className={styles.image}
            onError={e => (e.currentTarget.src = './images/question-mark.webp')}
          />

          {selectedHero.images && selectedHero.images.length > 1 && (
            <div className={styles.arrows}>
              {currentImageIndex > 0 && (
                <button className={styles.arrow} onClick={handlePrevImage}>
                  {'<'}
                </button>
              )}

              <div className={styles.spacer}></div>

              {currentImageIndex < selectedHero.images.length - 1 && (
                <button className={styles.arrow} onClick={handleNextImage}>
                  {'>'}
                </button>
              )}
            </div>
          )}
    </div>
  );
};
