import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LabTechService {
  private baseUrl = 'https://smart-medical-system.runasp.net/api';

  constructor(private http: HttpClient) {}
  // ===============Profile=======================
  private apiUrl = 'https://smart-medical-system.runasp.net/api/Profile';
  ProfileOpen(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/me/${id}`);
  }

  ProfileSaveChanges(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/${id}`, data);
  }

  // Get Dashboard Statistics
  getLabRequestStatistics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/RequestLabs/laboratory/statistics`);
  }

  // Get Pending Requests
  getLabRequests(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/RequestLabs/laboratory?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  // Update Request Status (Start Test / Complete Test)
  updateRequestStatus(requestId: number, body: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/RequestLabs/${requestId}/status`, body);
  }

  // ================= Patient Results =================

  // Create Patient Result
  createPatientResult(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/PatientResults`, body);
  }

  // Edit Patient Result
  updatePatientResult(id: number, body: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/PatientResults/${id}`, body);
  }

  // Get Patient Result
  getPatientResult(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/PatientResults/${id}`);
  }

  // ================= Patient Result Elements =================

  // Get Result Elements
  getPatientResultElements(
    patientResultId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/PatientResultElements/by-patient-result/${patientResultId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  // Add Result Element
  createPatientResultElement(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/PatientResultElements`, body);
  }

  // Edit Result Element
  updatePatientResultElement(id: number, body: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/PatientResultElements/${id}`, body);
  }

  // ================= Lab Test Elements =================

  // Get Lab Test Elements
  getLabTestElements(labTestId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/LabTestElements/by-lab-test/${labTestId}`);
  }

  // ================= AI Report =================

  // Generate AI Report
  generateAIReport(patientResultId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/PatientAIReports/results/${patientResultId}/generate`,
      {},
    );
  }

  // ================= Notifications =================

  getUnreadNotificationsCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Notifications/unread-count`);
  }
}
