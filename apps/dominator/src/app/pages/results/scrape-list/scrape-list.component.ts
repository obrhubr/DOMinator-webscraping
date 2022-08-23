import { ScrapeResult } from './../scrape-result';
import { QueryConfigResponse } from '@dominator/parser';
import { Component, Input, OnInit } from '@angular/core';
import { ResultsService } from '../../../services/results.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-scrape-list',
  templateUrl: './scrape-list.component.html',
  styleUrls: ['./scrape-list.component.scss']
})
export class ScrapeListComponent implements OnInit {

  baseUrl = "";

  @Input() id: string = ""
  @Input() config: QueryConfigResponse = new QueryConfigResponse('', '', '', '', { queries: [] })
  constructor(private readonly resultsService: ResultsService) { }

  results: ScrapeResult[] = [];

  ngOnInit(): void {
    this.baseUrl = environment.baseUrl;
    this.resultsService.getResults(this.id).subscribe(data => this.results = data);
  }

}
