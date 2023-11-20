import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../../util/https';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';

export default function FindEventSection() {
  const searchElement = useRef();
  const [serachTerm, setSearchTerm] = useState();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events', { search: serachTerm }],
    queryFn: ({ signal }) => fetchEvents({ signal, serachTerm }),
    enabled: serachTerm !== undefined
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and find events.</p>;
  if (isLoading) {
    content = <LoadingIndicator />
  }

  if (isError) {
    content = <ErrorBlock title="An error occured" message={error.info?.message || 'Could not fetch events'} />
  }

  if (data) {
    content = <ul className='events-list'>
      {data.map(event => <li key={event.id}><EventItem event={event} /></li>)}
    </ul>
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
