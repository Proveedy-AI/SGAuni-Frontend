import PropTypes from 'prop-types';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  title: { fontSize: 8, textAlign: 'center', marginBottom: 8, fontWeight: 'bold' },
  subtitle: { fontSize: 8, textAlign: 'center', marginBottom: 20, fontWeight: 'semibold' },
  table: { display: 'table', width: 'auto', margin: '0 auto' },
  tableHeader: { backgroundColor: '#eee', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row' },
  cell: { padding: 4, border: '1pt solid #ccc', minWidth: 60, textAlign: 'center' },
  cellWide: { minWidth: 120 }
});

export const PdfDocument = ({ dataProgram, headers, data }) => {
  const faviconUrl = `${window.location.origin}/favicon.png`;

  return (
    <PDFViewer height="600" width="100%">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ padding:'0px 54px', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image src={faviconUrl} style={{ width: 40, height: 40, marginRight: 12 }} />
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={[styles.title, { textAlign: 'left', marginBottom: 2 }]}>
                UNIVERSIDAD NACIONAL DE INGENIERÍA
              </Text>
              <Text style={[styles.subtitle, { textAlign: 'left', marginBottom: 0 }]}>
                ESCUELA DE POSTGRADO
              </Text>
              <Text style={[styles.subtitle, { textAlign: 'left', marginBottom: 0 }]}>
                UNIDAD DE POSTGRADO
              </Text>
              <Text style={[styles.subtitle, { textAlign: 'left', marginBottom: 0 }]}>
                Facultad de Ingeniería Económica, Estadística y Ciencias Sociales
              </Text>
            </View>
          </View>
          <View style={{ padding:'0px 54px', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ flexDirection: 'column', flex: 1, textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
              <Text style={{ backgroundColor: 'red' }}>
                { dataProgram.admission_process_name }
              </Text>
              <Text style={{ backgroundColor: 'red' }}>
                Acta
              </Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 1, textAlign: 'right' }}>
              <Text style={{ fontWeight: 'bold' }}>
                Modalidad:
              </Text>
              <Text>
                Evaluación de Méritos y Conocimientos
              </Text>
            </View>
          </View>
          
          <View style={{textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }}>
            <Text>{ dataProgram.program_name?.toUpperCase() }</Text>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              {headers.map((header, idx) => (
                <Text key={idx} style={styles.cell}>
                  {header}
                </Text>
              ))}
            </View>

            {data.map((row, idx) => (
              <View key={row.fullname || idx} style={styles.tableRow}>
                <Text style={styles.cell}>{idx + 1}</Text>
                <Text style={styles.cell}>{row.fullname}</Text>
                <Text style={styles.cell}>{row.knowledge_average}</Text>
                <Text style={styles.cell}>{row.merit_evaluation}</Text>
                <Text style={styles.cell}>{row.final_average}</Text>
                <Text style={styles.cell}>{row.enrolled ? 'Sí' : 'No'}</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

PdfDocument.propTypes = {
  dataProgram: PropTypes.object,
  headers: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
};