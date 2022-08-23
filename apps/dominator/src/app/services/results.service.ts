import { ScrapeResult } from '../pages/results/scrape-result';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ResultsService {

    constructor(private http: HttpClient) {}

    getResults(id: string) {
        return this.http.get<ScrapeResult[]>(environment.baseUrl + '/scrape/config/' + id)
    }
}