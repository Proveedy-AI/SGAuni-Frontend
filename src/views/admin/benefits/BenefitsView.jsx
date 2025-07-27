import { MyBenefitsTable } from '@/components/tables/benefits/MyBenefitsTable';
import { useReadListBenefits } from '@/hooks/benefits/useReadListBenefits';

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
import { FiAward, FiSearch } from 'react-icons/fi';

export const BenefitsView = () => {
	const {
		data: dataBenefits,
		fetchNextPage: fetchNextPageBenefits,
		hasNextPage: hasNextPageBenefits,
		isFetchingNextPage: isFetchingNextPageBenefits,
		isLoading: loadingBenefits,
		refetch: fetchBenefits,
	} = useReadListBenefits({});
	const [searchBenefitsValue, setSearchBenefitsValue] = useState('');
	console.log(dataBenefits);
	const allBenefits =
		dataBenefits?.pages?.flatMap((page) => page.results) ?? [];

	const isFiltering = searchBenefitsValue.trim().length > 0;

	const filteredBenefits = allBenefits?.filter((item) =>
		item?.owner_name?.toLowerCase().includes(searchBenefitsValue.toLowerCase())
	);

	const totalCount = isFiltering
		? filteredBenefits.length
		: (dataBenefits?.pages?.[0]?.count ?? 0);

	return (
		<Box spaceY='5'>
			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						<Flex align='center' gap={2}>
							<Icon as={FiAward} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'> Becas y Beneficios</Heading>
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
					</Flex>
				</Card.Body>
			</Card.Root>

			<MyBenefitsTable
				isLoading={loadingBenefits}
				data={filteredBenefits}
				fetchNextPage={fetchNextPageBenefits}
				hasNextPage={hasNextPageBenefits}
				totalCount={totalCount}
				isFetchingNext={isFetchingNextPageBenefits}
				refetch={fetchBenefits}
			/>
		</Box>
	);
};
