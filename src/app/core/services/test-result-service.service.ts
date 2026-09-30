import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientResult } from '../../shared/interfaces/LabTechnician/PatientResult';
import { PatientResultElement } from '../../shared/interfaces/LabTechnician/PatientResultElement';
import { PaginatedResponse } from '../../shared/interfaces/LabTechnician/PaginatedResponse';
import { PatientAIReport } from '../../shared/interfaces/LabTechnician/PatientAIReport';
@Injectable({
  providedIn: 'root',
})
export class TestResultService {
  private api = 'https://smart-medical-system.runasp.net/api';

  constructor(private http: HttpClient) {}

  getRequestInfo(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/requestLabs/${id}`);
  }

  getLabTestElements(labTestId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/LabTestElements/by-lab-test/${labTestId}`);
  }

  getTestElementById(testElementId: number): Observable<any> {
    return this.http.get<any>(`${this.api}/TestElements/${testElementId}`);
  }

  submitPatientResults(result: any): Observable<any> {
    return this.http.post<any>(`${this.api}/PatientResults`, result);
  }

  submitPatientResultElements(resultElements: any): Observable<any> {
    return this.http.post<any>(`${this.api}/PatientResultElements`, resultElements);
  }

  generateAIReport(patientResultId: number): Observable<PatientAIReport> {
    return this.http.post<PatientAIReport>(
      `${this.api}/PatientAIReports/results/${patientResultId}/generate`,
      {},
    );
  }

  updatePatientResult(patientId: number, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.api}/PatientResults/${patientId}`, updatedData);
  }

  getUserFullReport(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.api}/PatientAIReports/patients/${patientId}/full-report`);
  }

  PatchRequestStatus(requestLabId: number, labTestId: number, data: any): Observable<any> {
    return this.http.patch(
      `${this.api}/request-labs/${requestLabId}/lab-tests/${labTestId}/status`,
      data,
    );
  }
}
