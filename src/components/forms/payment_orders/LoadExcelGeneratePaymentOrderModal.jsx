import { Alert, Button, Field, Modal, toaster } from '@/components/ui';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { useGeneratePaymentOrderExcel } from '@/hooks/payment_orders';
import { uploadToS3 } from '@/utils/uploadToS3';
import { Box, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useReadEnrollmentsPrograms } from '@/hooks/enrollments_programs';
import { ReactSelect } from '@/components/select';

export const LoadExcelGeneratePaymentOrderModal = ({ fetchData }) => {
	const [open, setOpen] = useState(false);
	const [excelPath, setExcelPath] = useState(null);
	const { mutate: validate } = useGeneratePaymentOrderExcel();
	const [isLoading, setIsLoading] = useState(false);
	const [selectedProgram, setSelectedProgram] = useState(null);

	const { data: enrollmentsPrograms } = useReadEnrollmentsPrograms(
		{ status: 4 },
		{ enable: open }
	);

  console.log(enrollmentsPrograms)

	const enrollmentOptions = enrollmentsPrograms?.results
		? enrollmentsPrograms.results.map((program) => ({
				value: program.uuid,
				label: `${program.name || program.program_name} - ${program.enrollment_period_name}`,
			}))
		: [];

	const handleValidate = async () => {
		setIsLoading(true);

		if (!excelPath || !selectedProgram) {
			toaster.create({
				title: 'Datos incompletos',
				description: 'Por favor, selecciona un programa y un archivo Excel.',
				type: 'warning',
			});
			setIsLoading(false);
			return;
		}

		let pathDocUrl = excelPath;

		try {
			// Subir a S3 si es nuevo
			if (excelPath instanceof File) {
				pathDocUrl = await uploadToS3(
					excelPath,
					'sga_uni/vouchers/validation',
					'excel_ocef',
          'xlsx'
				);
			}

			if (!pathDocUrl) {
				throw new Error('Error al subir el archivo a S3.');
			}

			const payload = { order_excel_url: pathDocUrl };

			validate({ uuid: selectedProgram?.value, payload }, {
				onSuccess: () => {
					toaster.create({
						title: 'Validación exitosa',
						description: 'El archivo Excel ha sido subido correctamente.',
						type: 'success',
					});
					setOpen(false);
					fetchData();
					setExcelPath(null);
					setIsLoading(false);
				},
			});
		} catch (err) {
			toaster.create({
				title: 'Error inesperado',
				description: err.message || 'No se pudo completar la validación.',
				type: 'error',
			});
			setIsLoading(false);
		} finally {
			// Limpiar el estado del archivo después de la validación
			setExcelPath(null);
			setIsLoading(false);
		}
	};

	const handleDownloadGuide = () => {
		// Crear un enlace temporal para descargar el archivo
		const link = document.createElement('a');
		link.href = '/templates/GENERAR-ORDENES-DE-PAGO.xlsx'; // Archivo en la carpeta public
		link.download = 'GENERAR-ORDENES-DE-PAGO.xlsx';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toaster.create({
			title: 'Descarga completa',
			description: 'La guía del ordenes de pago se descargó correctamente.',
			type: 'success',
			duration: 3000,
			isClosable: true,
		});
	};

	return (
		<Modal
			trigger={
				<Button
					borderColor='uni.secondary'
					color='uni.secondary'
					variant='outline'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					Generar Ordenes con Excel
				</Button>
			}
			title='Generar Ordenes de Pago para propositos de créditos'
			placement='center'
			size='2xl'
			loading={isLoading}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			onSave={() => handleValidate()}
		>
			<Stack gap={4}>
				<Stack gap={4} w='full'>
					<Field label='Programa Académico:'>
						<ReactSelect
							value={selectedProgram}
							onChange={setSelectedProgram}
							variant='flushed'
							size='xs'
							isSearchable
							isClearable
							options={enrollmentOptions}
						/>
					</Field>
					<Field label='Excel:'>
						<CompactFileUpload
							name='path_ocef'
							accept='.xlsx'
							onChange={(file) => setExcelPath(file)}
							onClear={() => setExcelPath(null)}
						/>
					</Field>
				</Stack>
				<Alert
					status='info'
					borderRadius='lg'
					bg='blue.50'
					borderColor='blue.200'
					borderWidth={1}
					title='Requisitos del archivo:'
				>
					<VStack align='start' gap={1}>
						<Text>
							• La generacion de ordenes de pago es exclusiva para propositos de
							créditos
						</Text>
						<Text>• Formato requerido: .xlsx o .xls</Text>
						<Text>• Columnas: Descargar Guía de formato correcto</Text>
						<Text>• Primera fila debe contener los encabezados</Text>
					</VStack>
				</Alert>

				<Box
					bg='gray.50'
					p={4}
					w={'full'}
					borderRadius='lg'
					border='1px solid'
					borderColor='gray.200'
				>
					<HStack justify='space-between' align='center'>
						<HStack gap={3}>
							<Box
								w={8}
								h={8}
								bg='green.100'
								borderRadius='full'
								display='flex'
								alignItems='center'
								justifyContent='center'
							>
								<FiFileText color='green.600' size={16} />
							</Box>
							<Box>
								<Text fontSize='sm' fontWeight='medium' color='gray.800'>
									Plantilla de ejemplo
								</Text>
								<Text fontSize='xs' color='gray.600'>
									Descarga la guía con formato correcto
								</Text>
							</Box>
						</HStack>

						<Button
							colorPalette='green'
							variant='solid'
							onClick={handleDownloadGuide}
							borderRadius='lg'
						>
							<FiDownload /> Descargar guía
						</Button>
					</HStack>
				</Box>
			</Stack>
		</Modal>
	);
};

LoadExcelGeneratePaymentOrderModal.propTypes = {
	fetchData: PropTypes.func.isRequired,
};
