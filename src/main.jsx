import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './responsive.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { ApolloProvider, ApolloClient, InMemoryCache, split } from '@apollo/client';
import { createHttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Provider } from 'react-redux';
import threadStore from './store/index.js';

// HTTP Link for queries and mutations
const httpLink = createHttpLink({
  uri: 'https://socialmedia-realtime-backend.onrender.com/graphql',
});

// Authentication context link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      token: token || '',
    },
  };
});

// WebSocket Link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://socialmedia-realtime-backend.onrender.com/graphql',
    connectionParams: () => {
      const token = localStorage.getItem("token");
      return { token: token || '' };
    },
  })
);

// Combine HTTP and WebSocket links
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // Use WebSocket link for subscriptions
  authLink.concat(httpLink) // Use HTTP link for queries and mutations
);

// Create Apollo Client instance
const client = new ApolloClient({
  link, // Combined link
  cache: new InMemoryCache(),
});

// Lazy load components
const App = lazy(() => import('./routes/App.jsx'));
const Home = lazy(() => import('./routes/Home.jsx'));
const Login = lazy(() => import('./routes/Login.jsx'));
const Profile = lazy(() => import('./routes/Profile.jsx'));
const ProfileReplies = lazy(() => import('./routes/ProfileReplies.jsx'));
const ProfileThreads = lazy(() => import('./routes/ProfileThreads.jsx'));
const ProfileReposts = lazy(() => import('./routes/ProfileReposts.jsx'));
const NotificationPanel = lazy(() => import('./routes/LikedByNotifications.jsx'));
const VisitProfile = lazy(() => import('./routes/VisitProfile.jsx'));
const SearchProfile = lazy(() => import('./routes/SearchProfile.jsx'));
const VisitProfileThread = lazy(() => import('./routes/VisitProfileThread.jsx'));
const VisitProfileReplies = lazy(() => import('./routes/VisitProfileReplies.jsx'));
const VisitProfileReposts = lazy(() => import('./routes/VisitProfileReposts.jsx'));
const Inbox = lazy(() => import('./routes/Inbox.jsx'));
const Chat = lazy(() => import('./routes/Chat.jsx'));


// Router configuration
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: '/login',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: '/notification',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <NotificationPanel />
            </Suspense>
          ),
        },
        {
          path: '/search',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <SearchProfile />
            </Suspense>
          ),
        },
        {
          path: '/profile/*', // Explicitly mark as splat route
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Profile />
            </Suspense>
          ),
          children: [
            {
              path: 'replies',
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfileReplies />
                </Suspense>
              ),
            },
            {
              path: 'threads',
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfileThreads />
                </Suspense>
              ),
            },
            {
              path: 'reposts',
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfileReposts />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: '/:username/*', // Explicitly mark as splat route
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <VisitProfile />
            </Suspense>
          ),
          children: [
            {
              path: 'replies',
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <VisitProfileReplies />
                </Suspense>
              ),
            },
            {
              path: 'threads',
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <VisitProfileThread />
                </Suspense>
              ),
            },
            {
              path: 'reposts',
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <VisitProfileReposts />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: '/inbox/*', // Explicitly mark as splat route
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Inbox />
            </Suspense>
          ),
          children: [
            {
              path: ':username',
              element: (
                <Suspense fallback={<LoadingSpinner />}>
                  <Chat />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // ✅ Fixes first warning
      v7_startTransition: true,   // ✅ Fixes second warning
    },
  }
);


// Render the application
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={threadStore}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
);
export default client;
