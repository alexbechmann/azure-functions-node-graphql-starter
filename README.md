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

  getTestValue
}
```

## Sample mutation

Paste this into query on GraphiQL dashboard.

```
mutation {
  updateTestValue(newValue: "new value")
}
```

Re-run first sample query and see updated value for "getTestValue"

## Create function
```
npm run function:new
```