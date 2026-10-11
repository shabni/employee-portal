import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { SessionService } from './core/session.service';
import { WorkspaceComponent } from './layout/workspace.component';
import { LoginComponent } from './pages/auth/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { RolesComponent } from './pages/roles/roles.component';
import { TeamComponent } from './pages/team/team.component';
import { ChatComponent } from './pages/chat/chat.component';

const signedInGuard: CanActivateFn = () => inject(SessionService).isAuthenticated || inject(Router).createUrlTree(['/']);

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'setup/employees', component: EmployeesComponent },
  { path: 'setup/roles', component: RolesComponent },
  { path: 'setup/tasks', component: TasksComponent },
  {
    path: 'workspace', component: WorkspaceComponent, canActivate: [signedInGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      { path: 'overview', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'team', component: TeamComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'chat', component: ChatComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
