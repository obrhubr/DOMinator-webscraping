import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BaseQuery, BaseQueryAll, ChildQuery, TextQuery, Query, TableQuery } from '@dominator/parser';

@Component({
  selector: 'app-table-query',
  templateUrl: './table-query.component.html',
  styleUrls: ['./table-query.component.scss']
})
export class TableQueryComponent implements OnInit {

  tableBodyQuery = { name: "", obj_name: "", query: { query: "" } as BaseQuery };
  tableQueryDone = false;

  searchForQueries = [{ name: "", obj_name: "", query: { query: "" } as BaseQuery }];

  done = false;

  @Input() dom: Document | null = null;
  tableBodySelected = false;
  rowDom: any;

  @Input() query: TableQuery = { name: "", obj_name: "", tablebody: { query: "" } as BaseQuery, searchFor: [] as TextQuery[] }
  @Input() index = -1
  @Output() sendTableQuery = new EventEmitter()
  @Output() deleted = new EventEmitter()
  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
  }

  domSelected(d: any) {
    this.tableBodySelected = true;
    this.rowDom = d;
  }

  // Get Query from app-text-query and copy it's query into the tablebody query
  // Then take the name and obj_name and set the tableQuery's name and obj_name
  setTableBodyQuery(q: TextQuery) {
    this.query.tablebody = q.query;

    this.query.name = q.name;
    this.query.obj_name = q.obj_name;

    this.tableQueryDone = true;

    this.checkDone();
  }

  setSearchForQuery(q: TextQuery) {
    this.query.searchFor.push(q);

    this.checkDone();
  }

  checkDone() {
    if (this.tableQueryDone && (this.searchForQueries.length == this.query.searchFor.length)) {
      this.done = true;
      this.send();
    }
  }
  
  addSearchFor() {
    this.searchForQueries.push({ name: "", obj_name: "", query: { query: "" } as BaseQuery });
  }

  send() {
    this.sendTableQuery.emit(this.query);
  }

  deleteSearchFor(i: number | null) {
    if (i != null) {
      if (i > 0) {
        this.searchForQueries.splice(i, 1);
      }
      if (i == 0) {
        this.searchForQueries.shift();
      }
    }
  }

  delete() {
    this.deleted.emit(this.index);
  }

}
