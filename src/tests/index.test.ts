import { Data } from '../index'

interface TestObject {
    firstName: string
    lastName: string
}

const test: TestObject = {
    firstName: "Dale",
    lastName: "Cooper"
}

const tests: Data<TestObject>[] = [
    Data.ready(test),
    Data.empty(),
    Data.loading(),
    Data.loadError()
]

describe("it is a blob of data basically", () => {
    it('maps over arrays', () => {
        const capitaliseFirstName = (obj: TestObject): string => {
            return obj.firstName.toUpperCase()
        }

        const cap = (obj: Data<TestObject>): string => {
            return obj.fmap(capitaliseFirstName).valueOr("bum")
        }

        const changed = tests.map(cap)

        expect(changed).toEqual(['DALE', 'bum', 'bum', 'bum'])
    })

    it('uses isNotReady correctly', () => {
        expect(tests.map(Data.isNotReady)).toEqual([false, true, true, true])
    })

    it('sequences a bad array correctly', () => {
        expect(Data.sequence(tests)).toEqual(Data.empty())
    })

    it('sequences a good array correctly', () => {
        const sequenceGood = Data.sequence([Data.ready("yeah"), Data.ready("detroit")])
        const expected = Data.ready(['yeah', 'detroit'])
        expect(sequenceGood).toEqual(expected)
    })

    it('sequences a bad object', () => {
        const objBad = { names: Data.loading(), dates: Data.ready("2018-01-01") };
        expect(Data.sequenceObj(objBad)).toEqual(Data.empty())
    })

    it('sequences a good object', () => {
        const objGood = { names: Data.ready("Dogman"), dates: Data.ready("2018-01-01") };
        const expected = Data.ready({ names: "Dogman", dates: "2018-01-01" })
        expect(Data.sequenceObj(objGood)).toEqual(expected)
    })
})
