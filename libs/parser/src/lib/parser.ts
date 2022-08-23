import { JSDOM }  from "jsdom";
import { Config, BaseQuery, BaseQueryAll, Query, TableQuery, TextQuery, isBaseQuery, isChildQuery, isBaseQueryAll, isTableQuery, isTextQuery, HTMLReturn, HTMLSingleReturn } from "./query-types";

export class DOMinator {
	constructor(
		private readonly config: Config
	) {}

	private executeBaseQuery(base: Element, q: BaseQuery): Element {
		let from: any;
		let res: any;

		if (q.from) {
			from = this.executeQuery(base, q.from);//base.querySelector(q.from);
			res = from.querySelector(q.query);
		} else if (q.query) {
			res = base.querySelector(q.query);
		};

		if (!res) {
			throw Error('Query Selector returned null.');
		}
		return res;
	}
	
	private executeBaseQueryAll(base: Element, q: BaseQueryAll): Element {
		let from: any;
		let res: any;

		if (q.from) {
			from = this.executeQuery(base, q.from);//base.querySelector(q.from);
			res = from.querySelectorAll(q.query)[q.num];
		} else if (q.query) {
			res = base.querySelectorAll(q.query)[q.num];
		};

		if (!res) {
			throw Error('Query Selector All could not select nth element.');
		}
		return res;
	}
	
	private executeBaseQueryAllNoFilter(base: Element, q: BaseQuery): NodeListOf<Element> {
		let res = base.querySelectorAll(q.query as string);
		if (!res) {
			throw Error('Query Selector returned null.');
		}
		return res;
	}
	
	private executeTableQuery(dom: HTMLSingleReturn, q: TableQuery) {
		let table: {}[] = [];
		let tablebody: NodeListOf<Element>;
	
		try {
			tablebody = this.executeBaseQueryAllNoFilter(dom, q.tablebody as BaseQuery);
		} catch (error) {
			return table; 
		}
	
		for (let i = 0; i < tablebody.length; i++) {
			let tablerow = tablebody[i];
			let row: any = {};
	
			for (let j = 0; j < q.searchFor.length; j++) {
				let sf = q.searchFor[j];
	
				let name: string = j + "_query";
				if (!isBaseQuery(q)) {
					name = (sf as Query).obj_name;
				}
	
				try {
					row[name] = this.executeTextQuery(tablerow, sf as TextQuery);
				} catch (error) {
					row[name] = "";
				}
			}
			
			table.push(row);
		}
	
		return table;
	}
	
	private executeTextQuery(dom: HTMLSingleReturn, q: TextQuery): string | null {
		let res = this.executeQuery(dom, q.query) as Element;
		return res.textContent;
	}
	
	private executeQuery(base: HTMLSingleReturn, q: Query | BaseQuery): HTMLReturn | null {
		if (isBaseQueryAll(q)) {
			return this.executeBaseQueryAll(base as Element, q);
		}
	
		if (isBaseQuery(q)) {
			return this.executeBaseQuery(base as Element, q);
		}
	
		if (isChildQuery(q) && q.from) {
			return (this.executeQuery(base, q.from) as Element).childNodes[q.childnum] as Element;
		}

		return null;
	}
	
	parse(dom: JSDOM): any {
		let result: any = {};
	
		for (let q in this.config.queries) {
			let qc = this.config.queries[q];
	
			if (isTableQuery(qc as TableQuery)) {
				let res = this.executeTableQuery(dom.window.document.body, qc as TableQuery);
				if (res) {
					result[q] = { ...qc, scraped: res };
				};
			}
	
			if (isTextQuery(qc as TextQuery)) {
				let res = this.executeTextQuery(dom.window.document.body, qc as TextQuery);
				if (res) {
					result[q] = { ...qc, scraped: res };
				};
			}
		}
	
		return result;
	}
}