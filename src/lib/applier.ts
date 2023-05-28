import { Predicate, PredicateNode } from './deserializer';

export function apply<T extends Object>(input: Array<T>, predicate: PredicateNode): Array<T>
{
    const output: Array<T> = [];

    for (const entry of input)
    {
        const checks = checkPredicate(entry, predicate, '|');
        if (checks) output.push(entry);
    }

    return output;
}



// Private



function checkPredicate(item: any, node: PredicateNode, level: '|' | '&' | '¦'): boolean
{
    if (!Array.isArray(node))
    {
        return checkPredicateEnd(item, node);
    }
    else
    {
        if (level === '|')
        {
            for (const n of node)
            {
                if (checkPredicate(item, n, '&')) return true;
            }

            return false;
        }
        else if (level === '&')
        {
            for (const n of node)
            {
                if (!checkPredicate(item, n, '¦')) return false;
            }

            return true;
        }
        else
        {
            for (const n of node)
            {
                if (Array.isArray(n)) throw new Error('The third condition level must be an ending condition');
                if (checkPredicateEnd(item, n)) return true;
            }
            return false;
        }
    }
}

function checkPredicateEnd(item: any, predicate: Predicate): boolean
{
    let value = item[predicate.property];
    if (!value) return false;

    if (typeof value === 'string')
    {
        value = value.toLowerCase();
    }

    return predicate.apply(value);
}