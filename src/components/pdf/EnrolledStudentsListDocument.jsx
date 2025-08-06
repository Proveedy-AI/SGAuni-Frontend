import PropTypes from 'prop-types';
import { Document, Page, Text, View, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer';

export const EnrolledStudentsListDocument = ({ students }) => {
  const faviconUrl = `${window.location.origin}/favicon.png`;

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
      marginBottom: 30,
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
      textAlign: 'left',
    },
    department: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'left',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
      letterSpacing: 2,
    },
    infoSection: {
      marginBottom: 25,
    },
    infoRow: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 6,
      paddingBottom: 3,
    },
    infoLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      width: 80,
      textAlign: 'left',
    },
    infoValue: {
      fontSize: 10,
      flex: 1,
      textAlign: 'left',
    },
    table: {
      display: 'table',
      width: 'auto',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopStyle: 'solid',
      borderBottomStyle: 'solid',
      borderTopColor: '#000000',
      borderBottomColor: '#000000',
      marginBottom: 20,
    },
    tableRow: {
      display: 'table-row',
      flexDirection: 'row',
    },
    tableHeader: {
      backgroundColor: '#f0f0f0',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: '#000000',
    },
    tableColNumber: {
      display: 'table-cell',
      width: '5%',
      padding: 6,
      fontSize: 9,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    tableColCode: {
      display: 'table-cell',
      width: '12%',
      padding: 6,
      fontSize: 9,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    tableColDocument: {
      display: 'table-cell',
      width: '12%',
      padding: 6,
      fontSize: 9,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    tableColName: {
      display: 'table-cell',
      width: '35%',
      padding: 6,
      fontSize: 9,
      fontWeight: 'bold',
    },
    tableColCourses: {
      display: 'table-cell',
      width: '26%',
      padding: 6,
      fontSize: 9,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    tableColCredits: {
      display: 'table-cell',
      width: '10%',
      padding: 6,
      fontSize: 9,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    // Estilos para las celdas de datos (sin bold)
    tableDataNumber: {
      display: 'table-cell',
      width: '5%',
      padding: 6,
      fontSize: 9,
      textAlign: 'center',
    },
    tableDataCode: {
      display: 'table-cell',
      width: '12%',
      padding: 6,
      fontSize: 9,
      textAlign: 'center',
    },
    tableDataDocument: {
      display: 'table-cell',
      width: '12%',
      padding: 6,
      fontSize: 9,
      textAlign: 'center',
    },
    tableDataName: {
      display: 'table-cell',
      width: '35%',
      padding: 6,
      fontSize: 9,
    },
    tableDataCourses: {
      display: 'table-cell',
      width: '26%',
      padding: 6,
      fontSize: 8,
      textAlign: 'center',
    },
    tableDataCredits: {
      display: 'table-cell',
      width: '10%',
      padding: 6,
      fontSize: 9,
      textAlign: 'center',
    },
    pageNumber: {
      position: 'absolute',
      bottom: 30,
      right: 40,
      fontSize: 10,
    },
  });

  return (
    <PDFViewer height="600" width="100%">
      <Document>
        {students?.map((programData, programIndex) => (
          <Page key={programIndex} size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
              <Image style={styles.logo} src={faviconUrl} />
              <View style={styles.headerText}>
                <Text style={styles.universityName}>UNIVERSIDAD NACIONAL DE INGENIERÍA</Text>
                <Text style={styles.department}>Escuela Central de Posgrado</Text>
              </View>
            </View>

            {/* Título */}
            <Text style={styles.title}>ALUMNOS MATRICULADOS</Text>

            {/* Información del programa */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PERÍODO</Text>
                <Text style={styles.infoValue}>{programData.academic_period_name}</Text>
                <Text style={styles.infoValue}>{programData.academic_period_name} PRIMER SEMESTRE FIEECS</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>UNIDAD</Text>
                <Text style={styles.infoValue}>FIEECS</Text>
                <Text style={styles.infoValue}>Unidad de Posgrado de la Facultad de Ingeniería Económica, Estadística y Ciencias Sociales</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PROGRAMA</Text>
                <Text style={styles.infoValue}>P108</Text>
                <Text style={styles.infoValue}>{programData.program_name}</Text>
              </View>
            </View>

            {/* Tabla de estudiantes */}
            <View style={styles.table}>
              {/* Header de la tabla */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableColNumber}>N°</Text>
                <Text style={styles.tableColCode}>CÓDIGO</Text>
                <Text style={styles.tableColDocument}>DOCUMENTO</Text>
                <Text style={styles.tableColName}>NOMBRE COMPLETO</Text>
                <Text style={styles.tableColCourses}>CURSOS</Text>
                <Text style={styles.tableColCredits}>CRÉDITOS</Text>
              </View>

              {/* Filas de estudiantes */}
              {programData.students?.map((student, index) => (
                <View key={student.id} style={styles.tableRow}>
                  <Text style={styles.tableDataNumber}>{index + 1}</Text>
                  <Text style={styles.tableDataCode}>{student.code}</Text>
                  <Text style={styles.tableDataDocument}>{student.document}</Text>
                  <Text style={styles.tableDataName}>{student.full_name}</Text>
                  <Text style={styles.tableDataCourses}>
                    {student.course_groups_code?.join(', ') || ''}
                  </Text>
                  <Text style={styles.tableDataCredits}>{student.total_credits}</Text>
                </View>
              ))}
            </View>

            {/* Número de página */}
            <Text style={styles.pageNumber}>
              {programIndex + 1} / {students.length}
            </Text>
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
};

EnrolledStudentsListDocument.propTypes = {
  students: PropTypes.array,
}
