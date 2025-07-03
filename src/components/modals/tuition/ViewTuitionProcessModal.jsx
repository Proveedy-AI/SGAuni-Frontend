import { Field, Modal, Tooltip } from '@/components/ui';
import {
	Box,
	Heading,
	IconButton,
	Input,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import PropTypes from 'prop-types';

export const ViewTuitionProcessModal = ({ data }) => {
	const [open, setOpen] = useState(false);
	return (
		<Modal
			title={data?.academicPeriod}
			placement='center'
			size='md'
			hiddenFooter={true}
			trigger={
				<Box>
					<Tooltip
						content='Ver detalle'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='blue'
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<FiEye />
						</IconButton>
					</Tooltip>
				</Box>
			}
			positionerProps={{ style: { padding: '40px' } }}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
		>
			<Stack gap={4}>
				<Stack>
					<Heading size={'md'} color={'uni.secondary'}>
						Inscripción
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						<Field label='Fecha de inicio'>
							<Input
								type='date'
								value={'2026-08-13'}
								readOnly
								css={{ '--focus-color': '#000' }}
							/>
						</Field>

						<Field label='Fecha de fin'>
							<Input
								type='date'
								value={'2026-12-20'}
								readOnly
								css={{ '--focus-color': '#000' }}
							/>
						</Field>
					</SimpleGrid>
				</Stack>

				<Stack>
					<Heading size={'md'} color={'uni.secondary'}>
						Cronograma de evaluaciones
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						<Field label='Evaluación inicial'>
							<Input
								type='date'
								value={'2026-09-03'}
								readOnly
								css={{ '--focus-color': '#000' }}
							/>
						</Field>

						<Field label='Evaluación final'>
							<Input
								type='date'
								value={'2026-12-20'}
								readOnly
								css={{ '--focus-color': '#000' }}
							/>
						</Field>
					</SimpleGrid>
				</Stack>

				<Stack>
					<Heading size={'md'} color={'uni.secondary'}>
						Inicio de semestre
					</Heading>
					<Input
						type='date'
						value={'2026-12-25'}
						readOnly
						css={{ '--focus-color': '#000' }}
					/>
				</Stack>
			</Stack>
		</Modal>
	);
};

ViewTuitionProcessModal.propTypes = {
	data: PropTypes.object,
};
