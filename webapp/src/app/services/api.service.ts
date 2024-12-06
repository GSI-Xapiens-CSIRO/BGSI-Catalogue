import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getProjects(hub_api_endpoint: any): Observable<any> {
    const url = `${hub_api_endpoint.endpoint}prod/projects`;
    return this.http.get(url);
  }
}
