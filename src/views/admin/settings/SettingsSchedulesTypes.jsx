import { ReactSelect } from '@/components';
import { AddScheduleTypeModal } from '@/components/forms/schedule_types';
import { SchedulesTypesTable } from '@/components/tables/schedule_types';
import { Button, InputGroup } from '@/components/ui';
import { useReadScheduleTypes } from '@/hooks/schedule_types';
import {
	Box,
	Card,
	Flex,
	Heading,
	Input,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch, FiTrash } from 'react-icons/fi';

export const SettingsSchedulesTypes = () => {
	const [searchName, setSearchName] = useState('');
	const [searchIsSingle, setSearchIsSingle] = useState(null);
	const [searchEnabled, setSearchEnabled] = useState(null);

	const IsSingleOptions = [
		{ label: 'Sí', value: true },
		{ label: 'No', value: false },
	];

	const EnabledOptions = [
		{ label: 'Habilitados', value: true },
		{ label: 'Deshabilitados', value: false },
	];

	const {
		data: dataScheduleTypes,
		isLoadingScheduleTypes,
		refetch: fetchScheduleTypes,
	} = useReadScheduleTypes();

	const filteredScheduleTypes = dataScheduleTypes?.results?.filter(
		(item) =>
			(!searchName ||
				item?.name?.toLowerCase().includes(searchName.toLocaleLowerCase())) &&
			(searchIsSingle === null || item?.is_single === searchIsSingle?.value) &&
			(searchEnabled === null || item?.enabled === searchEnabled?.value)
	);

	const hasFilters = searchName || searchIsSingle || searchEnabled;

	const handleReset = () => {
		setSearchName('');
		setSearchIsSingle(null);
		setSearchEnabled(null);
	};

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

				<AddScheduleTypeModal
					data={dataScheduleTypes?.results}
					fetchData={fetchScheduleTypes}
				/>
			</Stack>

			<Card.Root>
				<Card.Header overflow="hidden">
					<Flex
						direction={{ base: 'column', md: 'row' }}
						alignItems={{ base: 'flex-start', md:'center' }}
						justifyContent={{ base: 'flex-start', md: 'space-between' }}
						width='100%'
            gap="3"
					>
						<Heading size='xl' h='40px'>
							Filtros de búsqueda
						</Heading>
						{hasFilters && (
							<Button
								size='sm'
								bg='red.100'
								color='red.500'
								_hover={{ bg: 'red.200' }}
								onClick={handleReset}
							>
								<FiTrash /> Quitar Filtros
							</Button>
						)}
					</Flex>
				</Card.Header>
				<Card.Body>
					<SimpleGrid
						columns={{ base: 1, lg: 3 }}
						gap={4}
						mb={4}
						alignItems='center'
					>
						<InputGroup startElement={<FiSearch />}>
							<Input
								ml='1'
								size='sm'
								placeholder='Buscar por nombre o código de curso'
								value={searchName}
								onChange={(e) => setSearchName(e.target.value)}
							/>
						</InputGroup>
						<ReactSelect
							label='¿Es único?'
							size='sm'
							options={IsSingleOptions}
							value={searchIsSingle}
							onChange={setSearchIsSingle}
							isClearable
							placeholder='Seleccione una opción'
						/>
						<ReactSelect
							label='¿Está habilitado?'
							size='sm'
							options={EnabledOptions}
							value={searchEnabled}
							onChange={setSearchEnabled}
							isClearable
							placeholder='Seleccione una opción'
						/>
					</SimpleGrid>
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
