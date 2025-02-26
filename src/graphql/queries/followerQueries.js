import { gql } from '@apollo/client';

export const USER_FOLLOWERS = gql`
  query GetUserFollowers($userId: String!, $offset: Int, $limit: Int) {
    getUserFollowers(userId: $userId, offset: $offset, limit: $limit) {
      firstName
      lastName
      email
      picture
      followers
      id
    }
  }
`;

export const USER_FOLLOWING = gql`
  query GetUserFollowing($userId: String!, $offset: Int, $limit: Int) {
    getUserFollowing(userId: $userId, offset: $offset, limit: $limit) {
    id
      firstName
      lastName
      email
      picture
      followers
    }
  }
`;
