export declare enum DataType {
    Ready = 0,
    Empty = 1,
    Loading = 2,
    Waiting = 3,
    LoadError = 4,
}
export interface DataPatterns<a, b> {
    ready: (data: a) => b;
    empty: () => b;
    loading: () => b;
    waiting: () => b;
    loadError: () => b;
}
export declare function data<a>(data: a): Data<a>;
export declare class Data<T> {
    private type;
    private value;
    constructor(type: DataType, value?: T | undefined);
    static sequence<T>(list: Data<T>[]): Data<T[]>;
    static sequenceObj(objList: {
        [k: string]: Data<any>;
    }): Data<{
        [k: string]: any;
    }>;
    static data<T>(t?: T | null): Data<T>;
    static ready<T>(t: T): Data<T>;
    static empty<T>(): Data<T>;
    static loading<T>(): Data<T>;
    static waiting<T>(): Data<T>;
    static loadError<T>(): Data<T>;
    static isReady<T>(t: Data<T>): boolean;
    static isNotReady<T>(t: Data<T>): boolean;
    static isEmpty<T>(t: Data<T>): boolean;
    static isLoading<T>(t: Data<T>): boolean;
    static isWaiting<T>(t: Data<T>): boolean;
    static isLoadError<T>(t: Data<T>): boolean;
    unit<T>(t: T): Data<T>;
    of: <T>(t: T) => Data<T>;
    fmap<U>(f: (t: T) => U): Data<U>;
    lift: <U>(f: (t: T) => U) => Data<U>;
    map: <U>(f: (t: T) => U) => Data<U>;
    caseOf<U>(patterns: DataPatterns<T, U>): U | Data<U>;
    defaulting(defaultValue: T): Data<T>;
    valueOr(defaultValue: T): T;
}
