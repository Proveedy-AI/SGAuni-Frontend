import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import {
	Document,
	Page,
	Text,
	View,
	Image,
	StyleSheet,
	PDFViewer,
} from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// Estilos para el documento PDF
const styles = StyleSheet.create({
	page: {
		flexDirection: 'column',
		backgroundColor: '#FFFFFF',
		padding: 30,
		fontFamily: 'Helvetica',
	},
	header: {
		flexDirection: 'row',
		marginBottom: 20,
		alignItems: 'center',
	},
	logo: {
		width: 50,
		height: 60,
		marginRight: 15,
	},
	headerText: {
		flex: 1,
	},
	universityName: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#666',
		marginBottom: 2,
	},
	facultyName: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#000000',
		marginBottom: 8,
	},
	actaTitle: {
		fontSize: 10,
		fontWeight: 'bold',
		marginBottom: 2,
	},
	periodCode: {
		fontSize: 10,
		color: '#666',
	},
	mainTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
		color: '#000',
	},
	courseInfoContainer: {
		marginBottom: 20,
	},
	infoRow: {
		flexDirection: 'row',
		marginBottom: 8,
		flexWrap: 'wrap',
	},
	infoPair: {
		flex: 1, // para 2 columnas en una fila
		flexDirection: 'row',
		alignItems: 'center',
	},
	infoLabel: {
		fontSize: 11,
		fontWeight: 'bold',
		color: '#000',
		marginRight: 4,
	},
	infoValue: {
		fontSize: 11,
		color: '#000',
		flexShrink: 1,
	},

	table: {
		marginTop: 20,
		marginBottom: 30,
	},
	tableHeader: {
		backgroundColor: '#E0E0E0',
		fontSize: 8,
		fontWeight: 'bold',
		paddingVertical: 5,
		justifyContent: 'center',
		paddingHorizontal: 3,
	},
	tableCell: {
		fontSize: 10,
		paddingVertical: 5,
		borderColor: '#000',
		paddingHorizontal: 3,
	},
	footerContainer: {
		marginTop: 40,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	signatureBox: {
		width: '45%',
		alignItems: 'center',
	},
	signatureLine: {
		borderBottomWidth: 1,
		borderBottomColor: '#000',
		width: '100%',
		marginBottom: 5,
		height: 40,
	},
	signatureLabel: {
		fontSize: 11,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	dateLabel: {
		fontSize: 11,
		marginTop: 30,
		textAlign: 'left',
	},
});

