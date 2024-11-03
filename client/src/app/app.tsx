import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { User } from '@acme/shared-models';
import styles from './app.module.css';
import Tickets from './tickets/tickets';
import { getAllUsersApi } from './apis/user';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { getUsers, setUsers } from './reducers/userSlice';
import { useAppSelector } from './stores/hooks';
import TicketDetails from './ticket-details/ticket-details';

/**
 * Main application component that sets up routes and fetches user data on initial load.
 *
 * @component
 * @returns {JSX.Element} The root component of the application.
 */
const App = () => {
  // Dispatch function for interacting with the Redux store.
  const dispatch = useDispatch();

  // Selector to retrieve user data from the Redux store.
  const users = useAppSelector(getUsers);

  // Message API for displaying notifications within the component.
  const [_, contextHolder] = message.useMessage();

  /**
   * Fetches user data from the API and updates the Redux store if the request is successful.
   * Displays an error message if the request fails.
   */
  useEffect(() => {
    async function fetchUsers() {
      const data = await getAllUsersApi();
      if (!data.success) {
        // Display an error message if fetching users fails.
        message.error(data.message);
        return;
      }
      // Update users in the Redux store if data retrieval is successful.
      dispatch(setUsers(data.data as User[]));
    }

    // Only fetch users if they are not already loaded in the store.
    if (users === undefined) {
      fetchUsers();
    }
  }, [users]);

  return (
    <div className={styles['app']}>
      <h1>Ticketing App</h1>
      {contextHolder}
      <Routes>
        {/* Route for the main ticket listing page */}
        <Route path="/" element={<Tickets />} />
        {/* Route for the ticket details page with dynamic ticket ID */}
        <Route path="/:id" element={<TicketDetails />} />
      </Routes>
    </div>
  );
};

export default App;
