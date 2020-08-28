const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3005;

mongoose.connect ('mongodb+srv://noisy86:13ad13ad@graphqldatabase.urqm5.mongodb.net/QLDB?retryWrites=true&w=majority', { useNewUrlParser: true });

app.use(cors());

//integrate graphql on start server
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));



const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to db'));

app.listen(PORT, err => {
  err ? console.log(error) : console.log('Server started');
});
