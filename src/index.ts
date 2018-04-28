
export enum DataType {
    Ready,
    Empty,
    Loading,
    LoadError
}

export interface DataPatterns<a, b> {
    ready: (data: a) => b
    empty: () => b
    loading: () => b
    loadError: () => b
}

export function data<a>(data: a) {
    return Data.data(data)
}

export class Data<T> {

    constructor(private type: DataType, private value?: T) { }

    static sequence<T>(list: Data<T>[]): Data<T[]> {
        const goodList = list.reduce((total: T[], item: Data<T>): T[] => {
            return (Data.isReady(item) && item.value !== undefined) ? [...total, item.value] : []
        }, [])
        return (goodList.length > 0) ? Data.ready(goodList) : Data.empty();
    }

    static sequenceObj(objList: { [k: string]: any }): Data<{ [k: string]: any }> {
        if (Object.keys(objList).filter(k => Data.isNotReady(objList[k])).length) {
            return Data.empty<{ [k: string]: any }>();
        }
        var result: { [k: string]: any } = {};
        for (var k in objList) {
            if (objList.hasOwnProperty(k)) {
                result[k] = objList[k].value;
            }
        }
        return Data.ready(result);
    }

    // make new thing with data in
    static data<T>(t?: T | null): Data<T> {
        return t === null || t === undefined ? new Data<T>(DataType.LoadError)
            : new Data<T>(DataType.Ready, t)
    }

    // CONSTRUCTORS
    static ready<T>(t: T): Data<T> {
        if (t === null || t === undefined) {
            return new Data<T>(DataType.LoadError)
        }
        return new Data<T>(DataType.Ready, t)
    }

    static empty<T>(): Data<T> {
        return new Data<T>(DataType.Empty)
    }

    static loading<T>(): Data<T> {
        return new Data<T>(DataType.Loading)
    }

    static loadError<T>(): Data<T> {
        return new Data<T>(DataType.LoadError)
    }

    // CHECKERS
    static isReady<T>(t: Data<T>): boolean {
        return t.type === DataType.Ready
    }

    static isNotReady<T>(t: Data<T>): boolean {
        return !Data.isReady(t);
    }

    static isEmpty<T>(t: Data<T>): boolean {
        return t.type === DataType.Empty
    }

    static isLoading<T>(t: Data<T>): boolean {
        return t.type === DataType.Loading
    }

    static isLoadError<T>(t: Data<T>): boolean {
        return t.type === DataType.LoadError
    }

    unit<T>(t: T) {
        return Data.data<T>(t)
    }

    of = this.unit

    fmap<U>(f: (t: T) => U): Data<U> {
        if (!this.value) {
            return Data.empty<U>();
        }
        switch (this.type) {
            case DataType.Ready:
                return Data.ready<U>(f(this.value))
            case DataType.Empty:
                return Data.empty<U>();
            case DataType.Loading:
                return Data.loading<U>();
            case DataType.LoadError:
                return Data.loadError<U>();
            default:
                return Data.empty<U>();
        }
    }

    lift = this.fmap

    map = this.fmap

    caseOf<U>(patterns: DataPatterns<T, U>) {
        if (!this.value) {
            return Data.empty<U>();
        }
        switch (this.type) {
            case DataType.Ready:
                return patterns.ready(this.value)
            case DataType.Empty:
                return patterns.empty();
            case DataType.Loading:
                return patterns.loading();
            case DataType.LoadError:
                return patterns.loadError();
            default:
                return patterns.empty();
        }
    }

    defaulting(defaultValue: T) {
        return Data.ready(this.valueOr(defaultValue))
    }

    valueOr(defaultValue: T): T {
        return this.type === DataType.Ready && this.value !== undefined ? this.value : defaultValue;
    }

}