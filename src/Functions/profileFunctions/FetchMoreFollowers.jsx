import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserFollowerAction } from '../../store/UserFollower';

export default function useFetchMoreFollowers(fetchMore, limit) {
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const dispatch = useDispatch();
    const followerList = useSelector((store) => store.userfollowers);

    const fetchMoreFollowers = useCallback( () => {
        if (hasMore && !loadingMore) {
            setLoadingMore(true);
            fetchMore({
                variables: {
                  offset: followerList.length,
                  limit,
                },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (fetchMoreResult.getUserFollowers.length === 0) {
                      setHasMore(false);
                      setLoadingMore(false);
                      return prevResult;
                    }
                    console.log(fetchMoreResult.getUserFollowers)
                    dispatch(UserFollowerAction.addUserFollower(fetchMoreResult.getUserFollowers));
                    setLoadingMore(false);
                
                    return {
                        ...prevResult,
                        getUserFollowers: [
                          ...prevResult.getUserFollowers,
                          ...fetchMoreResult.getUserFollowers,
                        ],
                      };
                    }
                });
        }
    }, [hasMore, loadingMore, fetchMore, followerList.length, limit, dispatch]);

    return { fetchMoreFollowers, hasMore, loadingMore, setHasMore };
}
