import { Link, Outlet, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEvent } from '../../util/https.js';

import Header from '../Header.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {
  const params = useParams();
  const id = params.id;
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  });

  let content;
  if (isPending) {
    content = (
      <div id='event-detail-content' className='center'>
        <p>Fetching event data...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div id='event-detail-content' className='center'>
        <ErrorBlock title="An error occurred while fetching event" message={error.info?.message || 'Could not fetch event.'} />
      </div>
    );
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    content = (
      <article id="event-details">
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt="" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{formattedDate} @ {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {content}
    </>
  );
}
