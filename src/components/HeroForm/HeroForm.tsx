import React, { useEffect, useState } from 'react';
import styles from './HeroForm.module.scss';
import { Hero } from '../../types/Hero';
import { patchHero, postHero } from '../../api/heroes';
import { HeroServer } from '../../types/HeroServer';
import { addImage, deleteImage, getImageUrl } from '../../api/images';
import { Loader } from '../Loader';
import clsx from 'clsx';
import { DeleteHero } from '../DeleteHero';

type Props = {
  selectedHero?: Hero | null;
  setHeroes: React.Dispatch<React.SetStateAction<HeroServer[]>>;
  flipBack: (id: number) => void;
  close: () => void;
};

export const HeroForm: React.FC<Props> = ({
  selectedHero,
  setHeroes,
  flipBack,
  close,
}) => {
  const [nickname, setNickName] = useState(selectedHero?.nickname || '');
  const [realName, setRealName] = useState(selectedHero?.realName || '');
  const [origin, setOrigin] = useState(selectedHero?.origin || '');
  const [powers, setPowers] = useState(selectedHero?.powers || '');
  const [phrase, setPhrase] = useState(selectedHero?.phrase || '');
  const [image, setImage] = useState<File | null>(null);
  const [inCreateMode, setInCreateMode] = useState(!selectedHero);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(event.target.value.trimStart());
  };

  const handleRealNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRealName(event.target.value.trimStart());
  };

  const handleOriginChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setOrigin(event.target.value.trimStart());
  };

  const handlePowersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPowers(event.target.value.trimStart());
  };

  const handlePhraseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhrase(event.target.value.trimStart());
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      if (event.target.files[0].size > 5000000) {
        setErrorMessage('Image file must be smaller then 5mb.')

        return;
      }
      
      setImage(event.target.files[0]);
    }
  };

  const hasChanges =
    selectedHero &&
    (nickname !== selectedHero.nickname ||
      realName !== selectedHero.realName ||
      origin !== selectedHero.origin ||
      powers !== selectedHero.powers ||
      phrase !== selectedHero.phrase);

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

  const submitImage = async (heroId: number) => {
    setIsLoading(true);
    setErrorMessage('');

    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }

    try {
      const newImage = await addImage(formData, heroId);

      return newImage;
    } catch (error) {
      setErrorMessage(`${error}`);
    }

    setIsLoading(false);
  };

  const handleSubmitCreate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

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

        if (image?.body) {
          heroFromServer.images.push(image.body);
        }

        setHeroes(curHeroes => [...curHeroes, heroFromServer]);
        setInCreateMode(false);
        console.log('heroFromServer', heroFromServer);
        flipBack(heroFromServer.id);
      }
    } catch (error) {
      setErrorMessage(`${error} Hero can\'t be created`);
    }

    setIsLoading(false);
  };

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (selectedHero?.id) {
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
        await patchHero(selectedHero.id, updatedHero);

        setHeroes(curHeroes => {
          return curHeroes.map(curHero => {
            if (curHero.id === selectedHero.id) {
              return { ...curHero, ...updatedHero };
            }

            return curHero;
          });
        });

        flipBack(selectedHero.id);
      } catch (error) {
        setErrorMessage(`${error}. Hero can\'t be changed`);
      }
    }

    setIsLoading(false);
  };

  const handleImageDelete = async (image: string, id: number) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await deleteImage({ image }, id);
      if (selectedHero) {
        setHeroes(curHeroes => {
          return curHeroes.map(curHero => {
            if (curHero.id !== selectedHero.id) {
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
      setErrorMessage(`${error}. Hero can\'t be deleted`);
    }

    setIsLoading(false);
  };

  const addRandomImage = async () => {
    const baseURL = window.location.origin;
    const imageIndex = Math.ceil(Math.random() * 22);
    const imageURL = `${baseURL}/images/heroes/${imageIndex}.webp`;

    try {
      const image = await fetch(imageURL);
      const imageData = await image.blob();
      const imageFile = await new File([imageData], 'randomImage.webp');

      setImage(imageFile);
    } catch (error) {
      setErrorMessage(`${error}. Image can\'t be added`);
    }
  };

  const addImageWithoutSubmit = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (selectedHero && image) {
        const newImage = await submitImage(selectedHero.id);
        setImage(null);
        if (newImage) {
          setHeroes(curHeroes => {
            return curHeroes.map(curHero => {
              if (curHero.id === selectedHero.id) {
                return {
                  ...curHero,
                  images: [...curHero.images, newImage.body],
                };
              }

              return curHero;
            });
          });
        }
      }
    } catch (error) {
      setErrorMessage(`${error}. Image can\'t be added`);
    }

    setIsLoading(false);
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

      {selectedHero && (
        <DeleteHero
          setHeroes={setHeroes}
          id={selectedHero.id}
          setErrorMessage={setErrorMessage}
          setIsLoading={setIsLoading}
          close={close}
        />
      )}

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
            required
          />
          <div className={styles.inputError}>REQUIRED</div>
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
            required
          />
          <div className={styles.inputError}>REQUIRED</div>
        </label>

        <label className={styles.label}>
          Origin:
          <textarea
            className={clsx(styles.input, styles.inputTextArea)}
            value={origin}
            onChange={handleOriginChange}
            placeholder="Fallen in toxic waste or...bitten by radioactive roach?!"
            maxLength={200}
            required
          />
          <div className={styles.inputError}>REQUIRED</div>
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
            required
          />
          <div className={styles.inputError}>REQUIRED</div>
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
            required
          />
          <div className={styles.inputError}>REQUIRED</div>
        </label>

        <div className={styles.imageButtons}>
          <label className={styles.imageLabel}>
            {selectedHero ? 'Add image' : 'Select image'}
            <input
              type="file"
              className={styles.imageInput}
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>

          {image && (
            <button
              className={styles.selectedMark}
              onClick={() => {
                setImage(null);
              }}
            >
              deselect
            </button>
          )}

          <label className={styles.imageLabel}>
            Add random image
            <input className={styles.imageInput} onClick={addRandomImage} />
          </label>
        </div>
        {(hasChanges || inCreateMode) && (
          <button type="submit" className={styles.save} disabled={disabled}>
            {inCreateMode ? 'create' : 'save'}
          </button>
        )}
      </form>

      {selectedHero?.images && selectedHero.images.length > 0 && (
        <div className={styles.images}>
          <ul className={styles.imagesList}>
            {selectedHero.images.map(image => (
              <li className={styles.imageItem} key={image}>
                {selectedHero.images.length !== 1 && (
                  <button
                    className={styles.delete}
                    onClick={() => {
                      handleImageDelete(image, selectedHero.id);
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
          <Loader isWhite={true} />
        </div>
      )}

      {errorMessage && (
        <div className={styles.error}>
          <p className={styles.errorMessage}>{errorMessage}</p>

          <button
            className={styles.errorButton}
            onClick={() => setErrorMessage('')}
          >
            close
          </button>
        </div>
      )}
    </div>
  );
};
