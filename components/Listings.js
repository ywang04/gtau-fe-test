import { useEffect, useState } from 'react';

const ACTIONS = ['View', 'Reply'];

const formatAsCurrency = int =>
  int?.toLocaleString('en-AU', {
    currency: 'AUD',
  });

const isPriceTypeNumber = price => typeof price === 'number';

const Listing = ({ title, description, imgUrl, price, location }) => {
  return (
    <li className="listing">
      <div className="listing__header__container">
        <h3>{title}</h3>
        <div className="listing__price__location">
          {isPriceTypeNumber(price) ? (
            <strong>${formatAsCurrency(price)}</strong>
          ) : (
            <strong>{price}</strong>
          )}
          <span>{location}</span>
        </div>
      </div>
      {isPriceTypeNumber(price) && (
        <div className="listing__img__container">
          <img className="listing__img" src={imgUrl} />
        </div>
      )}
      <p className="listing__paragraph">{description}</p>
      <div>
        {ACTIONS.map(action => (
          <button
            key={action}
            className="listing__button"
            onClick={() => console.log(`${action}: ${title}`)}
          >
            {action}
          </button>
        ))}
      </div>
    </li>
  );
};

const renderListings = listings =>
  listings.map((item, index) => <Listing {...item} key={index} />);

const Listings = ({ dataEndpoint, keyword, location }) => {
  const [listings, setListings] = useState([]);

  const [numberOfResults, setNumberOfResults] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(dataEndpoint);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      setListings(data);
      setNumberOfResults(data?.length);
    } catch (error) {
      setErrorMessage('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (errorMessage) {
    return <h1>{errorMessage}</h1>;
  }

  if (isLoading) {
    return <h1>loading....</h1>;
  }

  return (
    <div className="listings__container">
      <div className="listings__header">
        <h2>Search Results</h2>
        <span className="listings_results">{`${numberOfResults}`} results</span>
        {' for '}
        <span className="listings_results">{`${keyword}`}</span>
        {' in '}
        <span className="listings_results">{`${location}`}</span>
      </div>
      <ul className="listings__grid">{renderListings(listings)}</ul>
    </div>
  );
};

export default Listings;
