const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');

// const directorsJson = [
//   { "name": "Quentin Tarantino", "age": 55 },//5f45e0f53ca1fb0e4c5f60b2
//   { "name": "Michael Radford", "age": 72 },//5f45e3a73ca1fb0e4c641e85
//   { "name": "James McTeigue", "age": 51 },//5f45e3d13ca1fb0e4c64708e
//   { "name": "Guy Ritchie", "age": 50 },//5f45e3e43ca1fb0e4c64874a
// ];
//
// const moviesJson = [
//   { "name":"Pulp Fiction", "genre":"Crime", "directorId":"5f45e0f53ca1fb0e4c5f60b2" },
//   { "name":"1984", "genre":"Sci-fi", "directorId":"5f45e3a73ca1fb0e4c641e85" },
//   { "name":"V for vendetta", "genre":"Sci-Fi-Triller", "directorId":"5f45e3d13ca1fb0e4c64708e" },
//   { "name":"Snatch", "genre":"Crime-Comedy", "directorId":"5f45e3e43ca1fb0e4c64874a" },
//   { "name":"Reservoir Dogs", "genre":"Crime", "directorId":"5f45e0f53ca1fb0e4c5f60b2" },
//   { "name":"The Hateful Eight", "genre":"Crime", "directorId":"5f45e0f53ca1fb0e4c5f60b2" },
//   { "name":"Inglorious Basterds", "genre":"Crime", "directorId":"5f45e0f53ca1fb0e4c5f60b2" },
//   { "name":"Lock, Stock and Two Smoking Barrels", "genre":"Crime-Comedy", "directorId":"5f45e3 e43ca1fb0e4c64874a" },
// ];
//
//


//db
// const movies = [
//   { id: 1, name: 'Pulp Fiction', genre: 'Crime', directorId: 1 },
//   { id: 2, name: '1984', genre: 'Sci-fi', directorId: 2 },
//   { id: 3, name: 'V for vendetta', genre: 'Sci-Fi-Triller', directorId: 3 },
//   { id: 4, name: 'Snatch', genre: 'Crime-Comedy', directorId: 4 },
//   { id: 5, name: 'Reservoir Dogs', genre: 'Crime', directorId: 1 },
//   { id: 6, name: 'The Hateful Eight', genre: 'Crime', directorId: 1 },
//   { id: 7, name: 'Inglorious Basterds', genre: 'Crime', directorId: 1 },
//   { id: 8, name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime-Comedy', directorId: 4 },
// ];
//
// //db
// const directors = [
//   { id: 1, name: 'Quentin Tarantino', age: 55 },
//   { id: 2, name: 'Michael Radford', age: 72 },
//   { id: 3, name: 'James McTeigue', age: 51 },
//   { id: 4, name: 'Guy Ritchie', age: 50 },
// ];

//type for db
const DirectorType = new GraphQLObjectType({
  name: 'director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args){
        // return movies.filter(movie => movie.directorId == parent.id);
        return Movies.find({ directorId: parent.id });
      },
    },
  }),
});

//type for db and connecting movie with director
const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    director: {
      type: DirectorType,
      resolve(parent, args){
        // return directors.find(director => director.id == parent.id);
        return Directors.findById(parent.directorId);
      }
    }
  }),
});


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return movies.find(movie => movie.id == args.id);
        return Movies.findById(args.id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args){
        // return directors.find(director => director.id == args.id);
        return Directors.findById(args.id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies;
        return Movies.find({});
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        // return directors;
        return Directors.find({});
      }
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args){
        const director = new Directors({
          name: args.name ,
          age: args. age,
        });
        return director.save();
      },
    },

    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId ,
        });
        return movie.save();
      } ,
    },
    deleteDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args)  {
        return Directors.findByIdAndRemove(args.id);
      }
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args)  {
        return Movies.findByIdAndRemove(args.id);
      }
    },

    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return Directors.findByIdAndUpdate (
          args.id,
          { $set: { name: args.name, age: args.age } },
          { new: true },
        );
      },
    },

    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
      },
      resolve(parent, args){
        return Movies.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, age: args.age } },
          { new: true },
        );
      },
    },

    }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
