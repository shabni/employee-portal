import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PortalApiService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:3000/api';
  login(data: unknown): Observable<any> { return this.http.post(`${this.base}/auth/logIn`, data); }
  logout(userId: string): Observable<any> { return this.http.post(`${this.base}/auth/logOut`, { userId }); }
  session(token: string): Observable<any> { return this.http.post(`${this.base}/auth/session`, { token }); }
  employees(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/user/getEmployees`); }
  employee(id: string): Observable<any> { return this.http.get(`${this.base}/user/${encodeURIComponent(id)}`); }
  createEmployee(data: unknown): Observable<any> { return this.http.post(`${this.base}/user/createEmployee`, data); }
  updateEmployee(id: string, data: unknown): Observable<any> { return this.http.patch(`${this.base}/user/updateEmployee/${encodeURIComponent(id)}`, data); }
  roles(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/settings/getRoles`); }
  createRole(data: unknown): Observable<any> { return this.http.post(`${this.base}/settings/createRole`, data); }
  updateRole(id: string, data: unknown): Observable<any> { return this.http.patch(`${this.base}/settings/updateRole/${encodeURIComponent(id)}`, data); }
  teamLeads(roleId: string): Observable<any[]> { return this.http.get<any[]>(`${this.base}/user/getTeamLeads/${encodeURIComponent(roleId)}`); }
  attendance(userId: string): Observable<any[]> { return this.http.get<any[]>(`${this.base}/attendence/getUserAttendence/${encodeURIComponent(userId)}`); }
  updateAttendance(id: string, data: unknown): Observable<any> { return this.http.patch(`${this.base}/attendence/${encodeURIComponent(id)}`, data); }
  checkIn(data: unknown): Observable<any> { return this.http.post(`${this.base}/attendence/checkIn`, data); }
  checkOut(data: unknown): Observable<any> { return this.http.post(`${this.base}/attendence/checkOut`, data); }
  reports(userId: string): Observable<any[]> { return this.http.get<any[]>(`${this.base}/reports/getUserReport/${encodeURIComponent(userId)}`); }
  createReport(data: unknown): Observable<any> { return this.http.post(`${this.base}/reports/createUserReport`, data); }
  updateReport(id: string, data: unknown): Observable<any> { return this.http.patch(`${this.base}/reports/updateReport/${encodeURIComponent(id)}`, data); }
  tasks(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/tasks/getAllTasks`); }
  createTask(data: unknown): Observable<any> { return this.http.post(`${this.base}/tasks/createTask`, data); }
  updateTask(id: string, data: unknown): Observable<any> { return this.http.patch(`${this.base}/tasks/updateTask/${encodeURIComponent(id)}`, data); }
  activeTask(userId: string): Observable<any> { return this.http.get(`${this.base}/tasks/userActiveTask/${encodeURIComponent(userId)}`); }
  startTask(data: unknown): Observable<any> { return this.http.post(`${this.base}/tasks/createTaskTrack`, data); }
  stopTask(taskTrackId: string): Observable<any> { return this.http.post(`${this.base}/tasks/stopTask`, { taskTrackId }); }
  subtasks(taskId: string): Observable<any[]> { return this.http.get<any[]>(`${this.base}/subtasks/getAllSubTasks/${encodeURIComponent(taskId)}`); }
  saveSubtasks(data: unknown[]): Observable<any> { return this.http.post(`${this.base}/subtasks/createSubTasks`, data); }
  upload(folder: string, file: File): Observable<any> { const form = new FormData(); form.append('photo', file); return this.http.post(`${this.base}/uploads/${encodeURIComponent(folder)}`, form); }
  teamMembers(id: string): Observable<any[]> { return this.http.get<any[]>(`${this.base}/team/getTeamMembers/${encodeURIComponent(id)}`); }
  teamData(kind: 'getTeamAttendence' | 'getTeamReports' | 'getTeamProgress', userId: string, date: number): Observable<any[]> {
    const key = kind === 'getTeamAttendence' ? 'attendenceDate' : kind === 'getTeamReports' ? 'reportDate' : 'progressDate';
    const params = new HttpParams().set('userId', userId).set(key, date.toString());
    return this.http.get<any[]>(`${this.base}/team/${kind}`, { params });
  }
}
