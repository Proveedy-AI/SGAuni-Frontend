import PropTypes from 'prop-types';
import { Box, HStack, IconButton, Stack, Text } from '@chakra-ui/react';
import { MenuContent, MenuRoot, MenuTrigger, Switch, Tooltip } from '../ui';
import { FiEdit } from 'react-icons/fi';

export const SettingsVisibilityColum = ({
	visibleColumns,
	toggleColumnVisibility,
}) => {
	const visibleCount = Object.values(visibleColumns).filter(
		(column) => column.visible
	).length;

	return (
		<MenuRoot>
			<MenuTrigger asChild>
				<Box>
					<Tooltip
						content='Editar campos'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							variant='outline'
							aria-label='Botón editar campos'
							size='sm'
							_hover={{ bg: { base: 'white', _dark: 'uni.gray.500' } }}
							css={{
								_icon: {
									width: '5',
									height: '5',
								},
							}}
						>
							<FiEdit />
						</IconButton>
					</Tooltip>
				</Box>
			</MenuTrigger>
			<MenuContent bg={{ base: 'white', _dark: 'uni.gray.500' }} p='5'>
				<Text fontWeight='medium' mb='3' fontSize='sm'>
					Mostrar/Ocultar
				</Text>
				<Stack>
					{Object.keys(visibleColumns).map((columnKey) => {
						const column = visibleColumns[columnKey];
						const isDisabled = visibleCount === 1 && column.visible;
						return (
							<HStack key={columnKey} align='center' justify='space-between'>
								<Text fontSize='xs'>{column.name}</Text>
								<Switch
									checked={column.visible}
									onChange={() => toggleColumnVisibility(columnKey)}
									colorPalette='cyan'
									disabled={isDisabled}
									variant='raised'
									size='xs'
								/>
							</HStack>
						);
					})}
				</Stack>
			</MenuContent>
		</MenuRoot>
	);
};

SettingsVisibilityColum.propTypes = {
	visibleColumns: PropTypes.object,
	toggleColumnVisibility: PropTypes.func,
};
