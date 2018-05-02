import { Response, response } from '../index'

interface TestObject {
    firstName: string
    lastName: string
}

const test: TestObject = {
    firstName: "Dale",
    lastName: "Cooper"
}

const tests: Response<TestObject>[] = [
    Response.ready(test),
    Response.empty(),
    Response.loading(),
    Response.loadError()
]

describe("The 'Response' constructor/object/data-holding-item", () => {
    it('maps over arrays', () => {
        const capitaliseFirstName = (obj: TestObject): string => {
            return obj.firstName.toUpperCase()
        }

        const cap = (obj: Response<TestObject>): string => {
            return obj.fmap(capitaliseFirstName).valueOr("bum")
        }

        const changed = tests.map(cap)

        expect(changed).toEqual(['DALE', 'bum', 'bum', 'bum'])
    })

    it("uses 'response' constructor function", () => {
        expect(response("hat")).toEqual(Response.ready("hat"))
    })

    it('uses isNotReady correctly', () => {
        expect(tests.map(Response.isNotReady)).toEqual([false, true, true, true])
    })

    it('sequences a bad array correctly', () => {
        expect(Response.sequence(tests)).toEqual(Response.empty())
    })

    it('sequences a good array correctly', () => {
        const sequenceGood = Response.sequence([Response.ready("yeah"), Response.ready("detroit")])
        const expected = Response.ready(['yeah', 'detroit'])
        expect(sequenceGood).toEqual(expected)
    })

    it('sequences a bad object', () => {
        const objBad = { names: Response.loading(), dates: Response.ready("2018-01-01") };
        expect(Response.sequenceObj(objBad)).toEqual(Response.empty())
    })

    it('sequences a good object', () => {
        const objGood = { names: Response.ready("Dogman"), dates: Response.ready("2018-01-01") };
        const expected = Response.ready({ names: "Dogman", dates: "2018-01-01" })
        expect(Response.sequenceObj(objGood)).toEqual(expected)
    })
})
