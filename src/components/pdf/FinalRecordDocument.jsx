import PropTypes from 'prop-types';
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	PDFViewer,
	Image,
} from '@react-pdf/renderer';
import { Button, Modal } from '../ui';
import { useState } from 'react';
import { useReadGradesApplicantions } from '@/hooks/admissions_applicants';
import { Spinner } from '@chakra-ui/react';
import { useReadDataDirectorMain } from '@/hooks/users';

const styles = StyleSheet.create({
	page: { padding: 20, fontSize: 10 },
	title: {
		fontSize: 8,
		textAlign: 'center',
		marginBottom: 8,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: 8,
		textAlign: 'center',
		marginBottom: 20,
		fontWeight: 'semibold',
	},
	table: { display: 'table', width: '100%', margin: '0 auto' },
	tableHeader: { backgroundColor: '#eee', fontWeight: 'bold' },
	tableRow: { flexDirection: 'row' },
	cell: { padding: 2, border: '1px solid #ccc', textAlign: 'center', flex: 1 },
	cellNum: { flex: 0.5 }, // Número
	cellName: { flex: 2 }, // Nombre
	cellScore: { flex: 1 }, // Puntajes
});

export const FinalRecordDocument = ({ modality, dataProgram, headers }) => {
	const [open, setOpen] = useState(false);
	const faviconUrl = `${window.location.origin}/favicon.png`;
	const { data: dataGrades, isLoading: isLoadingGrades } =
		useReadGradesApplicantions(dataProgram?.uuid, open, {
			modality_id: modality?.value,
		});

	const { data: dataDirector } = useReadDataDirectorMain();

	const today = new Date();
	const formattedDate = today.toLocaleDateString('es-PE', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});

	return (
		<Modal
			title='Vista previa del documento de acta de notas'
			placement='center'
			trigger={<Button onClick={() => setOpen(true)}>Ver Documento</Button>}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size='4xl'
			hiddenFooter={true}
		>
			{isLoadingGrades && !dataGrades ? (
				<Spinner />
			) : dataGrades ? (
				<PDFViewer height='600' width='100%'>
					<Document>
						<Page size='A4' style={styles.page}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginBottom: 10,
								}}
							>
								<Image
									src={faviconUrl}
									style={{ width: 40, height: 40, marginRight: 12 }}
								/>
								<View style={{ flexDirection: 'column', flex: 1 }}>
									<Text
										style={[
											styles.title,
											{ textAlign: 'left', marginBottom: 2 },
										]}
									>
										UNIVERSIDAD NACIONAL DE INGENIERÍA
									</Text>
									<Text
										style={[
											styles.subtitle,
											{ textAlign: 'left', marginBottom: 0 },
										]}
									>
										ESCUELA DE POSTGRADO
									</Text>
									<Text
										style={[
											styles.subtitle,
											{ textAlign: 'left', marginBottom: 0 },
										]}
									>
										UNIDAD DE POSTGRADO
									</Text>
									<Text
										style={[
											styles.subtitle,
											{ textAlign: 'left', marginBottom: 0 },
										]}
									>
										Facultad de Ingeniería Económica, Estadística y Ciencias
										Sociales
									</Text>
								</View>
							</View>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginBottom: 10,
								}}
							>
								<View
									style={{
										flexDirection: 'column',
										flex: 1,
										textAlign: 'center',
										color: 'white',
										fontWeight: 'bold',
									}}
								>
									<Text style={{ backgroundColor: '#8B1F1F', padding: '2px' }}>
										PROCESO DE ADMISIÓN {dataGrades.admission_process_name}
									</Text>
									<Text
										style={{ backgroundColor: '#8b3e1fff', padding: '2px' }}
									>
										Acta
									</Text>
								</View>
								<View
									style={{
										flexDirection: 'column',
										flex: 1,
										textAlign: 'right',
									}}
								>
									<Text style={{ fontWeight: 'bold' }}>Modalidad:</Text>
									<Text>{dataGrades.modality_name}</Text>
								</View>
							</View>

							<View
								style={{
									textAlign: 'center',
									fontWeight: 'bold',
									marginBottom: 10,
								}}
							>
								<Text>{dataGrades.postgraduate_name?.toUpperCase()}</Text>
							</View>

							<View style={styles.table}>
								<View style={[styles.tableRow, styles.tableHeader]}>
									<Text style={[styles.cell, styles.cellNum]}>
										{headers[0]}
									</Text>
									<Text style={[styles.cell, styles.cellName]}>
										{headers[1]}
									</Text>
									{dataGrades.requires_essay && (
										<Text style={[styles.cell, styles.cellScore]}>
											{headers[2]}
										</Text>
									)}
									{!dataGrades.requires_essay &&
										!dataGrades.requires_interview && (
											<Text style={[styles.cell, styles.cellScore]}>
												{headers[3]}
											</Text>
										)}
									{dataGrades.requires_interview && (
										<Text style={[styles.cell, styles.cellScore]}>
											{headers[4]}
										</Text>
									)}
									<Text style={[styles.cell, styles.cellScore]}>
										{headers[5]}
									</Text>
									<Text style={[styles.cell, styles.cellScore]}>
										{headers[6]}
									</Text>
								</View>

								{dataGrades.applicants?.map((row, idx) => (
									<View key={row.fullname || idx} style={styles.tableRow}>
										<Text style={[styles.cell, styles.cellNum]}>{idx + 1}</Text>
										<Text style={[styles.cell, styles.cellName]}>
											{row.person_full_name}
										</Text>
										{dataGrades.requires_essay && (
											<Text style={[styles.cell, styles.cellScore]}>
												{row.essay_score}
											</Text>
										)}
										{!dataGrades.requires_essay &&
											!dataGrades.requires_interview && (
												<Text style={[styles.cell, styles.cellScore]}>
													{dataGrades.postgraduate_name}
												</Text>
											)}
										{dataGrades.requires_interview && (
											<Text style={[styles.cell, styles.cellScore]}>
												{row.interview_score}
											</Text>
										)}
										<Text style={[styles.cell, styles.cellScore]}>
											{row.qualification_average || '-'}
										</Text>
										<Text style={[styles.cell, styles.cellScore]}>
											{row.has_passed ? 'Sí' : 'No'}
										</Text>
									</View>
								))}
							</View>
							<View style={{ marginTop: 10, textAlign: 'left' }}>
								<Text style={{ fontSize: 6 }}>
									C1, {dataDirector?.degree} {dataDirector?.name}{' '}
								</Text>
							</View>
							<View style={{ marginTop: 1, textAlign: 'left' }}>
								<Text style={{ fontSize: 6 }}>C2. {dataGrades.director} </Text>
							</View>
							<View style={{ marginTop: 1, textAlign: 'left' }}>
								<Text style={{ fontSize: 6 }}>
									C3. {dataGrades.coordinator}{' '}
								</Text>
							</View>
							<View
								style={{
									marginTop: 70,
									flexDirection: 'row',
									justifyContent: 'space-between',
									textAlign: 'center',
								}}
							>
								{/* Firma 1 */}
								<View style={{ flex: 1, marginHorizontal: 10 }}>
									<Text>__________________________</Text>
									<Text
										style={{ marginTop: 4, fontSize: 8, fontWeight: 'bold' }}
									>
										C1. DIRECTOR (e)
									</Text>
									<Text style={{ fontSize: 8 }}>UNIDAD DE POSGRADO FIEECS</Text>
								</View>

								{/* Firma 2 */}
								<View style={{ flex: 1, marginHorizontal: 10 }}>
									<Text>__________________________</Text>
									<Text
										style={{ marginTop: 4, fontSize: 8, fontWeight: 'bold' }}
									>
										C2. DIRECTOR (e) DEL ÁREA DE
									</Text>
									<Text style={{ fontSize: 8 }}>MAESTRÍAS</Text>
								</View>
							</View>

							{/* Firma 3 */}
							<View
								style={{
									marginTop: 60,
									alignItems: 'center',
									textAlign: 'center',
								}}
							>
								<Text>__________________________</Text>
								<Text style={{ marginTop: 4, fontSize: 8, fontWeight: 'bold' }}>
									C3. COORDINADOR ACADÉMICO DE LA
								</Text>
								<Text style={{ fontSize: 8 }}>
									{dataGrades.postgraduate_name}
								</Text>
							</View>
							<View style={{ marginTop: 40, textAlign: 'left' }}>
								<Text style={{ fontSize: 8 }}>Lima, {formattedDate}</Text>
							</View>
						</Page>
					</Document>
				</PDFViewer>
			) : (
				<Text>No se encontraron datos para mostrar</Text>
			)}
		</Modal>
	);
};

FinalRecordDocument.propTypes = {
	modality: PropTypes.object,
	dataProgram: PropTypes.object,
	headers: PropTypes.arrayOf(PropTypes.string),
};
