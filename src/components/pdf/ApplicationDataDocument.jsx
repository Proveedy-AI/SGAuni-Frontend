import PropTypes from 'prop-types';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  logo: { width: 48, height: 48, marginRight: 16 },
  headerText: { flexDirection: 'column', flex: 1 },
  uniTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  uniSubtitle: { fontSize: 10, marginBottom: 1 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', marginVertical: 12, textAlign: 'left' },
  dataRow: { flexDirection: 'row', marginBottom: 6 },
  label: { width: 140, fontWeight: 'bold', color: '#333' },
  value: { flex: 1, color: '#222' },
  divider: { borderBottom: '1pt solid #ccc', marginVertical: 10 },
});

export const ApplicationDataDocument = ({ applicationData }) => {
  const faviconUrl = `${window.location.origin}/favicon.png`;
  const p = applicationData?.person_details || {};

  return (
    <PDFViewer height="600" width="100%">
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Image src={faviconUrl} style={styles.logo} />
            <View style={styles.headerText}>
              <Text style={styles.uniTitle}>UNIVERSIDAD NACIONAL DE INGENIERÍA</Text>
              <Text style={styles.uniSubtitle}>ESCUELA DE POSTGRADO</Text>
              <Text style={styles.uniSubtitle}>UNIDAD DE POSTGRADO</Text>
              <Text style={styles.uniSubtitle}>Facultad de Ingeniería Económica, Estadística y Ciencias Sociales</Text>
            </View>
          </View>

          <View style={[styles.uniTitle, { textAlign: 'center', marginBottom: 5 }]}>
            <Text>FICHA DE POSTULANTE</Text>
          </View>

          <View style={styles.divider} />

          {/* Title */}
          <Text style={styles.sectionTitle}>Datos Personales</Text>

          {/* Datos personales */}
          <View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Nombre completo:</Text>
              <Text style={styles.value}>{p.full_name}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Correo electrónico:</Text>
              <Text style={styles.value}>{p.email}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Tipo de documento:</Text>
              <Text style={styles.value}>{p.type_document_name}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Número de documento:</Text>
              <Text style={styles.value}>{p.document_number}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{p.phone}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Dirección:</Text>
              <Text style={styles.value}>{p.address}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Fecha de nacimiento:</Text>
              <Text style={styles.value}>{p.birth_date}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>País:</Text>
              <Text style={styles.value}>{p.country_name}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Nacionalidad:</Text>
              <Text style={styles.value}>{p.nationality_name}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Departamento:</Text>
              <Text style={styles.value}>{p.department_name}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Provincia:</Text>
              <Text style={styles.value}>{p.province_name}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Distrito:</Text>
              <Text style={styles.value}>{p.district_name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Programa de postgrado */}
          <Text style={styles.sectionTitle}>Programa Alineado</Text>
          <View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Programa:</Text>
              <Text style={styles.value}>{applicationData.postgrade_name}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Proceso de admisión:</Text>
              <Text style={styles.value}>{applicationData.admission_process_name}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Modalidad:</Text>
              <Text style={styles.value}>{applicationData.modality_display}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Estado:</Text>
              <Text style={styles.value}>{applicationData.status_display}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Estado de calificación:</Text>
              <Text style={styles.value}>{applicationData.status_qualification_display}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

ApplicationDataDocument.propTypes = {
  applicationData: PropTypes.object.isRequired,
};