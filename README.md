# Data-blob

## (What a terrible name, suggestions please)

## What?
The idea of this library is to reduce a load of boilerplate and unnecesary fiddling about when dealing with loading data from endpoints.
It does this by capturing all states in one object. This allows for two things:
1. Less items in your data model that need passing around and dealing with
2. No getting into weird states (so `isLoading` is true, but so is `didError`, so what do I display?) - inspired by Richard Feldman's excellent [Making Impossible States Impossible](https://www.youtube.com/watch?v=IcgmSRJHu_8)

## Why?
Basically I've been using ReasonML a lot recently and realised capturing data in Sum types and pattern matching over them saves so much time and repeated lines of code. This whole library is just a way of doing:
```ocaml
type data('a) = Empty | Loading | LoadError | Ready('a)
```
Where 'a represents whatever type of data you like.

## How do I use it?
Install with `npm install data-blob`

Import into your code with `import { Data } from 'data-blob'`

The library isn't limited to use in reducers, but it's a good example. Here is your initial state, for instance:
```javascript
const initialState = {
    title: "Great reducer!",
    apiData: Data.empty()
}
```

Now the change functions are as simple as 
```javascript
case REQUESTING_DATA:
    return {
        ...state,
        apiData: Data.loading()
    }
case RECEIVED_DATA_OK:
    return {
        ...state,
        apiData: Data.ready(action.payload.data)
    }
case RECEIVED_DATA_FAILED:
    return {
        ...state,
        apiData: Data.loadError()
    }
```

## How do I get to the data then?
A couple of ways. Either using caseOf to do a sort of pattern matching on it:

### caseOf
```javascript
const reply = datablob.caseOf({
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
// if datablob is Data.ready("Excellent!") this would return "Excellent!"
// if datablob is Data.empty() this would return "this is empty, nothing has happened, maybe we will die waiting"
// and so on...
```
Now `reply` will equal either the data or one of various alternatives.

### valueOr
Most of the time in UI rendering you won't need that much granularity, so use:
```javascript
// returns data...
const great = Data.ready("great").valueOr("No");
// great = "great"

// returns default...
const reply = Data.loading().valueOr("Nah");
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
const loudDataBlob = data.ready('dog').map(toUpper);
// loudDataBlob = Data.ready('DOG')
const notReadyBlob = data.loading().map(toUpper);
// notReadyBlob = Data.loading()
```

## Other things
Often waiting for multiple endpoints to return and dealing with checking this is a pain, so there is also sequencing functions for combining Data objects.

```javascript
// some data objects
const goodData = Data.ready("yeah!")
const badData = Data.loading();

// are they both ready?
const allData = Data.sequence([goodData, badData]);

// nope
// allData = Data.empty();

// some better data objects
const greatData = Data.ready("Absolutely")
const betterData = Data.ready("wonderful")

// are these ones ready?
const excellentData = Data.sequence([greatData, betterData]);

// yes!
// excellentData = Data.ready(["Absolutely","wonderful"])
```

Ending up with this stuff inside an array can also seem somewhat meaningless, so there is an object version:
```javascript
// an object with Data in it
const stuff = {
    name: Data.empty(),
    date: Data.ready('2018-01-01')
}
// all ready yet?
const allStuff = Data.sequenceObj(stuff)

// nope
// allStuff = Data.empty()

// an object with ready Data in it
const betterStuff = {
    name: Data.ready("Agent Dale Cooper"),
    date: Data.ready('2018-01-01')
}
// ready now?
const readyStuff = Data.sequenceObj(betterStuff)

// excellent stuff!
/*
readyStuff = Data.ready({
    name: "Agent Dale Cooper",
    date: "2018-01-01"
})
*/
```

## Influences, thanks.

This is mostly inspired by how much I am enjoying programming in [ReasonML](https://reasonml.github.io/) at the moment. I ended up coping so much of the code structure from [ts-monad](https://github.com/cbowdon/TsMonad) (a library I enjoy very much) that basically the author can take complete credit for any positive outcomes of this library's existance. Also thanks to Linus Norton for writing [this tutorial](https://ljn.io/posts/publishing-typescript-projects-with-npm/) for making publishing a TS library pretty bearable.

## Tests

They're coming soon, I'm usually really on this but not today.

## Roadmap

1. Tests
2. Bind (I started it, the types got messy, I gave up, forgive me)
3. Profit

## Contributors

Sure, why not?