import { useSubscription, gql } from '@apollo/client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// GraphQL subscription
const ACTIVE_STATUS_UPDATED_SUBSCRIPTION = gql`
  subscription ActiveStatusUpdated {
    activeStatusUpdated {
      userId
      isActive
      lastActive
    }
  }
`;

function GlobalActiveStatusListener() {
  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);

  const { data, loading, error } = useSubscription(ACTIVE_STATUS_UPDATED_SUBSCRIPTION,{ skip: !isLoggedIn })
  if (loading) return null; // Optionally show a loading indicator
  if (error) console.error('Active status subscription error:', error);

  return null; // This component only listens for updates
}

export default GlobalActiveStatusListener;
