import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import {
	Box,
	Container,
	Heading,
	Input,
	Stack,
	VStack,
	Text,
} from '@chakra-ui/react';
import { toaster, Field, Button, InputGroup } from '@/components/ui';
import { LuArrowLeft, LuLock } from 'react-icons/lu';
import { useResetPassword } from '@/hooks/users/recoverypass';

export const ResetPassword = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const token = queryParams.get('token');
	const navigate = useNavigate();

	const { mutateAsync: reset, isPending: loadingReset } = useResetPassword();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [fieldError, setFieldError] = useState({
		password: '',
		confirmPassword: '',
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
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

		if (!token) {
			toaster.create({
				title: 'Error',
				description: 'No se pudo validar el token. Intente de nuevo.',
				type: 'error',
			});
			return;
		}

		try {
			await reset({
				new_password: password,
				confirm_new_password: confirmPassword,
				token: token,
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
		}
	};

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
								<InputGroup width='100%' startElement={<LuLock />}>
									<Input
										placeholder='Ingrese su nueva contraseña'
										type='password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										size='sm'
									/>
								</InputGroup>
							</Field>

							<Field
								label='Confirmar contraseña'
								invalid={!!fieldError.confirmPassword}
								errorText={fieldError.confirmPassword}
							>
								<InputGroup width='100%' startElement={<LuLock />}>
									<Input
										placeholder='Confirme su nueva contraseña'
										type='password'
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										size='sm'
									/>
								</InputGroup>
							</Field>

							<Button
								type='submit'
								w='full'
								loading={loadingReset}
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
