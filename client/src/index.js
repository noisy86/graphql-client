// import React from "react";
// import { render } from "react-dom";
//
// import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { gql } from '@apollo/client';
//
// const client = new ApolloClient({
//   uri: 'http://localhost:3005/graphql?',
//   cache: new InMemoryCache()
// })
//
//
// client
//   .query({
//     query: gql`
//       query GetRates {
//         directors{
//           name
//           age
//         }
//       }
//     `
//   })
//   .then(result => console.log(result));
import { gql } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
const client = new ApolloClient({
  uri: 'http://localhost:3005/graphql',
  cache: new InMemoryCache()
})

client
  .query({
    query: gql`
      query moviesQuery {
        movies {
          name
        }
      }
    `
  })
  .then(result => console.log(result));
