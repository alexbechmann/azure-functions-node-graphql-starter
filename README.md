# azure-functions-node-graphql-starter

## Run locally

```
npm install
npm start
```

GraphiQL dashboard: <http://localhost:7072/api/gql>

## Sample query
Paste this into query on GraphiQL dashboard.

```graphql
{
  hello

  getCurrentUser {
    name
    dateOfBirth
    upperCaseName
  }
}
```

## Create function
```
npm run function:new
```