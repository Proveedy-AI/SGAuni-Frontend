import { FractionationTable } from '@/components/tables/commitment_letters/FractionationTable';
import { useReadFractionation } from '@/hooks/fractionation_requests/useReadFractionation';

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

export const FractionationsView = () => {
	const [searchBenefitsValue, setSearchBenefitsValue] = useState('');

	const {
		data: dataFractionation,
		fetchNextPage: fetchNextPageFractionation,
		hasNextPage: hasNextPageFractionation,
		isFetchingNextPage: isFetchingNextPageFractionation,
		isLoading: loadingFractionation,
		refetch: fetchFractionation,
	} = useReadFractionation({}, {});

	const allFractionations =
		dataFractionation?.pages?.flatMap((page) => page.results) ?? [];

	const isFiltering = searchBenefitsValue.trim().length > 0;

	const filteredFractionations = allFractionations?.filter((item) =>
		item?.student_name
			?.toLowerCase()
			.includes(searchBenefitsValue.toLowerCase())
	);

	const totalCount = isFiltering
		? filteredFractionations.length
		: (dataFractionation?.pages?.[0]?.count ?? 0);

	return (
		<Box spaceY='5'>
			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						<Flex align='center' gap={2}>
							<Icon as={FiClipboard} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'> Fraccionamientos </Heading>
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

			<FractionationTable
				isLoading={loadingFractionation}
				data={allFractionations}
				fetchNextPage={fetchNextPageFractionation}
				hasNextPage={hasNextPageFractionation}
				totalCount={totalCount}
				isFetchingNext={isFetchingNextPageFractionation}
				refetch={fetchFractionation}
			/>
		</Box>
	);
};
