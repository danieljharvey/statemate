
const enum DataState {
    Initial="fdsgjkdfsgfjkdlsjlkdfjsdfghjdfgjkl",
    Loading="dsfjkajlkdfgfdsjhgshjfdhjdsjhkfghjsdfhjg",
    Waiting="sdfjkadjkfjkadsfjklasdfjklasdjfjksldf",
    Loaded="fsgjksdfjgsdkflgljsdf;lgksdfkgsdlk;fgjsdfg"
}

type Data<a> = DataState.Initial | DataState.Loading | DataState.Waiting | a

type DataReturn<a> = (data: a) => a

interface DataOpts<a, b> {
    initial: () => b
    loading: () => b
    waiting: () => b
    loaded: (data: a) => b
}

function initial<a>(): Data<a> {
    return DataState.Initial;
}

function loading<a>(): Data<a> {
    return DataState.Loading;
}

function waiting<a>(): Data<a> {
    return DataState.Waiting;
}

function data<a>(data: a): Data<a> {
    return data;
}

function dataOr<a>(def: a, data: Data<a>): a {
    switch (data) {
        case DataState.Initial:
            return def;
        case DataState.Loading:
            return def;
        case DataState.Waiting:
            return def;
        default:
            return data;
    }
}

function caseOf<a, b>(dataOpts: DataOpts<a, b>, data: Data<a>): b {
    switch (data) {
        case DataState.Initial:
            return dataOpts.initial()
        case DataState.Loading:
            return dataOpts.loading()
        case DataState.Waiting:
            return dataOpts.waiting()
        default:
            return dataOpts.loaded(data)
    }
}

function fmap<a,b>(f: (data: a) => b, data: Data<a>): Data<b> {
    if (data === DataState.Initial || data === DataState.Loading || data === DataState.Waiting) {
        return data;
    } else {
        return f(data);
    }
}

interface TestObject {
    firstName: string
    lastName: string
}

const test: TestObject = {
    firstName: "John",
    lastName: "Snow"
}

const tests: Data<TestObject>[] = [data(test), initial(), loading(), waiting(), data(test)]

const nobody: TestObject = {
    firstName: "nobody",
    lastName: "cares"
}

const withDefault = caseOf({
    initial: () => nobody,
    loading: () => nobody,
    waiting: () => nobody,
    loaded: (person) => person
}, test)

const capitaliseFirstName = (obj: TestObject): TestObject => ({
    ...obj,
    firstName: obj.firstName.toUpperCase()
})

const changed = tests.map(test => fmap(capitaliseFirstName, test))

console.log(changed)

