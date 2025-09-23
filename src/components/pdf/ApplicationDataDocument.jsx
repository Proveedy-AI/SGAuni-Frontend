import PropTypes from 'prop-types';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';

// Estilos actualizados
const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontSize: 10, 
    fontFamily: 'Helvetica',
    lineHeight: 1.4
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10,
  },
  logo: { 
    width: 50, 
    height: 50, 
    marginRight: 15 
  },
  headerText: { 
    flexDirection: 'column', 
    flex: 1,
    textAlign: 'center'
  },
  uniTitle: { 
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'black',
    letterSpacing: -1,
    marginBottom: 3
  },
  uniSubtitle: { 
    textAlign: 'left',
    fontSize: 14, 
    fontWeight: 'black',
    letterSpacing: -1,
    marginBottom: 2
  },
  title: {
    fontSize: 14,
    fontWeight: 'black',
    textAlign: 'center',
    marginVertical: 10,
    textTransform: 'uppercase'
  },
  sectionTitle: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    marginVertical: 6,
    backgroundColor: '#e0e0e0',
    padding: 3,
    textAlign: 'center'
  },
  table: {
    display: 'table',
    width: '100%',
    borderColor: '#000',
    marginBottom: 10
  },
  tableRow: { 
    flexDirection: 'row' 
  },
  tableColHeader: {
    width: '25%',
    padding: 5,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    minHeight: 16
  },
  tableCellHeader: { 
    fontSize: 9, 
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tableCell: { 
    fontSize: 9,
    textAlign: 'center',
  },
  inlineSection: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center'
  },
  inlineLabel: {
    width: 150,
    fontWeight: 'bold'
  },
  inlineValue: {
    flex: 1
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  checkbox: {
    width: 10,
    height: 10,
    border: '1px solid #000',
    marginRight: 4
  },
  checked: {
    backgroundColor: '#000'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  signatureBox: {
    width: 200,
    borderTop: '1px solid #000',
    paddingTop: 5,
    textAlign: 'center'
  },
  divider: { borderBottom: '1pt solid #711610', marginVertical: 10 },
  photo: {
    width: 60,
    height: 80,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    marginLeft: 'auto',
    marginRight: 0
  }
});

