import Select from 'react-select';
import { useColorMode, useContrastingColor } from '@/components/ui';

export const ReactSelect = (props) => {
	const { colorMode } = useColorMode();
	const { contrast } = useContrastingColor();
	const isDarkMode = colorMode === 'dark';

	const customStyles = {
		container: (provided) => ({
			...provided,
			width: '100%',
		}),
		control: (provided, state) => ({
			...provided,
			backgroundColor: 'transparent',
			borderColor: 'border',
			boxShadow: state.isFocused
				? `0 0 0 1px ${isDarkMode ? '' : ''}`
				: 'none',
			'&:hover': {
				borderColor: 'border.inverted',
			},
			opacity: state.isDisabled ? 0.7 : 1,
		}),
		input: (provided) => ({
			...provided,
			color: isDarkMode ? 'white' : '#151A20',
		}),

		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isSelected
				? '#019CFE'
				: state.isFocused
					? isDarkMode
						? '#1A2129'
						: '#F2F2F2'
					: null,
			color: state.isSelected
				? 'white'
				: isDarkMode
					? 'white'
					: '#151A20',
			'&:hover': {
				backgroundColor: isDarkMode ? '#1A2129' : '#F2F2F2',
				color: isDarkMode ? 'white' : '#151A20',
			},
		}),
		singleValue: (provided) => ({
			...provided,
			color: isDarkMode ? 'white' : '#1A2129',
		}),
		menu: (provided) => ({
			...provided,
			backgroundColor: isDarkMode ? '#151A20' : 'white',
			border: isDarkMode ? '1px solid #151A20' : '1px solid white',
			zIndex: 9999,
		}),
		menuPortal: (provided) => ({
			...provided,
			zIndex: 9999,
		}),
		multiValue: (provided, state) => {
			const color = state.data.color;
			return {
				...provided,
				backgroundColor: color
					? color
					: isDarkMode
						? '#1A2129'
						: '#F2F2F2',
			};
		},
		multiValueLabel: (provided, state) => {
			const color = state.data.color;
			return {
				...provided,
				fontSize: '10px',
				color: color
					? contrast(color)
					: isDarkMode
						? 'white'
						: '#1A2129',
				backgroundColor: color || 'transparent',
			};
		},
		multiValueRemove: (provided, state) => {
			const color = state.data.color;
			return {
				...provided,
				color: color
					? contrast(color)
					: isDarkMode
						? 'white'
						: '#1A2129',
			};
		},
	};

	const mergedStyles = { ...customStyles };

	if (props.styles) {
		Object.keys(props.styles).forEach((key) => {
			mergedStyles[key] = mergeStyleFunctions(
				customStyles[key],
				props.styles[key]
			);
		});
	}

	return <Select {...props} styles={mergedStyles} menuPosition='fixed' />;
};

const mergeStyleFunctions = (baseStyle, overrideStyle) => (provided, state) => {
	const base =
		typeof baseStyle === 'function'
			? baseStyle(provided, state)
			: baseStyle || {};
	const override =
		typeof overrideStyle === 'function'
			? overrideStyle(provided, state)
			: overrideStyle || {};
	return { ...base, ...override };
};
