import { createHandler } from 'azure-function-express';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

interface User {
  name: string;
}

interface Context {
  currentUser: { name: string };
}

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    name: { type: GraphQLString }
  })
});

let TEST_VALUE = 'original value';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: GraphQLString,
      resolve: () => 'hello graphql consumer'
    },
    getTestValue: {
      type: GraphQLString,
      resolve: () => TEST_VALUE
    },
    getCurrentUser: {
      type: UserType,
      resolve: (source, args, context: Context) => context.currentUser
    }
  })
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    updateTestValue: {
      type: GraphQLString,
      args: {
        newValue: { type: GraphQLString }
      },
      resolve: (source, args, context) => {
        TEST_VALUE = args.newValue;
        return TEST_VALUE;
      }
    }
  })
});

const schema = new GraphQLSchema({
  query,
  mutation
});

const app = express();

app.use(
  graphqlHTTP((req, res) => {
    const context: Context = {
      currentUser: {
        name: 'User1' // can access req and extract token
      }
    };
    return {
      schema,
      graphiql: true,
      context
    };
  })
);

export default createHandler(app);
