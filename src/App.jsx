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
	AccountStudentProfile,
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
	AdmissionEvaluators,
	AdmissionEvaluatorsByProgram,
} from './views/admin/admissions';
import { Contracts, MyContracts } from './views/admin/contracts';
import { AdmissionMyApplicants } from './views/admin/applicants/AdmissionMyApplicants';
import { ApplicantsLayout } from './views/admin/applicants/ApplicantsLayout';
import {
	TuitionMyPrograms,
	TuitionProcess,
	TuitonPrograms,
} from './views/admin/tuitions';
import {
	DebtsLayout,
	PaymentOrdersByRequest,
	PaymentRequestsView,
} from './views/admin/debts';
import { CoursesAndSchedules } from './views/admin/courses_and_schedules';
import ChakraInscriptionForm from './views/inscription-form';
import { PaymentOrdersView } from './views/admin/debts/PaymentOrdersView';
import { MyPaymentDebt } from './views/admin/mypayments/MyPaymentDebt';
import { MyPaymentsLayout } from './views/admin/mypayments/MyPaymentsLayout';
import { MyPaymentRequests } from './views/admin/mypayments/MyPaymentRequests';
import { MyPaymentAddRequests } from './views/admin/mypayments/MyPaymentAddRequests';
import { MyPaymentUpload } from './views/admin/mypayments/MyPaymentUpload';
import { MyPaymentHistories } from './views/admin/mypayments/MyPaymentHistories';
import { CommitmentLetters } from './views/admin/debt_requests';
import { MyPaymentSchedule } from './views/admin/mypayments/MyPaymentSchedule';
import { MyEnrollmentsLayout } from './views/admin/myenrollments/MyEnrollmentsLayout';
import { MyEnrollments } from './views/admin/myenrollments';
import { ClassMyCoursesByProgramView, ClassMyEstudentsByCourseView, ClassMyProgramView, MyClassesLayout } from './views/admin/myclasses';

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
										<ProtectedRoute requiredPermission='admissions.applicants.view' />
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
								<Route
									element={
										<ProtectedRoute requiredPermission='applicants.myapplicants.view' />
									}
								>
									<Route path='myapplicants'>
										<Route index element={<AdmissionMyApplicants />} />
										<Route
											path='proccess'
											element={<ApplicantsLayout />}
										></Route>
									</Route>
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='admissions.evaluators.view' />
									}
								>
									<Route path='evaluators'>
										<Route index element={<AdmissionEvaluators />} />

										<Route
											path='programs/:id'
											element={<AdmissionEvaluatorsByProgram />}
										/>
									</Route>
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
							<Route path='enrollments'>
								<Route
									element={
										<ProtectedRoute requiredPermission='enrollments.proccessEnrollments.view' />
									}
								>
									<Route path='proccess' element={<TuitionProcess />} />
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='enrollments.myprogramsEnrollments.view' />
									}
								>
									<Route
										path='myprograms/:id'
										element={<TuitionMyPrograms />}
									/>
								</Route>

								<Route
									element={
										<ProtectedRoute requiredPermission='enrollments.programsEnrollments.view' />
									}
								>
									<Route path='programs/:id' element={<TuitonPrograms />} />
								</Route>
							</Route>

							<Route path='myenrollments' element={<MyEnrollmentsLayout />}>
								<Route
									element={
										<ProtectedRoute requiredPermission='enrollments.myenrollments.view' />
									}
								>
									<Route index element={<MyEnrollments />} />
								</Route>
							</Route>

							<Route path='courses-schedules'>
								<Route
									element={
										<ProtectedRoute requiredPermission='courses.schedules.view' />
									}
								>
									<Route index element={<CoursesAndSchedules />} />
								</Route>
							</Route>

              <Route path='myclasses' element={<MyClassesLayout />}>
                <Route
                  element={
                    <ProtectedRoute requiredPermission='classes.myprograms.view' />
                  }
                >
                  <Route path='myprograms'>
                    <Route index element={<ClassMyProgramView />} />
                    <Route path=':id'>
                      <Route index element={<ClassMyCoursesByProgramView />} />
                      <Route path='course/:courseId' element={<ClassMyEstudentsByCourseView />} />
                    </Route>
                  </Route>
                </Route>
              </Route>

							<Route path='mypaymentsdebts' element={<MyPaymentsLayout />}>
								<Route>
									<Route
										element={
											<ProtectedRoute requiredPermission='payment.mypaymentsdebts.view' />
										}
									>
										<Route path='debts'>
											<Route index element={<MyPaymentDebt />} />
										</Route>
										<Route path='requests'>
											<Route index element={<MyPaymentRequests />} />
										</Route>
										<Route path='addrequests'>
											<Route index element={<MyPaymentAddRequests />} />
										</Route>
										<Route path='uploadsvouchers'>
											<Route index element={<MyPaymentUpload />} />
										</Route>
										<Route path='history-requests'>
											<Route index element={<MyPaymentHistories />} />
										</Route>
										<Route path='schedule'>
											<Route index element={<MyPaymentSchedule />} />
										</Route>
									</Route>
								</Route>
							</Route>

							<Route path='debts' element={<DebtsLayout />}>
								<Route
									element={
										<ProtectedRoute requiredPermission='payment.requests.view' />
									}
								>
									<Route path='payment-requests'>
										<Route index element={<PaymentRequestsView />} />
										<Route path=':id' element={<PaymentOrdersByRequest />} />
									</Route>
									<Route
										element={
											<ProtectedRoute requiredPermission='payment.orders.view' />
										}
									>
										<Route
											path='payment-orders'
											element={<PaymentOrdersView />}
										/>
									</Route>
									<Route index element={<PaymentRequestsView />} />
									<Route path=':id' element={<PaymentOrdersByRequest />} />
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='payment.orders.view' />
									}
								>
									<Route
										path='payment-orders'
										element={<PaymentOrdersView />}
									/>
								</Route>
							</Route>
							<Route
								path='commitment-letters'
								element={<CommitmentLetters />}
							/>
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
									<Route path='myprofile' element={<AccountStudentProfile />} />
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
					<Route
						path='admission-process/:uuid'
						element={<ChakraInscriptionForm />}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
