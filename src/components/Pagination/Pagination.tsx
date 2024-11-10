import React from 'react';
import clsx from 'clsx';
import styles from './Pagination.module.scss';

enum Direction {
  NEXT = 'next',
  BACK = 'back',
}

const SMALL_PAGINATION_LENGTH = 4;
const BIG_PAGINATION_LENGTH = 9;

type Props = {
  pagesNumber: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export const Pagination: React.FC<Props> = ({
  pagesNumber,
  currentPage,
  setCurrentPage,
}) => {
  const pages = new Array(pagesNumber).fill(1).map((el, i) => el + i);
  const lastPage = pages[pages.length - 1];

  let centerPages: number[] = pages.slice(1, lastPage - 1);
  let mobilePages: number[] = [...pages];

  const smallPaginationOverflowed = pages.length > SMALL_PAGINATION_LENGTH;
  const bigPaginationOverflowed = pages.length > BIG_PAGINATION_LENGTH;

  const handlePageChange = (page: Direction | number) => {
    switch (page) {
      case Direction.BACK:
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        break;

      case Direction.NEXT:
          if (currentPage < lastPage) {
            setCurrentPage(currentPage + 1);
          };
        break;

      default:
        setCurrentPage(page);
    }
  };


  const prepareCenterPages = () => {
    if (currentPage <= 4) {
      centerPages = pages.slice(2, 7);

      return;
    }

    if (currentPage >= lastPage - 4) {
      centerPages = pages.slice(lastPage - 7, lastPage - 2);

      return;
    }

    centerPages = pages.slice(currentPage - 2, currentPage + 3);
  };

  const prepareMobilePages = () => {
    if (currentPage <= 2) {
      mobilePages = pages.slice(0, 4);

      return;
    }

    if (currentPage >= lastPage - 2) {
      mobilePages = pages.slice(lastPage - 4);

      return;
    }

    mobilePages = pages.slice(currentPage - 2, currentPage + 2);
  };

  if (smallPaginationOverflowed) {
    prepareMobilePages();
  }

  if (bigPaginationOverflowed) {
    prepareCenterPages();
  }

  return (

    <nav className={styles.pagination}>
    <button
      className={clsx(
        styles.button,
        styles.buttonTypeBack,
        currentPage === 1 && styles.disabled,
      )}
      onClick={() => handlePageChange(Direction.BACK)}
      tabIndex={currentPage === 1 ? -1 : 0}
    >{'<'}</button>

    <ul className={clsx(styles.list, styles.listSizeL)}>
      <li className={styles.listItem}>
        <button
          className={clsx(
            styles.button,
            styles.buttonBorderLight,
            currentPage === 1 && styles.active,
          )}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      </li>

      {bigPaginationOverflowed &&
        (currentPage <= 4 ? (
          <li className={styles.listItem}>
            <button
              className={clsx(
                styles.button,
                styles.buttonBorderLight,
                currentPage === 2 && styles.active,
              )}
              onClick={() => handlePageChange(2)}
            >
              2
            </button>
          </li>
        ) : (
          <li className={styles.listItem}>
            <button
              className={clsx(styles.button, styles.buttonBorderLight)}
              onClick={() => handlePageChange(centerPages[0] - 1)}
            >
              ...
            </button>
          </li>
        ))}

      {centerPages.map(pageNumber => (
        <li className={styles.listItem} key={pageNumber}>
          <button
            className={clsx(
              styles.button,
              styles.buttonBorderLight,
              currentPage === pageNumber && styles.active,
            )}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        </li>
      ))}

      {bigPaginationOverflowed &&
        (currentPage >= lastPage - 5 ? (
          <li className={styles.listItem}>
            <button
              className={clsx(
                styles.button,
                styles.buttonBorderLight,
                currentPage === lastPage - 1 && styles.active,
              )}
              onClick={() => handlePageChange(lastPage - 1)}
            >
              {lastPage - 1}
            </button>
          </li>
        ) : (
          <li className={styles.listItem}>
            <button
              className={clsx(styles.button, styles.buttonBorderLight)}
              onClick={() =>
                handlePageChange(centerPages[centerPages.length - 1] + 1)
              }
            >
              ...
            </button>
          </li>
        ))}

      <li className={styles.listItem}>
        <button
          className={clsx(
            styles.button,
            styles.buttonBorderLight,
            currentPage === lastPage && styles.active,
          )}
          onClick={() => handlePageChange(lastPage)}
        >
          {lastPage}
        </button>
      </li>
    </ul>

    <ul className={clsx(styles.list, styles.listSizeS)}>
      {mobilePages.map(pageNumber => (
        <li className={styles.listItem} key={pageNumber}>
          <button
            className={clsx(
              styles.button,
              styles.buttonBorderLight,
              currentPage === pageNumber && styles.active,
            )}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        </li>
      ))}
    </ul>

    <button
      className={clsx(
        styles.button,
        styles.buttonTypeNext,
        currentPage === lastPage && styles.disabled
      )}
      onClick={() => handlePageChange(Direction.NEXT)}
      tabIndex={currentPage === lastPage ? -1 : 0}
    >{'>'}</button>
  </nav>
  );
};
