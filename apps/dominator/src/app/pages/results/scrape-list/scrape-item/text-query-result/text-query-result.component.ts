import { TextQueryResult } from './../../../scrape-result';
import { Component, Input, OnInit } from '@angular/core';
import { TextQuery, BaseQuery } from '@dominator/parser';

@Component({
  selector: 'app-text-query-result',
  templateUrl: './text-query-result.component.html',
  styleUrls: ['./text-query-result.component.scss']
})
export class TextQueryResultComponent implements OnInit {

  @Input() q: TextQueryResult = { name: "", scraped: "", obj_name: "", query: { query: "" } as BaseQuery }
  constructor() { }

  ngOnInit(): void {
  }

}
