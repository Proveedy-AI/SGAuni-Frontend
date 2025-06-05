//import { UpdateSettingsCountryForm } from '@/components/forms';
import { UpdateSettingsDistrictForm } from '@/components/forms/settings';
import {
	ConfirmModal,
	Pagination,
	SelectContent,
	SelectItem,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
	toaster,
} from '@/components/ui';
import { useDeleteDistrict } from '@/hooks';

import {
	Box,
	createListCollection,
	HStack,
	IconButton,
	Span,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useEffect, useMemo, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

const Row = memo(({ item, fetchData, startIndex, index, dataProvince }) => {
	const [open, setOpen] = useState(false);

	const { mutate: deleteDistrict, isPending } = useDeleteDistrict();

	const handleDelete = () => {
		deleteDistrict(item.id, {
			onSuccess: () => {
				toaster.create({
					title: 'Distrito eliminado correctamente',
					type: 'success',
				});
				fetchData();
				setOpen(false);
			},
			onError: (error) => {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
	};
	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<Table.Cell>{startIndex + index + 1}</Table.Cell>
			<Table.Cell>{item.name}</Table.Cell>
			<Table.Cell>{item.code}</Table.Cell>
			<Table.Cell>{item.province}</Table.Cell>
			<Table.Cell>
				<HStack>
					<UpdateSettingsDistrictForm
						data={item}
						dataProvince={dataProvince}
						fetchData={fetchData}
					/>

					<ConfirmModal
						placement='center'
						trigger={
							<IconButton colorPalette='red' size='xs'>
								<FiTrash2 />
							</IconButton>
						}
						open={open}
						onOpenChange={(e) => setOpen(e.open)}
						onConfirm={() => handleDelete(item.id)}
						loading={isPending}
					>
						<Text>
							¿Estás seguro que quieres eliminar a
							<Span fontWeight='semibold' px='1'>
								{item.name}
							</Span>
							de la lista de distritos?
						</Text>
					</ConfirmModal>
				</HStack>
			</Table.Cell>
		</Table.Row>
	);
});

Row.displayName = 'Row';

Row.propTypes = {
	item: PropTypes.object,
	fetchData: PropTypes.func,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	dataProvince: PropTypes.array,
};

export const SettingsDistrictTable = ({ data, fetchData, dataProvince }) => {
	const smallOptions = useMemo(
		() => [
			{ label: '6', value: '6' },
			{ label: '10', value: '10' },
			{ label: '15', value: '15' },
		],
		[]
	);

	const mediumOptions = useMemo(
		() => [
			{ label: '10', value: '10' },
			{ label: '20', value: '20' },
			{ label: '25', value: '25' },
		],
		[]
	);

	const largeOptions = useMemo(
		() => [
			{ label: '13', value: '13' },
			{ label: '26', value: '26' },
			{ label: '39', value: '39' },
		],
		[]
	);

	const smallHeight = 350; // Base para pantallas pequeñas
	const mediumHeight = 530; // Para pantallas medianas
	const largeHeight = 690; // Para pantallas grandes

	const getTableHeight = () => {
		const width = window.innerWidth;
		if (width > 1900) return largeHeight; // Para pantallas muy grandes (large)
		if (width >= 1600) return mediumHeight; // Para pantallas medianas
		return smallHeight; // Para pantallas pequeñas
	};

	const [tableHeight, setTableHeight] = useState(getTableHeight());

	useEffect(() => {
		const handleResize = () => {
			setTableHeight(getTableHeight()); // Actualiza la altura cada vez que se redimensione
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const getInitialPageSize = () => {
		const width = window.innerWidth;
		if (width > 1900) return largeOptions[0].value;
		if (width >= 1600) return mediumOptions[0].value;
		return smallOptions[0].value;
	};

	const getInitialPageSizeOptions = () => {
		const width = window.innerWidth;
		if (width > 1900) return largeOptions;
		if (width >= 1600) return mediumOptions;
		return smallOptions;
	};

	const [pageSize, setPageSize] = useState(getInitialPageSize());
	const [pageSizeOptions, setPageSizeOptions] = useState(
		getInitialPageSizeOptions()
	);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;

			if (width > 1900) {
				setPageSizeOptions(largeOptions);
				if (parseInt(pageSize) < 13) setPageSize('13');
			} else if (width >= 1600) {
				setPageSizeOptions(mediumOptions);
				if (parseInt(pageSize) > 10 || parseInt(pageSize) < 10)
					setPageSize('10');
			} else {
				setPageSizeOptions(smallOptions);
				if (parseInt(pageSize) > 6) setPageSize('6');
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [pageSize, largeOptions, mediumOptions, smallOptions]);

	const startIndex = (currentPage - 1) * parseInt(pageSize);
	const endIndex = startIndex + parseInt(pageSize);
	const visibleRows = data?.slice(startIndex, endIndex);

	const handlePageSizeChange = (newPageSize) => {
		setPageSize(newPageSize);
		setCurrentPage(1);
	};

	return (
		<Box
			bg={{ base: 'white', _dark: 'its.gray.500' }}
			p='3'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
		>
			<Table.ScrollArea
				style={{
					maxHeight: tableHeight,
				}}
			>
				<Table.Root size='sm' w='full' striped>
					<Table.Header>
						<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
							<Table.ColumnHeader>N°</Table.ColumnHeader>
							<Table.ColumnHeader>Distrito</Table.ColumnHeader>
							<Table.ColumnHeader>Código</Table.ColumnHeader>
							<Table.ColumnHeader>Provincia</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{visibleRows?.map((item, index) => (
							<Row
								key={item.id}
								item={item}
								dataProvince={dataProvince}
								fetchData={fetchData}
								startIndex={startIndex}
								index={index}
							/>
						))}
					</Table.Body>
				</Table.Root>
			</Table.ScrollArea>

			<Stack
				w='full'
				direction={{ base: 'column', sm: 'row' }}
				justify={{ base: 'center', sm: 'space-between' }}
				pt='2'
			>
				<SelectRoot
					collection={createListCollection({
						items: pageSizeOptions,
					})}
					size='xs'
					w='150px'
					display={{ base: 'none', sm: 'block' }}
					defaultValue={pageSize}
					onChange={(event) => handlePageSizeChange(event.target.value)}
				>
					<SelectTrigger>
						<SelectValueText placeholder='Seleccionar filas' />
					</SelectTrigger>
					<SelectContent bg={{ base: 'white', _dark: 'its.gray.500' }}>
						{pageSizeOptions.map((option) => (
							<SelectItem
								_hover={{
									bg: {
										base: 'its.100',
										_dark: 'its.gray.400',
									},
								}}
								key={option.value}
								item={option}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</SelectRoot>

				<Pagination
					count={data?.length}
					pageSize={pageSize}
					currentPage={currentPage}
					onPageChange={(page) => setCurrentPage(page)}
				/>
			</Stack>
		</Box>
	);
};

SettingsDistrictTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	loading: PropTypes.bool,
	dataProvince: PropTypes.array,
};