export const ApplicationDataDocument = ({ applicationData }) => {
  const faviconUrl = `${window.location.origin}/favicon.png`;
  const p = applicationData?.person_details || {};
  
  // Separar nombre completo
  const nameParts = p.full_name?.split(' ') || [];
  const lastName = nameParts[0] || '';
  const motherLastName = nameParts[1] || '';
  const firstName = nameParts.slice(2).join(' ') || '';
  
  // Formatear fecha de nacimiento
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  };

  const semester = new Date().getMonth() < 6 ? '1' : '2';
  const academicPeriod = `${new Date().getFullYear()}-${semester}`;

  const languages = ['Inglés', 'Francés', 'Alemán', 'Ruso', 'Chino', 'Portugués'];
  return (
    <PDFViewer height="600" width="100%">
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Encabezado */}
          <View style={styles.header}>
            <Image src={faviconUrl} style={styles.logo} />
            <View style={styles.headerText}>
              <Text style={styles.uniTitle}>UNIVERSIDAD NACIONAL DE INGENIERÍA</Text>
              <View style={styles.divider} />
              <Text style={styles.uniSubtitle}>Escuela Central de Posgrado</Text>
            </View>
          </View>

          {/* Título principal */}
          <Text style={styles.title}>FICHA DE DATOS PERSONALES</Text>

          <View style={[styles.inlineSection, { alignItems: 'flex-start', gap: 16 }]}>
            <View style={{ width: '25%'}}>
              <Text style={{ textAlign: 'center', border: '1px solid #000' }}>{academicPeriod}</Text>
              <Text style={{ textAlign: 'center', margin: 5 }}>Período Académico</Text>
              <Text style={{ fontWeight: 'bold' }}>Programas:</Text>
              <Text>{applicationData.postgrade_name}</Text>
              <Text style={styles.inlineLabel}>Modalidad de Ingreso:</Text>
              <Text>{applicationData.modality_display}</Text>
            </View>
            <View style={{ width: '50%', paddingBottom: 5 }}>
              <Text style={{ textAlign: 'center', border: '1px solid #000' }}>FIEECS</Text>
              <Text style={{ textAlign: 'center', margin: 5,  }}>Unidad de Posgrado</Text>
            </View>
            <View style={styles.photo}>
              <Text style={{ fontSize: 8, color: '#888', textAlign: 'center' }}>Foto</Text>
              <Text style={{ fontSize: 8, color: '#888', textAlign: 'center' }}>(Tamaño carnet)</Text>
            </View>
          </View>

          {/* <View style={[styles.inlineSection, { marginTop: 10 }]}>
            <Text style={styles.inlineLabel}>Modalidad de Ingreso:</Text>
            <Text>{applicationData.modality_display}</Text>

            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {modalities.map((item) => (
                <View key={item} style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, item === applicationData.modality_display && styles.checked]} />
                  <Text>{item}</Text>
                </View>
              ))}
            </View>
          </View> */}

          <View>
            <Text style={{ textAlign: 'center', border: '1px solid #000' }}>{applicationData.specialty}</Text>
            <Text style={{ textAlign: 'center', margin: 5, fontWeight: 'bold' }}>Mención o Especialidad</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {width: '33%'}]}>
                <Text style={styles.tableCell}>{lastName}</Text>
              </View>
              <View style={[styles.tableCol, {width: '33%'}]}>
                <Text style={styles.tableCell}>{motherLastName}</Text>
              </View>
              <View style={[styles.tableCol, {width: '34%'}]}>
                <Text style={styles.tableCell}>{firstName}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, {width: '33%'}]}>
                <Text style={styles.tableCellHeader}>Ap. Paterno</Text>
              </View>
              <View style={[styles.tableColHeader, {width: '33%'}]}>
                <Text style={styles.tableCellHeader}>Ap. Materno</Text>
              </View>
              <View style={[styles.tableColHeader, {width: '34%'}]}>
                <Text style={styles.tableCellHeader}>Nombres</Text>
              </View>
            </View>
          </View>

          {/* Tabla de datos personales */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {width: '25%'}]}>
                <Text style={styles.tableCell}>{p.nationality_name}</Text>
              </View>
              <View style={[styles.tableCol, {width: '25%'}]}>
                <Text style={styles.tableCell}>{p.document_number}</Text>
              </View>
              <View style={[styles.tableCol, {width: '25%'}]}>
                <Text style={styles.tableCell}>{formatDate(p.birth_date)}</Text>
              </View>
              <View style={[styles.tableCol, {width: '25%'}]}>
                <Text style={styles.tableCell}>{p.gender ?? '-'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, {width: '25%'}]}>
                <Text style={styles.tableCellHeader}>Nacionalidad</Text>
              </View>
              <View style={[styles.tableColHeader, {width: '25%'}]}>
                <Text style={styles.tableCellHeader}>DNI; C.E; Pasaporte</Text>
              </View>
              <View style={[styles.tableColHeader, {width: '25%'}]}>
                <Text style={styles.tableCellHeader}>Fecha de Nacimiento</Text>
              </View>
              <View style={[styles.tableColHeader, {width: '25%'}]}>
                <Text style={styles.tableCellHeader}>Sexo (M/F)</Text>
              </View>
            </View>
          </View>

          {/* Tabla de dirección */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.address}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.district_name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.province_name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.department_name}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Dirección</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Distrito</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Provincia</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Departamento</Text>
              </View>
            </View>
          </View>

          {/* Teléfonos y email */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {width: '33%'}]}>
                <Text style={styles.tableCell}>{p.home_phone ?? '-'}</Text>
              </View>
              <View style={[styles.tableCol, {width: '33%'}]}>
                <Text style={styles.tableCell}>{p.phone}</Text>
              </View>
              <View style={[styles.tableCol, {width: '34%'}]}>
                <Text style={styles.tableCell}>{p.email}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, {width: '33%'}]}>
                <Text style={styles.tableCellHeader}>Teléfonos: Casa</Text>
              </View>
              <View style={[styles.tableColHeader, {width: '33%'}]}>
                <Text style={styles.tableCellHeader}>Celular</Text>
              </View>
              <View style={[styles.tableColHeader, {width: '34%'}]}>
                <Text style={styles.tableCellHeader}>E-mail</Text>
              </View>
            </View>
          </View>

          {/* Grados y títulos */}
          <View style={[styles.table, { display: 'flex', flexDirection: 'column' }]}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, {width: '50%'}]}>
                <Text style={styles.tableCellHeader}>Grados y Títulos</Text>
              </View>
              <View style={[styles.tableColHeader, {width: '50%'}]}>
                <Text style={styles.tableCellHeader}>Universidad de Precedencia</Text>
              </View>
            </View>
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCol, {width: '50%'}]}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={[styles.tableCol, {width: '50%'}]}>
                  <Text style={styles.tableCell}></Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', gap: 16, marginBottom: 8 }}>
            <Text style={{marginBottom: 5}}>Nº de Colegiatura: </Text>
            <Text style={{ width:'100%', textAlign: 'center', border: '1px solid #000' }}>{ applicationData?.colegiatura }</Text>
          </View>

          <Text style={{ fontWeight: 'bold' }}>IDIOMAS:</Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'flex-end' }}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, {width: '30%'}]}></View>
                <View style={[styles.tableColHeader, {width: '20%'}]}>
                  <Text style={styles.tableCellHeader}>Básico</Text>
                </View>
                <View style={[styles.tableColHeader, {width: '20%'}]}>
                  <Text style={styles.tableCellHeader}>Medio</Text>
                </View>
                <View style={[styles.tableColHeader, {width: '20%'}]}>
                  <Text style={styles.tableCellHeader}>Avanzado</Text>
                </View>
              </View>
              {languages.map((lang) => (
                <View key={lang} style={styles.tableRow}>
                  <View style={[styles.tableCol, {width: '30%'}]}>
                    <Text style={styles.tableCell}>{lang}</Text>
                  </View>
                  <View style={[styles.tableCol, {width: '20%'}]}>
                    <View style={{alignItems: 'center'}}>
                      <View style={styles.checkbox} />
                    </View>
                  </View>
                  <View style={[styles.tableCol, {width: '20%'}]}>
                    <View style={{alignItems: 'center'}}>
                      <View style={styles.checkbox} />
                    </View>
                  </View>
                  <View style={[styles.tableCol, {width: '20%'}]}>
                    <View style={{alignItems: 'center'}}>
                      <View style={styles.checkbox} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <View style={[styles.signatureBox, { width:'60%', marginTop: 24 }]}>
              <Text>Firma:</Text>
              <Text>Lima, ............ de .............................. de 2020</Text>
            </View>
          </View>

          {/* Pie de página */}
          <View style={styles.footer}>
            <View style={{ borderLeft: '2px solid #711610', paddingLeft: 8, fontSize: 8 }}>
              <Text>Av. Tupac Amaru N○ 210 Rimac, Lima-Perú </Text>
              <Text>Telefono: (511) 381-3826 - Central telefónica (511) 481-1070 Anexo: 3401</Text> 
              <Text>Web:postgrado.uni.edu.pe Email:posgrado@uni.edu.pe</Text>
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