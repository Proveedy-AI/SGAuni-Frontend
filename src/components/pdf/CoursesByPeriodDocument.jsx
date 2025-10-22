import {
	Document,
	PDFViewer,
	Page,
	View,
	Text,
	Image,
	StyleSheet,
} from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingBottom: 6,
	},
	logo: {
		width: 40,
		height: 48,
		marginRight: 12,
	},
	headerText: {
		flexDirection: 'column',
	},
	universityName: {
		fontSize: 13,
		fontWeight: 'bold',
	},
	department: {
		fontSize: 11,
		color: '#333',
	},
	title: {
		fontSize: 15,
		fontWeight: 'bold',
		textAlign: 'center',
		marginVertical: 10,
		color: '#263238',
    marginBottom: 20,
	},
	cycleTitle: {
		fontSize: 10,
		fontWeight: 'bold',
		marginTop: 18,
		marginBottom: 6,
		color: '#263238',
	},
	table: {
		marginBottom: 10,
	},
	th: {
		backgroundColor: '#e3e3e3',
		fontSize: 8,
		fontWeight: 'bold',
		padding: 4,
		border: '1px solid #bbb',
	},
	td: {
		fontSize: 8,
		padding: 4,
		border: '1px solid #ddd',
	},
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 7,
    color: '#7f8c8d',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    paddingTop: 5,
  },
});

export const CoursesByPeriodDocument = ({ program, coursesByCycle }) => {
	const faviconUrl = `${window.location.origin}/favicon.png`;
	const cycles = Object.keys(coursesByCycle).sort(
		(a, b) => Number(a) - Number(b)
	);

	return (
		<PDFViewer height='600' width='100%'>
			<Document>
				<Page size='A4' style={{ padding: 24 }}>
					{/* Header */}
					<View style={styles.header} fixed>
						<Image style={styles.logo} src={faviconUrl} />
						<View style={styles.headerText}>
							<Text style={styles.universityName}>
								UNIVERSIDAD NACIONAL DE INGENIERÍA
							</Text>
							<Text style={styles.department}>Escuela Central de Posgrado</Text>
							<Text style={styles.department}>Facultad de Ingeniería Económica, Estadística y Ciencias Sociales</Text>
						</View>
					</View>
					{/* Título */}
					<Text style={styles.title}>CURSOS APROBADOS</Text>

					{/* Info del programa */}
					<View style={{ marginBottom: 10 }}>
						<Text style={{ fontSize: 11 }}>
							<Text style={{ fontWeight: 'bold' }}>Programa: </Text>
							{program.program_name}
						</Text>
						<Text style={{ fontSize: 11 }}>
							<Text style={{ fontWeight: 'bold' }}>Periodo de matrícula: </Text>
							{program.enrollment_period_name}
						</Text>
					</View>

					{/* Tablas por ciclo */}
					{cycles.map((cycle) => (
						<View key={cycle} wrap={false}>
							<Text style={styles.cycleTitle}>{`CICLO ${cycle}`}</Text>
							<Table style={styles.table} data={coursesByCycle[cycle]} weightings={[40, 5, 5, 50]}>
								<TH>
									<TD style={[styles.th, { justifyContent: 'center' }]}>Asignatura</TD>
									<TD style={[styles.th, { justifyContent: 'center' }]}>Créd.</TD>
									<TD style={[styles.th, { justifyContent: 'center' }]}>Oblig.</TD>
									<TD style={[styles.th, { justifyContent: 'center' }]}>
										Pre-requisito(s)
									</TD>
								</TH>
								{coursesByCycle[cycle].map((course, idx) => (
									<TR key={idx}>
										<TD style={styles.td}>
											{`${course?.courses_code?.toUpperCase()} - ${course?.course_name?.toUpperCase()}`}
										</TD>
										<TD style={[styles.td, { justifyContent: 'center' }]}>
											{course.credits}
										</TD>
										<TD style={[styles.td, { justifyContent: 'center' }]}>
											{course.is_mandatory ? 'SI' : 'NO'}
										</TD>
										<TD style={styles.td}>
											{course.prerequisite && course.prerequisite.length > 0
												? course.prerequisite.join(', ')?.toUpperCase()
												: ''}
										</TD>
									</TR>
								))}
							</Table>
						</View>
					))}
          
          {/* Footer */}
          <Text style={styles.footer} fixed>
            Documento generado automáticamente el {new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })} - Sistema de Gestión Académica UNI
          </Text>
				</Page>
			</Document>
		</PDFViewer>
	);
};

CoursesByPeriodDocument.propTypes = {
	program: PropTypes.object.isRequired,
	coursesByCycle: PropTypes.object.isRequired,
};
