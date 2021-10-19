import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import getParam from './utilities/getParam';

import SearchForm from './SearchForm';
import GifList from './GifList';

const App = () => {
  const initialSearch = 'dog';
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const performSearch = (value) => {
    setQuery(value);
    const newPath = `?search=${value}`;
    return history.push(newPath);
  };

  useEffect(() => {
    axios(
      `http://api.giphy.com/v1/gifs/search?q=${
        query || initialSearch
      }&limit=24&offset=24&api_key=dc6zaTOxFJmzC`
    )
      .then((response) => {
        setData(response.data.data);
        setPagination(response.data.pagination);
        console.log(response.data.pagination);
      })
      .catch((error) => console.log('Error fetching and parsing data', error))
      .finally(() => setIsLoading(false));
  }, [query]);

  useEffect(() => {
    const locationParam = getParam('search', location.search);
    if (locationParam !== query) {
      setQuery(locationParam);
    }
  }, [location, query]);

  return (
    <>
      <header className='main-header'>
        <div className='inner'>
          <SearchForm onSearch={performSearch} />
        </div>
      </header>
      <div className='main-content'>
        {isLoading ? <p>Loading...</p> : <GifList data={data} />}
      </div>
    </>
  );
};

export default App;
