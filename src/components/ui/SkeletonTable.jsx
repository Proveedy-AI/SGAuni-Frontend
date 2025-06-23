import { Skeleton, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function SkeletonTable({ columns = 4 }) {
	return (
		<>
			{Array.from({ length: 10 }).map((_, rowIndex) => (
				<Table.Row key={rowIndex}>
					{Array.from({ length: columns }).map((_, colIndex) => (
						<Table.Cell key={colIndex}>
							<Skeleton height='20px' width='100%' />
						</Table.Cell>
					))}
				</Table.Row>
			))}
		</>
	);
}

SkeletonTable.propTypes = {
	columns: PropTypes.number,
};
