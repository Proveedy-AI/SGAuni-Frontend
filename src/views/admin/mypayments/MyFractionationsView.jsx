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
