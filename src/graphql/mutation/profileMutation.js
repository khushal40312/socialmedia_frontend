import {  gql } from '@apollo/client';

export const UPDATE_PROFILE = gql`
mutation UpdateProfile($firstName: String!, $lastName: String!) {
updateProfile(firstName: $firstName, lastName: $lastName) {
         firstName
         lastName
         picture
     }
 }
 `;