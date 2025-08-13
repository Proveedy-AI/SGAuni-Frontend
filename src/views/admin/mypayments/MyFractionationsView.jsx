import { MyFractionationTable } from '@/components/tables/commitment_letters/MyFractionationTable';
import { useReadMyFractionation } from '@/hooks';

import {
	Box,
	Heading,
	InputGroup,
	Input,
	Flex,
	Card,
	Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiClipboard, FiSearch } from 'react-icons/fi';

export const MyFractionationsView = () => {
	const [searchBenefitsValue, setSearchBenefitsValue] = useState('');

	const {
		data: dataFractionation,
		isLoading: loadingFractionation,
		refetch: fetchFractionation,
	} = useReadMyFractionation({}, {});

	/*const dataFractionation = [
		{
			id: 1,
			plan_purpose: 'Fraccionamiento',
			status_review: 2,
			status_display: 'En revisión',
			student_name: 'Juan Pérez',
			enrollment_name: '2024-I',
			plan_type_display: 'Cuotas',
			total_amount: '1200.00',
			total_amortization: '400.00',
			total_balance: '800.00',
			upfront_percentage: '0.3',
			number_of_installments: 3,
			program_name: 'Ingeniería de Sistemas',
			reviewed_at: '2024-05-10T10:00:00.000Z',
			payment_document_type: 1,
			payment_document_type_display: 'Boleta',
			path_commitment_letter: 'https://example.com/doc/54asd6s4asdas4d89asd4as',
			num_document_person: '12345678',
		},
	];*/

	const filteredFractionations = dataFractionation?.filter((item) =>
		item?.enrollment_name
			?.toLowerCase()
			.includes(searchBenefitsValue.toLowerCase())
	);

	return (
		<Box spaceY='5'>
			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						<Flex align='center' gap={2}>
							<Icon as={FiClipboard} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Mis Fraccionamientos </Heading>
						</Flex>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Flex justify='space-between' align='center'>
						<InputGroup flex='1' startElement={<FiSearch />}>
							<Input
								ml='1'
								maxWidth={'550px'}
								bg={'white'}
								size='sm'
								variant='outline'
								placeholder='Buscar ...'
								value={searchBenefitsValue}
								onChange={(e) => setSearchBenefitsValue(e.target.value)}
							/>
						</InputGroup>
					</Flex>
				</Card.Body>
			</Card.Root>

			<MyFractionationTable
				isLoading={loadingFractionation}
				data={filteredFractionations}
				refetch={fetchFractionation}
			/>
		</Box>
	);
};
