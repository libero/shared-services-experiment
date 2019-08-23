const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const rest = require('./rest');

const apollo = new ApolloServer({ typeDefs, resolvers });

const db = require('./database');

const app = express();

app.use((req, _, next) => {
  console.log(req.method, req.path);

  next();
});
apollo.applyMiddleware({app});

const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('/ root'))

app.post('/graphql', () => res.send("gql"))

app.use('/rest', rest);

app.listen(port, () => console.log('App started'))
