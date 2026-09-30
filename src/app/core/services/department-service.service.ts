import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../shared/interfaces/Department/PaginatedResult';
import { Department } from '../../shared/interfaces/Department/Department';
import { CreateDepartmentDto } from '../../shared/interfaces/Department/CreateDepartmentDto';
import { UpdateDepartmentDto } from '../../shared/interfaces/Department/UpdateDepartmentDto';
import { DoctorForSelect } from '../../shared/interfaces/Department/DoctorForSelect';
import { AuthenticationService } from './authenticationService.service';
import { DoctorAtDepartment } from '../../shared/interfaces/Department/DoctorAtDepartment ';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = 'https://smart-medical-system.runasp.net/api/Departments';
  private doctorsUrl = 'https://smart-medical-system.runasp.net/api/Doctors';

  // private apiUrl = 'https://localhost:7099/api/Departments';
  // private doctorsUrl = 'https://localhost:7099/api/Doctors';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
  ) {}

  // ============================================================
  // Department APIs
  // ============================================================

  // Get all departments (paginated)
  // في department.service.ts
  getAllDepartments(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    statusFilter?: string,
    creationDateFilter?: string, // ← NEW
    managerFilter?: string, // ← NEW
  ): Observable<PaginatedResult<Department>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    if (statusFilter) {
      params = params.set('statusFilter', statusFilter);
    }
    if (creationDateFilter && creationDateFilter !== 'all') {
      params = params.set('creationDateFilter', creationDateFilter);
    }
    if (managerFilter && managerFilter !== 'all') {
      params = params.set('managerFilter', managerFilter);
    }

    return this.http.get<PaginatedResult<Department>>(this.apiUrl, { params });
  }

  // Get department by ID
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  // Get active departments
  getActiveDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/active`);
  }

  // Check if department name is unique
  isDepartmentNameUnique(name: string, excludeId?: number): Observable<boolean> {
    let params = new HttpParams().set('name', name);
    if (excludeId) {
      params = params.set('excludeId', excludeId.toString());
    }
    return this.http.get<boolean>(`${this.apiUrl}/unique`, { params });
  }

  // Create new department
  createDepartment(data: CreateDepartmentDto): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, data);
  }

  // Update department
  updateDepartment(id: number, data: UpdateDepartmentDto): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, data);
  }

  // Delete department
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Assign head doctor
  assignHeadDoctor(departmentId: number, doctorId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${departmentId}/head-doctor/${doctorId}`, {});
  }

  // ============================================================
  // Doctor APIs (for select dropdown)
  // ============================================================

  getDoctorsForSelect(
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<PaginatedResult<any>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult<DoctorForSelect>>(
      `${this.doctorsUrl}/available-for-new-department`,
      { params },
    );
  }

  // Get department doctors with pagination (using DoctorsController)
  getDepartmentDoctors(
    departmentId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
  ): Observable<PaginatedResult<DoctorAtDepartment>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<DoctorAtDepartment>>(
      `${this.doctorsUrl}/by-department/${departmentId}`,
      { params },
    );
  }
}
