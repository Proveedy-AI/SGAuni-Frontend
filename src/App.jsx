import { BrowserRouter, Route, Routes } from 'react-router';
import { AdminLayout, AuthLayout } from './layouts';
//import { PrivateRoute, ProtectedRoute } from './PrivateRoute ';
import { Login, LoginAdmin, ResetPassword } from './views/auth';
import {
	AccountProfile,
	SettingsCountries,
	SettingsLayout,
	SettingsPrograms,
	SettingsRoles,
	SettingsAdmissionModality,
} from './views/admin/settings';
import { UserList } from './views/admin/UserList';
import { PrivateRoute, ProtectedRoute } from './PrivateRoute ';
import { Dashboard } from './views/admin/Dashboard';
import { AdmissionsProccess } from './views/admin/admissions';
import { Contracts, MyContracts } from './views/admin/contracts';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/auth' element={<AuthLayout />}>
						<Route path='login' element={<Login />} />
						<Route path='admin/login' element={<LoginAdmin />} />
						<Route path='reset-password/:token' element={<ResetPassword />} />
					</Route>

					<Route element={<PrivateRoute />}>
						<Route path='/' element={<AdminLayout />}>
							<Route index element={<Dashboard />} />

							<Route
								element={
									<ProtectedRoute requiredPermission='users.users.view' />
								}
							>
								<Route path='users' element={<UserList />} />
							</Route>

							<Route path='admissions'>
								<Route
									element={
										<ProtectedRoute requiredPermission='admissions.proccess.view' />
									}
								>
									<Route path='proccess' element={<AdmissionsProccess />} />
								</Route>
							</Route>

							<Route path='contracts'>
								<Route
									element={
										<ProtectedRoute requiredPermission='contracts.mylist.view' />
									}
								>
									<Route path='mylist' element={<MyContracts />} />
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='contracts.list.view' />
									}
								>
									<Route path='list' element={<Contracts />} />
								</Route>
							</Route>

							{/* SETTINGS */}
							<Route path='settings' element={<SettingsLayout />}>
								<Route path='profile' element={<AccountProfile />} />
								<Route
									element={
										<ProtectedRoute requiredPermission='settings.modalities.view' />
									}
								>
									<Route
										path='modalities'
										element={<SettingsAdmissionModality />}
									/>
								</Route>

								<Route
									element={
										<ProtectedRoute requiredPermission='settings.program.view' />
									}
								>
									<Route path='programs' element={<SettingsPrograms />} />
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='settings.roles.view' />
									}
								>
									<Route path='roles' element={<SettingsRoles />} />
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='settings.countries.view' />
									}
								>
									<Route path='regional' element={<SettingsCountries />} />
								</Route>
							</Route>
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
