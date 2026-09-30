import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestLabsService {
  private baseUrl = 'https://smart-medical-system.runasp.net/api/RequestLabs';

  constructor(private http: HttpClient) {}

  RequestLabsTable(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/laboratory?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  RequestsDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  SessionRequests(sessionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/by-session/${sessionId}`);
  }
}
