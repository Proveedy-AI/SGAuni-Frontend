import { Document, Page, Text, View, Image, StyleSheet, PDFViewer } from '@react-pdf/renderer';
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
    color: '#8B0000',
    marginBottom: 2,
  },
  facultyName: {
    fontSize: 12,
    color: '#8B0000',
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
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 80,
    color: '#000',
  },
  infoValue: {
    fontSize: 11,
    flex: 1,
    color: '#000',
  },
  infoValueRight: {
    fontSize: 11,
    width: 100,
    color: '#000',
  },
  table: {
    marginTop: 20,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    borderTopWidth: 0,
    minHeight: 25,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: '#F8F8F8',
  },
  cellNumber: {
    width: '8%',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 3,
  },
  cellName: {
    width: '42%',
    fontSize: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 3,
  },
  cellGradeNumber: {
    width: '15%',
    textAlign: 'center',
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 3,
  },
  cellGradeWords: {
    width: '35%',
    textAlign: 'center',
    fontSize: 10,
    padding: 3,
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
  return (
    <PDFViewer height="600" width="100%">
      <Document>
        {/* Generar una página por cada componente de evaluación */}
        {dataGradesReport?.map((componentData, pageIndex) => {
          // Extraer información del componente actual
          const courseInfo = componentData;
          const studentsList = componentData.student_grades || [];

          return (
            <Page key={pageIndex} size="A4" style={styles.page}>
              {/* Header con logo y título */}
              <View style={styles.header}>
                <Image src={faviconUrl} style={styles.logo} />
                <View style={styles.headerText}>
                  <Text style={styles.universityName}>UNIVERSIDAD NACIONAL DE INGENIERÍA</Text>
                  <Text style={styles.facultyName}>Escuela Central de Posgrado</Text>
                  <Text style={styles.actaTitle}>ACTA DE NOTAS</Text>
                  <Text style={styles.periodCode}>{courseInfo.enrollment_period}-FIEECS</Text>
                </View>
              </View>

              {/* Título principal */}
              <Text style={styles.mainTitle}>
                {courseInfo.program_name?.toUpperCase() || 'PROGRAMA ACADÉMICO'}
              </Text>

              {/* Información del curso */}
              <View style={styles.courseInfoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ASIGNATURA</Text>
                  <Text style={styles.infoValue}>{courseInfo.course_name || ''}</Text>
                  <Text style={styles.infoLabel}>TIPO DE NOTA</Text>
                  <Text style={styles.infoValueRight}>{componentData.evaluation_component_name}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>PROFESOR</Text>
                  <Text style={styles.infoValue}>{courseInfo.teacher_name || ''}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CRÉDITO</Text>
                  <Text style={styles.infoValue}>{courseInfo.course_credits || ''}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>SEMESTRE ACADÉMICO</Text>
                  <Text style={styles.infoValue}>{courseInfo.enrollment_period}-FIEECS</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CÓDIGO DE CURSO</Text>
                  <Text style={styles.infoValue}>{courseInfo.course_code || ''}</Text>
                  <Text style={styles.infoLabel}>SECCIÓN</Text>
                  <Text style={styles.infoValueRight}>{courseInfo.group_code || ''}</Text>
                </View>
              </View>

              {/* Tabla de estudiantes y notas */}
              <View style={styles.table}>
                {/* Header de la tabla */}
                <View style={styles.tableHeader}>
                  <Text style={styles.cellNumber}>N°</Text>
                  <Text style={styles.cellName}>APELLIDOS Y NOMBRES</Text>
                  <Text style={styles.cellGradeNumber}>NÚMEROS</Text>
                  <Text style={styles.cellGradeWords}>LETRAS</Text>
                </View>

                {/* Filas de estudiantes */}
                {studentsList.map((studentGrade, index) => {
                  return (
                    <View 
                      key={index} 
                      style={[
                        styles.tableRow, 
                        index % 2 === 1 ? styles.tableRowEven : null
                      ]}
                    >
                      <Text style={styles.cellNumber}>{index + 1}</Text>
                      <Text style={styles.cellName}>{studentGrade.student_full_name}</Text>
                      <Text style={styles.cellGradeNumber}>
                        {studentGrade.numeric_grade || ''}
                      </Text>
                      <Text style={styles.cellGradeWords}>
                        {studentGrade.grade_in_words || ''}
                      </Text>
                    </View>
                  );
                })}
              </View>

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
                  <Text style={styles.signatureLabel}>DIRECTOR UNIDAD POSGRADO</Text>
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
