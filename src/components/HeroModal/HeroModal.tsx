import React, { useCallback, useEffect, useState } from 'react';
import { clsx } from 'clsx/lite';

import styles from './HeroModal.module.scss';
import { Hero } from '../../types/Hero';
import { HeroForm } from '../HeroForm';
import { Backdrop } from '../Backdrop';
import { deleteHero } from '../../api/heroes';
import { HeroServer } from '../../types/HeroServer';
import { getImageUrl } from '../../api/images';

type Props = {
  close: () => void;
  setHeroes: React.Dispatch<React.SetStateAction<HeroServer[]>>;
  hero?: Hero | null;
};

export const HeroModal: React.FC<Props> = ({
  hero,
  close = () => {},
  setHeroes,
}) => {
  const [isInEdit, setIsInEdit] = useState(false);
  const [displayedHero, setDisplayedHero] = useState(hero || null);
  const [currentImageIndex, setCurrentImageIndex] = useState(
    displayedHero?.images ? displayedHero.images.length - 1 : 0,
  );
  const mainImage = displayedHero?.images ? displayedHero?.images.at(currentImageIndex) : null;
  const imageUlr = mainImage ? getImageUrl(mainImage) : undefined;

  const isEmpty = !displayedHero;

  useEffect(() => {
    setCurrentImageIndex(displayedHero ? displayedHero.images.length - 1 : 0);
  }, [displayedHero?.images ? displayedHero?.images.length : 0])

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(curIndex => curIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (!displayedHero) {
      return;
    }

    if (currentImageIndex < (displayedHero.images.length - 1)) {
      setCurrentImageIndex(curIndex => curIndex + 1);
    }
  };

  const handleDelete = async () => {
    try {
      if (displayedHero?.id) {
        await deleteHero(displayedHero.id);

        setHeroes((curHeroes: HeroServer[]) => {
          return curHeroes.filter(
            (curHero: HeroServer) => curHero.id !== displayedHero.id,
          );
        });
      }

      close();
    } catch (error) {
      throw error
    }
  };

  const flipBack = useCallback((hero: Hero) => {
    setIsInEdit(false);
    setDisplayedHero(hero);
  }, []);

  return (
    <>
      <div
        className={clsx(
          styles.heroModal,
          (isInEdit || isEmpty) && styles.inEdit,
        )}
      >
        <div className={styles.inner}>
          <div className={clsx(styles.side, styles.sideFront)}>
            {displayedHero && (
              <>
                <h2 className={styles.title}>{displayedHero.nickname}</h2>

                <div className={styles.details}>
                  <div className={styles.detail}>
                    <h3 className={styles.detailTitle}>Real name:</h3>
                    <p className={styles.detailInfo}>
                      {displayedHero.realName}
                    </p>
                  </div>

                  <div className={styles.detail}>
                    <h3 className={styles.detailTitle}>Origin:</h3>
                    <p className={styles.detailInfo}>{displayedHero.origin}</p>
                  </div>

                  <div className={styles.detail}>
                    <h3 className={styles.detailTitle}>Superpowers:</h3>
                    <p className={styles.detailInfo}>{displayedHero.powers}</p>
                  </div>

                  <div className={styles.detail}>
                    <h3 className={styles.detailTitle}>Catch phrase:</h3>
                    <p className={styles.detailInfo}>{displayedHero.phrase}</p>
                  </div>
                </div>

                <img
                  src={imageUlr || './images/question-mark.webp'}
                  alt="superhero"
                  className={styles.image}
                  onError={e =>
                    (e.currentTarget.src = './images/question-mark.webp')
                  }
                />

                {displayedHero.images && displayedHero.images.length > 1 && (
                  <div className={styles.arrows}>
                    {currentImageIndex > 0 && (
                      <button className={styles.arrow} onClick={handlePrevImage}>{'<'}</button>
                    )}

                    <div className={styles.spacer}></div>

                    {currentImageIndex < displayedHero.images.length - 1 && (
                      <button className={styles.arrow} onClick={handleNextImage}>{'>'}</button>
                    )}
                  </div>
                )}
              </>
            )}

            <button className={styles.deselect} tabIndex={0} onClick={close}>
              x
            </button>

            <button
              className={styles.edit}
              tabIndex={0}
              onClick={() => {
                setIsInEdit(true);
              }}
            >
              edit
            </button>
          </div>

          <div className={clsx(styles.side, styles.sideBack)}>
            <HeroForm
              hero={displayedHero}
              setHeroes={setHeroes}
              flipBack={flipBack}
            />

            <button className={styles.deselect} tabIndex={0} onClick={close}>
              x
            </button>

            {!isEmpty && (
              <>
                <button
                  className={styles.delete}
                  tabIndex={0}
                  onClick={handleDelete}
                >
                  delete
                </button>

                <button
                  className={styles.back}
                  onClick={() => {
                    setIsInEdit(false);
                  }}
                >
                  back
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Backdrop close={close} />
    </>
  );
};
