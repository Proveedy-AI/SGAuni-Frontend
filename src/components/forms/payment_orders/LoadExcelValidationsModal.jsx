import { Alert, Button, Field, Modal, toaster } from '@/components/ui';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { useValidateOcefExcel } from '@/hooks/payment_orders';
import { uploadToS3 } from '@/utils/uploadToS3';
import { Box, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';

export const LoadExcelValidationsModal = () => {
	const [open, setOpen] = useState(false);
	const [excelPath, setExcelPath] = useState(null);
	const { mutate: validate } = useValidateOcefExcel();
	const [isLoading, setIsLoading] = useState(false);

	const handleValidate = async () => {
		setIsLoading(true);
		if (!excelPath) {
			toaster.create({
				title: 'Excel no subido',
				description: 'Compartir el excel OCEF para validar ordenes de pago',
				type: 'warning',
			});
		}

		let pathDocUrl = excelPath;

		// Solo subir a S3 si hay un archivo nuevo
		if (excelPath instanceof File) {
			pathDocUrl = await uploadToS3(
				excelPath,
				'sga_uni/vouchers/validation',
				'excel_ocef'
			);
		}

		const payload = {
			excel_url: pathDocUrl,
		};

		validate(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Validación exitosa',
					description: 'El archivo Excel ha sido validado correctamente.',
					type: 'success',
				});
				setOpen(false);
				setExcelPath(null);
				setIsLoading(false);
			},
			onError: () => {
				toaster.create({
					title: 'Error en la validación',
					description: 'El archivo Excel no ha sido validado correctamente.',
					type: 'error',
				});
				setIsLoading(false);
			},
		});
	};

	const handleDownloadGuide = () => {
		// Crear un enlace temporal para descargar el archivo
		const link = document.createElement('a');
		link.href = '/templates/Verificar-Ordenes-de-pago-FIEECS-UNI.xlsx'; // Archivo en la carpeta public
		link.download = 'Verificar-Ordenes-de-pago-FIEECS-UNI.xlsx';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toaster.create({
			title: 'Descarga completa',
			description: 'La guía del validación se descargó correctamente.',
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
					Validar con excel OCEF
				</Button>
			}
			title='Validar órdenes de pago con documento OCEF'
			placement='center'
			size='xl'
			loading={isLoading}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			onSave={() => handleValidate()}
		>
			<Stack gap={4}>
				<Stack spacing={4} w='full'>
					<Field
						orientation={{ base: 'vertical', sm: 'horizontal' }}
						label='Excel OCEF:'
					>
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
					<VStack align='start' spacing={1}>
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
