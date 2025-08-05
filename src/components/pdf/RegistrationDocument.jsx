import PropTypes from 'prop-types';
import { Document, Page, Text, View, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer';

export const RegistrationDocument = ({ registration_info }) => {
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
      paddingVertical: 5,
    },
    tableHeader: {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: '#000000',
    },
    tableColCiclo: {
      display: 'table-cell',
      width: '8%',
      padding: 5,
      fontSize: 9,
      textAlign: 'center',
    },
    tableColCurso: {
      display: 'table-cell',
      width: '15%',
      padding: 5,
      fontSize: 9,
      textAlign: 'center',
    },
    tableColCreditos: {
      display: 'table-cell',
      width: '8%',
      padding: 5,
      fontSize: 9,
      textAlign: 'center',
    },
    tableColNombre: {
      display: 'table-cell',
      width: '69%',
      padding: 5,
      fontSize: 9,
    },
    totalSection: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingTop: 10,
    },
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
    <PDFViewer height="600" width="100%">
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Image style={styles.logo} src={faviconUrl} />
            <View style={styles.headerText}>
              <Text style={styles.universityName}>UNIVERSIDAD NACIONAL DE INGENIERÍA</Text>
              <Text style={styles.department}>Escuela Central de Posgrado</Text>
              <Text style={styles.subtitle}>
                Unidad de Posgrado de la Facultad de Ingeniería Económica, Estadística y Ciencias Sociales
              </Text>
            </View>
          </View>

          {/* Fecha de impresión */}
          <Text style={styles.printDate}>FECHA IMPRESIÓN: {getCurrentDate()}</Text>

          {/* Título */}
          <Text style={styles.title}>BOLETA DE MATRÍCULA {registration_info.period_enrollment}-FIEECS</Text>

          {/* Información del estudiante */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>FACULTAD :</Text>
              <Text style={styles.infoValue}>
                Unidad de Posgrado de la Facultad de Ingeniería Económica, Estadística y Ciencias Sociales
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>MENCIÓN :</Text>
              <Text style={styles.infoValue}>{registration_info.program_enrollment}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ALUMNO :</Text>
              <Text style={styles.infoValue}>{registration_info.student_full_name}</Text>
            </View>
          </View>

          {/* Tabla de cursos */}
          <View style={styles.table}>
            {/* Header de la tabla */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableColCiclo}>CICLO</Text>
              <Text style={styles.tableColCurso}>CURSO</Text>
              <Text style={styles.tableColCreditos}>CRD</Text>
              <Text style={styles.tableColNombre}>NOMBRE CURSO</Text>
            </View>

            {/* Filas de cursos */}
            {registration_info.courses_groups.map((course, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableColCiclo}>{course.cycle}</Text>
                <Text style={styles.tableColCurso}>{course.group_code}</Text>
                <Text style={styles.tableColCreditos}>{course.credits}</Text>
                <Text style={styles.tableColNombre}>{course.course_name}</Text>
              </View>
            ))}
          </View>

          {/* Totales */}
          <View style={styles.totalSection}>
            <Text style={styles.totalItem}>Total de Cursos: {registration_info.total_courses}</Text>
            <Text style={styles.totalItem}>Total de Créditos: {registration_info.total_credits}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

RegistrationDocument.propTypes = {
  registration_info: PropTypes.object.isRequired
}

