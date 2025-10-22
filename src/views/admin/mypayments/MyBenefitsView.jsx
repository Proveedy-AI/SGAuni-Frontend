import { AddMyBenefits } from '@/components/forms/benefits/AddMyBenefits';
import { MyBenefitsTable } from '@/components/tables/benefits/MyBenefitsTable';
import { useReadMyRequestBenefits } from '@/hooks';

import {
	Box,
	Heading,
	HStack,
	InputGroup,
	Input,
	Flex,
	Card,
	Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiAward, FiSearch } from 'react-icons/fi';

export const MyBenefitsView = () => {
	const {
		data: dataBenefits,
		isLoading: loadingBenefits,
		refetch: fetchBenefits,
	} = useReadMyRequestBenefits({});

	const [searchBenefitsValue, setSearchBenefitsValue] = useState('');

	const filteredBenefits = dataBenefits?.filter((item) =>
		item?.enrollment_period
			.toLowerCase()
			.includes(searchBenefitsValue.toLowerCase())
	);

	return (
		<Box spaceY='5'>
			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						<Flex align='center' gap={2}>
							<Icon as={FiAward} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'> Solicitar Becas y Beneficios</Heading>
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
								placeholder='Buscar por nombre'
								value={searchBenefitsValue}
								onChange={(e) => setSearchBenefitsValue(e.target.value)}
							/>
						</InputGroup>

						<HStack>
							<AddMyBenefits fetchData={fetchBenefits} />
						</HStack>
					</Flex>
				</Card.Body>
			</Card.Root>

			<MyBenefitsTable
				isLoading={loadingBenefits}
				data={filteredBenefits}
				refetch={fetchBenefits}
			/>
		</Box>
	);
};
