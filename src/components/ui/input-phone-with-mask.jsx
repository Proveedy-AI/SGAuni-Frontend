import { Input } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { withMask } from 'use-mask-input';

const masksByDialCode = {
	'+51': '999 999 999', // Perú
	'+54': '999 9999 9999', // Argentina
	'+591': '999 99999', // Bolivia
	'+55': '(99) 99999-9999', // Brasil
	'+56': '9 9999 9999', // Chile
	'+57': '999 999 9999', // Colombia
	'+1': '(999) 999-9999', // Estados Unidos
	'+32': '999 99 99 99', // Bélgica
	'+506': '9999 9999', // Costa Rica
	'+53': '5 999 9999', // Cuba (móviles empiezan con 5)
	'+593': '99 999 9999', // Ecuador
	'+503': '9999 9999', // El Salvador
	'+502': '9999 9999', // Guatemala
	'+504': '9999 9999', // Honduras
	'+52': '999 999 9999', // México
	'+34': '999 99 99 99', // España
	'+598': '99 999 999', // Uruguay
	'+58': '412 9999999', // Venezuela (móviles: 412, 414, 416, etc.)
	'+509': '99 99 9999', // Haití
	'+505': '9999 9999', // Nicaragua
	'+507': '9999 9999', // Panamá
	'+595': '999 999 999', // Paraguay
	'+91': '99999 99999', // India
	'+20': '1 999999999', // Egipto (móviles comienzan con 1)
};

const getDialCodeFromPhone = (phone) => {
	const cleaned = phone.replace(/\D/g, ''); // solo números
	const dialCodes = Object.keys(masksByDialCode).sort(
		(a, b) => b.length - a.length
	);

	for (const code of dialCodes) {
		const codeDigits = code.replace('+', '');
		if (cleaned.startsWith(codeDigits)) {
			return code;
		}
	}
	return null;
};

export const InputPhoneWithMask = ({
	dialCode,
	setDialCode,
	setCountry,
	options,
	value,
	onChange,
	...props
}) => {
	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef.current) {
			withMask(masksByDialCode[dialCode])(inputRef.current);
		}
	}, [dialCode]);

	const handlePaste = (event) => {
		const pasted = event.clipboardData.getData('Text');
		const cleaned = pasted.replace(/\D/g, '');
		const detectedDial = getDialCodeFromPhone(cleaned);

		if (detectedDial && detectedDial !== dialCode) {
			setDialCode([detectedDial]);

			const foundCountry = options.find((c) => c.value === detectedDial);
			if (foundCountry) {
				setCountry(foundCountry);
			}

			// Recortar el número sin el código detectado
			const codeDigits = detectedDial.replace('+', '');
			const phoneWithoutDial = cleaned.slice(codeDigits.length);
			setTimeout(() => {
				onChange({ target: { value: phoneWithoutDial } });
			}, 0);
		}
	};

	return (
		<Input
			{...props}
			ref={inputRef}
			value={value}
			onChange={onChange}
			onPaste={handlePaste}
			placeholder={masksByDialCode[dialCode]}
			type='tel'
		/>
	);
};

InputPhoneWithMask.propTypes = {
	dialCode: PropTypes.array.isRequired,
	setDialCode: PropTypes.func.isRequired,
	setCountry: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
		})
	).isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
