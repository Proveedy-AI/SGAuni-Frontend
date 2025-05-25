import { HStack, ButtonGroup, IconButton, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import {
	LuChevronLeft,
	LuChevronRight,
	LuChevronsLeft,
	LuChevronsRight,
} from 'react-icons/lu';

export const Pagination = ({ count, pageSize, currentPage, onPageChange }) => {
	const totalPages = Math.ceil(count / pageSize);

	const from = (currentPage - 1) * pageSize + 1;
	const to = Math.min(currentPage * pageSize, count);

	const handlePageChange = (newPage) => {
		if (newPage < 1 || newPage > totalPages) return;
		onPageChange?.(newPage);
	};

	return (
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
	);
};

Pagination.propTypes = {
	count: PropTypes.number.isRequired,
	pageSize: PropTypes.number.isRequired,
	currentPage: PropTypes.number.isRequired,
	onPageChange: PropTypes.func,
};
