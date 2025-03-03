import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../../ThemeContext';
import { CiSearch } from "react-icons/ci";
import { UsersActions } from '../store/SearchedUser';
import { useDispatch, useSelector } from 'react-redux';
import MoreSpinner from '../components/MoreSpinner';
import { gql, useQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const USER_FIND_QUERY = gql`
query FindByName($firstName: String!, $offset: Int, $limit: Int) {
    findByName(firstName: $firstName, offset: $offset, limit: $limit) {
      id
      firstName
      lastName
      picture
      email
      followers
    }
  }`;

export default function SearchProfile() {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [zoomedImage, setZoomedImage] = useState(null); // State for zoom modal

    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const limit = 4;
    const SearchedUsers = useSelector((store) => store.searchedusers);

    // Get the logged-in user ID from localStorage
    const loggedInUserId = localStorage.getItem('userId');

    // Create a ref for the input field
    const inputRef = useRef(null);

    useEffect(() => {
        // Automatically focus on the input field when the component is mounted
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const { loading, fetchMore, error } = useQuery(USER_FIND_QUERY, {
        variables: { firstName: searchTerm, offset: 0, limit },
        skip: !searchTerm.trim(), // Skip query if no search term
        notifyOnNetworkStatusChange: true,
        onCompleted: (fetchedData) => {
            dispatch(UsersActions.addUsers(fetchedData.findByName)); // Dispatch array of users
            if (fetchedData.findByName.length < limit) {
                setHasMore(false);
            }
        },
    });

    const debounceSearch = useCallback(
        debounce((value) => {
            dispatch(UsersActions.clearUsers()); // Clear previous users
            setSearchTerm(value); // Update search term
            setHasMore(true); // Reset pagination
        }, 1000),
        [dispatch]
    );

    const handleSearch = (e) => {
        debounceSearch(e.target.value);
    };

    const fetchMoreUsers = async () => {
        if (hasMore && !loadingMore) {
            setLoadingMore(true);
            try {
                const { data } = await fetchMore({
                    variables: {
                        offset: SearchedUsers.length,
                        limit,
                    },
                });

                if (data.findByName.length < limit) {
                    setHasMore(false);
                }
                dispatch(UsersActions.addUsers(data.findByName));
            } catch (error) {
                console.error("Error fetching more users:", error);
            } finally {
                setLoadingMore(false);
            }
        }
    };

    const filteredUsers = SearchedUsers.filter(user => user.id !== loggedInUserId);
    const handleImageClick = (picture) => {
        setZoomedImage(picture); // Set the image for zoom modal
    };

    const closeZoomModal = () => {
        setZoomedImage(null); // Close the zoom modal
    };
   // if (loading && SearchedUsers.length === 0) return <div style={{ marginBottom: "40px" }} className='d-flex justify-content-center mx-5 align-items-center'><MoreSpinner /></div>

    if (error) return <p className="text-center mt-4">An error occurred. Please try again later.</p>;



    const findProfile = (payload) => {
        const { username } = payload;
        navigate(`/${username}`);
    };

    return (
        <>
            <div className={`d-flex flex-column ${theme} main-post-res`}>
                <div className={`${theme} d-flex justify-content-center top-nav`} style={{ width: '95vw', height: "10vh" }}>
                    <h4 className={` ${theme} my-3`}>Search</h4>
                </div>

                <div className={` ${theme} d-flex justify-content-center search-bar-res`} style={{ height: "90vh", width: "95vw" }}>
                    <div className={`hrmargin ${theme} search-main-res `} style={{ width: "43vw", borderRadius: "20px", border: '2px solid rgb(47 46 46)' }}>

                        <div className='search-div'>
                            <span className='search-icon'><CiSearch size={25} /></span>
                            <input
                                ref={inputRef}
                                onChange={handleSearch}
                                placeholder="Search"
                                className={`${theme}-input bw-input-search bw-input-search-${theme}`}
                                type="text"
                                aria-label="Search for users"
                            />
                        </div>

                        {!searchTerm.trim() && filteredUsers.length === 0 ? (
                            <p className="text-center mt-4">Start typing to search for users...</p>
                        ) : (
                            <div id="scrollable-content-search">
                                {filteredUsers.length === 0 && !loading ? (
                                    <p className="text-center mt-4">User not found</p>
                                ) : (
                                    <InfiniteScroll
                                        dataLength={filteredUsers.length}
                                        next={fetchMoreUsers}
                                        hasMore={hasMore}
                                        loader={loading&&loadingMore && <MoreSpinner />}
                                        scrollableTarget="scrollable-content-search"
                                        endMessage={
                                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                                <b>No more results.</b>
                                            </div>
                                        }
                                    >
                                        {filteredUsers.map((user) => (
                                            <div className="container my-1 search-component" key={user.id}>
                                                {loading ? <LoadingSpinner /> : <div
                                                    style={{
                                                        border: "2px solid white",
                                                        borderRadius: "25px",
                                                        height: "97px",
                                                        width: "845px",
                                                    }}
                                                    className="d-flex justify-content-between align-items-center px-3 my-3 search-result"
                                                >
                                                    {/* Profile Picture with Zoom */}
                                                    <img
                                                        className="post-Profile-img"
                                                        src={user.picture || "default.jpg"}
                                                        alt="profile pic"
                                                        style={{
                                                            width: "50px",
                                                            height: "50px",
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => handleImageClick(user.picture)}
                                                    />

                                                    {/* Name */}
                                                    <strong className='name-res' style={{ flex: "1", textAlign: "center" }}>
                                                        {user.firstName}
                                                    </strong>

                                                    {/* Full Name */}
                                                    <small
                                                        style={{
                                                            flex: "2",
                                                            textAlign: "center",
                                                            overflowWrap: "break-word",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                        className='text-secondary'
                                                    >
                                                        {user.firstName} {user.lastName}
                                                    </small>

                                                    {/* Followers */}
                                                    <strong className='follower-search-res' style={{ flex: "1", textAlign: "center", cursor: "pointer" }}>
                                                        Followers {user.followers}
                                                    </strong>

                                                    {/* Visit Profile Button */}
                                                    <button
                                                        onClick={() =>
                                                            findProfile({
                                                                username: `${user.id}@${user.firstName}${user.lastName}` || "unknown",
                                                            })
                                                        }
                                                        className="visit-profile-btn"
                                                        style={{
                                                            flex: "1",
                                                            textAlign: "center",
                                                            padding: "5px 10px",
                                                            borderRadius: "10px",
                                                        }}
                                                    >
                                                        Profile
                                                    </button>
                                                </div>}
                                            </div>
                                        ))}
                                    </InfiniteScroll>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Zoom Modal */}
            {zoomedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                    onClick={closeZoomModal}
                >
                    <img
                        src={zoomedImage}
                        alt="Zoomed"
                        style={{
                            maxHeight: '80%',
                            maxWidth: '80%',
                            objectFit: 'contain',
                            borderRadius: '10px',
                        }}
                    />
                </div>
            )}
        </>
    );
}
