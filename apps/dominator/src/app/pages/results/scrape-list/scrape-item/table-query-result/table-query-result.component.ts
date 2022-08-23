import { TableQueryResult } from './../../../scrape-result';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-query-result',
  templateUrl: './table-query-result.component.html',
  styleUrls: ['./table-query-result.component.scss']
})
export class TableQueryResultComponent implements OnInit {

  columns: string[] = []

  @Input() q: TableQueryResult = { name: "", obj_name: "", tablebody: {}, searchFor: [], scraped: [] }
  constructor() { }

  ngOnInit(): void {
    for (let key in this.q.scraped[0]) {
      this.columns.push(key);
    }
  }

  getValMinusHead(row: any): string[] {
    let cols: string[] = [];

    for (let key in row) {
      cols.push(row[key]);
    }
    cols.shift();
    return cols;
  }

  getHead(row: any): string {
    let cols: string[] = [];

    for (let key in row) {
      cols.push(row[key]);
    }

    return cols[0];
  }

}
