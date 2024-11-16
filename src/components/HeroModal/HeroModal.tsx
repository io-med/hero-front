import React, { useCallback, useEffect, useState } from 'react';
import { clsx } from 'clsx/lite';

import styles from './HeroModal.module.scss';
import { Hero } from '../../types/Hero';
import { HeroForm } from '../HeroForm';
import { Backdrop } from '../Backdrop';
import { HeroServer } from '../../types/HeroServer';
import { HeroDetails } from '../HeroDetails';

type Props = {
  close: () => void;
  setHeroes: React.Dispatch<React.SetStateAction<HeroServer[]>>;
  selectedHero: Hero | null;
  setSelected: (id: number) => void;
};

export const HeroModal: React.FC<Props> = ({
  selectedHero,
  close = () => {},
  setHeroes,
  setSelected,
}) => {
  const [isInEdit, setIsInEdit] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInitialRender(false);
    }, 0);
  }, []);

  const isEmpty = !selectedHero;

  const flipBack = useCallback((id: number) => {
    setIsInEdit(false);
    setSelected(id);
  }, []);

  return (
    <>
      <div
        className={clsx(
          styles.heroModal,
          initialRender && styles.initial,
          (isInEdit || isEmpty) && styles.inEdit,
        )}
      >
        <div className={styles.inner}>
          <div className={clsx(styles.side, styles.sideFront)}>
            {selectedHero && <HeroDetails selectedHero={selectedHero} />}

            <button
              className={clsx(
                styles.button,
                styles.buttonDeselect,
                styles.buttonFront,
              )}
              tabIndex={0}
              onClick={close}
            >
              x
            </button>

            <button
              className={clsx(
                styles.button,
                styles.buttonEdit,
                styles.buttonFront,
              )}
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
              selectedHero={selectedHero}
              setHeroes={setHeroes}
              flipBack={flipBack}
              close={close}
            />

            <button
              className={clsx(styles.button, styles.buttonDeselect)}
              tabIndex={0}
              onClick={close}
            >
              x
            </button>

            {!isEmpty && (
              <button
                className={clsx(styles.button, styles.buttonBack)}
                onClick={() => {
                  setIsInEdit(false);
                }}
              >
                back
              </button>
            )}
          </div>
        </div>
      </div>

      <Backdrop close={close} />
    </>
  );
};
