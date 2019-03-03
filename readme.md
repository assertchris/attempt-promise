# attempt-promise

[![support](https://enjoy.gitstore.app/repositories/badge-assertchris/attempt-promise.svg)](https://enjoy.gitstore.app/repositories/assertchris/attempt-promise)

`async` and `await` are great! SO much better than callbacks all over the place, and helpful for showing that functions are asynchronous, without having to read the function.

What's not so great is having to wrap calls to `async` functions in a try-catch.

Maybe this code looks like something in your application:

```js
const id = session.get("id");

let user = undefined;
let products = undefined;

try {
  user = await User.find(id);

  try {
    products = await Product.where("user_id", user.id)
      .orderBy("updated_at", "desc")
      .limit(50)
      .fetch();
  } catch (e) {
    response.error("Oops! Missing products...");
    return;
  }
} catch (e) {
  response.error("Oops! No user...");
  return;
}

response.ok("here are your products...", products);
```

This is ok, but there are a couple things I don't like about it:

1. I have to pre-define variables, or they're hidden in the scope of the try-catches
2. The error handling, for the missing user, is far away from the attempt to fetch the user
3. There are multiple levels of nesting, for what is supposed to be a linear process

I feel like the gains of being able to avoid promise callbacks are lost by having to wrap everything in a try-catch. I was inspired by some syntax from Go:

```go
user, err := User.find(id)

if err != nil {
    log.Fatal(err)
}

// do something with user
```

So, I implemented something similar, here. Check out how the first example changes, given this new syntax:

```js
const attempt = require("@assertchris/attempt-promise");

const id = session.get("id");

const [err1, user] = await attempt(User.find(id));

if (err1) {
  response.error("Oops! No user...");
  return;
}

const [err2, products] = await attempt(
  Product.where("user_id", user.id)
    .orderBy("updated_at", "desc")
    .limit(50)
    .fetch()
);

if (err2) {
  response.error("Oops! Missing products...");
  return;
}

response.ok("here are your products...", products);
```

We also got `attempt.all`, an alternative to `Promise.allSettled`:

```js
const attempt = require("@assertchris/attempt-promise");

const id = session.get("id");

const [errs, [user, products]] = await attempt.all([
  User.find(id),
  Product.where("user_id", user.id)
    .orderBy("updated_at", "desc")
    .limit(50)
    .fetch()
]);

if (!errs) {
  response.ok("here are your products...", products);
} else {
  const [err1, err2] = errs;
  if (err1) {
    response.error("Oops! No user...");
  }
  if (err2) {
    response.error("Oops! Missing products...");
  }
}
```



## Installing

Use one of these to install:

```
npm install @assertchris/attempt-promise
yarn add @assertchris/attempt-promise
```
