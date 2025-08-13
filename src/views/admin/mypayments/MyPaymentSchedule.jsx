import { StudentScheduleTable } from '@/components/tables/commitment_letters';

import { useReadMyEnrollments } from '@/hooks';
import {
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Icon,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiFileText, FiTrash } from 'react-icons/fi';

export const MyPaymentSchedule = () => {
	/*
  {
    id: 1,
    program: 1,
    program_name: '',
    applictaion: 1,
    applicant_name: '',
    total: '',
    is_first_installment: true
    deadline: '',
    status: ''
  }
  */

	/*
  const {
    data: dataInstallments,
    isLoading: isLoadingInstallments,
    refetch: fetchInstallments
  } = useReadInstallmentsUserLogged();
  */

	const { data: dataMyEnrollments, isLoading: isLoadingEnrollment } =
		useReadMyEnrollments();

	/*const dataInstallments = {
		results: [
			{
				id: 1,
				program: 1,
				program_name: 'Maestría en Ingeniería',
				applictaion: 1,
				applicant_name: 'Juan Pérez',
				total: '1500.00',
				is_first_installment: true,
				deadline: '2025-07-15',
				status: 2,
			},
			{
				id: 2,
				program: 1,
				program_name: 'Maestría en Ingeniería',
				applictaion: 1,
				applicant_name: 'Juan Pérez',
				total: '2000.00',
				is_first_installment: false,
				deadline: '2025-08-15',
				status: 1,
			},
			{
				id: 3,
				program: 1,
				program_name: 'Maestría en Ingeniería',
				applictaion: 1,
				applicant_name: 'Juan Pérez',
				total: '1200.00',
				is_first_installment: false,
				deadline: '2025-09-15',
				status: 1,
			},
		],
	};*/

	const [selectedDeadline, setSelectedDeadline] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);

	const hasActiveFilters = selectedDeadline || selectedStatus;

	const clearFilters = () => {
		setSelectedDeadline(null);
		setSelectedStatus(null);
	};

	return (
		<Stack gap={4}>
			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						<Flex align='center' gap={2}>
							<Icon as={FiFileText} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Mi Cronograma de Pagos</Heading>
						</Flex>
						{hasActiveFilters && (
							<Button
								variant='outline'
								colorPalette='red'
								size='sm'
								onClick={clearFilters}
							>
								<FiTrash />
								Limpiar Filtros
							</Button>
						)}
					</Flex>
				</Card.Header>
				<Card.Body>
					<Stack gap={4} mb={4}>
						<SimpleGrid
							columns={{ base: 1, sm: 2, md: 2, xl: 2 }}
							gap={6}
						></SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>
			<Card.Root>
				<Card.Body>
					<Box overflowX='auto'>
						<StudentScheduleTable
							data={dataMyEnrollments}
							isLoading={isLoadingEnrollment}
						/>
					</Box>
				</Card.Body>
			</Card.Root>
		</Stack>
	);
};
