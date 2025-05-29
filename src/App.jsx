import { BrowserRouter, Route, Routes } from 'react-router';
import { AdminLayout, AuthLayout } from './layouts';
//import { PrivateRoute, ProtectedRoute } from './PrivateRoute ';
import {
	Home,
} from './views/admin';
import { Login, LoginAdmin, ResetPassword } from './views/auth';
import { AccountProfile, SettingsLayout } from './views/admin/settings';

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

					<Route>
						<Route path='/' element={<AdminLayout />}>
							<Route index element={<Home />} />

							{/* SETTINGS */}
							<Route path='settings' element={<SettingsLayout />}>
								<Route path='profile' element={<AccountProfile />} />
							</Route>
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
