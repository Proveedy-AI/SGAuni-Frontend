import PropTypes from 'prop-types';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';

export const DashboardCard = ({
	label,
	value,
	trend,
	helpText,
	trendColor,
	icon,
}) => {
	return (
		<Box
			w='full'
			bg={{ base: 'white', _dark: 'uni.gray.500' }}
			p='4'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
		>
			<HStack align='start' justify='space-between'>
				<Box>
					<Text fontSize={{ base: 'xs', sm: 'sm' }}>{label}</Text>
					<HStack>
						<Text fontSize='xl' fontWeight='bold'>
							{value}
						</Text>
						<Text color={trendColor} fontSize='xs'>
							{trend}
						</Text>
					</HStack>
					<Text fontSize={{ base: 'xs', sm: 'sm' }}>{helpText}</Text>
				</Box>
				<Flex
					w='50px'
					h='50px'
					bg='uni.200'
					borderRadius='lg'
					color='uni.primary'
					align='center'
					justify='center'
				>
					{icon}
				</Flex>
			</HStack>
		</Box>
	);
};

DashboardCard.propTypes = {
	label: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.node,
	]),
	trend: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	helpText: PropTypes.oneOfType([
		PropTypes.string, // Para aceptar un React Element (<FaAward />)
		PropTypes.object, // Para aceptar un objeto
	]),
	trendColor: PropTypes.string,
	icon: PropTypes.oneOfType([
		PropTypes.elementType, // Para aceptar un React Element (<FaAward />)
		PropTypes.object, // Para aceptar un objeto
	]),
};
