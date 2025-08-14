import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFViewer
} from '@react-pdf/renderer';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#8B0000',
    paddingBottom: 8,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  universityName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  facultyName: {
    fontSize: 9,
    color: '#7f8c8d',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#2c3e50',
    textTransform: 'uppercase',
  },
  infoSection: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    fontSize: 9,
    marginBottom: 2,
    paddingVertical: 2,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 70,
    color: '#34495e',
  },
  infoFirstValue:{
    flex: 0.5,
    color: '#2c3e50',
  },
  infoSecondValue:{
    flex: 1,
    color: '#2c3e50',
  },
  table: {
    marginTop: 15,
    borderColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#E0E0E0', // gray.50
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 3,
    justifyContent: 'center'
  },
  tableCell: {
    fontSize: 8,
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderColor: '#000',
    textAlign: 'left',
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

const PDFContent = ({ data, students }) => {
  const faviconUrl = `${window.location.origin}/favicon.png`;

  const NumberLabels = { 1: 'PRIMER', 2: 'SEGUNDO' };
  const year = data?.period?.split('-')[0];
  const number = data?.period?.split('-')[1];
  const numberLabel = NumberLabels[number];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={faviconUrl} />
          <View>
            <Text style={styles.universityName}>UNIVERSIDAD NACIONAL DE INGENIERÍA</Text>
            <Text style={styles.facultyName}>Escuela Central de Posgrado</Text>
          </View>
        </View>

        <Text style={styles.title}>ALUMNOS MATRICULADOS POR CURSO</Text>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PERÍODO</Text>
            <Text style={styles.infoFirstValue}>{data?.period || ''}</Text>
            <Text style={styles.infoSecondValue}>{year} {numberLabel} SEMESTRE</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>UNIDAD</Text>
            <Text style={styles.infoFirstValue}>FIEECS</Text>
            <Text style={styles.infoSecondValue}>Unidad de Posgrado de la Facultad de Ingeniería Económica, Estadística y Ciencias Sociales</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PROGRAMA</Text>
            <Text style={styles.infoFirstValue}>{data?.program_code?.toUpperCase() || ''}</Text>
            <Text style={styles.infoSecondValue}>{data?.program?.toUpperCase() || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CURSO</Text>
            <Text style={styles.infoFirstValue}>{data?.course_code || ''}</Text>
            <Text style={styles.infoSecondValue}>{data?.course_name?.toUpperCase() || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>SECCIÓN</Text>
            <Text style={styles.infoFirstValue}>{data?.group_code?.toUpperCase() || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PROFESOR</Text>
            <Text style={styles.infoFirstValue}>{data?.teacher_name?.toUpperCase() || ''}</Text>
          </View>
        </View>

        {/* Table */}
        <Table style={styles.table} weightings={[5, 15, 15, 40, 25]}>
          <TH>
            <TD style={styles.tableHeader}>N°</TD>
            <TD style={styles.tableHeader}>CÓDIGO</TD>
            <TD style={styles.tableHeader}>DOCUMENTO</TD>
            <TD style={styles.tableHeader}>NOMBRE COMPLETO</TD>
            <TD style={styles.tableHeader}>CORREO ELECTRÓNICO</TD>
          </TH>
          {students?.map((student, index) => (
            <TR key={index}>
              <TD style={{ ...styles.tableCell, justifyContent: 'center' }}>{index + 1}</TD>
              <TD style={{ ...styles.tableCell, justifyContent: 'center' }}>{student.code || ''}</TD>
              <TD style={{ ...styles.tableCell, justifyContent: 'center' }}>{student.document || ''}</TD>
              <TD style={styles.tableCell}>{student.full_name?.toUpperCase() || ''}</TD>
              <TD style={styles.tableCell}>{student.email || ''}</TD>
            </TR>
          ))}
        </Table>

        {/* Footer */}
        <Text style={styles.footer}>
          Documento generado automáticamente el {new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', month: 'long', day: 'numeric' 
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
    program_code: PropTypes.string,
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
