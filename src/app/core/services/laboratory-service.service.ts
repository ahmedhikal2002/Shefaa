import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../shared/interfaces/Department/PaginatedResult';
import { Laboratory } from '../../shared/interfaces/Laboratory/Laboratory';
import { LaboratoryForSelect } from '../../shared/interfaces/Laboratory/LaboratoryForSelect';
import { CreateLaboratoryDto } from '../../shared/interfaces/Laboratory/CreateLaboratoryDto';
import { UpdateLaboratoryDto } from '../../shared/interfaces/Laboratory/UpdateLaboratoryDto';
import { DepartmentForSelect } from '../../shared/interfaces/Laboratory/DepartmentForSelect';
import { TechnicianForSelect } from '../../shared/interfaces/Laboratory/TechnicianForSelect';
import { LaboratoryDetails } from '../../shared/interfaces/Laboratory/LaboratoryDetails';

@Injectable({
  providedIn: 'root',
})
export class LaboratoryService {
  private apiUrl = 'https://smart-medical-system.runasp.net/api/Laboratories';
  private departmentsUrl = 'https://smart-medical-system.runasp.net/api/Departments';
  private techniciansUrl = 'https://smart-medical-system.runasp.net/api/LabTechnicians';
  private labTestUrl = 'https://smart-medical-system.runasp.net/api/LabTests';

  // private apiUrl = 'https://localhost:7099/api/Laboratories';
  // private departmentsUrl = 'https://localhost:7099/api/Departments';
  // private techniciansUrl = 'https://localhost:7099/api/LabTechnicians';
  // private labTestUrl = 'https://localhost:7099/api/LabTests';

  constructor(private http: HttpClient) {}

  // ============================================================
  // Get all laboratories (paginated)
  // ============================================================
  getAllLaboratories(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    statusFilter?: string,
  ): Observable<PaginatedResult<Laboratory>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    if (statusFilter) {
      params = params.set('statusFilter', statusFilter);
    }

    return this.http.get<PaginatedResult<Laboratory>>(this.apiUrl, { params });
  }

  // ============================================================
  // Get laboratory by ID
  // ============================================================
  getLaboratoryById(id: number): Observable<LaboratoryDetails> {
    return this.http.get<LaboratoryDetails>(`${this.apiUrl}/${id}`);
  }

  // ============================================================
  // Get active laboratories (for select)
  // ============================================================
  getActiveLaboratories(): Observable<LaboratoryForSelect[]> {
    return this.http.get<LaboratoryForSelect[]>(`${this.apiUrl}/active`);
  }

  // ============================================================
  // Get laboratories for select
  // ============================================================
  getLaboratoriesForSelect(): Observable<LaboratoryForSelect[]> {
    return this.http.get<LaboratoryForSelect[]>(`${this.apiUrl}/for-select`);
  }

  // ============================================================
  // Check if laboratory name is unique
  // ============================================================
  isLaboratoryNameUnique(name: string, excludeId?: number): Observable<boolean> {
    let params = new HttpParams().set('name', name);
    if (excludeId) {
      params = params.set('excludeId', excludeId.toString());
    }
    return this.http.get<boolean>(`${this.apiUrl}/unique`, { params });
  }

  // ============================================================
  // Create new laboratory
  // ============================================================
  createLaboratory(data: CreateLaboratoryDto): Observable<Laboratory> {
    return this.http.post<Laboratory>(this.apiUrl, data);
  }

  // ============================================================
  // Update laboratory
  // ============================================================
  updateLaboratory(id: number, data: UpdateLaboratoryDto): Observable<Laboratory> {
    return this.http.put<Laboratory>(`${this.apiUrl}/${id}`, data);
  }

  // ============================================================
  // Delete laboratory
  // ============================================================
  deleteLaboratory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ============================================================
  // Get departments for select
  // ============================================================
  getDepartmentsForSelect(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
  ): Observable<PaginatedResult<DepartmentForSelect>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<DepartmentForSelect>>(`${this.departmentsUrl}`, {
      params,
    });
  }

  // ============================================================
  // Get technicians for select (filter by laboratory)
  // ============================================================
  getTechniciansForSelect(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
  ): Observable<PaginatedResult<TechnicianForSelect>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<TechnicianForSelect>>(
      `${this.techniciansUrl}/available-for-new-laboratory`,
      {
        params,
      },
    );
  }

  getTechniciansForEdit(
    laboratoryId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
  ): Observable<PaginatedResult<TechnicianForSelect>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<TechnicianForSelect>>(
      `${this.techniciansUrl}/available-for-laboratory/${laboratoryId}`,
      { params },
    );
  }

  // ============================================================
  // Get Lab Tests by Laboratory (using LabTestsController)
  // ============================================================
  getLabTestsByLaboratory(
    labId: number,
    pageNumber: number = 1,
    pageSize: number = 5,
    searchTerm?: string,
  ): Observable<PaginatedResult<any>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<any>>(`${this.labTestUrl}/by-laboratory/${labId}`, {
      params,
    });
  }

  // ============================================================
  // Get technicians by laboratory (using LabTechniciansController)
  // ============================================================
  getTechniciansByLaboratory(
    labId: number,
    pageNumber: number = 1,
    pageSize: number = 5,
    searchTerm?: string,
  ): Observable<PaginatedResult<any>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<any>>(`${this.techniciansUrl}/by-laboratory/${labId}`, {
      params,
    });
  }
}
