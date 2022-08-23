import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { QueryConfig, QueryConfigResponse } from '@dominator/parser';
import { Observable } from 'rxjs';
import { PreviewInterface } from '@dominator/api-interfaces';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    constructor(private http: HttpClient) {}

    getPreview(url: string): Observable<PreviewInterface> {
        return this.http.post<PreviewInterface>(environment.baseUrl + '/scrape/preview', JSON.stringify({ url }), { headers: { "Content-Type": "application/json" }});
    }

    createConfig(qc: QueryConfig) {
        return this.http.post(environment.baseUrl + '/config', JSON.stringify(qc), { headers: { "Content-Type": "application/json" }});
    }

    getConfigs(): Observable<QueryConfigResponse[]> {
        return this.http.get<QueryConfigResponse[]>(environment.baseUrl + '/config');
    }

    getConfigWithId(id: string): Observable<QueryConfigResponse> {
        return this.http.get<QueryConfigResponse>(environment.baseUrl + '/config/' + id);
    }

    deleteConfig(id: string) {
        return this.http.delete(environment.baseUrl + '/config/' + id).subscribe(data => console.log('Delete Successful'));
    }

    scrape(id: string) {
        return this.http.get(environment.baseUrl + '/scrape/start/' + id).subscribe(data => console.log('Started Scrape'));
    }
}