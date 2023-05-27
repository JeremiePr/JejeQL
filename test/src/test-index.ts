import { getArrayFilteredByQuery } from '../../src/index';

function runTests(): void
{
    for (const method of testMethods)
    {
        method();
    }
    console.log("All tests ran successfully!");
}

function assert(predicate: () => boolean): void
{
    if (!predicate())
    {
        throw new Error('Test failed');
    }
}

const testMethods: Array<() => void> = [

    () =>
    {
        interface Type { foo: string; bar: number; baz: boolean; }

        const array: Array<Type> = [
            { foo: 'Gabo', bar: 745.68, baz: false },
            { foo: '_Itzievno', bar: -80.50, baz: false },
            { foo: 'OroOmov', bar: 2.34, baz: true }
        ];

        const query = `foo *=* 'v'`;

        const actual = getArrayFilteredByQuery(array, query);
        const expected = array.filter(x => x.foo.includes('v'));

        assert(() => actual.length === expected.length);

        for (const { foo, bar, baz } of expected)
        {
            assert(() => !!actual.find(x => x.foo === foo && x.bar === bar && x.baz === baz));
        }
    }
];

runTests();