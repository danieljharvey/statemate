"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataType;
(function (DataType) {
    DataType[DataType["Ready"] = 0] = "Ready";
    DataType[DataType["Empty"] = 1] = "Empty";
    DataType[DataType["Loading"] = 2] = "Loading";
    DataType[DataType["Waiting"] = 3] = "Waiting";
    DataType[DataType["LoadError"] = 4] = "LoadError";
})(DataType = exports.DataType || (exports.DataType = {}));
function data(data) {
    return Data.data(data);
}
exports.data = data;
var Data = /** @class */ (function () {
    function Data(type, value) {
        this.type = type;
        this.value = value;
        this.of = this.unit;
        this.lift = this.fmap;
        this.map = this.fmap;
    }
    Data.sequence = function (list) {
        var goodList = list.reduce(function (total, item) {
            return (Data.isReady(item) && item.value !== undefined) ? total.concat([item.value]) : [];
        }, []);
        return (goodList.length > 0) ? Data.ready(goodList) : Data.empty();
    };
    Data.sequenceObj = function (objList) {
        if (Object.keys(objList).filter(function (k) { return Data.isNotReady(objList[k]); }).length) {
            return Data.empty();
        }
        var result = {};
        for (var k in objList) {
            if (objList.hasOwnProperty(k)) {
                result[k] = objList[k].value;
            }
        }
        return Data.ready(result);
    };
    // make new thing with data in
    Data.data = function (t) {
        return t === null || t === undefined ? new Data(DataType.LoadError)
            : new Data(DataType.Ready, t);
    };
    // CONSTRUCTORS
    Data.ready = function (t) {
        if (t === null || t === undefined) {
            return new Data(DataType.LoadError);
        }
        return new Data(DataType.Ready, t);
    };
    Data.empty = function () {
        return new Data(DataType.Empty);
    };
    Data.loading = function () {
        return new Data(DataType.Loading);
    };
    Data.waiting = function () {
        return new Data(DataType.Waiting);
    };
    Data.loadError = function () {
        return new Data(DataType.LoadError);
    };
    // CHECKERS
    Data.isReady = function (t) {
        return t.type === DataType.Ready;
    };
    Data.isNotReady = function (t) {
        return !Data.isReady(t);
    };
    Data.isEmpty = function (t) {
        return t.type === DataType.Empty;
    };
    Data.isLoading = function (t) {
        return t.type === DataType.Loading;
    };
    Data.isWaiting = function (t) {
        return t.type === DataType.Waiting;
    };
    Data.isLoadError = function (t) {
        return t.type === DataType.LoadError;
    };
    Data.prototype.unit = function (t) {
        return Data.data(t);
    };
    Data.prototype.fmap = function (f) {
        if (!this.value) {
            return Data.empty();
        }
        switch (this.type) {
            case DataType.Ready:
                return Data.ready(f(this.value));
            case DataType.Empty:
                return Data.empty();
            case DataType.Loading:
                return Data.loading();
            case DataType.Waiting:
                return Data.waiting();
            case DataType.LoadError:
                return Data.loadError();
            default:
                return Data.empty();
        }
    };
    Data.prototype.caseOf = function (patterns) {
        if (!this.value) {
            return Data.empty();
        }
        switch (this.type) {
            case DataType.Ready:
                return patterns.ready(this.value);
            case DataType.Empty:
                return patterns.empty();
            case DataType.Loading:
                return patterns.loading();
            case DataType.Waiting:
                return patterns.waiting();
            case DataType.LoadError:
                return patterns.loadError();
            default:
                return patterns.empty();
        }
    };
    Data.prototype.defaulting = function (defaultValue) {
        return Data.ready(this.valueOr(defaultValue));
    };
    Data.prototype.valueOr = function (defaultValue) {
        return this.type === DataType.Ready && this.value !== undefined ? this.value : defaultValue;
    };
    return Data;
}());
exports.Data = Data;
var test = {
    firstName: "John",
    lastName: "Snow"
};
var tests = [
    Data.ready(test),
    Data.empty(),
    Data.loading(),
    Data.waiting(),
    Data.loadError()
];
var nobody = {
    firstName: "nobody",
    lastName: "cares"
};
var capitaliseFirstName = function (obj) {
    return obj.firstName.toUpperCase();
};
var cap = function (obj) {
    return obj.fmap(capitaliseFirstName).valueOr("bum");
};
var changed = tests.map(cap);
var readies = tests.map(Data.isNotReady);
console.log(changed);
console.log(readies);
var sequenceBad = Data.sequence(tests);
console.log(sequenceBad);
var sequenceGood = Data.sequence([Data.ready("yeah"), Data.ready("detroit")]);
console.log(sequenceGood);
var sequenceObjBad = Data.sequenceObj({ names: Data.loading(), dates: Data.ready(new Date()) });
console.log(sequenceObjBad);
var sequenceObjGood = Data.sequenceObj({ names: Data.ready("Dogman"), dates: Data.ready(new Date()) });
console.log(sequenceObjGood);
