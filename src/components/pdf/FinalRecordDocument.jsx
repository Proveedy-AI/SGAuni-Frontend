import PropTypes from 'prop-types';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { Button, Modal } from '../ui';
import { useState } from 'react';
import { useReadGradesApplicantions } from '@/hooks/admissions_applicants';
import { Spinner } from '@chakra-ui/react';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  title: { fontSize: 8, textAlign: 'center', marginBottom: 8, fontWeight: 'bold' },
  subtitle: { fontSize: 8, textAlign: 'center', marginBottom: 20, fontWeight: 'semibold' },
  table: { display: 'table', width: '100%', margin: '0 auto' },
  tableHeader: { backgroundColor: '#eee', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row' },
  cell: { padding: 4, border: '1pt solid #ccc', textAlign: 'center', flex: 1 },
  cellNum: { flex: 0.5 }, // Número
  cellName: { flex: 2 },  // Nombre
  cellScore: { flex: 1 }, // Puntajes
});

export const FinalRecordDocument = ({ modality, dataProgram, headers }) => {
  const [open, setOpen] = useState(false);
  const faviconUrl = `${window.location.origin}/favicon.png`;
  const {
    data: dataGrades,
    isLoading: isLoadingGrades,
  } = useReadGradesApplicantions(dataProgram?.uuid, open, {
    modality_id: modality?.value,
  });

  return (
    <Modal
      title="Vista previa del documento de acta de notas"
      placement="center"
      trigger={
        <Button onClick={() => setOpen(true)}>Ver Documento</Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size="4xl"
      hiddenFooter={true}
    >
      {isLoadingGrades && !dataGrades ? <Spinner /> : dataGrades ? (
        <PDFViewer height="600" width="100%">
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
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
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flexDirection: 'column', flex: 1, textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
                  <Text style={{ backgroundColor: 'red' }}>
                    { dataGrades.admission_process_name }
                  </Text>
                  <Text style={{ backgroundColor: 'red' }}>
                    Acta
                  </Text>
                </View>
                <View style={{ flexDirection: 'column', flex: 1, textAlign: 'right' }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Modalidad:
                  </Text>
                  <Text>{ dataGrades.modality_name }</Text>
                </View>
              </View>
              
              <View style={{textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }}>
                <Text>{ dataGrades.postgraduate_name?.toUpperCase() }</Text>
              </View>

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.cell, styles.cellNum]}>{headers[0]}</Text>
                  <Text style={[styles.cell, styles.cellName]}>{headers[1]}</Text>
                  {dataGrades.requires_essay && (
                      <Text style={[styles.cell, styles.cellScore]}>{headers[2]}</Text>
                  )}
                  {dataGrades.requires_interview && (
                    <Text style={[styles.cell, styles.cellScore]}>{headers[3]}</Text>
                  )}
                  <Text style={[styles.cell, styles.cellScore]}>{headers[4]}</Text>
                  <Text style={[styles.cell, styles.cellScore]}>{headers[5]}</Text>
                </View>

                {dataGrades.applicants?.map((row, idx) => (
                  <View key={row.fullname || idx} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.cellNum]}>{idx + 1}</Text>
                    <Text style={[styles.cell, styles.cellName]}>{row.person_full_name}</Text>
                    {dataGrades.requires_essay && (
                      <Text style={[styles.cell, styles.cellScore]}>{row.knowledge_average}</Text>
                    )}
                    {dataGrades.requires_interview && (
                      <Text style={[styles.cell, styles.cellScore]}>{row.merit_evaluation}</Text>
                    )}
                    <Text style={[styles.cell, styles.cellScore]}>{row.qualification_average || '-'}</Text>
                    <Text style={[styles.cell, styles.cellScore]}>{row.enrolled ? 'Sí' : 'No'}</Text>
                  </View>
                ))}
              </View>
            </Page>
          </Document>
        </PDFViewer>
      ) : (
        <Text>No se encontraron datos para mostrar</Text>
      )}
    </Modal>
  );
}

FinalRecordDocument.propTypes = {
  modality: PropTypes.object,
  dataProgram: PropTypes.object,
  headers: PropTypes.arrayOf(PropTypes.string),
};