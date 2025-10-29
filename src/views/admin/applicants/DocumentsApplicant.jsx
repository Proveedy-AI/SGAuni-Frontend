import {
	Box,
	Button,
	Flex,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import { useEffect, useMemo, useState } from 'react';
import { toaster, Tooltip } from '@/components/ui';
import { FiHelpCircle } from 'react-icons/fi';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { uploadToS3 } from '@/utils/uploadToS3';
import { useCreateDocuments, useReadDocuments } from '@/hooks/documents';
import PropTypes from 'prop-types';
import { GenerateApplicantDataPdfModal } from '@/components/forms/admissions';
import { useReadAdmissionApplicantById } from '@/hooks/admissions_applicants/useReadAdmissionApplicantById';

export const DocumentsApplicant = ({ onValidationChange }) => {
	const item = EncryptedStorage.load('selectedApplicant');
  const [originalDocuments, setOriginalDocuments] = useState([]);
  const [hasDocumentChanges, setHasDocumentChanges] = useState(false);
	const [documentsData, setDocumentsData] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState(1);

	const { data: dataApplicant } = useReadAdmissionApplicantById(item.id);
  console.log(dataApplicant?.documents);

  useEffect(() => {
    if (dataApplicant?.documents) {
      setOriginalDocuments(dataApplicant.documents);
    }
  }, [dataApplicant?.documents]);

	const handleFileChange = (key, file) => {
		setDocumentsData((prev) => ({
			...prev,
			[key]: {
				...prev[key],
				file,
				initialFilePath: prev[key]?.initialFilePath || null, // ✅ conserva valor original
			},
		}));
	};

	const documentRulesMap = useMemo(() => {
		if (!item?.rules) return {};
		return item.rules.reduce((acc, rule) => {
			acc[rule.id] = rule; // id === key del documento
			return acc;
		}, {});
	}, [item]);

  useEffect(() => {
    if (!originalDocuments || !documentsData) {
      setHasDocumentChanges(false);
      return;
    }

    // Compara cada documento actual con el original
    const hasChanges = Object.entries(documentsData).some(([ruleId, { file }]) => {
      // Busca el documento original por type_document_id
      const originalDoc = originalDocuments.find(doc => doc.type_document_id === documentRulesMap?.[ruleId]?.document_type);

      // Si no existe en original, es nuevo
      if (!originalDoc && file) return true;

      // Si existe, compara el nombre del archivo
      if (originalDoc && typeof file !== 'string' && file?.name !== originalDoc.file_path?.split('/').pop()) return true;

      return false;
    });

    setHasDocumentChanges(hasChanges);
  }, [documentsData, originalDocuments, documentRulesMap]);

	const leftColumnIds = [1, 3, 4, 5, 6, 7, 15]; // 👈 reglas que deben ir a la derecha

	const documentConfig = {
		3: {
			tooltip: 'Copia Simple, 6 meses para regularizar',
		},
		6: { tooltip: '(Concepto de carpeta)' },
		7: { tooltip: 'Copia Simple, adverso y reverso (pdf)' },
		14: {
			tooltip:
				'Asignaturas aprobadas (visadas y selladas) adjuntadas en un .pdf',
		},
		15: { tooltip: 'Copia Simple, 18 meses para regularizar' },

		// puedes seguir agregando aquí más ids...
	};
	const { leftColumnDocs, rightColumnDocs } = useMemo(() => {
		const visible = Object.values(documentRulesMap).filter(
			(rule) => rule.is_visible
		);

		const rightColumn = visible.filter(
			(rule) => !leftColumnIds.includes(rule.id)
		);
		const leftColumn = visible.filter((rule) =>
			leftColumnIds.includes(rule.id)
		);

		return {
			leftColumnDocs: leftColumn,
			rightColumnDocs: rightColumn,
		};
	}, [documentRulesMap, leftColumnIds]);

	const typeDocumentToKeyMap = useMemo(() => {
		if (!item?.rules) return {};
		return item.rules.reduce((acc, rule) => {
			if (rule.document_type != null) {
				// usamos el id de la regla como "key"
				acc[rule.document_type] = rule.id;
			}
			return acc;
		}, {});
	}, [item?.rules]);

	const { mutate: create } = useCreateDocuments();
	const { data: dataDocuments, refetch } = useReadDocuments({ application: item.id });

	useEffect(() => {
		if (!dataDocuments?.results || !item?.rules) return;

		const mappedDocs = {};

		dataDocuments.results.forEach((doc) => {
			// ahora el key es el id de la regla asociada
			const key = typeDocumentToKeyMap[doc.type_document];
			if (!key) return;

			mappedDocs[key] = {
				file: doc.file_path,
				initialFilePath: doc.file_path,
				description: doc.description_display,
				id: doc.id,
			};
		});

		// ⚠️ solo setear si hay cambios reales
		setDocumentsData((prev) => {
			const isEqual =
				JSON.stringify(prev) === JSON.stringify({ ...prev, ...mappedDocs });
			if (isEqual) return prev;
			return { ...prev, ...mappedDocs };
		});
	}, [dataDocuments]);

	useEffect(() => {
		if (!item?.rules) return;

		const excludedIds = [3, 15];

		const missing = item.rules
			.filter((rule) => !excludedIds.includes(rule.id)) // 👈 excluye 3 y 15
			.some((rule) => {
				if (!rule.is_required) return false;
				const file = documentsData?.[rule.id]?.file;
				return !file;
			});

		onValidationChange?.(!missing);
	}, [documentsData, item, onValidationChange]);

	const handleSubmitDocuments = async () => {
		const applicationId = item?.id;
		if (!applicationId) {
			toaster.create({
				title: 'No se encontró el identificador de la postulación',
				status: 'warning',
			});
			return;
		}

		setIsLoading(true);

		const missingRequiredDocs = [];
		const allDocs = [...leftColumnDocs, ...rightColumnDocs];

		for (const rule of allDocs) {
			const isRequired = rule?.is_required ?? false;
			const uploadedFile = documentsData?.[rule.id]?.file;
			if (isRequired && !uploadedFile) {
				missingRequiredDocs.push(rule.field_name);
			}
		}

		if (missingRequiredDocs.length > 0) {
			toaster.create({
				title: 'Faltan documentos requeridos',
				description: `Debes subir los siguientes documentos: ${missingRequiredDocs.join(', ')}.`,
				type: 'info',
			});
			setIsLoading(false);
			return;
		}

		let uploadedCount = 0;
		let keptCount = 0;
		let documentsPayload = await Promise.all(
			Object.entries(documentsData).map(async ([ruleId, { file }]) => {
				const rule = documentRulesMap?.[ruleId];
				if (!rule?.id || !file) return null;

				// Buscar el documento original
				const originalDoc = originalDocuments.find(doc => doc.type_document_id === rule.document_type);

				// Si el archivo es string, es solo path, se mantiene
				if (typeof file === 'string') {
					keptCount++;
					return {
						type_document_id: rule.document_type,
						description: 1,
						file_path: file,
					};
				}

				// Si existe original y el nombre es igual, se mantiene
				if (originalDoc && file.name === originalDoc.file_path?.split('/').pop()) {
					keptCount++;
					return {
						type_document_id: rule.document_type,
						description: 1,
						file_path: originalDoc.file_path,
					};
				}

				// Si es diferente, se sube a S3
				const filePath = await uploadToS3(
					file,
					'sga_uni/applicants_documents',
					`${item.first_name?.replace(/\s+/g, '_') || 'document'}_${rule.field_name}`
				);
				uploadedCount++;
				return {
					type_document_id: rule.document_type,
					description: 1,
					file_path: filePath,
				};
			})
		).then((res) => res.filter(Boolean));

		const filteredPayload = documentsPayload.filter(Boolean);

		console.log('Payload final de documentos:', filteredPayload);
		console.log(`Subidos a S3: ${uploadedCount}, mantenidos: ${keptCount}`);

			// 3️⃣ Llamada final
			create(
				{
					application_id: applicationId,
					documents: filteredPayload,
				},
				{
					onSuccess: () => {
						setIsLoading(false);
						refetch();
						// Reinicia originalDocuments y bloquea cambios
						setOriginalDocuments(filteredPayload.map(doc => ({
							type_document_id: doc.type_document_id,
							file_path: doc.file_path
						})));
						setHasDocumentChanges(false);
						toaster.create({
							title: 'Documentos guardados',
							description:
								'Los documentos fueron enviados correctamente. Puede continuar con el proceso.',
							type: 'success',
						});
            if(uploadedCount > 0){
              toaster.create({
                title: 'Documentos actualizados',
                description: `Se actualizaron ${uploadedCount} documentos.`,
                type: 'info',
              });
            }
					},
					onError: () => {
						setIsLoading(false);
						toaster.create({
							title: 'Error',
							description: 'No se pudieron enviar los documentos.',
							status: 'error',
						});
					},
				}
			);
	};

	const handleDownloadGuides = () => {
		const files = [
			'/templates/Carta-presentación.docx',
			'/templates/Solicitud.docx',
			'/templates/Declaración-Jurada.docx',
		];

		files.forEach((file) => {
			const link = document.createElement('a');
			link.href = file;
			link.download = '';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		});
	};

	return (
		<Box
			bg={{ base: 'white', _dark: 'its.gray.500' }}
			p='4'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
			justifyContent={'center'}
			mx={'auto'}
			w={{ base: 'full', md: '80%' }}
			mb={10}
			mt={1}
		>
			<Stack
				direction={{ base: 'column', sm: 'row' }}
				align='center'
				justifyContent={'center'}
				mb={5}
			>
				<Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }} color='gray.500'>
					Subir documentos requeridos
				</Heading>
			</Stack>
			<Flex mb={6} gap={8} justify='center'>
				{[
					{ stepNum: 1, label: 'Datos base' },
					{ stepNum: 2, label: 'Otros formatos' },
				].map(({ stepNum, label }) => (
					<Flex
						key={stepNum}
						direction='column'
						align='center'
						cursor='pointer'
						onClick={() => setStep(stepNum)}
					>
						<Flex
							align='center'
							justify='center'
							boxSize='40px'
							borderRadius='full'
							bg={step === stepNum ? 'uni.primary' : 'gray.200'}
							color={step === stepNum ? 'white' : 'gray.600'}
							fontWeight='bold'
							mb={2}
							transition='all 0.2s'
						>
							{stepNum}
						</Flex>
						<Text
							fontSize='sm'
							fontWeight={step === stepNum ? 'bold' : 'normal'}
							color={step === stepNum ? 'uni.primary' : 'gray.500'}
						>
							{label}
						</Text>
					</Flex>
				))}
			</Flex>
			<Stack p={4} gap={4} css={{ '--field-label-width': '150px' }}>
				{step === 1 ? (
					<>
						<Stack
							direction={{ base: 'column', md: 'row' }}
							align={{ base: 'center', md: 'center' }}
							justify={{ base: 'center', md: 'space-between' }}
							bg='gray.50'
							p={4}
							borderRadius='lg'
							mx={'auto'}
							w={{ base: 'full', md: '95%' }}
							boxShadow='md'
							position='relative'
							maxH={{ base: 'none', md: '150px' }}
							spacing={{ base: 4, md: 6 }}
							mb={6}
							px={{ base: 'none', md: 20 }}
						>
							{/* Imagen */}
							<Box
								position='relative'
								zIndex={2}
								transform={{ base: 'none', md: 'translateY(-20%)' }}
								overflow='hidden'
								w={{ base: '100px', md: '200px' }}
								h={{ base: '100px', md: '200px' }}
								flexShrink={0}
							>
								<img
									src='/img/imgs.png'
									alt='Icono'
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							</Box>

							{/* Texto */}
							<Box
								flex={1}
								px={{ base: 2, md: 4 }}
								display='flex'
								justifyContent='center'
							>
								<Box textAlign={{ base: 'center', md: 'start' }}>
									<Heading size='md' color='gray.600'>
										Ficha de Inscripción
									</Heading>
									<Text fontSize='sm' color='gray.500'>
										Descarga tu ficha de inscripción.
									</Text>
								</Box>
							</Box>

							{/* Botón */}
							<Box pt={{ base: 2, md: 0 }}>
								<GenerateApplicantDataPdfModal
									applicationPersonalData={dataApplicant}
								/>
							</Box>
						</Stack>
						{/* Paso 1: Mostrar documentos de la derecha en dos columnas */}
						<SimpleGrid
							columns={[1, 2]} // 1 col en móvil, 2 en desktop
							gap={4}
						>
							{leftColumnDocs.map((rule) => {
								const isRequired = rule?.is_required ?? false;
								const tooltip = documentConfig?.[rule.id]?.tooltip;

								return (
									<Box key={rule.id}>
										<Text fontWeight='medium'>
											{rule.field_name}{' '}
											{tooltip && (
												<Tooltip
													content={tooltip}
													positioning={{ placement: 'top-center' }}
													showArrow
													openDelay={0}
												>
													<span>
														<FiHelpCircle
															style={{
																display: 'inline',
																verticalAlign: 'middle',
																cursor: 'pointer',
															}}
														/>
													</span>
												</Tooltip>
											)}
											{isRequired && (
												<Text as='span' color='red.500'>
													{' '}
													*
												</Text>
											)}
										</Text>

										<CompactFileUpload
											name={`file-${rule.id}`}
											onChange={(file) => handleFileChange(rule.id, file)}
											defaultFile={documentsData[rule.id]?.file ?? null}
											onClear={() => handleFileChange(rule.id, null)}
										/>
									</Box>
								);
							})}
						</SimpleGrid>
					</>
				) : (
					// Paso 2: Mostrar documentos de la izquierda
					<>
						<Stack
							direction={{ base: 'column', md: 'row' }}
							align={{ base: 'center', md: 'center' }}
							justify={{ base: 'center', md: 'space-between' }}
							bg='gray.50'
							p={4}
							borderRadius='lg'
							mx={'auto'}
							w={{ base: 'full', md: '95%' }}
							boxShadow='md'
							position='relative'
							maxH={{ base: 'none', md: '150px' }}
							spacing={{ base: 4, md: 6 }}
							mb={6}
							px={{ base: 'none', md: 20 }}
						>
							{/* Imagen */}
							<Box
								position='relative'
								zIndex={2}
								transform={{ base: 'none', md: 'translateY(-20%)' }}
								overflow='hidden'
								w={{ base: '100px', md: '160px' }}
								h={{ base: '100px', md: '160px' }}
								flexShrink={0}
							>
								<img
									src='/img/rafiki.svg'
									alt='Icono'
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							</Box>

							{/* Texto */}
							<Box
								flex={1}
								px={{ base: 2, md: 4 }}
								display='flex'
								justifyContent='center'
							>
								<Box textAlign={{ base: 'center', md: 'start' }}  overflowY="hidden">
									<Heading size='md' color='gray.600'>
										Plantillas de formatos
									</Heading>
									<Text fontSize='sm' color='gray.500'>
										Es necesario descargar las plantilla de los formatos
										solicitados.
									</Text>
								</Box>
							</Box>

							{/* Botón */}
							<Box pt={{ base: 2, md: 0 }}>
								<Button
									colorScheme='blue'
									onClick={handleDownloadGuides}
									size='sm'
								>
									Descargar guías
								</Button>
							</Box>
						</Stack>
						<Stack
							spacing={4}
							justifyContent={'center'}
							mx={'auto'}
							w={{ base: 'full', md: '80%' }}
						>
							{rightColumnDocs.map((rule) => {
								const isRequired = rule?.is_required ?? false;
								const tooltip = documentConfig?.[rule.id]?.tooltip;

								return (
									<Box key={rule.id}>
										<Text fontWeight='medium'>
											{rule.field_name}{' '}
											{tooltip && (
												<Tooltip
													content={tooltip}
													positioning={{ placement: 'top-center' }}
													showArrow
													openDelay={0}
												>
													<span>
														<FiHelpCircle
															style={{
																display: 'inline',
																verticalAlign: 'middle',
																cursor: 'pointer',
															}}
														/>
													</span>
												</Tooltip>
											)}
											{isRequired && (
												<Text as='span' color='red.500'>
													{' '}
													*
												</Text>
											)}
										</Text>
										<CompactFileUpload
											name={`file-${rule.id}`}
											onChange={(file) => handleFileChange(rule.id, file)}
											defaultFile={documentsData[rule.id]?.file ?? null}
											onClear={() => handleFileChange(rule.id, null)}
										/>
									</Box>
								);
							})}
						</Stack>
					</>
				)}
			</Stack>

			<Flex justify='flex-end' mt={6} gap={3}>
				{step === 1 ? (
					<Button bg='uni.primary' color='white' onClick={() => setStep(2)}>
						Siguiente
					</Button>
				) : (
					<>
						<Button variant='outline' onClick={() => setStep(1)}>
							Atrás
						</Button>
						<Button
							bg='uni.secondary'
							color='white'
							loading={isLoading}
							onClick={handleSubmitDocuments}
              disabled={!hasDocumentChanges}
						>
							Guardar cambios
						</Button>
					</>
				)}
			</Flex>
		</Box>
	);
};

DocumentsApplicant.propTypes = {
	onValidationChange: PropTypes.bool,
};
