import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { VisitedUserfollowingAction } from '../../store/VisitedUserFollowing';

export default function useFetchMoreFollowings(fetchMore2, limit) {
    const [hasMore2, setHasMore2] = useState(true);
    const [loadingMore2, setLoadingMore2] = useState(false);
    const dispatch = useDispatch();
    const followingList = useSelector((store) => store.VisitedUserfollowing);

    const fetchMoreFollowings = useCallback( () => {
        if (hasMore2 && !loadingMore2) {
            setLoadingMore2(true);
            fetchMore2({
                variables: {
                  offset: followingList.length,
                  limit,
                },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (fetchMoreResult.getUserFollowing.length === 0) {
                      setHasMore2(false);
                      setLoadingMore2(false);
                      return prevResult;
                    }
                    dispatch(VisitedUserfollowingAction.addVisitedUserFollowing(fetchMoreResult.getUserFollowing));
                    setLoadingMore2(false);
                
                    return {
                        ...prevResult,
                        getUserFollowing: [
                          ...prevResult.getUserFollowing,
                          ...fetchMoreResult.getUserFollowing,
                        ],
                      };
                    }
                });
            }
    }, [hasMore2, loadingMore2, fetchMore2, followingList.length, limit, dispatch]);

    return { fetchMoreFollowings, hasMore2, loadingMore2, setHasMore2 };
}
