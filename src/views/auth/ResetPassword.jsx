import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import {
	Box,
	Container,
	Heading,
	Input,
	Stack,
	VStack,
	Text,
	Spinner,
} from '@chakra-ui/react';
import { toaster, Field, Button, InputGroup } from '@/components/ui';
import { LuArrowLeft, LuLock } from 'react-icons/lu';
import { useResetPassword } from '@/hooks/users/recoverypass';

export const ResetPassword = () => {
	const { token } = useParams();
	const navigate = useNavigate();

	/*const {
		loading: loadingFind,
		data,
		error,
		fetchTokenRecovery,
	} = useFindTokenRecovery();*/
	const { reset, loading: loadingReset } = useResetPassword();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [fieldError, setFieldError] = useState({
		password: '',
		confirmPassword: '',
	});

	/*useEffect(() => {
		if (token && token.trim() !== '') {
			fetchTokenRecovery(token);
		}
	}, [token, fetchTokenRecovery]);*/

	const handleSubmit = async (e) => {
	/*	e.preventDefault();
		setFieldError({ password: '', confirmPassword: '' });

		if (!password) {
			setFieldError((prev) => ({
				...prev,
				password: 'La contraseña es requerida',
			}));
			return;
		}

		if (!confirmPassword) {
			setFieldError((prev) => ({
				...prev,
				confirmPassword: 'Debe confirmar la contraseña',
			}));
			return;
		}

		if (password !== confirmPassword) {
			setFieldError((prev) => ({
				...prev,
				confirmPassword: 'Las contraseñas no coinciden',
			}));
			return;
		}

		if (!data?.email || !data?.token) {
			toaster.create({
				title: 'Error',
				description: 'No se pudo validar el token. Intente de nuevo.',
				type: 'error',
			});
			return;
		}

		try {
			await reset({
				email: data.email,
				password: password,
				token: data.token,
				configuration_id: 1,
			});

			toaster.create({
				title: 'Contraseña actualizada correctamente',
				type: 'success',
			});

			navigate('/auth/login', {
				state: {
					successMessage: 'Contraseña actualizada correctamente',
				},
			});
		} catch (error) {
			toaster.create({
				title: 'Error al actualizar la contraseña',
				description: error.message,
				type: 'error',
			});
		}*/
	};

	/*if (loadingFind) {
		return (
			<Container maxW='md' py={12}>
				<Box
					bg={{ base: 'white', _dark: 'uni.gray.500' }}
					p={10}
					borderRadius='20px'
					boxShadow='2xl'
					w='full'
					textAlign='center'
				>
					<Spinner size='lg' />
					<Text mt={4} color='gray.600'>
						Verificando token...
					</Text>
				</Box>
			</Container>
		);
	}

	if (error || !data?.email || !data?.token) {
		return (
			<Container maxW='md' py={12}>
				<Box
					bg={{ base: 'white', _dark: 'uni.gray.500' }}
					p={10}
					borderRadius='20px'
					boxShadow='2xl'
					w='full'
					textAlign='center'
				>
					<Text fontSize='xl' fontWeight='bold' color='red.500'>
						Token inválido o expirado
					</Text>
					<Text color='gray.600' mt={2}>
						Por favor, solicita un nuevo enlace de recuperación.
					</Text>
					<Button
						mt={4}
						bg='uni.secondary'
						color='white'
						as={Link}
						to='/auth/login'
					>
						Solicitar nuevo enlace
					</Button>
				</Box>
			</Container>
		);
	}*/

	return (
		<Container maxW='md' py={12}>
			<Box
				bg={{ base: 'white', _dark: 'uni.gray.500' }}
				p={10}
				borderRadius='20px'
				boxShadow='2xl'
				w='full'
			>
				<VStack spacing={6} align='stretch'>
					<Box display='flex' alignItems='center' gap='0.5rem'>
						<LuArrowLeft size={18} />
						<Link to='/login'>
							<Text
								fontSize='sm'
								color='gray.500'
								_hover={{ color: 'blue.500' }}
								as='span'
							>
								Volver al login
							</Text>
						</Link>
					</Box>

					<Box>
						<Heading fontSize='2xl' fontWeight='bold' mb={2}>
							Restablecer contraseña
						</Heading>
						<Text color='gray.600'>
							Ingresa tu nueva contraseña y confírmala.
						</Text>
					</Box>

					<form onSubmit={handleSubmit} style={{ width: '100%' }}>
						<Stack w='full' spacing={4}>
							<Field
								label='Nueva contraseña'
								invalid={!!fieldError.password}
								errorText={fieldError.password}
							>
								<InputGroup
									width='100%'
									startElement={<LuLock />}
								>
									<Input
										placeholder='Ingrese su nueva contraseña'
										type='password'
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										size='sm'
									/>
								</InputGroup>
							</Field>

							<Field
								label='Confirmar contraseña'
								invalid={!!fieldError.confirmPassword}
								errorText={fieldError.confirmPassword}
							>
								<InputGroup
									width='100%'
									startElement={<LuLock />}
								>
									<Input
										placeholder='Confirme su nueva contraseña'
										type='password'
										value={confirmPassword}
										onChange={(e) =>
											setConfirmPassword(e.target.value)
										}
										size='sm'
									/>
								</InputGroup>
							</Field>

							<Button
								type='submit'
								w='full'
								//loading={loadingReset}
								loadingText='Guardando...'
								bg='uni.secondary'
								color='white'
								size='sm'
							>
								Guardar nueva contraseña
							</Button>
						</Stack>
					</form>
				</VStack>
			</Box>
		</Container>
	);
};
