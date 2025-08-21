import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { Button, Stack, Text, Box, Badge, Card } from '@chakra-ui/react';
import { Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { ReactSelect } from '@/components';

export const ConvalidacionForm = ({
	fetchData,
	oldCoursesOptions,
	newCoursesOptions,
}) => {
	const [selectedOldCourses, setSelectedOldCourses] = useState([]);
	const [selectedNewCourse, setSelectedNewCourse] = useState(null);
	const [convalidations, setConvalidations] = useState([]);
	const [open, setOpen] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const contentRef = useRef(null);

	// calcular créditos
	const totalOldCredits = selectedOldCourses.reduce(
		(sum, c) => sum + c.credits,
		0
	);
	const newCredits = selectedNewCourse?.credits || 0;

	const handleAddConvalidacion = () => {
		if (!selectedOldCourses.length || !selectedNewCourse) {
			toaster.create({
				title: 'Selecciona cursos antiguos y un curso nuevo',
				status: 'warning',
			});
			return;
		}

		const payload = {
			course_selection_ids: selectedOldCourses.map((c) => c.value),
			course_period_program_id: selectedNewCourse.value,
			oldCredits: totalOldCredits,
			newCredits: newCredits,
		};

		setConvalidations([...convalidations, payload]);

		// limpiar selección
		setSelectedOldCourses([]);
		setSelectedNewCourse(null);
	};

	const handleSubmitData = async () => {
		try {
			setIsPending(true);

			const finalPayload = convalidations.map((c) => ({
				course_selection_ids: c.course_selection_ids,
				course_period_program_id: c.course_period_program_id,
			}));

			// aquí deberías hacer el fetch o mutation al backend
			console.log('Payload final:', finalPayload);

			toaster.create({
				title: 'Convalidaciones guardadas',
				status: 'success',
			});

			// refrescar data externa
			if (fetchData) fetchData();

			setOpen(false);
		} catch (error) {
			toaster.create({
				title: 'Error al guardar convalidaciones',
				status: 'error',
			});
		} finally {
			setIsPending(false);
		}
	};

	return (
		<Modal
			title='Agregar convalidación'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar convalidación
				</Button>
			}
			onSave={handleSubmitData}
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack spacing={4} ref={contentRef}>
				<ReactSelect
					placeholder='Filtrar por programa...'
					value={selectedOldCourses}
					onChange={(value) => setSelectedOldCourses(value)}
					variant='flushed'
					size='xs'
					isSearchable
					isClearable
					isMulti
					options={oldCoursesOptions}
				/>
				{/* Cursos antiguos */}

				<ReactSelect
					placeholder='Filtrar por programa...'
					value={selectedNewCourse}
					onChange={(value) => setSelectedNewCourse(value)}
					variant='flushed'
					size='xs'
					isSearchable
					isClearable
					options={newCoursesOptions}
				/>

				{/* Validación créditos */}
				{selectedOldCourses.length > 0 && selectedNewCourse && (
					<Box>
						<Text>
							Créditos antiguos: <b>{totalOldCredits}</b> | Nuevo:{' '}
							<b>{newCredits}</b>
						</Text>
						{totalOldCredits < newCredits ? (
							<Badge colorScheme='red'>
								Se generará orden de pago por diferencia de créditos
							</Badge>
						) : (
							<Badge colorScheme='green'>Convalidación posible</Badge>
						)}
					</Box>
				)}

				<Button onClick={handleAddConvalidacion} colorScheme='blue'>
					Agregar convalidación
				</Button>

				{/* Listado temporal */}
				{convalidations.length > 0 && (
					<Card.Root p={3} shadow='sm'>
						<Text fontWeight='semibold'>Convalidaciones armadas:</Text>
						{convalidations.map((c, idx) => (
							<Box key={idx} p={2} borderWidth='1px' rounded='md' mt={2}>
								<Text>Old IDs: {c.course_selection_ids.join(', ')}</Text>
								<Text>New ID: {c.course_period_program_id}</Text>
								<Text>
									Créditos: {c.oldCredits} → {c.newCredits}
								</Text>
							</Box>
						))}
					</Card.Root>
				)}
			</Stack>
		</Modal>
	);
};

ConvalidacionForm.propTypes = {
	fetchData: PropTypes.func,
	oldCoursesOptions: PropTypes.array.isRequired,
	newCoursesOptions: PropTypes.array.isRequired,
};
