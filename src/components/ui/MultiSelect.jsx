import { Select } from 'chakra-react-select';
import PropTypes from 'prop-types';

export const MultiSelect = ({
	options,
	value,
	onChange,
	placeholder,
	disabled,
}) => {
	return (
		<Select
			disabled={disabled}
			size='sm'
			minWidth='150px'
			isMulti
			options={options}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			closeMenuOnSelect={false}
			selectedOptionStyle='check'
			hideSelectedOptions={false}
			menuPosition='fixed'
			chakraStyles={{
				control: (provided) => ({
					...provided,
					border: '1px solid',
					borderColor: 'its.secondary',
					borderRadius: 'md',
					minWidth: '165px',
					maxWidth: '180px',
					minHeight: '34px',
					maxHeight: '34px',
					backgroundColor: 'transparent',
				}),
				menu: (provided) => ({
					...provided,
					border: '1px solid',
					borderColor: 'its.secondary',
					borderRadius: 'md',
				}),
				menuList: (provided) => ({
					...provided,
					bg: { base: 'white', _dark: 'its.gray.500' },
				}),
				multiValue: (provided) => ({
					...provided,
					backgroundColor: 'its.500',
				}),
				multiValueLabel: (provided) => ({
					...provided,
					color: 'its.secondary',
				}),
				multiValueRemove: (provided) => ({
					...provided,
					color: 'its.secondary',
					':hover': {
						backgroundColor: 'its.200',
						color: 'its.secondary',
					},
				}),
				valueContainer: (provided) => ({
					...provided,
					maxHeight: '60px', // Ajusta la altura máxima según sea necesario
					overflow: 'auto',
				}),
			}}
		/>
	);
};

MultiSelect.propTypes = {
	options: PropTypes.array.isRequired,
	value: PropTypes.any,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
};
