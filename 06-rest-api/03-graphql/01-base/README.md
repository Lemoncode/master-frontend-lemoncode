# 01 Base

In this example we are going to learn GraphQL base concepts.

# Steps to build it

- This is the [official documentation page](https://graphql.org/learn/), but now we are going to use an editor tool called **GraphiQL**

- We can play with online tool at [Github GraphQL Server](https://developer.github.com/v4/explorer/)

# Base concepts

## 1. Playing with tool:

- Click on `Docs` to open right panel.

- Type the following query and click on play button:

```graphql
query {
  viewer {
    login
  }
}
```

- It returns a some data. Let's add more fields to it:

```diff
query {
  viewer {
    login
+   company
+   avatarUrl
  }
}
```

- We can fetch resources by some parameters:

```diff
query {
  viewer {
    login
    company
    avatarUrl
  }

+ repository(name:"react", owner: "facebook") {
+   name
+   description
+ }
}
```

> Notice that we are using only one query to retrieve two different resources.
>
> If you want split them in two queries:
> 
> ```
> query QueryA {
>   viewer {
>     login
>     company
>     avatarUrl
>   }
> }
> 
> query QueryB {
>   repository(name:"react", owner: "facebook") {
>     name
>     description
>   }
> }
> 
> ```

- As we known, `name` and `owner` are required fields. We can check `Docs` section on right side to provide necessary input fields, returned types, etc.

- We can fetch array's fields as we did with object's fields:

```diff
query {
  viewer {
    login
    company
    avatarUrl
  }
  
  repository(name:"react", owner: "facebook") {
    name
    description
+   contactLinks {
+     name
+     url
+   }
  }
}
```

## 2. Fields and Types.

- [Scalar Types](https://graphql.org/learn/schema/#scalar-types)

- [Enumeration Types](https://graphql.org/learn/schema/#enumeration-types)

- [List](https://graphql.org/learn/schema/#lists-and-non-null)

- [Object Types](https://graphql.org/learn/schema/#object-types-and-fields)

Summary:

- With this tool, we can see how the `GraphQL Schema` is defined.

- When we execute the query, there are some functions called `resolvers` which it retrieves data from database and send results to the client side.

- These `resolvers` are the API endpoint functions executed in `REST API`.

- The Graphql `fields` (blue color) could be an `scalar type` like String, Int, etc, custom type like `User` or an array of them, i.e. `[RepositoryContactLink!]`

- It has optional or required fields (using `!`). For example, `name` returns an optional `String`:

```diff
query {
  viewer {
    login
+   name
    company
    avatarUrl
  }
...

```

## 3. Variables

- Let's create a variable:

```json
{
  "repositoryName": "react",
  "repositoryOwner": "facebook"
}
```


- And use it:

```diff
- query {
+ query($repositoryName: String!, $repositoryOwner: String!) {
  viewer {
    login
    name
    company
    avatarUrl
  }
  
- repository(name:"react", owner: "facebook") {
+ repository(name: $repositoryName, owner: $repositoryOwner) {
    name
    description
    contactLinks {
      name
      url
    }
  }
}

```

> If you want create a `custom` variable type, you have to use [input](https://graphql.org/learn/schema/#input-types) type in server schema definition.

For example:

```
input RepositoryInput {
  name: String!
  owner: String!
}

type Query {
  repository: (repositoryInput: RepositoryInput!)
}
```

## 4. Mutations

- Let's fetch a repository to update information:

```diff
+ query {
+   repository(name: "graphql-playground-example", owner:"lemoncode") {
+     id
+     name
+     description
+   }
+ }

```

> [Repository](https://github.com/Lemoncode/graphql-playground-example)

- If we want to update the description, we have to use a mutation:

```diff
- query {
+ query QueryA {
  repository(name: "graphql-playground-example", owner:"lemoncode") {
    id
    name
    description
  }
}

+ mutation MutationA {
+   updateRepository(input: {
+     repositoryId: "<repository-id>"
+     description: "Updated This is a repository for play with Graphql Playground: https://developer.github.com/v4/explorer/"
+   }) {
+     repository {
+       name
+       description
+     }
+   }
+ }

```

- This is a good example to use variables:

```diff
...
- mutation MutationA {
+ mutation MutationA($repositoryInput: UpdateRepositoryInput!) {
-   updateRepository(input: {
-     repositoryId: "<repository-id>"
-     description: "Updated This is a repository for play with Graphql Playground: https://developer.github.com/v4/explorer/"
-   }) {
+   updateRepository(input: $repositoryInput) {
    repository {
      name
      description
    }
  }
}
```

```json
{
  "repositoryInput": {
    "repositoryId": "<repository-id>",
    "description": "This is a repository for play with Graphql Playground: https://developer.github.com/v4/explorer/"
  }
}
```


# Advance Concepts

## 1. Aliases.

Sometimes the _data_ exposed by the server might have different property names from what the UI is using.

For example, let's assume our UI uses a variable called _githubId_ instead of just _Id_. Now we would have a mismatch between the server response, which has "id" as the key to this value, and the UI component, which expects the property to be "githubId". This usually means that we would need to process the server response on the client to make it match what the UI is using.

GraphQL _aliases_ can help us avoid this extra processing. We can simply use an alias name in the query to rename the key used in the server response. _githubId_ is _id_, and when we execute that, the response will be just ready for the UI. No further processing needed.

We can use aliases on any field to customize its appearance in the response.

```grapqhl
query {
  viewer {
    id
    login
    name
    company
    avatarUrl
  }
}

```

```diff
query {
- viewer {
+ user: viewer {
-   id
+   githubId: id
    login
    name
    company
    avatarUrl
  }
}
```

> NOTE: We can also use aliases to ask for the same field more than once.

```diff
query {
  user: viewer {
    githubId: id
    login
    name
    company
    avatarUrl
  }
+ facebookRepo:repository(name: "react", owner: "facebook") {
+   name
+   description
+ }
+ lemoncodeRepo:repository(name: "fonk", owner: "lemoncode") {
+   name
+   description
+ }
}

```

## 2. Directives

Sometimes using just the field arguments to customize the behavior of the GraphQL server execution engine will not be enough. For example, what if we have an special variable in our application, call it _includeRepos_, and we want to customize the GraphQL server response to only include the repo list when this variable is set to _true_, and completely omit the repos list from the response when the _includeRepos_ variable is set to _false_.

The best way to do this in GraphQL is with a _directive_. Directives can be used to alter the GraphQL _runtime_ execution, and they are commonly used with variables to customize the reponse based on the variables values.

- built-in directives -> _skip_, _include_, both can be used on fields and fragments.

```diff
- query {
+ query($includeRepo:Boolean!) {
    viewer {
      login
      name
      company
      avatarUrl
    }
-   repository(name: "react", owner: "facebook") {
+   repository(name: "react", owner: "facebook") @include(if: $includeRepo)  {
      name
      description
    }
  }

```


```json
{
  "includeRepo": true
}
```

## 3. Fragments

_Fragments_ are what make GraphQL _composable_.

In the next example, we repeated the _repository_ information fields:

```graphql
query {
  repoA:repository(name: "react", owner: "facebook")  {
    name
    description
  }
  
  repoB:repository(name: "fonk", owner: "lemoncode")  {
    name
    description
  }
}

```

If we later decide to ask for an extra field on every _repository_ object, we'll have to change two places in our query, which is not ideal. We can use _GraphQL fragments_:

```diff
query {
  repoA:repository(name: "react", owner: "facebook")  {
-   name
-   description
+   ...RepositoryInfo
  }
  
  repoB:repository(name: "fonk", owner: "lemoncode")  {
-   name
-   description
+   ...RepositoryInfo
  }
}

+ fragment RepositoryInfo on Repository {
+   id
+   name
+   description
+ }
```

> NOTE: The content of the fragment has to fit in the place where it's used.
