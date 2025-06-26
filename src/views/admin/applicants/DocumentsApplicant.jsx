import {
	Box,
	Button,
	Flex,
	Grid,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import React, { useEffect, useState } from 'react';
import { RequiredDocumentsSections } from '@/data';
import { toaster, Tooltip } from '@/components/ui';
import { FiHelpCircle } from 'react-icons/fi';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { uploadToS3 } from '@/utils/uploadToS3';
import { useCreateDocuments, useReadDocuments } from '@/hooks/documents';
import PropTypes from 'prop-types';
import { FaDownload } from 'react-icons/fa';
import { GenerateApplicantDataPdfModal } from '@/components/forms/admissions';
import { useReadAdmissionApplicantById } from '@/hooks/admissions_applicants/useReadAdmissionApplicantById';

export const DocumentsApplicant = ({ onValidationChange }) => {
	const item = EncryptedStorage.load('selectedApplicant');
	const [documentsData, setDocumentsData] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const { data: dataApplicant } = useReadAdmissionApplicantById(item.id);

	const handleFileChange = (key, file) => {
		setDocumentsData((prev) => ({
			...prev,
			[key]: {
				...prev[key],
				file,
			},
		}));
	};

	const allDocuments = [
		...RequiredDocumentsSections.leftColumn,
		...RequiredDocumentsSections.rightColumn,
	];

	const typeDocumentToKeyMap = allDocuments.reduce((acc, doc) => {
		if (doc.type_document != null && doc.key != null) {
			acc[doc.type_document] = doc.key;
		}
		return acc;
	}, {});

	const documentRulesMap = item?.rules?.reduce((acc, rule) => {
		acc[rule.id] = rule;
		return acc;
	}, {});

	const shouldShowDocument = (doc) => {
		if (doc.key != null) {
			const rule = documentRulesMap?.[doc.key];
			return rule?.is_visible ?? false;
		}
		return true;
	};

	const { mutate: create } = useCreateDocuments();
	const { data: dataDocuments } = useReadDocuments();

	useEffect(() => {
		if (!dataDocuments?.results || !item) return;

		const mappedDocs = {};

		dataDocuments.results
			.filter((doc) => doc.application === item.id)
			.forEach((doc) => {
				const key = typeDocumentToKeyMap[doc.type_document];
				if (!key) return;

				mappedDocs[key] = {
					file: doc.file_path,
					description: doc.description_display,
					id: doc.id,
				};
			});

		setDocumentsData((prev) => ({
			...prev,
			...mappedDocs,
		}));
	}, [dataDocuments]);

	useEffect(() => {
		if (!item || !documentRulesMap) return;

		const allDocs = [
			...RequiredDocumentsSections.leftColumn,
			...RequiredDocumentsSections.rightColumn,
		];

		const missing = allDocs.some((doc) => {
			const rule = doc.key ? documentRulesMap?.[doc.key] : null;
			const isRequired = rule?.is_required ?? false;
			if (!isRequired) return false;
			const file = documentsData?.[doc.key]?.file;
			return !file;
		});

		onValidationChange?.(!missing); // true si está todo ok
	}, [documentsData, item]);

	const handleSubmitDocuments = async () => {
		const applicationId = item?.id;
		if (!applicationId) {
			toaster.create({
				title: 'No se encontro el identificador de la postulación',
				status: 'warning',
			});
			return;
		}

		setIsLoading(true);
		const missingRequiredDocs = [];

		const allDocs = [
			...RequiredDocumentsSections.leftColumn,
			...RequiredDocumentsSections.rightColumn,
		];

		for (const doc of allDocs) {
			const rule = doc.key ? documentRulesMap?.[doc.key] : null;

			const isRequired = rule?.is_required ?? false;

			const uploadedFile = documentsData[doc.key]?.file;
			console.log(uploadedFile);
			if (isRequired && !uploadedFile) {
				missingRequiredDocs.push(doc.label);
			}
		}

		if (missingRequiredDocs.length > 0) {
			toaster.create({
				title: 'Faltan documentos requeridos',
				description: `Debes subir los siguientes documentos: ${missingRequiredDocs.join(
					', '
				)}.`,
				type: 'info',
			});
			setIsLoading(false);
			return;
		}

		const documentsPayload = await Promise.all(
			Object.entries(documentsData).map(async ([key, { file }]) => {
				const docInfo = allDocuments.find((d) => `${d.key}` === key);
				if (!docInfo?.type_document || !file) return null;

				const filePath = await uploadToS3(
					file,
					'sga_uni/applicants_documents',
					`${item.first_name?.replace(/\s+/g, '_') || 'document'}_${docInfo.label}`
				);

				return {
					type_document_id: docInfo.type_document,
					description: 1, //CAMBIAR O BORRAR
					file_path: filePath,
				};
			})
		);
		const filteredPayload = documentsPayload.filter(Boolean);
		create(
			{
				application_id: applicationId,
				documents: filteredPayload,
			},
			{
				onSuccess: () => {
					setIsLoading(false);
					toaster.create({
						title: 'Documentos guardados',
						description: 'Los documentos fueron enviados correctamente.',
						status: 'success',
					});
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
			'/templates/Solicitud-Maestria.docx',
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

	const renderDocumentList = (section) =>
		section.filter(shouldShowDocument).map(({ key, label, tooltip }) => {
			const rule = key != null ? documentRulesMap?.[key] : null;
			const isRequired = rule?.is_required ?? false;

			return (
				<React.Fragment key={`${key ?? 'no-key'}-${label}`}>
					<Text fontWeight='medium'>
						{label}{' '}
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
						name={`file-${key}`}
						onChange={(file) => handleFileChange(key, file)}
						defaultFile={
							typeof documentsData[key]?.file === 'string'
								? documentsData[key].file
								: null
						}
						onClear={() => handleFileChange(key, null)}
					/>
				</React.Fragment>
			);
		});

	return (
		<Box
			bg={{ base: 'white', _dark: 'its.gray.500' }}
			p='4'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
			mb={10}
			mt={1}
		>
			<Stack
				direction={{ base: 'column', sm: 'row' }}
				align='center'
				justify='space-between'
				mb={5}
			>
				<Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }} color='gray.500'>
					Subir documentos requeridos
				</Heading>
				<Box spaceX={2}>
					<GenerateApplicantDataPdfModal
						applicationPersonalData={dataApplicant}
					/>
					<Button
						colorPalette='blue'
						variant='ghost'
						onClick={handleDownloadGuides}
					>
						<FaDownload />
						Documentos guías
					</Button>
				</Box>
			</Stack>
			<Stack p={4} spacing={4} css={{ '--field-label-width': '150px' }}>
				<SimpleGrid columns={[1, 2]} spacingY={2} columnGap={6}>
					<Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={4}>
						{renderDocumentList(RequiredDocumentsSections.leftColumn)}
					</Grid>
					<Grid templateColumns={{ base: '1fr', md: '200px 1fr' }} gap={4}>
						{renderDocumentList(RequiredDocumentsSections.rightColumn)}
					</Grid>
				</SimpleGrid>
			</Stack>
			<Flex justify='flex-end' mt={6}>
				<Button
					bg='uni.secondary'
					color='white'
					loading={isLoading}
					onClick={handleSubmitDocuments}
				>
					Guardar cambios
				</Button>
			</Flex>
		</Box>
	);
};

DocumentsApplicant.propTypes = {
	onValidationChange: PropTypes.bool,
};
