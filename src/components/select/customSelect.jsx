import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Input, Text, Spinner, Icon, Flex } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';

const CustomSelect = ({ options, value, onChange, isDisabled, isLoading, isSearchable }) => {
	const [search, setSearch] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef(null);

	// 🔹 Manejar clics fuera del componente
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (selectRef.current && !selectRef.current.contains(event.target)) {
				setTimeout(() => setIsOpen(false), 100); // 🔹 Retraso para evitar cierre inmediato
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// 🔹 Filtrar opciones según búsqueda
	const filteredOptions = options.filter((opt) =>
		opt.label.toLowerCase().includes(search.toLowerCase())
	);

	// 🔹 Obtener la etiqueta de la opción seleccionada
	const selectedLabel = options.find((opt) => opt.value === value)?.label || '';

	// 🔹 Manejar selección
	const handleSelect = (option) => {
		setSearch('');
		onChange(option.value);
		setIsOpen(false);
	};

	// 🔹 Limpiar selección
	const handleClear = () => {
		setSearch('');
		onChange(null);
	};

	// 🔹 Alternar el menú
	const toggleDropdown = (event) => {
		event.preventDefault(); // 🔹 Evita que se active el cierre inmediato
		if (!isDisabled) {
			setIsOpen((prev) => !prev);
		}
	};

	return (
		<Box position='relative' w='full' ref={selectRef}>
			<Flex
				alignItems='center'
				border='1px solid'
				borderColor={isDisabled ? { base: 'gray.600', _dark: 'gray.500' } : { base: 'gray.500', _dark: 'gray.400' }}
				bg='transparent'
				h='40px'
				borderRadius='md'
				position='relative'
				cursor={isDisabled ? 'not-allowed' : 'pointer'}
				px='2'
				onClick={toggleDropdown} // 🔹 Alternar menú al hacer clic
				opacity={isDisabled ? 0.6 : 1} // 🔹 Opacidad menor cuando está deshabilitado
			>
				{isSearchable && (
					<Input
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setIsOpen(true);
							e.stopPropagation();
						}}
						placeholder=''
						isDisabled={isDisabled || isLoading}
						border='none'
						cursor={isDisabled ? 'not-allowed' : 'pointer'}
						_focus={{ outline: 'none' }}
						flex='1'
						color={{ base: 'white', _dark: 'black' }}
						bg='transparent'
						autoComplete='off'
						pr='30px'
						onFocus={() => setIsOpen(true)}
					/>
				)}

				{/* Mostrar la opción seleccionada si no hay búsqueda */}
				{!isSearchable && search === '' && selectedLabel && (
					<Text
						flex='1'
						color={{ base: 'white', _dark: 'black' }}
						whiteSpace='nowrap'
						overflow='hidden'
						textOverflow='ellipsis'
						cursor='pointer'
						maxWidth='80%'
					>
						{selectedLabel || 'Seleccionar'}
					</Text>
				)}
				<Box
					position='absolute'
					right='0'
					display='flex'
					alignItems='center'
					justifyContent='center'
					px='2'
					borderLeft='1px solid'
					borderColor={{ base: 'gray.500', _dark: 'gray.400' }}
				>
					{isLoading ? (
						<Spinner size='sm' />
					) : (
						<Icon as={FiChevronDown} w={4} h={4} cursor='pointer' />
					)}
				</Box>
			</Flex>

			{/* Opciones del Select */}
			{isOpen && (
				<Box
					position='absolute'
					mt='1'
					w='full'
					border='1px solid'
					borderRadius='md'
					boxShadow='sm'
					zIndex='99999'
					bg={{ base: 'gray.700', _dark: 'white' }}
					borderColor={{ base: 'gray.500', _dark: 'gray.400' }}
				>
					{/* Opción para limpiar selección */}
					{filteredOptions.length > 0 && (
						<Text
							px='4'
							py='2'
							w='full'
							textAlign='start'
							cursor='pointer'
							_hover={{ bg: { base: 'gray.400', _dark: 'gray.200' } }}
							onClick={handleClear}
						>
							Ninguno
						</Text>
					)}

					{/* Opciones dinámicas */}
					{filteredOptions.length > 0 ? (
						filteredOptions.map((option) => (
							<Text
								key={option.value}
								px='4'
								py='2'
								w='full'
								textAlign='start'
								cursor='pointer'
								bg={
									option.value === value
										? { base: 'uni.secondary', _dark: 'uni.secondary' }
										: 'transparent'
								}
								_hover={{
									bg: { base: 'gray.500', _dark: 'gray.200' },
									color: { base: 'white', _dark: 'black' },
								}}
								fontWeight={option.value === value ? 'bold' : 'normal'}
								color={option.value === value ? 'white' : 'inherit'}
								onClick={() => handleSelect(option)}
							>
								{option.label}
							</Text>
						))
					) : (
						<Text px='4' py='2' w='full' textAlign='center' color='gray.400'>
							No hay resultados
						</Text>
					)}
				</Box>
			)}
		</Box>
	);
};

// 📌 Validación de Props
CustomSelect.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	isDisabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	isSearchable: PropTypes.bool,
};

// 📌 Valores por defecto
CustomSelect.defaultProps = {
	value: null,
	isDisabled: false,
	isLoading: false,
	isSearchable: true,
};

export default CustomSelect;
