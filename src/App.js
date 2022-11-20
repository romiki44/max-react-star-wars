import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // then()-catch() promise
  // function fetchMoviesHandler() {
  //   fetch('https://swapi.dev/api/films')
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log(data.results);
  //       const transformedMovies = data.results.map((result) => {
  //         return {
  //           id: result.episode_id,
  //           title: result.title,
  //           openingText: result.opening_crawl,
  //           releaseDate: result.release_date,
  //         };
  //       });
  //       setMovies(transformedMovies);
  //     });
  // }

  //async-await
  //povodne bolo bez useCallback, ale vraj fetchMoviesHandler treb pridat do dendencies pre useEffect()
  //ak by sa priadala, tak pri kazsom renderovani by sa vytvorila nova instancia/objekt tejto funkcie
  //a tym padom sa znovu z znovu volalo api....preto useCallback(), aby sa vytvorila memoizovana verzia funkcie
  //to jest nevytvara sa znova a znova, ale sa raz zapamata potom sa uz len vola....
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      //console.log('loading start');
      const response = await fetch('https://swapi.dev/api/films');
      //console.log('loading finshed');

      //javascriptovy fetch() nehodi chybu pri 404, 401 a pod...tusim len pri 500
      //da sa to potom osetrit takto cez response.ok (ak status kod=2**), alebo priamo cez response.status
      //druha moznost je pouzit axios
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      const transformedMovies = data.results.map((result) => {
        return {
          id: result.episode_id,
          title: result.title,
          openingText: result.opening_crawl,
          releaseDate: result.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  //musi byt tu, lebo inac sa javascript stazuje, ze fetchMoviesHandler je volany skor nez je inicializovany
  //vraj pri arrow funkcia neplati hoisting...cize keby to bola kalsicka funkcia na poradi by asi nezalezalo...
  //INAC NECHAPEM PRECO JE DENDENCY FUNKCIA??? PRECO NEMOZE BYT PRAZDNE POLE???
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {isLoading && <p>Loading movies...</p>}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
