import { Field, toaster } from '@/components/ui';
import {
	Card,
	Flex,
	Group,
	Heading,
	Icon,
	IconButton,
	Input,
	VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useCreateCurriculumMap } from '@/hooks/curriculum_maps';
import { HiPlus, HiTrash } from 'react-icons/hi2';
import { FiFile } from 'react-icons/fi';

export const CreateCurriculumMaps = ({
	program,
	curriculumMaps,
	fetchData,
}) => {
	const [code, setCode] = useState('');
	const [year, setYear] = useState('');
	const [errors, setErrors] = useState({});

	const { mutate: createCurriculumMap, isPending } = useCreateCurriculumMap();

	const validate = () => {
		const newErrors = {};
		if (!code.trim()) {
			newErrors.code = 'El código es requerido';
		} else if (
			curriculumMaps?.some(
				(map) => map.code?.toLowerCase().trim() === code.toLowerCase().trim()
			)
		) {
			newErrors.code = 'El código ya existe en otro plan de estudio';
		}
		if (!year.trim()) {
			newErrors.year = 'El año es requerido';
		} else if (!/^\d{4}$/.test(year.trim())) {
			newErrors.year = 'Debe ser un año válido (ej: 2024)';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleClear = () => {
		setCode('');
		setYear('');
		setErrors({});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validate()) {
			toaster.create({
				title: 'Campos requeridos',
				description: 'Completa todos los campos del formulario',
				type: 'warning',
			});
			return;
		}
		const payload = {
			program: program?.id,
			code: code.trim(),
			year: year.trim(),
		};

		createCurriculumMap(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Plan de estudio listo para enviar',
					type: 'success',
				});
				handleClear();
				fetchData?.();
			},
			onError: (error) => {
				toaster.create({
					title: 'Error al crear el plan de estudio',
					description: error?.response?.data?.message || error.message,
					type: 'error',
				});
			},
		});
	};

	return (
		<Card.Root>
			<Card.Header>
				<Heading
					size='md'
					display='flex'
					alignItems='center'
					gap={2}
					color='blue.500'
				>
					<FiFile size={24} /> Crear Nueva Malla Curricular
				</Heading>
			</Card.Header>
			<Card.Body gapY={2}>
				<VStack
					as='form'
					gap='20px'
					minW={'70%'}
					onSubmit={handleSubmit}
					flex='1'
					justify='space-between'
				>
					<Flex gap={4} w='full' alignItems='flex-end'>
						<Field
							w='full'
							label='Código'
							required
							invalid={!!errors.code}
							errorText={errors.code}
						>
							<Input
								value={code}
								onChange={(e) => setCode(e.target.value)}
								placeholder='Código de la malla (ej: CS-PLACEMENT)'
							/>
						</Field>
						<Field
							w='full'
							label='Año'
							required
							invalid={!!errors.year}
							errorText={errors.year}
						>
							<Input
								value={year}
								onChange={(e) => setYear(e.target.value)}
								placeholder='Año de la malla (ej: 2024)'
							/>
						</Field>
						<Group>
							<IconButton
								type='submit'
								bg='blue.500'
								color='white'
								isPending={isPending}
								boxSize={10}
							>
								<Icon as={HiPlus} />
							</IconButton>
							<IconButton
								bg='red.500'
								color='white'
								disabled={!code && !year}
								boxSize={10}
								onClick={handleClear}
							>
								<Icon as={HiTrash} />
							</IconButton>
						</Group>
					</Flex>
				</VStack>
			</Card.Body>
		</Card.Root>
	);
};

CreateCurriculumMaps.propTypes = {
	program: PropTypes.object,
	curriculumMaps: PropTypes.array,
	fetchData: PropTypes.func,
};
