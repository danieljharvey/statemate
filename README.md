# Statemate

## What?
The idea of this library is to reduce a load of boilerplate and unnecesary fiddling about when dealing with data that can be in a number of states.
It does this by capturing all states in one object. This allows for two things:
1. Less items in your data model that need passing around and dealing with
2. No getting into weird states (so `isLoading` is true, but so is `didError`, so what do I display?) - inspired by Richard Feldman's excellent [Making Impossible States Impossible](https://www.youtube.com/watch?v=IcgmSRJHu_8)

## Why?
Basically I've been using ReasonML a lot recently and realised capturing data in Sum types and pattern matching over them saves so much time and repeated lines of code. This library hopes to capture common reusable patterns. The first object, Response, is just a way of doing:
```ocaml
type respomse('a) = Empty | Loading | LoadError | Ready('a)
```
Where 'a represents whatever type of data you like.

## How do I use it?
Install with `npm install statemate`

Import into your code with `import { Response } from 'statemate'`

The library isn't limited to use in reducers, but it's a good example. Here is your initial state, for instance:
```javascript
const initialState = {
    title: "Great reducer!",
    apiResponse: Response.empty()
}
```

Now the change functions are as simple as 
```javascript
case REQUESTING_DATA:
    return {
        ...state,
        apiResponse: Response.loading()
    }
case RECEIVED_DATA_OK:
    return {
        ...state,
        apiResponse: Response.ready(action.payload.data)
    }
case RECEIVED_DATA_FAILED:
    return {
        ...state,
        apiResponse: Response.loadError()
    }
```

## How do I get to the actual data then?
A couple of ways. Either using caseOf to do a sort of pattern matching on it:

### caseOf
```javascript
const reply = myResponse.caseOf({
    ready: (data) => {
        return data;
    },
    empty: () => {
        return "this is empty, nothing has happened, maybe we will die waiting"
    },
    loading: () => {
        return "sorry, loading!"
    },
    loadError: () => {
        return "sorry, there was an error"
    }
})
// if myResponse is Response.ready("Excellent!") this would return "Excellent!"
// if myResponse is Response.empty() this would return "this is empty, nothing has happened, maybe we will die waiting"
// and so on...
```
Now `reply` will equal either the data or one of various alternatives.

### valueOr
Most of the time in UI rendering you won't need that much granularity, so use:
```javascript
// returns data...
const great = Response.ready("great").valueOr("No");
// great = "great"

// returns default...
const reply = Response.loading().valueOr("Nah");
// reply = "Nah"
```
This will return either the data inside or the default.

### map
You can also map over the data. This works much like mapping over a Maybe or Either type, in that the function will have no effect if the data is not ready.
```javascript
// yes, this is a really dull example
const toUpper = (str) => {
    return str.toUpperCase();
}
const loudResponseBlob = data.ready('dog').map(toUpper);
// loudResponseBlob = Response.ready('DOG')
const notReadyBlob = data.loading().map(toUpper);
// notReadyBlob = Response.loading()
```

## Other things
Often waiting for multiple endpoints to return and dealing with checking this is a pain, so there is also sequencing functions for combining Response objects.

```javascript
// some data objects
const goodResponse = Response.ready("yeah!")
const badResponse = Response.loading();

// are they both ready?
const allResponse = Response.sequence([goodResponse, badResponse]);

// nope
// allResponse = Response.empty();

// some better data objects
const greatResponse = Response.ready("Absolutely")
const betterResponse = Response.ready("wonderful")

// are these ones ready?
const excellentResponse = Response.sequence([greatResponse, betterResponse]);

// yes!
// excellentResponse = Response.ready(["Absolutely","wonderful"])
```

Ending up with this stuff inside an array can also seem somewhat meaningless, so there is an object version:
```javascript
// an object with Response in it
const stuff = {
    name: Response.empty(),
    date: Response.ready('2018-01-01')
}
// all ready yet?
const allStuff = Response.sequenceObj(stuff)

// nope
// allStuff = Response.empty()

// an object with ready Response in it
const betterStuff = {
    name: Response.ready("Agent Dale Cooper"),
    date: Response.ready('2018-01-01')
}
// ready now?
const readyStuff = Response.sequenceObj(betterStuff)

// excellent stuff!
/*
readyStuff = Response.ready({
    name: "Agent Dale Cooper",
    date: "2018-01-01"
})
*/
```

## Influences, thanks.

This is mostly inspired by how much I am enjoying programming in [ReasonML](https://reasonml.github.io/) at the moment. I ended up coping so much of the code structure from [ts-monad](https://github.com/cbowdon/TsMonad) (a library I enjoy very much) that basically the author can take complete credit for any positive outcomes of this library's existance. Also thanks to Linus Norton for writing [this tutorial](https://ljn.io/posts/publishing-typescript-projects-with-npm/) for making publishing a TS library pretty bearable.

## Tests

Needs more though

## Roadmap

1. More tests
2. Objects other than 'Response' should sensible ones present themselves
3. Bind (I started it, the types got messy, I gave up, forgive me)
4. Profit

## Contributors

Sure, why not?