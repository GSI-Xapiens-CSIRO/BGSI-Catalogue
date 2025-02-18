import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getProjects(
    hub_api_endpoint: any,
    limit: number = 10,
    last_evaluated_key: string | null = null,
    search: string = '',
  ): Observable<any> {
    const url = `${hub_api_endpoint.endpoint}prod/projects`;
    return this.http.get(url, {
      params: {
        limit: limit.toString(),
        last_evaluated_key: last_evaluated_key || '',
        search: search,
      },
    });
  }
}
