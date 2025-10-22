import PropTypes from 'prop-types';
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
	PDFViewer,
} from '@react-pdf/renderer';

export const RegistrationScheduleDocument = ({
	registration_info,
	coursesGroups,
}) => {
	const faviconUrl = `${window.location.origin}/favicon.png`;

	const timeSlots = [
		'07:00',
		'08:00',
		'09:00',
		'10:00',
		'11:00',
		'12:00',
		'13:00',
		'14:00',
		'15:00',
		'16:00',
		'17:00',
		'18:00',
		'19:00',
		'20:00',
		'21:00',
		'22:00',
	];
	const daysOfWeek = [
		'Lunes',
		'Martes',
		'Miércoles',
		'Jueves',
		'Viernes',
		'Sábado',
	];

	// Obtiene cursos en un slot de tiempo
	const getCourseForTimeSlot = (day, time) => {
		const coursesInSlot = [];
		coursesGroups?.forEach((course) => {
			if (!course.schedule || !Array.isArray(course.schedule)) return;
			course.schedule.forEach((sch) => {
				if (sch.day === day) {
					const start = parseInt(sch.start_time.split(':')[0], 10);
					const end = parseInt(sch.end_time.split(':')[0], 10);
					const slot = parseInt(time.split(':')[0], 10);
					if (slot >= start && slot < end) {
						coursesInSlot.push({ ...course, currentSchedule: sch });
					}
				}
			});
		});
		return coursesInSlot;
	};

	const styles = StyleSheet.create({
		page: {
			flexDirection: 'column',
			backgroundColor: '#FFFFFF',
			padding: 40,
			fontFamily: 'Times-Roman',
		},
		header: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'flex-start',
			marginBottom: 20,
		},
		logo: {
			width: 70,
			height: 80,
			marginRight: 20,
		},
		headerText: {
			flex: 1,
			fontSize: 10,
			lineHeight: 1.3,
		},
		universityName: {
			fontSize: 14,
			fontWeight: 'bold',
			marginBottom: 2,
			textAlign: 'center',
		},
		department: {
			fontSize: 10,
			fontWeight: 'bold',
			marginBottom: 8,
			textAlign: 'center',
		},
		subtitle: {
			fontSize: 14,
			marginBottom: 2,
			fontWeight: 'bold',
		},
		printDate: {
			fontSize: 8,
			textAlign: 'right',
			marginBottom: 10,
		},
		title: {
			fontSize: 16,
			fontWeight: 'bold',
			textAlign: 'center',
			marginBottom: 25,
		},
		infoSection: {
			marginBottom: 20,
		},
		infoRow: {
			display: 'flex',
			flexDirection: 'row',
			marginBottom: 8,
		},
		infoLabel: {
			fontSize: 10,
			fontWeight: 'bold',
			width: 100,
		},
		infoValue: {
			fontSize: 10,
			flex: 1,
		},
		separator: {
			borderBottom: '1 solid #000000',
			marginBottom: 15,
		},
		container: {
			fontSize: 8,
			width: '100%',
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: '#ccc',
		},
		headerRow: {
			flexDirection: 'row',
			backgroundColor: '#eee',
			borderBottomWidth: 1,
			borderBottomStyle: 'solid',
			borderBottomColor: '#ccc',
		},
		headerCell: {
			flex: 1,
			padding: 2,
			textAlign: 'start',
			fontWeight: 'bold',
		},
		row: {
			flexDirection: 'row',
			borderBottomWidth: 1,
			borderBottomStyle: 'solid',
			borderBottomColor: '#eee',
		},
		timeCell: {
			width: 35,
			padding: 2,
			textAlign: 'center',
			borderRightWidth: 1,
			borderRightStyle: 'solid',
			borderRightColor: '#eee',
		},
		cell: {
			flex: 1,
			minHeight: 20,
			borderRightWidth: 1,
			borderRightStyle: 'solid',
			borderRightColor: '#eee',
			padding: 1,
		},
		courseBox: {
			backgroundColor: '#d9e8ff',
			padding: 1,
			marginBottom: 1,
			borderRadius: 2,
		},
		courseName: { fontWeight: 'bold' },
		courseGroup: { fontSize: 7 },
		courseTeacher: { fontSize: 7 },
		courseTime: { fontSize: 7 },
		totalItem: {
			fontSize: 10,
			fontWeight: 'bold',
		},
	});

	// Obtener fecha actual formateada
	const getCurrentDate = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
	};

	return (
		<PDFViewer height='600' width='100%'>
			<Document>
				<Page size='A4' style={styles.page}>
					{/* Header */}
					<View style={styles.header}>
						<Image style={styles.logo} src={faviconUrl} />
						<View style={styles.headerText}>
							<Text style={styles.universityName}>
								UNIVERSIDAD NACIONAL DE INGENIERÍA
							</Text>
							<Text style={styles.department}>Escuela Central de Posgrado</Text>
							<Text style={styles.subtitle}>
								Unidad de Posgrado de la Facultad de Ingeniería Económica,
								Estadística y Ciencias Sociales
							</Text>
						</View>
					</View>

					{/* Fecha de impresión */}
					<Text style={styles.printDate}>
						FECHA IMPRESIÓN: {getCurrentDate()}
					</Text>

					{/* Título */}
					<Text style={styles.title}>
						BOLETA DE MATRÍCULA {registration_info.period_enrollment}-FIEECS
					</Text>

					{/* Información del estudiante */}
					<View style={styles.infoSection}>
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>FACULTAD :</Text>
							<Text style={styles.infoValue}>
								Unidad de Posgrado de la Facultad de Ingeniería Económica,
								Estadística y Ciencias Sociales
							</Text>
						</View>

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>MENCIÓN :</Text>
							<Text style={styles.infoValue}>
								{registration_info.program_enrollment}
							</Text>
						</View>

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>ALUMNO :</Text>
							<Text style={styles.infoValue}>
								{registration_info.student_full_name}
							</Text>
						</View>
					</View>

					{/* Tabla de cursos */}
					<View style={styles.container}>
						{/* Encabezado */}
						<View style={styles.headerRow}>
							<Text style={styles.headerCell}>Hora</Text>
							{daysOfWeek.map((day) => (
								<Text key={day} style={styles.headerCell}>
									{day}
								</Text>
							))}
						</View>

						{/* Filas de horarios */}
						{timeSlots.map((time) => (
							<View key={time} style={styles.row}>
								{/* Columna de hora */}
								<Text style={styles.timeCell}>{time}</Text>

								{/* Celdas por día */}
								{daysOfWeek.map((day) => {
									const courses = getCourseForTimeSlot(day, time);
									return (
										<View key={`${day}-${time}`} style={styles.cell}>
											{courses.map((course) => {
												// Solo mostramos si es el primer bloque del curso
												if (
													!course.currentSchedule.start_time.startsWith(
														time.split(':')[0]
													)
												) {
													return null;
												}
												return (
													<View
														key={`${course.group_code}-${day}`}
														style={styles.courseBox}
													>
														<Text style={styles.courseName}>
															{course.course_name}
														</Text>
														<Text style={styles.courseGroup}>
															{course.group_code}
														</Text>
														<Text style={styles.courseTeacher}>
															{course.teacher_name}
														</Text>
														<Text style={styles.courseTime}>
															{course.currentSchedule.start_time} -{' '}
															{course.currentSchedule.end_time}
														</Text>
													</View>
												);
											})}
										</View>
									);
								})}
							</View>
						))}
					</View>

					{/* Totales */}
					<View style={styles.totalSection}>
						<Text style={styles.totalItem}>
							Total de Cursos: {registration_info.total_courses}
						</Text>
						<Text style={styles.totalItem}>
							Total de Créditos: {registration_info.total_credits}
						</Text>
					</View>
				</Page>
			</Document>
		</PDFViewer>
	);
};

RegistrationScheduleDocument.propTypes = {
	registration_info: PropTypes.object.isRequired,
	coursesGroups: PropTypes.array.isRequired,
};
