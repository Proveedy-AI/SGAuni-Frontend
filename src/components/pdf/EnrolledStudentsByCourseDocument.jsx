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
    fontSize: 10,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#8B0000',
    paddingBottom: 15,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: 2,
  },
  facultyName: {
    fontSize: 10,
    color: '#7f8c8d',
    fontWeight: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
    marginVertical: 20,
    color: '#2c3e50',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoSection: {
    marginBottom: 25,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  infoColumn: {
    width: '50%',
    paddingRight: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#34495e',
    width: 80,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 9,
    color: '#2c3e50',
    fontWeight: 400,
    flex: 1,
  },
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: '#000000',
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingVertical: 6,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderLeftWidth: 1,
    borderLeftColor: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    paddingVertical: 6,
    paddingHorizontal: 5,
    minHeight: 30,
  },
  tableCell: {
    fontSize: 8,
    color: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 6,
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  // Anchos de columnas
  colNumber: { width: '8%' },
  colCode: { width: '15%' },
  colDocument: { width: '15%' },
  colName: { width: '35%' },
  colEmail: { width: '27%' },
  
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#7f8c8d',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    paddingTop: 10,
  },
});

const PDFContent = ({ data, students }) => {
  const faviconUrl = `${window.location.origin}/favicon.png`;

  const NumberLabels = {
    1: 'PRIMER',
    2: 'SEGUNDO',
    3: 'TERCER',
    4: 'CUARTO',
    5: 'QUINTO',
    6: 'SEXTO',
    7: 'SÉPTIMO',
    8: 'OCTAVO',
    9: 'NOVENO',
    10: 'DÉCIMO'
  }

  const year = data?.period?.split('-')[0];
  const number = data?.period?.split('-')[1];
  const numberLabel = NumberLabels[number];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={faviconUrl} />
          <View style={styles.headerText}>
            <Text style={styles.universityName}>UNIVERSIDAD NACIONAL DE INGENIERÍA</Text>
            <Text style={styles.facultyName}>Escuela Central de Posgrado</Text>
          </View>
        </View>

        <Text style={styles.title}>ALUMNOS MATRICULADOS POR CURSO</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoGrid}>
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PERÍODO</Text>
                <Text style={styles.infoValue}>{data?.period || '2025-1-FIEECS'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>UNIDAD</Text>
                <Text style={styles.infoValue}>FIEECS</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PROGRAMA</Text>
                <Text style={styles.infoValue}>P52</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CURSO</Text>
                <Text style={styles.infoValue}>{data?.course_code || 'GP-031'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>SECCIÓN</Text>
                <Text style={styles.infoValue}>{data?.group_code || 'A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PROFESOR</Text>
                <Text style={styles.infoValue}>{data?.teacher_name?.toUpperCase() || 'CASTILLO OCHOA MANUEL ENRIQUE'}</Text>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}></Text>
                <Text style={styles.infoValue}>{year} {numberLabel} SEMESTRE FIEECS</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}></Text>
                <Text style={styles.infoValue}>Unidad de Posgrado de la Facultad de Ingeniería Económica, Estadística y Ciencias Sociales</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}></Text>
                <Text style={styles.infoValue}>MAESTRÍA EN GERENCIA PÚBLICA</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}></Text>
                <Text style={styles.infoValue}>TEORÍA POLÍTICA Y GOBERNABILIDAD</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}></Text>
                <Text style={styles.infoValue}>A</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}></Text>
                <Text style={styles.infoValue}></Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colNumber]}>N°</Text>
            <Text style={[styles.tableHeaderCell, styles.colCode]}>CÓDIGO</Text>
            <Text style={[styles.tableHeaderCell, styles.colDocument]}>DOCUMENTO</Text>
            <Text style={[styles.tableHeaderCell, styles.colName]}>NOMBRE COMPLETO</Text>
            <Text style={[styles.tableHeaderCell, styles.colEmail]}>CORREO ELECTRÓNICO</Text>
          </View>

          {students?.map((student, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.colNumber]}>
                <Text>{index + 1}</Text>
              </View>
              <View style={[styles.tableCell, styles.colCode]}>
                <Text>{student.code || ''}</Text>
              </View>
              <View style={[styles.tableCell, styles.colDocument]}>
                <Text>{student.document || ''}</Text>
              </View>
              <View style={[styles.tableCell, styles.colName]}>
                <Text>{student.full_name?.toUpperCase() || ''}</Text>
              </View>
              <View style={[styles.tableCell, styles.colEmail]}>
                <Text>{student.email || ''}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Documento generado automáticamente el {new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} - Sistema de Gestión Académica UNI
        </Text>
      </Page>
    </Document>
  );
};

PDFContent.propTypes = {
  data: PropTypes.shape({
    period: PropTypes.string,
    program: PropTypes.string,
    course_name: PropTypes.string,
    course_code: PropTypes.string,
    group_code: PropTypes.string,
    teacher_name: PropTypes.string,
  }),
  students: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      document: PropTypes.string,
      full_name: PropTypes.string,
      email: PropTypes.string,
    })
  ),
};

export const EnrolledStudentsByCourseDocument = ({ data, students }) => {
  return (
    <PDFViewer height="600" width="100%">
      <PDFContent data={data} students={students} />
    </PDFViewer>
  );
};

EnrolledStudentsByCourseDocument.propTypes = {
  data: PropTypes.object,
  students: PropTypes.array,
}
