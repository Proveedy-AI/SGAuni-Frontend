import { useState } from 'react';
import { Box, Heading, Text, Input, HStack, Stack } from '@chakra-ui/react';
import { Dashboard } from './Dashboard';

export const Home = () => {

	const [filterDate, setFilterDate] = useState(() => {
		const now = new Date();
		return now.toISOString().slice(0, 7);
	});

	return (
		<Box spaceY='5'>
			<Stack
				direction={{ base: 'column', sm: 'row' }}
				align='center'
				justify='space-between'
				gap='3'
			>
				<Box>
					<Heading>Mi panel</Heading>
					<Text>👋 Hola, bienvenido nuevamente.</Text>
				</Box>

				<Stack
					direction={{ base: 'column', sm: 'row' }}
					w='50%'
					justify={{ base: 'center', sm: 'end' }}
				>
					<HStack>
						<Text
							fontSize='xs'
							fontWeight='medium'
							whiteSpace='nowrap'
						>
							Filtrar por mes
						</Text>
						<Input
							type='month'
							size='xs'
							max={new Date().toISOString().slice(0, 7)}
							bg={{ base: 'white', _dark: 'uni.gray.500' }}
							value={filterDate}
							onChange={(e) => setFilterDate(e.target.value)}
						/>
					</HStack>
				</Stack>
			</Stack>

			<Dashboard />
		</Box>
	);
};
