export const RequiredDocumentsSections = {
	leftColumn: [
		{ key: null, label: 'Curriculum:', tooltip: null },
		{
			key: null,
			label: 'Ficha de Datos:',
			tooltip: 'Se puede obtener en la Sección de Datos Personales',
			required: true,
		},
		{
			key: 6,
			tooltip: 'Copia Simple, 6 meses para regularizar',
			label: 'Bachiller o título',
		},
		{
			key: 7,
			tooltip: 'Copia Simple, 18 meses para regularizar',
			label: 'Grado Maestro',
		},
		{ key: null, label: 'Foto tamaño carnet' },
		{
			key: null,
			label: 'Voucher Pago (Concepto de carpeta)',
		},
		{
			key: null,
			tooltip: 'Copia Simple, adverso y reverso (pdf)',
			label: 'Documento de Identidad',
		},
	],
	rightColumn: [
		{ key: '', label: 'Solicitud al Director' },
		{
			key: null,
			label: 'Declaración Jurada',
			required: true,
		},
		{
			key: 5,
			tooltip: 'Subir 2 cartas de presentación en un archivo pdf',
			label: 'Carta de Presentación',
		},
		{
			key: 8,
			label: '2da Epecialización',
		},
		{
			key: 9,
			label: 'Diploma de Postgrado',
		},
		{
			key: 10,
			label: 'Records de notas y créditos',
		},
		{
			key: 11,
			tooltip: 'Asignaturas aprobadas (visadas y selladas) adjuntadas en un .pdf',
			label: 'Sylabus de Asignatura',
		},
		{
			key: 1,
			label: 'Constancia 5to Superior',
		},
	],
};
