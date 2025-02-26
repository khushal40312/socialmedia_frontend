import { useQuery, gql } from '@apollo/client';
export const USER_POSTS = gql`query GetAllUserPost {
    getAllUserPost{
      id
      title
      content
      createdAt
      updatedAt
      authorId
      likes
      author {
        firstName
        lastName
        id
        picture   
      }
      likedBy {
        firstName
        lastName
        id
    
      }
    }
  }`
const USER_QUERY = gql`
    query GetCurrentLoggedInUser {
        getCurrentLoggedInUser {
            firstName
            lastName
            email
            picture
            id
            followers
            following
        }
    }
`;

export function useUserQuery() {
    const { data, loading, error } = useQuery(USER_QUERY);
    return { data, loading, error };
}
