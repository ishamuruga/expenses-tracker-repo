import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ExpenseCreateComponent } from './features/expenses/expense-create.component';
import { AppLayoutComponent } from './features/layout/app-layout.component';

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{
		path: '',
		canActivate: [authGuard],
		component: AppLayoutComponent,
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'expenses/create', component: ExpenseCreateComponent },
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }
		]
	},
	{ path: '**', redirectTo: '' }
];
