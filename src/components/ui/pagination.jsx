// src/components/ui/PaginationWithPageSize.jsx
import {
	HStack,
	ButtonGroup,
	IconButton,
	Text,
	Stack,
	useBreakpointValue,
	createListCollection,
} from '@chakra-ui/react';
import {
	LuChevronLeft,
	LuChevronRight,
	LuChevronsLeft,
	LuChevronsRight,
} from 'react-icons/lu';
import PropTypes from 'prop-types';
import {
	SelectRoot,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';

export const Pagination = ({
	count,
	pageSize,
	currentPage,
	pageSizeOptions,
	onPageChange,
	onPageSizeChange,
}) => {
	const totalPages = Math.ceil(count / pageSize);
	const from = (currentPage - 1) * pageSize + 1;
	const to = Math.min(currentPage * pageSize, count);
	const options = Array.isArray(pageSizeOptions) ? pageSizeOptions : [];
	const isSmUp = useBreakpointValue({ base: false, sm: true });

	const handlePageChange = (newPage) => {
		if (newPage < 1 || newPage > totalPages) return;
		onPageChange?.(newPage);
	};

	const safeOptions = Array.isArray(pageSizeOptions)
		? pageSizeOptions.filter(
				(opt) =>
					typeof opt?.label === 'string' && typeof opt?.value === 'number'
			)
		: [];

	return (
		<Stack
			w='full'
			direction={{ base: 'column', sm: 'row' }}
			justify={{ base: 'center', sm: 'space-between' }}
			align='center'
			pt='2'
		>
			{isSmUp && (
				<SelectRoot
					collection={createListCollection({ items: safeOptions })}
					size='xs'
					w='150px'
					defaultValue={String(pageSize)}
					onChange={(e) => {
						const value = e.target.value;
						onPageSizeChange(Number(value));
					}}
				>
					<SelectTrigger>
						{pageSizeOptions.find((opt) => opt.value === pageSize)?.label ??
							'Seleccionar filas'}
					</SelectTrigger>
					<SelectContent bg={{ base: 'white', _dark: 'its.gray.500' }}>
						{options.map((option) => (
							<SelectItem
								key={option.value}
								item={{ label: option.label, value: String(option.value) }}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</SelectRoot>
			)}
			<HStack mt='2' justify='end'>
				<Text fontWeight='medium'>
					{from} - {to} de {count}
				</Text>
				<ButtonGroup variant='ghost' size='sm'>
					<IconButton
						size='xs'
						variant='outline'
						aria-label='Primera página'
						disabled={currentPage === 1}
						onClick={() => handlePageChange(1)}
					>
						<LuChevronsLeft />
					</IconButton>
					<IconButton
						size='xs'
						variant='outline'
						aria-label='Página anterior'
						disabled={currentPage === 1}
						onClick={() => handlePageChange(currentPage - 1)}
					>
						<LuChevronLeft />
					</IconButton>
					<IconButton
						size='xs'
						variant='outline'
						aria-label='Página siguiente'
						disabled={currentPage === totalPages}
						onClick={() => handlePageChange(currentPage + 1)}
					>
						<LuChevronRight />
					</IconButton>
					<IconButton
						size='xs'
						variant='outline'
						aria-label='Última página'
						disabled={currentPage === totalPages}
						onClick={() => handlePageChange(totalPages)}
					>
						<LuChevronsRight />
					</IconButton>
				</ButtonGroup>
			</HStack>
		</Stack>
	);
};

Pagination.propTypes = {
	count: PropTypes.number,
	pageSize: PropTypes.number,
	currentPage: PropTypes.number.isRequired,
	pageSizeOptions: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			label: PropTypes.string,
		})
	),
	onPageChange: PropTypes.func,
	onPageSizeChange: PropTypes.func,
};
