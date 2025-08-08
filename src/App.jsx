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
	SettingsDataProccess,
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
import {
	ClassMyCoursesByProgramView,
	ClassMyStudentsByCourseView,
	ClassMyProgramView,
	MyClassesLayout,
} from './views/admin/myclasses';
import { BenefitsView } from './views/admin/benefits/BenefitsView';
import { MyBenefitsView } from './views/admin/mypayments/MyBenefitsView';
import { RequestBenefitsView } from './views/admin/benefits/RequestBenefitsView';
import { FractionationsView } from './views/admin/debt_requests/FractionationsView';
import { MyFractionationsView } from './views/admin/mypayments/MyFractionationsView';
import { StudentsView } from './views/admin/student/StudentsView';
import { StudentDetailView } from './views/admin/student/StudentDetailView';
import {
	MyEnrollmentProcessView,
	MyInscriptionFormView,
	MyProceduresView,
} from './views/admin/procedures';
import {
	MyCoursesListByAcademicPeriodView,
	MyEvaluationsByCourseView,
} from './views/admin/mycourses';
import { EnrolledCourseGroupsView, EnrolledProcessView, EnrolledStudentsView } from './views/admin/tuitions/enrolled';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					{/* ---------------------------- AUTHENTICATION ROUTES ---------------------------- */}
					<Route path='/auth' element={<AuthLayout />}>
						<Route path='login' element={<LoginAdmin />} />
						{/*<Route path='admin/login' element={<LoginAdmin />} />*/}
						<Route path='reset-password' element={<ResetPassword />} />
					</Route>

					<Route element={<PrivateRoute />}>
						<Route path='/' element={<AdminLayout />}>
							<Route index element={<Dashboard />} />

							{/* ---------------------------- USER ROUTES ---------------------------- */}
							<Route
								element={
									<ProtectedRoute requiredPermission='users.users.view' />
								}
							>
								<Route path='users' element={<UserList />} />
							</Route>

							{/* ---------------------------- COURSES ROUTES ---------------------------- */}
							<Route path='courses-schedules'>
								<Route
									element={
										<ProtectedRoute requiredPermission='courses.schedules.view' />
									}
								>
									<Route index element={<CoursesAndSchedules />} />
								</Route>
							</Route>
							{/* ---------------------------- BENEFITS ROUTES ---------------------------- */}

							<Route path='benefits'>
								<Route
									element={
										<ProtectedRoute requiredPermission='benefits.benefits.view' />
									}
								>
									<Route path='list' element={<BenefitsView />} />
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='benefits.benefits.view' />
									}
								>
									<Route path='request' element={<RequestBenefitsView />} />
								</Route>
							</Route>

							{/* ---------------------------- ADMISSIONS ROUTES ---------------------------- */}
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

							{/* ---------------------------- CONTRACTS ROUTES ---------------------------- */}
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

							{/* ---------------------------- STUDENTS ROUTES ---------------------------- */}
							<Route path='students'>
								<Route
									element={
										<ProtectedRoute requiredPermission='students.students.view' />
									}
								>
									<Route index element={<StudentsView />} />
									<Route path=':id' element={<StudentDetailView />} />
								</Route>
							</Route>

							{/* ---------------------------- TUITION ROUTES ---------------------------- */}
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
              
              {/* ---------------------------- ENROLLED ROUTES ---------------------------- */}
                <Route
                  element={
                    <ProtectedRoute requiredPermission='enrollments.enrolled.view' />
                  }
                >
                  <Route path='enrolled' element={<EnrolledProcessView />} />
                  <Route path='programs/:id'>
                    <Route path ='course-groups'>
                      <Route index element={<EnrolledCourseGroupsView />} />
                      <Route path=':courseGroupId' element={<EnrolledStudentsView />} />
                    </Route>
                  </Route>
                </Route>
							</Route>

							<Route path='mycourses'>
								<Route
									element={
										<ProtectedRoute requiredPermission='enrollments.mycourses.view' />
									}
								>
									<Route
										index
										element={<MyCoursesListByAcademicPeriodView />}
									/>
									<Route path=':id'>
										<Route index element={<MyEvaluationsByCourseView />} />
									</Route>
								</Route>
							</Route>

							{/* ---------------------------- PERSON ROUTES ---------------------------- */}

							<Route path='myenrollments' element={<MyEnrollmentsLayout />}>
								<Route
									element={
										<ProtectedRoute requiredPermission='enrollments.myenrollments.view' />
									}
								>
									<Route index element={<MyEnrollments />} />
								</Route>
							</Route>

							{/* ---------------------------- PROCEDURES STUDENT ---------------------------- */}

							<Route path='myprocedures'>
								<Route
									element={
										<ProtectedRoute requiredPermission='procedures.myprocedures.view' />
									}
								>
									<Route index element={<MyProceduresView />} />
									<Route path='enrollment-process'>
										<Route index element={<MyEnrollmentProcessView />} />
										<Route path=':id' element={<MyInscriptionFormView />} />
									</Route>
								</Route>
							</Route>

							<Route path='myclasses' element={<MyClassesLayout />}>
								<Route
									element={
										<ProtectedRoute requiredPermission='classes.myclasses.view' />
									}
								>
									<Route path='myprograms'>
										<Route index element={<ClassMyProgramView />} />
										<Route path=':id'>
											<Route index element={<ClassMyCoursesByProgramView />} />
											<Route
												path='course/:courseId'
												element={<ClassMyStudentsByCourseView />}
											/>
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
										<Route path='addBenefits'>
											<Route index element={<MyBenefitsView />} />
										</Route>
										<Route path='schedule'>
											<Route index element={<MyPaymentSchedule />} />
										</Route>
										<Route path='mycommitmentLetters'>
											<Route index element={<MyFractionationsView />} />
										</Route>
									</Route>
								</Route>
							</Route>

							{/* ---------------------------- DEBTS ADMIN ROUTES ---------------------------- */}

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

							{/* ---------------------------- DEBTS REQUESTS ROUTES ---------------------------- */}
							<Route path='commitment-letters'>
								<Route
									element={
										<ProtectedRoute requiredPermission='commitment.commitment.view' />
									}
								>
									<Route path='list' element={<FractionationsView />} />
								</Route>
								<Route
									element={
										<ProtectedRoute requiredPermission='commitment.commitment.review' />
									}
								>
									<Route path='request' element={<CommitmentLetters />} />
								</Route>
							</Route>
							{/* ---------------------------- SETTINGS ROUTES ---------------------------- */}

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
								<Route
									element={
										<ProtectedRoute requiredPermission='settings.countries.view' />
									}
								>
									<Route
										path='data-processing'
										element={<SettingsDataProccess />}
									/>
								</Route>
							</Route>
						</Route>
					</Route>

					{/* ---------------------------- PUBLIC ROUTES ---------------------------- */}
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
