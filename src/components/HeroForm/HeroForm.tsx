import React, { useEffect, useState } from 'react';
import styles from './HeroForm.module.scss';
import { Hero } from '../../types/Hero';
import { patchHero, postHero } from '../../api/heroes';
import { HeroServer } from '../../types/HeroServer';
import { convertFromServerHero } from '../../utils/convertFromServerHero';
import { addImage, deleteImage, getImageUrl } from '../../api/images';
import { Loader } from '../Loader';

type Props = {
  hero?: Hero | null;
  setHeroes: React.Dispatch<React.SetStateAction<HeroServer[]>>;
  flipBack: (hero: Hero) => void;
};

export const HeroForm: React.FC<Props> = ({ hero, setHeroes, flipBack }) => {
  const [nickname, setNickName] = useState(hero?.nickname || '');
  const [realName, setRealName] = useState(hero?.realName || '');
  const [origin, setOrigin] = useState(hero?.origin || '');
  const [powers, setPowers] = useState(hero?.powers || '');
  const [phrase, setPhrase] = useState(hero?.phrase || '');
  const [image, setImage] = useState<File | null>(null);
  const [inCreateMode, setInCreateMode] = useState(!hero);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(event.target.value);
  };

  const handleRealNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRealName(event.target.value);
  };

  const handleOriginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrigin(event.target.value);
  };

  const handlePowersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPowers(event.target.value);
  };

  const handlePhraseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhrase(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const hasChanges =
    hero &&
    (nickname !== hero.nickname ||
      realName !== hero.realName ||
      origin !== hero.origin ||
      powers !== hero.powers ||
      phrase !== hero.phrase);

  const disabled =
    (!hasChanges && !inCreateMode) ||
    !nickname ||
    !realName ||
    !origin ||
    !powers ||
    !phrase ||
    (inCreateMode && !image) ||
    isLoading ||
    !!errorMessage;

  const clearError = () => {
    setErrorMessage('');
  };

  const submitImage = async (heroId: number) => {
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }

    try {
      const newImage = await addImage(formData, heroId);

      return newImage;
    } catch (error) {
      setErrorMessage("Image can't be loaded");
      throw error;
    }
  };

  const handleSubmitCreate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      const newHero = {
        nickname,
        real_name: realName,
        origin_description: origin,
        superpowers: powers,
        catch_phrase: phrase,
      };

      const heroFromServer = await postHero(newHero);

      if (heroFromServer) {
        const image = await submitImage(heroFromServer.id);

        if (image.body) {
          heroFromServer.images.push(image.body);
        }

        setHeroes(curHeroes => [...curHeroes, heroFromServer]);
        setInCreateMode(false);
        flipBack(convertFromServerHero(heroFromServer));
      }
    } catch (error) {
      setErrorMessage('Hero cannot be created');
      throw error;
    }

    setIsLoading(false);
  };

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (hero?.id) {
      const updatedHero: Partial<HeroServer> = {
        nickname,
        real_name: realName,
        origin_description: origin,
        superpowers: powers,
        catch_phrase: phrase,
      };

      Object.keys(updatedHero).forEach(key => {
        const keyOfHero = key as keyof typeof updatedHero;

        if (!updatedHero[keyOfHero]) {
          delete updatedHero[keyOfHero];
        }
      });

      try {
        await patchHero(hero.id, updatedHero);

        setHeroes(curHeroes => {
          return curHeroes.map(curHero => {
            if (curHero.id === hero.id) {
              return { ...curHero, ...updatedHero };
            }

            return curHero;
          });
        });

        flipBack({ ...hero, ...updatedHero });
      } catch (error) {
        setErrorMessage('Hero cannot be updated');
        throw error;
      }
    }

    setIsLoading(false);
  };

  const handleImageDelete = async (image: string, id: number) => {
    setIsLoading(true);

    try {
      await deleteImage({ image }, id);
      if (hero) {
        hero.images = hero.images.filter(
          existingImage => existingImage !== image,
        );

        setHeroes(curHeroes => {
          return curHeroes.map(curHero => {
            if (curHero.id !== hero.id) {
              return curHero;
            }

            return {
              ...curHero,
              images: [
                ...curHero.images.filter(curImage => curImage !== image),
              ],
            };
          });
        });
      }
    } catch (error) {
      setErrorMessage('Unable to delete!');
      throw error;
    }

    setIsLoading(false);
  };

  const addImageWithoutSubmit = async () => {
    try {
      if (hero && image) {
        const newImage = await submitImage(hero.id);
        setImage(null);
        hero.images.push(newImage.body);
        setHeroes(curHeroes => {
          return curHeroes.map(curHero => {
            if (curHero.id === hero.id) {
              return { ...curHero, images: [...curHero.images, newImage.body] };
            }

            return curHero;
          });
        });
      }
    } catch (error) {
      setErrorMessage('Unable to add!');
      throw error;
    }
  };

  useEffect(() => {
    if (!inCreateMode) {
      addImageWithoutSubmit();
    }
  }, [image]);

  return (
    <div className={styles.heroForm}>
      <h3 className={styles.title}>
        {inCreateMode ? 'Make your hero!' : 'Change your hero!'}
      </h3>
      <form
        className={styles.form}
        onSubmit={inCreateMode ? handleSubmitCreate : handleSubmitEdit}
      >
        <label className={styles.label}>
          Nickname:
          <input
            type="text"
            className={styles.input}
            value={nickname}
            onChange={handleNickNameChange}
            placeholder="Super who?"
            maxLength={15}
          />
        </label>

        <label className={styles.label}>
          Real name:
          <input
            type="text"
            className={styles.input}
            value={realName}
            onChange={handleRealNameChange}
            placeholder="Say my name!"
            maxLength={15}
          />
        </label>

        <label className={styles.label}>
          Origin:
          <input
            type="text"
            className={styles.input}
            value={origin}
            onChange={handleOriginChange}
            placeholder="Fallen in toxic waste or...bitten by radioactive roach?!"
            maxLength={100}
          />
        </label>

        <label className={styles.label}>
          Superpowers:
          <input
            type="text"
            className={styles.input}
            value={powers}
            onChange={handlePowersChange}
            placeholder="Transparent eyelids, three ears.."
            maxLength={40}
          />
        </label>

        <label className={styles.label}>
          Catch phrase:
          <input
            type="text"
            className={styles.input}
            value={phrase}
            onChange={handlePhraseChange}
            placeholder="What if I have nothing to say?"
            maxLength={30}
          />
        </label>

        <label className={styles.imageLabel}>
          add image
          <input
            type="file"
            className={styles.imageInput}
            onChange={handleImageChange}
            accept="image/*"
          />
        </label>

        {(hasChanges || inCreateMode) && (
          <button type="submit" className={styles.save} disabled={disabled}>
            {inCreateMode ? 'create' : 'save'}
          </button>
        )}
      </form>

      {hero?.images && hero.images.length > 0 && (
        <div className={styles.images}>
          <ul className={styles.imagesList}>
            {hero.images.map(image => (
              <li className={styles.imageItem} key={image}>
                {hero.images.length !== 1 && (
                  <button
                    className={styles.delete}
                    onClick={() => {
                      handleImageDelete(image, hero.id);
                    }}
                  >
                    x
                  </button>
                )}
                <img
                  src={getImageUrl(image)}
                  alt="superhero"
                  className={styles.image}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading && (
        <div className={styles.loading}>
          <Loader />
        </div>
      )}

      {errorMessage && (
        <div className={styles.error}>
          <p className={styles.errorMessage}>{errorMessage}</p>

          <button className={styles.errorButton} onClick={clearError}>
            close
          </button>
        </div>
      )}
    </div>
  );
};
