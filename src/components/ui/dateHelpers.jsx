// utils/dateHelpers.js
export const formatDateString = (isoDate) => {
	if (!isoDate) return '';
	const [year, month, day] = isoDate.split('-');
	const monthsEs = [
		'enero',
		'febrero',
		'marzo',
		'abril',
		'mayo',
		'junio',
		'julio',
		'agosto',
		'septiembre',
		'octubre',
		'noviembre',
		'diciembre',
	];
	return `${parseInt(day)} de ${monthsEs[parseInt(month) - 1]} de ${year}`;
};
