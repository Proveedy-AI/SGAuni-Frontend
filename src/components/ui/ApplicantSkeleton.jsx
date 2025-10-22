import {
	Box,
	Flex,
	HStack,
	Skeleton,
	SimpleGrid,
	Grid,
} from '@chakra-ui/react';
import React from 'react';

export default function ApplicantSkeleton() {
	return (
		<Box spaceY='5' mx={'auto'}>
			{/* Header */}
			<Flex
				bg='white'
				borderRadius='10px'
				overflow='hidden'
				boxShadow='md'
				mb={6}
				px={6}
				py={8}
				align='center'
				justify='space-between'
				wrap='wrap'
				gap={4}
			>
				{[1, 2, 3].map((_, idx) => (
					<HStack key={idx} spacing={2} align='flex-end'>
						<Skeleton height='20px' width='100px' />
						<Skeleton
							height='20px'
							width={idx === 0 ? '80px' : idx === 1 ? '200px' : '150px'}
						/>
					</HStack>
				))}
			</Flex>

			{/* Datos del postulante */}
			<Box bg='white' borderRadius='10px' boxShadow='md' p={6} mb={6}>
				<SimpleGrid columns={[1, 2]} spacingY={4} columnGap={6}>
					{[1, 2].map((_, colIdx) => (
						<Grid
							key={colIdx}
							templateColumns={{ base: '1fr', md: '200px 1fr' }}
							gap={4}
						>
							{Array.from({ length: 5 }).map((_, rowIdx) => (
								<React.Fragment key={rowIdx}>
									<Skeleton height='20px' width='100px' />
									<Skeleton height='20px' width='100%' />
								</React.Fragment>
							))}
						</Grid>
					))}
				</SimpleGrid>
			</Box>

			{/* Trámites */}
			<Box bg='white' borderRadius='10px' boxShadow='md' p={6} mb={6}>
				<Box w='full' p={4}>
					<SimpleGrid columns={[1, 8]} spacingY={2} columnGap={3}>
						{Array.from({ length: 8 }).map((_, i) => (
							<Skeleton key={i} height='20px' borderRadius='md' />
						))}
					</SimpleGrid>
				</Box>
			</Box>
		</Box>
	);
}
