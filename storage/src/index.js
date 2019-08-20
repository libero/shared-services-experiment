const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const apollo = new ApolloServer({ typeDefs, resolvers });

const db = require('./database');

const app = express();
apollo.applyMiddleware({app});

const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('/ root'))

app.post('/graphql', () => res.send("gql"))


app.listen(port, () => console.log('App started'))
