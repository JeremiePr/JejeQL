export interface Predicate
{
    property: string;
    operator: string;
    value: string | number | boolean;
    apply: (item: string | number | boolean) => boolean;
}

export type PredicateNode = Predicate | Array<PredicateNode>;

export function getPredicate(query: string): PredicateNode
{
    return getPredicateNode(query, '|');
}



const operators = ['=', '=*', '*=', '*=*', '>', '<', '>=', '<='];

function getPredicateNode(query: string, comparator?: string): PredicateNode
{
    if (!comparator) return getPredicateEnd(query);

    const entries = query.split(comparator);

    const childComparator = comparator === '|' ? '&' :
        (comparator === '&' ? '¦' : '');

    if (entries.length === 1 && !query.includes('|') && !query.includes('&') && !query.includes('¦'))
    {
        return getPredicateEnd(query);
    }
    else
    {
        return entries.map(entry => getPredicateNode(entry, childComparator));
    }
}

function getPredicateEnd(query: string): Predicate
{
    query = query.trim();

    let property: string | null = null;
    let operator: string | null = null;
    let negation: boolean | null = null;
    let value: string | number | boolean | null = null;

    for (const o of operators)
    {
        if (!query.includes(` ${o} `) && !query.includes(` !${o} `)) continue;

        operator = o;
        negation = query.includes(` !${o} `);

        break;
    }

    if (operator == null || negation == null) throw new Error(`Could not find any operator within the query '${query}'`);

    const parts = query.split(` ${negation ? '!' : ''}${operator} `);
    if (parts.length !== 2) throw new Error(`The operator is set more than once within the query '${query}'`);

    property = parts[0].trim();

    const rawValue = parts[1].trim();

    if (rawValue.startsWith(`'`) && rawValue.endsWith(`'`))
    {
        value = rawValue;
        value = value.substring(1);
        value = value.substring(0, value.length - 1);
        value = value.toLowerCase();
    }
    else
    {
        if (!isNaN(+rawValue))
        {
            value = Number(rawValue);
        }
        else
        {
            switch (rawValue)
            {
                case 'true':
                    value = true;
                    break;
                case 'false':
                    value = false;
                default:
                    throw new Error(`The value '${value}' is not valid. Correct values can be numbers, string embedded within single quotes and the values 'true' and 'false'`);
            }
        }
    }

    const apply = (item: string | number | boolean) =>
    {
        if (value == null) return false;

        let result = false;
        switch (operator)
        {
            case '=':
                result = item === value;
                break;
            case '=*':
                result = item.toString().startsWith(value.toString());
                break;
            case '*=':
                result = item.toString().endsWith(value.toString());
                break;
            case '*=*':
                result = item.toString().includes(value.toString());
                break;
            case '>':
                result = item > value;
                break;
            case '<':
                result = item < value;
                break;
            case '>=':
                result = item >= value;
                break;
            case '<=':
                result = item <= value;
                break;
        }

        return negation ? !result : result;
    };

    return { property: property, operator, value, apply };
}