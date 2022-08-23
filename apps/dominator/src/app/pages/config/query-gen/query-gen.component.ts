import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { BaseQuery, isTextQuery, TableQuery, TextQuery } from '@dominator/parser';

@Component({
  selector: 'app-query-gen',
  templateUrl: './query-gen.component.html',
  styleUrls: ['./query-gen.component.scss']
})
export class QueryGenComponent implements OnInit {

  @Output() sendQueryConfig = new EventEmitter()
  @Input() dom = ""
  constructor(private readonly formBuild: FormBuilder) { }

  createdQueries: (TextQuery | TableQuery)[] = [];
  finishedQueries: (TextQuery | TableQuery)[] = [];

  queryForm = new FormControl(this.createdQueries)

  allDone = false;

  parsedDom: Document | null = null;
  pText: string | null | undefined = "";

  ngOnInit(): void {
    let p = new DOMParser();
    this.parsedDom = p.parseFromString(this.dom, 'text/html');

    this.pText = this.parsedDom.querySelector('.menuTop__items')?.textContent;
  }

  createNewTextQuery() {
    this.createdQueries.push({ name: "", obj_name: "", query: { query: "" } as BaseQuery } as TextQuery);
  }

  createNewTableQuery() {
    this.createdQueries.push({ name: "", obj_name: "", tablebody: { query: "" } as BaseQuery, searchFor: [] } as TableQuery);
  }

  getTextQueries(): TextQuery[] {
    return this.createdQueries.filter((q) => {
      if((q as TableQuery).tablebody == undefined) {
        return true;
      };
      return false;
    }) as TextQuery[];
  }

  getTableQueries(): TableQuery[] {
    return this.createdQueries.filter((q) => {
      if((q as TableQuery).tablebody !== undefined) {
        return true;
      };
      return false;
    }) as TableQuery[];
  }

  setTextQuery(q: TextQuery) {
    this.finishedQueries.push(q);
  }

  setTableQuery(q: TableQuery) {
    this.finishedQueries.push(q);
  }

  deleteText(i: number | null) {
    if (i != null) {
      if (i > 0) {
        let temp = this.getTextQueries();
        temp.splice(i, 1);

        this.createdQueries = (temp as (TextQuery | TableQuery)[]).concat((this.getTableQueries() as (TextQuery | TableQuery)[]));
      }
      if (i == 0) {
        let temp = this.getTextQueries();
        temp.shift();

        this.createdQueries = (this.getTableQueries() as (TextQuery | TableQuery)[]).concat((temp as (TextQuery | TableQuery)[]));
      }
    }
  }

  deleteTable(i: number | null) {
    if (i != null) {
      if (i > 0) {
        let temp = this.getTableQueries();
        temp.splice(i, 1);

        this.createdQueries = (temp as (TextQuery | TableQuery)[]).concat((this.getTextQueries() as (TextQuery | TableQuery)[]));
      }
      if (i == 0) {
        let temp = this.getTableQueries();
        temp.shift();

        this.createdQueries = (this.getTextQueries() as (TextQuery | TableQuery)[]).concat((temp as (TextQuery | TableQuery)[]));
      }
    }
  }

  done() {
    this.allDone = true;
    this.sendQueryConfig.emit(this.finishedQueries);
  }

}
