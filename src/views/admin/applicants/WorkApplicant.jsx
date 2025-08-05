import {
	Box,
	Heading,
	Text,
	VStack,
	Flex,
	Badge,
	IconButton,
	Stack,
	Button,
	HStack,
	Icon,
} from '@chakra-ui/react';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import {
	useReadAdmissionEvaluationsByApplication,
	useUploadAdmissionEvaluation,
} from '@/hooks/admissions_evaluations';
import { useEffect, useState } from 'react';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { FaCalendar, FaDownload, FaTimes, FaUpload } from 'react-icons/fa';
import { uploadToS3 } from '@/utils/uploadToS3';
import { toaster } from '@/components/ui';
import PropTypes from 'prop-types';

const formatDateTime = (dateStr, timeStr) => {
	const date = new Date(`${dateStr}T${timeStr}`);
	return date.toLocaleString('es-PE', {
		weekday: 'long',
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
};

export const WorkApplicant = ({ onAllCompleted }) => {
	const item = EncryptedStorage.load('selectedApplicant');
	const { data: dataEvaluationsByApplication, refetch: fetchExams } =
		useReadAdmissionEvaluationsByApplication(item?.id ?? '');
	const { mutate: updateEssay } = useUploadAdmissionEvaluation();
	const [essayFiles, setEssayFiles] = useState({});
	const [disableUpload, setDisableUpload] = useState(false);

	const handleUploadEssayFile = async (work, updateEssay, essayFiles) => {
		const file = essayFiles[work.id];
		if (!file) {
			toaster.create({
				title: 'Usuario y fecha de expiración son obligatorios',
				type: 'warning',
			});
			return;
		}
		setDisableUpload(true);
		try {
			const s3Url = await uploadToS3(
				file,
				'sga_uni/tasks/essays',
				`${work.application}-essays`
			);
			const payload = {
				path_url: s3Url,
			};

			updateEssay(
				{
					id: work.id,
					payload,
				},
				{
					onSuccess: () => {
						toaster.create({
							title: 'Ensayo subido  correctamente',
							type: 'success',
						});
						fetchExams();
						setDisableUpload(false);
					},
					onError: (error) => {
						console.log(error);
						setDisableUpload(false);
						toaster.create({
							title:
								error.response?.data?.error ||
								'Error al actualizar el contrato',
							type: 'error',
						});
					},
				}
			);
		} catch (error) {
			console.error('Error al subir el archivo:', error);
			setDisableUpload(false);
			toaster.create({
				title: 'Error al subir el contrato',
				type: 'error',
			});
		}
	};

	const STATUS_MAP = {
		Pendiente: { label: 'Pendiente', color: 'yellow' },
		Completado: { label: 'Completado', color: 'green' },
		Rechazado: { label: 'Rechazado', color: 'red' },
		// Agrega más si existen
	};

	const [groupedWorks, setGroupedWorks] = useState({
		Ensayo: [],
		Entrevista: [],
		Examen: [],
	});

	const handleDownloadGuides = () => {
		const files = ['/templates/GUIA-DE-ENSAYO.pdf'];

		files.forEach((file) => {
			const link = document.createElement('a');
			link.href = file;
			link.download = '';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		});
	};

	useEffect(() => {
		if (!dataEvaluationsByApplication?.results) return;

		const grouped = {
			Ensayo: [],
			Entrevista: [],
			Examen: [],
		};

		for (const item of dataEvaluationsByApplication.results) {
			const type = item.type_application_display;
			if (grouped[type]) grouped[type].push(item);
		}

		setGroupedWorks(grouped);
	}, [dataEvaluationsByApplication]);

	useEffect(() => {
		if (!dataEvaluationsByApplication?.results) return;

		const grouped = {
			Ensayo: [],
			Entrevista: [],
			Examen: [],
		};

		let allCompleted = true;
		const results = dataEvaluationsByApplication.results || [];
		console.log(results);
		// Si no hay ningún trabajo, no está completo
		if (results.length === 0) {
			allCompleted = false;
		} else {
			for (const item of results) {
				const type = item.type_application_display;
				if (grouped[type]) grouped[type].push(item);

				if (item.status_qualification_display !== 'Completado') {
					allCompleted = false;
				}
			}
		}

		setGroupedWorks(grouped);

		// Llamamos al callback si está definido
		if (typeof onAllCompleted === 'function') {
			onAllCompleted(allCompleted);
		}
	}, [dataEvaluationsByApplication]);

	const renderWorkItem = (work) => {
		const now = new Date();

		// Validación robusta
		const parsedDeadline = work.end_date
			? new Date(`${work.end_date}T23:59:59-05:00`) // Forza zona horaria Perú
			: null;

		const isEssay = work.type_application_display === 'Ensayo';
		const showInput = isEssay && parsedDeadline && now <= parsedDeadline;

		const status = STATUS_MAP[work.status_qualification_display] || {
			label: work.status_qualification_display,
			color: 'gray',
		};

		return (
			<Box
				key={work.id}
				p={4}
				mb={4}
				borderWidth={1}
				borderRadius='lg'
				bg='gray.50'
			>
				<Flex
					direction={{ base: 'column', md: 'row' }}
					justify='space-between'
					align={{ base: 'flex-start', md: 'center' }}
					gap={2}
					mb={2}
				>
					<Box>
						<Text fontWeight='bold'>Evaluador: {work.evaluator_full_name}</Text>
						<Stack gap={2}>
							<HStack gap={2}>
								<Icon as={FaCalendar} boxSize={4} color='gray.600' />
								<Text fontWeight='medium' color='gray.700'>
									Fecha y hora de inicio:
								</Text>
								<Text>
									{formatDateTime(work.start_date, work.evaluation_time)}
								</Text>
							</HStack>

							{isEssay && work.end_date && (
								<HStack gap={2}>
									<Icon as={FaTimes} boxSize={4} color='gray.600' />
									<Text fontWeight='medium' color='gray.700'>
										Fecha y hora final:
									</Text>
									<Text>
										{formatDateTime(work.end_date, work.evaluation_time)}
									</Text>
								</HStack>
							)}
						</Stack>

						<Badge colorPalette={status.color} mt={1}>
							{status.label}
						</Badge>
					</Box>
					{work.qualification && (
						<Text fontSize='lg'>Nota: {work.qualification}</Text>
					)}
				</Flex>

				{isEssay && (
					<Box mt={3}>
						{showInput ? (
							<Flex
								direction={{ base: 'column', md: 'row' }}
								align={{ base: 'stretch', md: 'center' }}
								gap={3}
							>
								<Box flex='1'>
									<CompactFileUpload
										name={`essay-${work.id}`}
										onChange={(file) =>
											setEssayFiles((prev) => ({ ...prev, [work.id]: file }))
										}
										defaultFile={
											typeof work.path_url === 'string'
												? work.path_url
												: undefined
										}
										onClear={() =>
											setEssayFiles((prev) => ({ ...prev, [work.id]: null }))
										}
										accept='application/pdf'
									/>
								</Box>
								<IconButton
									colorPalette='gray'
									aria-label='Subir ensayo'
									size='sm'
									px={4}
									onClick={() =>
										handleUploadEssayFile(work, updateEssay, essayFiles)
									}
									disabled={!essayFiles[work.id] || disableUpload}
									loading={disableUpload}
									loadingText='Subiendo...'
								>
									<FaUpload /> Subir ensayo
								</IconButton>
								<Button
									colorPalette='blue'
									variant='ghost'
									onClick={handleDownloadGuides}
								>
									<FaDownload />
									Guía de Ensayo
								</Button>
							</Flex>
						) : (
							<Text color='red.500' fontWeight='semibold'>
								Fecha límite para subir el ensayo ha expirado.
							</Text>
						)}
					</Box>
				)}
			</Box>
		);
	};

	const hasNoWorks =
		groupedWorks.Ensayo.length === 0 &&
		groupedWorks.Entrevista.length === 0 &&
		groupedWorks.Examen.length === 0;

	return (
		<Box
			bg='white'
			p={6}
			borderRadius='lg'
			boxShadow='md'
			mt={4}
			justifyContent={'center'}
			mx={'auto'}
			w={{ base: 'full', md: '80%' }}
		>
			<Stack
				direction={{ base: 'column', sm: 'row' }}
				align='center'
				justify='space-between'
				mb={5}
			>
				<Heading size='md' color='gray.600' mb={4}>
					Trabajos Asignados
				</Heading>
			</Stack>

			{['Ensayo', 'Entrevista', 'Examen'].map(
				(type) =>
					groupedWorks[type]?.length > 0 && (
						<Box key={type} mb={6}>
							<Heading size='sm' mb={2} color='gray.700'>
								{type === 'Ensayo' && 'Ensayo'}
								{type === 'Entrevista' && 'Entrevista'}
								{type === 'Examen' && 'Examen'}
							</Heading>

							<VStack spacing={4} align='stretch'>
								{groupedWorks[type].map(renderWorkItem)}
							</VStack>
						</Box>
					)
			)}

			{hasNoWorks && (
				<Box mt={4} textAlign='center'>
					<Text fontSize='md' color='gray.500'>
						Aún no se han asignado tareas. Pronto se te informará sobre las
						fechas de entrega de tus trabajos.
					</Text>
				</Box>
			)}

			<Stack textAlign={{ base: 'center', sm: 'center' }} mt={5}>
				<Heading
					size={{
						xs: 'xs',
						sm: 'sm',
						md: 'sm',
					}}
					color={'gray.500'}
				>
					Cuando se complete las evaluaciones, podrás ver tus resultados aquí y
					finalizar el proceso
				</Heading>
			</Stack>
		</Box>
	);
};

WorkApplicant.propTypes = {
	onAllCompleted: PropTypes.bool,
};
