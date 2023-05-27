import { apply } from './applier';
import { Predicate, PredicateNode, getPredicate } from './deserializer';

const getPredicatesFromQuery = getPredicate;

const getArrayFilteredByQuery = <T>(array: Array<T>, query: string): Array<T> =>
{
    const predicate = getPredicate(query);
    return apply(array, predicate);
};

const tryGetArrayFilteredByQuery = <T>(array: Array<T>, query: string): { success: boolean, result: Array<T> | null, error: any } =>
{
    try
    {
        const result = getArrayFilteredByQuery(array, query);
        return { success: true, result, error: null };
    }
    catch (error)
    {
        return { success: false, result: null, error }
    }
}

type QueryOperator = '=' | '=*' | '*=' | '*=*' | '>' | '<' | '>=' | '<=';

export
{
    Predicate,
    PredicateNode,
    QueryOperator,
    getPredicatesFromQuery,
    getArrayFilteredByQuery,
    tryGetArrayFilteredByQuery,
};