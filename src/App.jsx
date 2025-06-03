import { BrowserRouter, Route, Routes } from 'react-router';
import { AdminLayout, AuthLayout } from './layouts';
//import { PrivateRoute, ProtectedRoute } from './PrivateRoute ';
import { Home } from './views/admin';
import { Login, LoginAdmin, ResetPassword } from './views/auth';
import { AccountProfile, SettingsCountries, SettingsLayout, SettingsPrograms, SettingsRoles, SettingsAdmissionModality } from './views/admin/settings';
import { UserList } from './views/admin/UserList';
import { PrivateRoute } from './PrivateRoute ';

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
							<Route index element={<Home />} />

							<Route path='usuarios' element={<UserList />} />
							{/* SETTINGS */}
							<Route path='settings' element={<SettingsLayout />}>
								<Route path='profile' element={<AccountProfile />} />
								<Route path='modalities' element={<SettingsAdmissionModality />} />
                <Route path='programs' element={<SettingsPrograms />} />
								<Route path='roles' element={<SettingsRoles />} />
								<Route path='regional' element={<SettingsCountries />} />
							</Route>
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
