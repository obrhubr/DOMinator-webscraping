# DOMScript interpreter

The interpreter works on JSON files that specify what to fetch in declarative syntax. It can be extended further to support more queries, which would support more specific usecases.

## The JSON File's basic syntax

```json
{
    "queries": [
        {...},
        {...}
    ]
}
```

The file has to contain a `queries` object, the value of which is an array of queries. The first step in parsing/interpreting the file is to iterate trough the objects in `queries`.

```typescript
parse(dom: JSDOM): any {
    let result = {};

    for (let q in this.config.queries) {
        // Iterate through the queries found
        let qc = this.config.queries[q];

        if (isTableQuery(qc as TableQuery)) {
            result[q] = { ...qc, scraped: this.executeTableQuery(dom.window.document.body, qc as TableQuery) };
        }

        if (isTextQuery(qc as TextQuery)) {
            result[q] = { ...qc, scraped: this.executeTextQuery(dom.window.document.body, qc as TextQuery) };
        }
    }

    return result;
}
```

For each object in `queries` it then determines if it is a TextQuery or a TableQuery. It then calls either 

```typescript
this.executeTableQuery(dom.window.document.body, qc as TableQuery)

//or

this.executeTextQuery(dom.window.document.body, qc as TextQuery)
```

## So what's the difference between a table- and textquery

### TextQuery
A TextQuery allows you to select an Element using DOMScript and it will get the text content of that element and save it.

```typescript
{
    name: "Biography",
    obj_name: "people_biography",
    query: { 
        from: { query: ".person_description", "num": 1 } as BaseQueryAll, 
        query: ".person_short_bio"
    } as BaseQuery
}
```

This TextQuery selects the second element with the class `.person_description` and from that selects the element `.person_short_bio`.

As a tree it would look like this:

<img src="../../../.github/simpletext.png" width="400" />

A more complex TextQuery might look like this:

<img src="../../../.github/complextext.png" width="600" />

### TableQuery
A TableQuery allows you to scrape table-like data and save it in an appropriate format. 
It's made up of a TableRow query and the TableColumn queries. 
The TableRow query specifies which elements contain the rows of the table. 
They might be `<li></li>` elements or a div. 
The TableColumn queries specify which elements to get from each of the TableRows. **The TableColumn queries are in fact TextQueries that extract data from the list elements.**

```typescript
{
    name: "Table",
    obj_name: "table_people",
    tablebody: { query: ".table_row" },
    searchFor: [
        { 
            "name": "Firstname", 
            "obj_name": "first_name", 
            "query": { "from": { "query": ".name"}, "childnum": 0 } 
        },
        { 
            "name": "Lastname", 
            "obj_name": "last_name", 
            "query": { "from": { "query": ".name"}, "childnum": 1 } 
        },
        { 
            "name": "Birthday", 
            "obj_name": "birthday", 
            "query": { "from": { query: ".person_dates"}, query: ".birthday" } 
        }
    ]
}
```

This query would select the firstname, lastname and birthday of every person in a table.

As a tree it would look like this:

<img src="../../../.github/table.png" width="700" />

## But, both of these queries rely on the BaseQuery, BaseQueryAll and ChildQuery to actually get the elements from which to extract data

### The TextQuery

Once the `parse` function has called `this.executeTextQuery()`:

```typescript
private executeTextQuery(dom: HTMLSingleReturn, q: TextQuery): string {
    let res = this.executeQuery(dom, q.query) as Element; // Note that this function returns a HTML element
    return res.textContent;
}
```

The function calls `this.executeQuery()`, the function at the heart of the parser/interpreter.

What makes the TextQuery is the last line of the function however: `return res.textContent;` it extracts the `textContent` of the HTML element returned by `this.executeQuery`.

### The TableQuery

Once the `parse` function has called `this.executeTableQuery()`:

