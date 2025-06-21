import { Breadcrumb, Stack } from '@chakra-ui/react';

import { LiaSlashSolid } from 'react-icons/lia';
import { Link as RouterLink } from 'react-router';
import PropTypes from 'prop-types';

export default function ResponsiveBreadcrumb({ items = [] }) {
	return (
		<Stack
			direction={{ base: 'column', md: 'row' }}
			spacing={{ base: 3, md: 4 }}
			align={{ base: 'flex-start', md: 'center' }}
			justify='space-between'
			wrap='wrap'
		>
			<Breadcrumb.Root size='lg'>
				<Breadcrumb.List flexWrap='wrap'>
					{items.map((item, index) => (
						<>
							<Breadcrumb.Item key={index}>
								{item.to ? (
									<Breadcrumb.Link as={RouterLink} to={item.to}>
										{item.label}
									</Breadcrumb.Link>
								) : (
									<Breadcrumb.CurrentLink>{item.label}</Breadcrumb.CurrentLink>
								)}
							</Breadcrumb.Item>
							{index < items.length - 1 && (
								<Breadcrumb.Separator key={`sep-${index}`}>
									<LiaSlashSolid />
								</Breadcrumb.Separator>
							)}
						</>
					))}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</Stack>
	);
}

ResponsiveBreadcrumb.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			to: PropTypes.string, // si no hay "to", será el elemento actual
		})
	).isRequired,
};
