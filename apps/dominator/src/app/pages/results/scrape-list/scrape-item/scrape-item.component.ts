import { environment } from './../../../../../environments/environment';
import { ScrapeResult, TableQueryResult, TextQueryResult } from './../../scrape-result';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scrape-item',
  templateUrl: './scrape-item.component.html',
  styleUrls: ['./scrape-item.component.scss']
})
export class ScrapeItemComponent implements OnInit {

  @Input() result: ScrapeResult = { _id: "", _config: "", blob: { queries: [] }, createdAt: "", updatedAt: "" }
  constructor() { }

  baseUrl = environment.baseUrl;

  collapsed = true;

  ngOnInit(): void {
    console.log(this.result);
  }

  getTextQueries(): TextQueryResult[] {
    let qs: TextQueryResult[] = [];

    for (let k in this.result.blob) {
      let val = this.result.blob[k];
      if(val.query !== undefined) {
        qs.push(val);
      };
    }

    return qs;
  }

  getTableQueries(): TableQueryResult[] {
    let qs: TableQueryResult[] = [];

    for (let k in this.result.blob) {
      let val = this.result.blob[k];
      if(val.tablebody !== undefined) {
        qs.push(val);
      };
    }

    return qs;
  }

  collapse() {
    this.collapsed = !this.collapsed;
  }

}