```typescript
private executeTableQuery(dom: HTMLSingleReturn, q: TableQuery) {
    let table = [];
    let tablebody: NodeListOf<Element>;

    try {
        tablebody = this.executeBaseQueryAllNoFilter(dom, q.tablebody as BaseQuery); // This function returns a list of elements, the list rows
    } catch (error) {
        // If no list elements were found, return an empty table
        return table; 
    }

    for (let i = 0; i < tablebody.length; i++) {
        // Iterate through all the List elements
        let tablerow = tablebody[i];
        let row = {};

        for (let j = 0; j < q.searchFor.length; j++) {
            // Then for each list element, iterate through the TextQueries and get the results.
            let sf = q.searchFor[j];

            // If no obj_name was specified, create one
            let name: string = j + "_query";
            if (!isBaseQuery(q)) {
                name = (sf as Query).obj_name;
            }

            // Try to actually execute the TextQuery on the element tablerow
            try {
                row[name] = this.executeTextQuery(tablerow, sf as TextQuery);
            } catch (error) {
                row[name] = ""
            }
        }
        
        // Push the results to the list as an object
        table.push(row);
    }

    return table;
}
```

The function `this.executeTableQuery()` seems more complex, but it operates on the same fundamental principles.

The function cof queries. The first step in parsing/interpreting the file is to iterate trough
```typescript
try {
    tablebody = this.executeBaseQueryAllNoFilter(dom, q.tablebody as BaseQuery);
} catch (error) {
    return table; 
}
```

Because the thing we want to get from the elements selected is text, the TableQuery relies on a list of TextQueries to extract data from the elements.

It iterates through all of them and extracts the data from the elements using **TextQueries**.

```typescript
try {
    row[name] = this.executeTextQuery(tablerow, sf as TextQuery);
} catch (error) {
    row[name] = ""
}
```

It then packages the results in nice format and returns them.

## ExecuteQuery - The heart of the interpreter

```typescript
private executeQuery(base: HTMLSingleReturn, q: Query | BaseQuery): HTMLReturn {
    if (isBaseQueryAll(q)) {
        return this.executeBaseQueryAll(base as Element, q);
    }

    if (isBaseQuery(q)) {
        return this.executeBaseQuery(base as Element, q);
    }

    if (isChildQuery(q)) {
        return (this.executeQuery(base, q.from) as Element).childNodes[q.childnum] as Element;
    }
}
```

The function is very simple in it's essence. It's given two arguments. An HTML element, which might be a `div`, a `li` or the entire `body` and a Query.

It then checks what the type of the Query is and calls one of two functions or simple takes the nth element(in case of a childQuery):
 - `this.executeBaseQueryAll()`
 - `this.executeBaseQuery()`
 - `.childNodes[q.childnum]`

## Recursion

What happens after `this.executeBaseQueryAll()` or `this.executeBaseQuery()` is called is **RECURSION**.

```typescript
private executeBaseQuery(base: Element, q: BaseQuery): Element {
    let from;
    let res;

    if (q.from) {
        // If this BaseQuery is applied to the return of another Query (if there is a from property, ex: if it selects that element from another element), first try to resolve the from Query.
        from = this.executeQuery(base, q.from);
        // And then select using the querySelector
        res = from.querySelector(q.query);
    } else {
        // If there is no from query, simply return
        // This is the recursion stop condition
        res = base.querySelector(q.query);
    };

    if (!res) {
        throw Error('Query Selector returned null.');
    }
    return res;
}
```

So what happens here is that a BaseQuery (or a BaseQueryAll) can specify a `from`  element:

```typescript
{
    query: { 
        from: { query: ".menuTop__items", num: 1 } as BaseQueryAll, 
        query: ".menuTop__text"  
    } as BaseQuery
}
```

This query would select the first element with the class `.menuTop__text` from the second element `.menuTop__items`.

To resolve such chained Queries I use recursion. The function always goes to the bottom of the the "QueryTree" first and then slowly works it's way up.

### BaseQueryAll

The `BaseQueryAll` is not too different, it only changes two lines of code:

```typescript
if (q.from) {
    from = this.executeQuery(base, q.from);
    // It selects the [q.num] th element that the QuerySelectorAll returns, instead of the first
    res = from.querySelectorAll(q.query)[q.num];
} else {
    // It selects the [q.num] th element that the QuerySelectorAll returns, instead of the first
    res = base.querySelectorAll(q.query)[q.num];
};
```