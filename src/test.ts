import { runTests, theArray, theBoolean, theObject } from '@jeje-devs/plume-testing';
import { getArrayFilteredByQuery, tryGetArrayFilteredByQuery, tryGetPredicatesFromQuery } from './lib/exports';

runTests({

    'TestArrayWithValidQuery': () =>
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

        theArray(actual).shouldHaveLength(expected.length);
        theArray(actual).shouldHaveAllItemsEqualPropertiesWith(expected, x => x.foo, x => x.bar, x => x.baz);
    },

    'TestArrayWithInvalidQuery': () =>
    {
        interface Type { foo: string; bar: number; baz: boolean; }

        const array: Array<Type> = [
            { foo: 'Fooo', bar: 888, baz: false }
        ];

        const result1 = tryGetArrayFilteredByQuery(array, "Hello World!");

        theBoolean(result1.success).shouldBeFalse();
    },

    'TestArrayWithEmptyQueryStringValue': () =>
    {
        const items = [{ name: 'Something' }];

        const query = `name *=* ''`;

        const predicateResult = tryGetPredicatesFromQuery(query);

        theBoolean(predicateResult.success).shouldBeTrue();
        theObject(predicateResult.result).shouldNotBeNil();

        const applyResult = tryGetArrayFilteredByQuery(items, query);

        theBoolean(applyResult.success).shouldBeTrue();
        theArray(applyResult.result).shouldHaveLength(1);
        theArray(applyResult.result).shouldVerify(x => x[0].name === 'Something');
    }

});