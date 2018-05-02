
export enum ResponseType {
    Ready,
    Empty,
    Loading,
    LoadError
}

export interface ResponsePatterns<a, b> {
    ready: (response: a) => b
    empty: () => b
    loading: () => b
    loadError: () => b
}

export function response<a>(response: a) {
    return Response.response(response)
}

export class Response<T> {

    constructor(private type: ResponseType, private value?: T) { }

    static sequence<T>(list: Response<T>[]): Response<T[]> {
        const goodList = list.reduce((total: T[], item: Response<T>): T[] => {
            return (Response.isReady(item) && item.value !== undefined) ? [...total, item.value] : []
        }, [])
        return (goodList.length > 0) ? Response.ready(goodList) : Response.empty();
    }

    static sequenceObj(objList: { [k: string]: any }): Response<{ [k: string]: any }> {
        if (Object.keys(objList).filter(k => Response.isNotReady(objList[k])).length) {
            return Response.empty<{ [k: string]: any }>();
        }
        var result: { [k: string]: any } = {};
        for (var k in objList) {
            if (objList.hasOwnProperty(k)) {
                result[k] = objList[k].value;
            }
        }
        return Response.ready(result);
    }

    // make new thing with response in
    static response<T>(t?: T | null): Response<T> {
        return t === null || t === undefined ? new Response<T>(ResponseType.LoadError)
            : new Response<T>(ResponseType.Ready, t)
    }

    // CONSTRUCTORS
    static ready<T>(t: T): Response<T> {
        if (t === null || t === undefined) {
            return new Response<T>(ResponseType.LoadError)
        }
        return new Response<T>(ResponseType.Ready, t)
    }

    static empty<T>(): Response<T> {
        return new Response<T>(ResponseType.Empty)
    }

    static loading<T>(): Response<T> {
        return new Response<T>(ResponseType.Loading)
    }

    static loadError<T>(): Response<T> {
        return new Response<T>(ResponseType.LoadError)
    }

    // CHECKERS
    static isReady<T>(t: Response<T>): boolean {
        return t.type === ResponseType.Ready
    }

    static isNotReady<T>(t: Response<T>): boolean {
        return !Response.isReady(t);
    }

    static isEmpty<T>(t: Response<T>): boolean {
        return t.type === ResponseType.Empty
    }

    static isLoading<T>(t: Response<T>): boolean {
        return t.type === ResponseType.Loading
    }

    static isLoadError<T>(t: Response<T>): boolean {
        return t.type === ResponseType.LoadError
    }

    unit<T>(t: T) {
        return Response.response<T>(t)
    }

    of = this.unit

    fmap<U>(f: (t: T) => U): Response<U> {
        if (!this.value) {
            return Response.empty<U>();
        }
        switch (this.type) {
            case ResponseType.Ready:
                return Response.ready<U>(f(this.value))
            case ResponseType.Empty:
                return Response.empty<U>();
            case ResponseType.Loading:
                return Response.loading<U>();
            case ResponseType.LoadError:
                return Response.loadError<U>();
            default:
                return Response.empty<U>();
        }
    }

    lift = this.fmap

    map = this.fmap

    caseOf<U>(patterns: ResponsePatterns<T, U>) {
        if (!this.value) {
            return Response.empty<U>();
        }
        switch (this.type) {
            case ResponseType.Ready:
                return patterns.ready(this.value)
            case ResponseType.Empty:
                return patterns.empty();
            case ResponseType.Loading:
                return patterns.loading();
            case ResponseType.LoadError:
                return patterns.loadError();
            default:
                return patterns.empty();
        }
    }

    defaulting(defaultValue: T) {
        return Response.ready(this.valueOr(defaultValue))
    }

    valueOr(defaultValue: T): T {
        return this.type === ResponseType.Ready && this.value !== undefined ? this.value : defaultValue;
    }

}