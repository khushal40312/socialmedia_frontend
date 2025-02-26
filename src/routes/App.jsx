import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { gql, useQuery } from "@apollo/client";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "../../ThemeContext";
import { InboxFollowersAction } from "../store/Inboxfollower";
// import { useApolloClient } from "@apollo/client";
import GlobalActiveStatusListener from "../Functions/activeNowFUnction./GlobalActiveStatusListener";


const USER_QUERY = gql`
  query GetCurrentLoggedInUser {
    getCurrentLoggedInUser {
      id
    }
  }
`;

const USER_FOLLOWERS = gql`
  query GetUserFollowers($userId: String!) {
    getUserFollowers(userId: $userId) {
      firstName
      lastName
      email
      picture
      followers
      id
    }
  }
`;

function App() {
  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { data, loading, error } = useQuery(USER_QUERY, { skip: !isLoggedIn });
  // const client = useApolloClient();

  const userInfo = localStorage.getItem("userId");
  const { loading4, fetchMore, error4 } = useQuery(USER_FOLLOWERS, {
    skip: !userInfo,
    variables: { userId: userInfo },
    notifyOnNetworkStatusChange: true,
    onCompleted: (fetchedData) => {
      dispatch(InboxFollowersAction.addFollowerInbox(fetchedData.getUserFollowers));
    }
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (data?.getCurrentLoggedInUser) {
      localStorage.setItem("userId", data.getCurrentLoggedInUser.id);
    }
  }, [data]);

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.title = 'Home - Thread';
        break;
      case '/login':
        document.title = 'Login - Thread';
        break;
      case '/profile':
        document.title = 'Profile - Thread';
        break;
      case '/addpost':
        document.title = 'Add Post - Thread';
        break;
      default:
        document.title = 'Thread';
    }
  }, [location.pathname]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <ThemeProvider>
        <div style={{ width: "98vw",height:"100vh" }} className="d-flex main-div">
          <Toaster />
          <GlobalActiveStatusListener /> {/* Global listener for active status */}
          <Navbar />
          <Outlet />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
