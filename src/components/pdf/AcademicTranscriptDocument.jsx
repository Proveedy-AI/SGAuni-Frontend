import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image,
  PDFViewer,
} from '@react-pdf/renderer';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 15,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 20,
  },
  headerText: {
    flex: 1,
    paddingTop: 5,
  },
  universityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 3,
  },
  facultyName: {
    fontSize: 12,
    color: '#000',
    marginBottom: 2,
  },
  facultySubname: {
    fontSize: 11,
    color: '#000',
    marginBottom: 15,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  promotionInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  promotionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 20,
  },
  promotionValue: {
    fontSize: 12,
  },
  studentInfoSection: {
    marginBottom: 25,
  },
  infoTable: {
    borderWidth: 1,
    borderColor: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 25,
    alignItems: 'center',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    width: '25%',
    fontSize: 11,
    fontWeight: 'bold',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  infoValue: {
    width: '75%',
    fontSize: 11,
    padding: 8,
  },
  coursesSection: {
    marginBottom: 25,
  },
  coursesTable: {
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 30,
    alignItems: 'center',
  },
  headerCell: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  headerCellLast: {
    borderRightWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 25,
    alignItems: 'center',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  cell: {
    fontSize: 10,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
  },
  cellLeft: {
    textAlign: 'left',
    paddingLeft: 8,
  },
  cellLast: {
    borderRightWidth: 0,
  },
  cellCode: { width: '10%' },
  cellSemester: { width: '10%' },
  cellPeriod: { width: '12%' },
  cellCourse: { width: '45%' },
  cellCredits: { width: '13%' },
  cellGrade: { width: '10%' },
  summarySection: {
    marginTop: 20,
    marginBottom: 40,
  },
  summaryTable: {
    borderWidth: 1,
    borderColor: '#000',
    width: '50%',
    alignSelf: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 25,
    alignItems: 'center',
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    width: '70%',
    fontSize: 11,
    fontWeight: 'bold',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  summaryValue: {
    width: '30%',
    fontSize: 11,
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 50,
    alignItems: 'center',
  },
  dateSection: {
    flexDirection: 'row',
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  signatureSection: {
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '100%',
    marginBottom: 8,
    height: 40,
  },
  signatureName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  signatureTitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
  },
  signatureUnit: {
    fontSize: 10,
    textAlign: 'center',
  },
});

export const AcademicTranscriptDocument = ({ data }) => {
  const faviconUrl = `${window.location.origin}/favicon.png`;
  
  const studentInfo = data?.student_info || {};
  const courses = data?.courses || [];
  const academicSummary = data?.academic_summary || {};

  return (
    <PDFViewer height="600" width="100%">
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              style={styles.logo}
              src={faviconUrl}
            />
            <View style={styles.headerText}>
              <Text style={styles.universityName}>UNIVERSIDAD NACIONAL DE INGENIERÍA</Text>
              <Text style={styles.facultyName}>Escuela de Posgrado - Unidad de Posgrado</Text>
              <Text style={styles.facultySubname}>Facultad de Ingeniería Económica, Estadística y Ciencias Sociales</Text>
            </View>
          </View>

          {/* Document Title */}
          <Text style={styles.documentTitle}>BOLETA DE NOTAS</Text>

          {/* Student Information */}
          <View style={styles.studentInfoSection}>
            <View style={styles.infoTable}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>APELLIDOS:</Text>
                <Text style={styles.infoValue}>{studentInfo.last_names || ''}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>NOMBRES:</Text>
                <Text style={styles.infoValue}>{studentInfo.first_names || ''}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ESPECIALIDAD:</Text>
                <Text style={styles.infoValue}>{studentInfo.program_name || ''}</Text>
              </View>
              
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>CÓDIGO:</Text>
                <Text style={styles.infoValue}>{studentInfo.student_code || ''}</Text>
              </View>
            </View>
          </View>

          {/* Courses Table */}
          <View style={styles.coursesSection}>
            <View style={styles.coursesTable}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.cellCode]}>CÓDIGO</Text>
                <Text style={[styles.headerCell, styles.cellSemester]}>SEMESTRE</Text>
                <Text style={[styles.headerCell, styles.cellPeriod]}>PERÍODO</Text>
                <Text style={[styles.headerCell, styles.cellCourse]}>NOMBRE DE LA ASIGNATURA</Text>
                <Text style={[styles.headerCell, styles.cellCredits]}>CRÉDITOS</Text>
                <Text style={[styles.headerCell, styles.cellGrade, styles.headerCellLast]}>NOTA</Text>
              </View>

              {/* Table Rows */}
              {courses.map((course, index) => (
                <View 
                  key={index} 
                  style={styles.tableRow}
                >
                  <Text style={[styles.cell, styles.cellCode]}>{course.course_code || ''}</Text>
                  <Text style={[styles.cell, styles.cellSemester]}>{course.cycle || ''}</Text>
                  <Text style={[styles.cell, styles.cellPeriod]}>{course.period_name || ''}</Text>
                  <Text style={[styles.cell, styles.cellCourse, styles.cellLeft]}>
                    {course.course_name || ''}
                  </Text>
                  <Text style={[styles.cell, styles.cellCredits]}>{course.credits || ''}</Text>
                  <Text style={[styles.cell, styles.cellGrade, styles.cellLast]}>
                    {course.final_grade || ''}
                  </Text>
                </View>
              ))}

              {/* Total Credits Row */}
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.cellCode]}></Text>
                <Text style={[styles.cell, styles.cellSemester]}></Text>
                <Text style={[styles.cell, styles.cellPeriod]}></Text>
                <Text style={[styles.cell, styles.cellCourse, styles.cellLeft, { fontWeight: 'bold' }]}>
                  TOTAL CRÉDITOS
                </Text>
                <Text style={[styles.cell, styles.cellCredits, { fontWeight: 'bold' }]}>
                  {academicSummary.total_credits || 0}
                </Text>
                <Text style={[styles.cell, styles.cellGrade, styles.cellLast, { fontWeight: 'bold' }]}>
                  {academicSummary.weighted_average ? academicSummary.weighted_average.toFixed(1) : '0.0'}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Date */}
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>
                FECHA: {new Date().toLocaleDateString('es-PE', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}
              </Text>
            </View>

            {/* Signature */}
            <View style={styles.signatureSection}>
              <View style={styles.signatureLine}></View>
              <Text style={styles.signatureName}>
                Dr. {academicSummary.director_name?.toUpperCase() || 'DIRECTOR(E)'}
              </Text>
              <Text style={styles.signatureTitle}>DIRECTOR (e)</Text>
              <Text style={styles.signatureUnit}>
                Unidad de Posgrado de la Facultad de Ingeniería Económica,
              </Text>
              <Text style={styles.signatureUnit}>
                Estadística y Ciencias Sociales
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

AcademicTranscriptDocument.propTypes = {
  data: PropTypes.object.isRequired,
};
