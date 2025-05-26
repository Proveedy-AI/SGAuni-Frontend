import PropTypes from 'prop-types';
import { useColorMode } from '../ui/color-mode';

export const IsoTipo = ({ negativo = false, light = false }) => {
	const { colorMode } = useColorMode();

	// Determina el color del primer path
	const fillPrimary = negativo
		? colorMode === 'dark'
			? 'white'
			: '#788193'
		: light
			? 'white'
			: colorMode === 'dark'
				? 'white'
				: '#09155F';

	// Determina el color del segundo path
	const fillSecondary = negativo
		? colorMode === 'dark'
			? 'white'
			: '#788193'
		: '#019CFE';

	return (
		<svg
			width='100'
			height='100'
			viewBox='0 0 26.458333 26.458333'
			version='1.1'
			xmlns='http://www.w3.org/2000/svg'
			style={{ width: '100%', height: '100%' }}
		>
			<path
				fill={fillPrimary}
				d='M 0,0 V 1.8878999 A 1.8874576,1.8874576 0 0 0 1.8878999,3.7740998 H 7.4603664 V 26.458332 H 11.212066 V 3.7740998 h 13.360066 a 1.8874576,1.8874576 0 0 0 1.8862,-1.8861999 V 0 Z M 26.435932,7.5602664 15.099866,7.586933 v 11.3016 h 3.753433 v -7.584367 h 5.7068 A 1.8761555,1.8761555 0 0 0 26.435932,9.4403663 Z M 0,15.110199 V 26.413566 H 3.7637665 V 16.953333 A 1.8761555,1.8761555 0 0 0 1.8758666,15.110199 Z'
			/>
			<path
				fill={fillSecondary}
				d='M 0.69076664,7.5843664 A 0.68943061,0.68943061 0 0 0 0,8.2733997 v 2.3736663 a 0.68943061,0.68943061 0 0 0 0.69076664,0.654567 H 3.0626999 A 0.68943061,0.68943061 0 0 0 3.7637665,10.6126 V 8.2733997 A 0.68943061,0.68943061 0 0 0 3.0626999,7.5843664 Z M 22.672199,15.122233 v 7.572333 h -7.594733 v 1.853466 a 1.8761555,1.8761555 0 0 0 1.875867,1.875834 h 9.504999 V 15.122233 Z'
			/>
		</svg>
	);
};

IsoTipo.propTypes = {
	negativo: PropTypes.bool,
	light: PropTypes.bool,
};