export const GradesReportDocument = ({ dataGradesReport }) => {
	const faviconUrl = `${window.location.origin}/favicon.png`;
  console.log(dataGradesReport)
	return (
		<PDFViewer height='600' width='100%'>
			<Document>
				{/* Generar una página por cada componente de evaluación */}
				{dataGradesReport?.map((componentData, pageIndex) => {
					// Extraer información del componente actual
					const courseInfo = componentData;
					const studentsList = componentData.student_grades || [];

					return (
						<Page key={pageIndex} size='A4' style={styles.page}>
							{/* Header con logo y título */}
							<View style={styles.header}>
								<Image src={faviconUrl} style={styles.logo} />
								<View style={styles.headerText}>
									<Text style={styles.universityName}>
										UNIVERSIDAD NACIONAL DE INGENIERÍA
									</Text>
									<Text style={styles.facultyName}>
										Escuela Central de Posgrado
									</Text>
									<Text style={styles.actaTitle}>ACTA DE NOTAS</Text>
									<Text style={styles.periodCode}>
										{courseInfo.enrollment_period}-FIEECS
									</Text>
								</View>
							</View>

							{/* Título principal */}
							<Text style={styles.mainTitle}>
								{courseInfo.program_name?.toUpperCase() || 'PROGRAMA ACADÉMICO'}
							</Text>

							{/* Información del curso */}
							<View style={styles.courseInfoContainer}>
								{/* FILA 1 */}
								<View style={styles.infoRow}>
									<Text style={styles.infoLabel}>ASIGNATURA:</Text>
									<Text style={styles.infoValue}>
										{(courseInfo.course_name || '').toUpperCase()}
									</Text>
								</View>

								{/* FILA 2 */}
								<View style={styles.infoRow}>
									<Text style={styles.infoLabel}>PROFESOR:</Text>
									<Text style={styles.infoValue}>
										{(courseInfo.teacher_name || '').toUpperCase()}
									</Text>
								</View>

								{/* FILA 3 (2 pares en la misma fila) */}
								<View style={styles.infoRow}>
									<View style={styles.infoPair}>
										<Text style={styles.infoLabel}>CRÉDITOS:</Text>
										<Text style={styles.infoValue}>
											{String(courseInfo.course_credits || '').toUpperCase()}
										</Text>
									</View>
									<View style={styles.infoPair}>
										<Text style={styles.infoLabel}>TIPO DE NOTA:</Text>
										<Text style={styles.infoValue}>
											{(
												componentData.evaluation_component_name || ''
											).toUpperCase()}
										</Text>
									</View>
								</View>

								{/* FILA 4 */}
								<View style={styles.infoRow}>
									<Text style={styles.infoLabel}>SEMESTRE ACADÉMICO:</Text>
									<Text style={styles.infoValue}>
										{(courseInfo.enrollment_period || '').toUpperCase()}-FIEECS
									</Text>
								</View>

								{/* FILA 5 (2 pares en la misma fila) */}
								<View style={styles.infoRow}>
									<View style={styles.infoPair}>
										<Text style={styles.infoLabel}>CÓDIGO CURSO:</Text>
										<Text style={styles.infoValue}>
											{(courseInfo.course_code || '').toUpperCase()}
										</Text>
									</View>
									<View style={styles.infoPair}>
										<Text style={styles.infoLabel}>SECCIÓN:</Text>
										<Text style={styles.infoValue}>
											{(courseInfo.group_code || '').toUpperCase()}
										</Text>
									</View>
								</View>
							</View>

							{/* Tabla de estudiantes y notas */}
							<Table style={styles.table} weightings={[5, 15, 15, 30, 10, 25]}>
								<TH>
									<TD style={styles.tableHeader}>N°</TD>
									<TD style={styles.tableHeader}>DOCUMENTO</TD>
									<TD style={styles.tableHeader}>CÓDIGO</TD>
									<TD style={styles.tableHeader}>APELLIDOS Y NOMBRES</TD>
									<TD style={styles.tableHeader}>NÚMEROS</TD>
									<TD style={styles.tableHeader}>LETRAS</TD>
								</TH>
								{studentsList.map((studentGrade, index) => (
									<TR key={index}>
										<TD
											style={{ ...styles.tableCell, justifyContent: 'center' }}
										>
											{index + 1}
										</TD>
										<TD
											style={{ ...styles.tableCell, justifyContent: 'center' }}
										>
											{studentGrade.document_number}
										</TD>
										<TD
											style={{ ...styles.tableCell, justifyContent: 'center' }}
										>
											{studentGrade.student_code}
										</TD>
										<TD style={styles.tableCell}>
											{studentGrade.student_full_name.toUpperCase()}
										</TD>
										<TD
											style={{ ...styles.tableCell, justifyContent: 'center' }}
										>
											{studentGrade.numeric_grade || ''}
										</TD>
										<TD
											style={{ ...styles.tableCell, justifyContent: 'center' }}
										>
											{studentGrade.grade_in_words || ''}
										</TD>
									</TR>
								))}
							</Table>

							{/* Footer con fechas y firmas */}
							<View style={styles.dateLabel}>
								<Text>FECHA DEL ACTA:</Text>
							</View>

							<View style={styles.footerContainer}>
								<View style={styles.signatureBox}>
									<View style={styles.signatureLine}></View>
									<Text style={styles.signatureLabel}>PROFESOR</Text>
								</View>

								<View style={styles.signatureBox}>
									<View style={styles.signatureLine}></View>
									<Text style={styles.signatureLabel}>
										DIRECTOR UNIDAD POSGRADO
									</Text>
								</View>
							</View>
						</Page>
					);
				})}
			</Document>
		</PDFViewer>
	);
};

GradesReportDocument.propTypes = {
	dataGradesReport: PropTypes.array,
};
