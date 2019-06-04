import { createHandler } from 'azure-function-express';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { getGraphQLQueryArgs, getMongoDbQueryResolver, getMongoDbFilter } from 'graphql-to-mongodb';

interface User {
  name: string;
}

interface Context {
  currentUser: User;
}

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    name: { type: GraphQLString },
    upperCaseName: {
      type: GraphQLString,
      resolve: source => source.name.toUpperCase()
    }
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
    },
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: getGraphQLQueryArgs(UserType),
      resolve: getMongoDbQueryResolver(UserType, async (filter, projection, options, obj, args) => {
        console.log({ filter, options });
        // return mongooseModel
        // .findOne(filter})
        // .sort(options.sort)
        // .limit(options.limit || defaultLimit)
        // .skip(options.skip);
        const users: User[] = [
          {
            name: 'User1'
          },
          {
            name: 'User2'
          }
        ];
        return users;
      })
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
