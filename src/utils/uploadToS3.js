import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Crear cliente S3
const s3Client = new S3Client({
	region: import.meta.env.VITE_AWS_REGION,
	credentials: {
		accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
		secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
	},
	requestChecksumCalculation: 'WHEN_REQUIRED',
});

// Función para subir el archivo
export const uploadToS3 = async (file, folder, name) => {
	const timestamp = new Date().toISOString().split('T')[0];
	const fileName = `${file.name.split('.')[0]}-${name}-${timestamp}.pdf`;
	const key = `${folder}/${fileName}`;

	// Parámetros para el comando
	const params = {
		Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
		Key: key,
		Body: file,
		ContentType: file.type,
	};

	try {
		// Crear el comando
		const command = new PutObjectCommand(params);
		// Enviar el comando
		const data = await s3Client.send(command);
		console.log('Archivo subido con éxito:', data);

		// Retornar la URL pública del archivo subido
		return `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
	} catch (err) {
		console.error('Error al subir el archivo:', err);
		throw err;
	}
};
