import { AddScheduleTypeModal } from '@/components/forms/schedule_types';
import { SchedulesTypesTable } from '@/components/tables/schedule_types';
import { InputGroup } from '@/components/ui';
import { Box, Card, Heading, Input, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const SettingsSchedulesTypes = () => {
	const [searchName, setSearchName] = useState('');

	//const { data: dataScheduleTypes, isLoadingScheduleTypes, refetch: fetchScheduleTypes } = useReadScheduleTypes();
	const dataScheduleTypes = {
		message: 'This is a mock schedule type',
		results: [
			{ id: 1, name: 'Teórico' },
			{ id: 2, name: 'Laboratorio' },
			{ id: 3, name: 'Práctico' },
			{ id: 4, name: 'Seminario' },
			{ id: 5, name: 'Taller' },
		],
	};
	const fetchScheduleTypes = () => console.log('fetch');
	const isLoadingScheduleTypes = false;

	const filteredScheduleTypes = dataScheduleTypes?.results?.filter(
		(item) =>
			!searchName ||
			item?.name?.toLowerCase().includes(searchName.toLocaleLowerCase())
	);

	return (
		<Box spaceY='5'>
			<Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
			>
				<Heading
					size={{
						xs: 'sm',
						sm: 'md',
						md: 'lg',
					}}
				>
					Gestión de Tipos de Horarios
				</Heading>

				<AddScheduleTypeModal data={dataScheduleTypes?.results} fetchData={fetchScheduleTypes} />
			</Stack>

			<Card.Root>
				<Card.Body>
					<InputGroup startElement={<FiSearch />} maxW='400px'>
						<Input
							ml='1'
							size='sm'
							placeholder='Buscar por nombre o código de curso'
							value={searchName}
							onChange={(e) => setSearchName(e.target.value)}
						/>
					</InputGroup>
				</Card.Body>
			</Card.Root>

			<SchedulesTypesTable
				data={filteredScheduleTypes}
				fetchData={fetchScheduleTypes}
				isLoading={isLoadingScheduleTypes}
			/>
		</Box>
	);
};
