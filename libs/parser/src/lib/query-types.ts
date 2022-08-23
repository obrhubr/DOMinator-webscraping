type Query = {
	name: string,
	obj_name: string
}

type TextQuery = Query & {
	query: BaseQuery
}

type TableQuery = Query & {
	tablebody: BaseQuery,
	searchFor: TextQuery[]
}

type BaseQuery = {
	from: BaseQuery | null,
	query: string | undefined
}

type BaseQueryAll = BaseQuery & {
	num: number
}

type ChildQuery =  BaseQuery & {
	childnum: number
}

type Config = {
	queries: Query[]
}

type HTMLReturn = (Element) | (NodeListOf<Element> | HTMLDivElement);
type HTMLSingleReturn = Element;
type HTMLListReturn = NodeListOf<Element> | NodeListOf<HTMLElement> | HTMLDivElement;

function isBaseQuery(obj: any): obj is BaseQuery {
	return typeof obj.query === 'string';
};

function isBaseQueryAll(obj: any): obj is BaseQueryAll {
	return typeof obj.num === 'number';
};

function isTextQuery(obj: any): obj is TextQuery {
	return typeof obj.tablebody === 'undefined' && typeof obj.name === 'string';
};

function isTableQuery(obj: any): obj is TableQuery {
	return typeof obj.tablebody !== 'undefined' && typeof obj.name === 'string';
};

function isChildQuery(obj: any): obj is ChildQuery {
	return typeof obj.childnum === 'number';
};

class QueryConfig {
	constructor(
		public name: string,
		public url: string,
		public cron: string,
		public config: { queries: (TextQuery | TableQuery)[]}
	) {}
}
class QueryConfigResponse {
	constructor(
		public _id: string,
		public name: string,
		public url: string,
		public cron: string,
		public config: { queries: (TextQuery | TableQuery)[]}
	) {}
}

export {
	Config,
	BaseQuery,
	BaseQueryAll,
	TableQuery,
	TextQuery,
	ChildQuery,

	isBaseQuery,
	isChildQuery,
	isBaseQueryAll,
	isTableQuery,
	isTextQuery,
	Query,

	HTMLListReturn,
	HTMLReturn,
	HTMLSingleReturn,

	QueryConfig,
	QueryConfigResponse
}