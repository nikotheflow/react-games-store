import React from 'react';

import qs from 'qs';

import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';

import {
  setActiveGenres,
  setCurrentPage,
  setFilters,
  selectFilter,
} from '../redux/slices/filterSlice';
import { fetchGames, selectGamesData } from '../redux/slices/gamesSlice';

import Filters from '../components/Filters';
import GameBlock from '../components/GameBlock';
import Skeleton from '../components/GameBlock/Skeleton';
import Sort from '../components/Sort';
import { sortTypes } from '../components/Sort';
import Pagination from '../components/Pagination';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { items, status } = useSelector(selectGamesData);
  const { searchValue, activeGenres, sortType, currentPage } = useSelector(selectFilter);
  const activeSort = sortType.designation;

  const onChangeFilters = (genre: string) => {
    dispatch(setActiveGenres(genre));
  };

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getGames = async () => {
    const genres = activeGenres ? `&genres=${activeGenres}` : '';
    const title = searchValue ? `&title=${searchValue}` : '';
    const sort = '&sortBy=' + activeSort.replace('-', '');
    const order = '&order=' + (activeSort[0] === '-' ? 'desc' : 'asc');

    dispatch(
      fetchGames({
        currentPage,
        genres,
        title,
        sort,
        order,
      }),
    );
  };

  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sortType = sortTypes.find((obj) => obj.designation === params.sortBy);

      console.log('params:', params, 'sortType:', sortType);

      dispatch(
        setFilters({
          ...params,
          sortType,
        }),
      );

      isSearch.current = true;
    }
  }, []);

  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        currentPage,
        activeGenres,
        sortBy: sortType.designation,
        order: sortType.designation[0] === '-' ? 'desc' : 'asc',
      });

      navigate(`?${queryString}`);
    }

    isMounted.current = true;
  }, [currentPage, sortType, activeGenres]);

  React.useEffect(() => {
    if (!isSearch.current) {
      getGames();
    }

    isSearch.current = false;
  }, [currentPage, activeGenres, searchValue, activeSort]);

  const games = items.map((obj: any) => (
    <Link to={`/game/${obj.id}`} key={obj.id}>
      <GameBlock {...obj} />
    </Link>
  ));
  const skeletons = [...new Array(9)].map((_, i) => <Skeleton key={i} />);

  return (
    <>
      <div className="catalog">
        <div className="catalog__header">
          <h2 className="catalog__title">Super Nintendo Entertainment System</h2>
          <span className="catalog__count text__secondary">{items.length} games</span>
        </div>
        {status === 'error' && (
          <p className="text__main text__center wrapper_content">
            Games catalog could not be loaded. Please try again later.
          </p>
        )}
        {status !== 'error' && (
          <div className="catalog__main">
            <Filters value={activeGenres} onChangeFilters={onChangeFilters} />
            <div className="catalog__content">
              <Sort />
              <div className="catalog__items">{status === 'loading' ? skeletons : games}</div>
              <Pagination currentPage={currentPage} onChangePage={onChangePage} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
