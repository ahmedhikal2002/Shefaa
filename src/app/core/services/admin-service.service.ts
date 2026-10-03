import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IAddLabTechnician } from '../../shared/interfaces/Admin/IAddLabTechnician';
import { IGetLabTechnicians } from '../../shared/interfaces/Admin/IGetLabTechnicians';
import { IPagedResponse } from '../../shared/interfaces/Admin/IPagedResponse';
import { ILabTechnician } from '../../shared/interfaces/Admin/ILabTechnician';
import { IAdminDashboard } from '../../shared/interfaces/Admin/IAdminDashboard';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly baseUrl = 'https://smart-medical-system.runasp.net/api';

  constructor(private http: HttpClient) {}

  addLabTechnician(data: FormData): Observable<ILabTechnician> {
    return this.http.post<ILabTechnician>(`${this.baseUrl}/LabTechnicians/create`, data);
  }

  deletLabTechnician(nationalId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/LabTechnicians/${nationalId}`);
  }

  getAllLabTechnicians(request: IGetLabTechnicians): Observable<IPagedResponse<ILabTechnician>> {
    let params = new HttpParams()
      .set('PageNumber', request.pageNumber.toString())
      .set('PageSize', request.pageSize.toString());

    if (request.search?.trim()) {
      params = params.set('Search', request.search.trim());
    }

    if (request.laboratory?.trim()) {
      params = params.set('Laboratory', request.laboratory.trim());
    }

    if (request.employmentStatus !== undefined) {
      params = params.set('EmploymentStatus', request.employmentStatus.toString());
    }

    if (request.workShift !== undefined) {
      params = params.set('WorkShift', request.workShift.toString());
    }

    if (request.joiningDate) {
      params = params.set('JoiningDate', request.joiningDate);
    }

    return this.http.get<IPagedResponse<ILabTechnician>>(`${this.baseUrl}/LabTechnicians`, {
      params,
    });
  }

  getDashboardStats(): Observable<IAdminDashboard> {
    return this.http.get<IAdminDashboard>(`${this.baseUrl}/AdminDashboard`);
  }

  getLabTechnicianById(nationalId: string): Observable<ILabTechnician> {
    return this.http.get<ILabTechnician>(`${this.baseUrl}/LabTechnicians/${nationalId}`);
  }

  updateLabTechnician(nationalId: string, formData: FormData): Observable<ILabTechnician> {
    return this.http.put<ILabTechnician>(`${this.baseUrl}/LabTechnicians/${nationalId}`, formData);
  }
}
