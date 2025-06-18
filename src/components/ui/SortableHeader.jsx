// src/components/ui/SortableHeader.jsx
import { HStack, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';

export const SortableHeader = ({ label, columnKey, sortConfig, onSort }) => {
	const isActive = sortConfig?.key === columnKey;
	const isAsc = sortConfig?.direction === 'asc';

	const handleSort = () => {
		if (!isActive) return onSort({ key: columnKey, direction: 'asc' });
		if (isAsc) return onSort({ key: columnKey, direction: 'desc' });
		onSort(null); // desactivar orden
	};

	return (
		<HStack cursor='pointer' onClick={handleSort}>
			<Text fontWeight='semibold'>{label}</Text>
			<HStack>
				<FaLongArrowAltUp
					size={14}
					color={isActive && isAsc ? '#711610' : 'gray'}
				/>
				<FaLongArrowAltDown
					size={14}
					style={{ marginLeft: '-14px' }}
					color={isActive && !isAsc ? '#711610' : 'gray'}
				/>
			</HStack>
		</HStack>
	);
};

SortableHeader.propTypes = {
	label: PropTypes.string.isRequired,
	columnKey: PropTypes.string.isRequired,
	sortConfig: PropTypes.shape({
		key: PropTypes.string,
		direction: PropTypes.oneOf(['asc', 'desc']),
	}),
	onSort: PropTypes.func.isRequired,
};
