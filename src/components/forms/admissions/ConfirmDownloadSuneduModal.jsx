import PropTypes from 'prop-types';
import { ControlledModal, toaster } from '@/components/ui';
import { Stack, Text } from '@chakra-ui/react';
import { useExportSuneduStudentExcel } from '@/hooks/admissions_programs';
import * as XLSX from 'xlsx';

export const ConfirmDownloadSuneduModal = ({
	admissionProcess,
	open,
	setOpen,
}) => {
	const { mutate: downloadSunedu, isPending } = useExportSuneduStudentExcel();

	// 👇 fusiona plantilla con los datos recibidos
	const loadExcelWithTemplate = async (blob) => {
		try {
			// 1. Convertir blob a ArrayBuffer
			const buffer = await blob.arrayBuffer();

			// 2. Leer workbook recibido del backend
			const receivedWb = XLSX.read(buffer, { type: 'array' });

			// 3. Leer plantilla desde /public/templates
			const templateResp = await fetch(
				'/templates/FORMATO-006-POSTULANTES.xlsx'
			);
			const templateBuffer = await templateResp.arrayBuffer();
			const templateWb = XLSX.read(templateBuffer, { type: 'array' });

			// 4. Reemplazar la Hoja1 de la plantilla con la Hoja1 del backend
			const sheetName = templateWb.SheetNames[0];
			const backendSheet = receivedWb.Sheets[receivedWb.SheetNames[0]];
			templateWb.Sheets[sheetName] = backendSheet;

			// 5. Exportar Excel final
			const excelBuffer = XLSX.write(templateWb, {
				bookType: 'xlsx',
				type: 'array',
			});

			const finalBlob = new Blob([excelBuffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});

			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(finalBlob);
			link.download = `estudiantes_admitidos_sunedu_${admissionProcess?.uuid}.xlsx`;
			link.click();
		} catch (err) {
			console.error(err);
			toaster.create({
				title: 'Error procesando Excel',
				type: 'error',
			});
		}
	};

	const handleDownload = () => {
		downloadSunedu(admissionProcess?.uuid, {
			onSuccess: (data) => {
				// ⚠️ Aquí asumimos que tu API devuelve JSON con estudiantes
				loadExcelWithTemplate(data);

				toaster.create({
					title: 'Descarga exitosa',
					type: 'success',
				});
				setOpen(false);
			},
			onError: (error) => {
				toaster.create({
					title:
						error.message ||
						'Error al descargar los estudiantes admitidos por SUNEDU.',
					type: 'error',
				});
			},
		});
	};

	return (
		<ControlledModal
			title='Vista Previa de Descarga SUNEDU'
			placement='center'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size='xl'
			onSave={handleDownload}
			loading={isPending}
		>
			<Stack css={{ '--field-label-width': '140px' }}>
				<Text>¿Desea descargar los estudiantes admitidos por SUNEDU?</Text>
			</Stack>
		</ControlledModal>
	);
};

ConfirmDownloadSuneduModal.propTypes = {
	admissionProcess: PropTypes.object,
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
