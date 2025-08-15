import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image,
  PDFViewer,
} from '@react-pdf/renderer';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
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
  studentInfoSection: {
    marginBottom: 25,
  },
  infoTable: {
    marginBottom: 10,
  },
  infoTableHeader: {
    backgroundColor: '#F5F5F5',
    fontSize: 9,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  infoTableCell: {
    fontSize: 9,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  coursesSection: {
    marginBottom: 25,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: '#E8E8E8',
    fontSize: 9,
    fontWeight: 'bold',
    paddingVertical: 8,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tableCell: {
    fontSize: 9,
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
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
            <Table 
              style={styles.infoTable}
              weightings={[25, 75]}
            >
              <TR>
                <TD style={styles.infoTableHeader}>DOCUMENTO:</TD>
                <TD style={styles.infoTableCell}>{studentInfo.document_number || ''}</TD>
              </TR>
              <TR>
                <TD style={styles.infoTableHeader}>APELLIDOS:</TD>
                <TD style={styles.infoTableCell}>{studentInfo.last_names || ''}</TD>
              </TR>
              <TR>
                <TD style={styles.infoTableHeader}>NOMBRES:</TD>
                <TD style={styles.infoTableCell}>{studentInfo.first_names || ''}</TD>
              </TR>
              <TR>
                <TD style={styles.infoTableHeader}>ESPECIALIDAD:</TD>
                <TD style={styles.infoTableCell}>{studentInfo.program_name || ''}</TD>
              </TR>
              <TR>
                <TD style={styles.infoTableHeader}>CÓDIGO:</TD>
                <TD style={styles.infoTableCell}>{studentInfo.student_code || ''}</TD>
              </TR>
            </Table>
          </View>

          {/* Courses Table */}
          <View style={styles.coursesSection}>
            <Table 
              style={styles.table}
              weightings={[10, 15, 12, 40, 13, 10]}
            >
              <TH>
                <TD style={styles.tableHeader}>CÓDIGO</TD>
                <TD style={styles.tableHeader}>SEMESTRE</TD>
                <TD style={styles.tableHeader}>PERÍODO</TD>
                <TD style={styles.tableHeader}>NOMBRE DE LA ASIGNATURA</TD>
                <TD style={styles.tableHeader}>CRÉDITOS</TD>
                <TD style={styles.tableHeader}>NOTA</TD>
              </TH>

              {courses.map((course, index) => (
                <TR key={index}>
                  <TD style={{ ...styles.tableCell, justifyContent: 'center' }}>
                    {course.course_code || ''}
                  </TD>
                  <TD style={{ ...styles.tableCell, justifyContent: 'center' }}>
                    {course.cycle || ''}
                  </TD>
                  <TD style={{ ...styles.tableCell, justifyContent: 'center' }}>
                    {course.period_name || ''}
                  </TD>
                  <TD style={styles.tableCell}>
                    {course.course_name || ''}
                  </TD>
                  <TD style={{ ...styles.tableCell, justifyContent: 'center' }}>
                    {course.credits || ''}
                  </TD>
                  <TD style={{ ...styles.tableCell, justifyContent: 'center' }}>
                    {course.final_grade || ''}
                  </TD>
                </TR>
              ))}

              {/* Total Credits Row */}
              <TR>
                <TD style={{ ...styles.tableCell, justifyContent: 'center' }}></TD>
                <TD style={{ ...styles.tableCell, justifyContent: 'center' }}></TD>
                <TD style={{ ...styles.tableCell, justifyContent: 'center' }}></TD>
                <TD style={{ ...styles.tableCell, fontWeight: 'bold' }}>
                  TOTAL CRÉDITOS
                </TD>
                <TD style={{ ...styles.tableCell, justifyContent: 'center', fontWeight: 'bold' }}>
                  {academicSummary.total_credits || 0}
                </TD>
                <TD style={{ ...styles.tableCell, justifyContent: 'center', fontWeight: 'bold' }}>
                  {academicSummary.weighted_average ? academicSummary.weighted_average.toFixed(1) : '0.0'}
                </TD>
              </TR>
            </Table>
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
  data: PropTypes.object,
};
