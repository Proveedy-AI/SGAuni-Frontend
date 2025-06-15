import { BrowserRouter, Route, Routes } from 'react-router';
import { AdminLayout, AuthLayout } from './layouts';
//import { PrivateRoute, ProtectedRoute } from './PrivateRoute ';
import { LoginAdmin, ResetPassword } from './views/auth';
import {
	AccountProfile,
	SettingsCountries,
	SettingsLayout,
	SettingsPrograms,
	SettingsRoles,
	SettingsModalities,
} from './views/admin/settings';
import { UserList } from './views/admin/UserList';
import { PrivateRoute, ProtectedRoute } from './PrivateRoute ';
import { Dashboard } from './views/admin/Dashboard';
import {
	AdmissionApplicantDetail,
	AdmissionApplicants,
	AdmissionApplicantsByProgram,
	AdmissionsMyPrograms,
	AdmissionsProccess,
	AdmissionsPrograms,
} from './views/admin/admissions';
import { Contracts, MyContracts } from './views/admin/contracts';
import AdmissionForm from './views/Inscription';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/auth' element={<AuthLayout />}>
						<Route path='login' element={<LoginAdmin />} />
						{/*<Route path='admin/login' element={<LoginAdmin />} />*/}
						<Route path='reset-password' element={<ResetPassword />} />
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
								<Route
									element={
										<ProtectedRoute requiredPermission='admissions.programs.view' />
									}
								>
									<Route path='programs/:id' element={<AdmissionsPrograms />} />
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='admissions.myprograms.view' />
									}
								>
									<Route
										path='myprograms/:id'
										element={<AdmissionsMyPrograms />}
									/>
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='admissions.myprograms.view' />
									}
								>
									<Route path='applicants'>
										<Route index element={<AdmissionApplicants />} />

										<Route
											path='programs/:id'
											element={<AdmissionApplicantsByProgram />}
										/>
										<Route
											path='programs/:programId/estudiante/:id'
											element={<AdmissionApplicantDetail />}
										/>
									</Route>
								</Route>
							</Route>
							s
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
								<Route
									element={
										<ProtectedRoute requiredPermission='settings.adminprofile.view' />
									}
								>
									<Route path='profile' element={<AccountProfile />} />
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='settings.studenprofile.view' />
									}
								>
									<Route path='myprofile' element={<AccountProfile />} />
								</Route>

								<Route
									element={
										<ProtectedRoute requiredPermission='settings.modalities.view' />
									}
								>
									<Route path='modalities' element={<SettingsModalities />} />
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

					{/* Ruta para ir a formulario de inscripción */}
					<Route path='admission-process/:uuid' element={<AdmissionForm />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
