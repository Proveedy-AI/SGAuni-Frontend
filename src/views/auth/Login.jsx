import { Alert, Button, Field, InputGroup, toaster } from '@/components/ui';
import { useAuth, useGenerateTokenRecovery } from '@/hooks/auth';
import {
	Box,
	Flex,
	Group,
	Heading,
	Input,
	InputAddon,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuEye, LuEyeOff, LuLock, LuMail } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router';

export const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [fieldError, setFieldError] = useState({ email: '', password: '' });
	const [fieldSuccess, setFieldSuccess] = useState('');
	const [isForgotPassword, setIsForgotPassword] = useState(false);
	const { generate, loading: LoadingToken } = useGenerateTokenRecovery();
	const [block, setBlock] = useState(false);

	const location = useLocation();
	const [isVisible, setIsVisible] = useState(false);

	// Acceder al mensaje si está presente en el estado
	const successMessage = location.state?.successMessage;

	useEffect(() => {
		if (successMessage) {
			// Mostrar el mensaje
			setIsVisible(true);

			// Esconder el mensaje después de 5 segundos
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 8000);

			// Limpiar el temporizador cuando el componente se desmonte o el mensaje cambie
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	const toggleForgotPassword = () => {
		setIsForgotPassword(!isForgotPassword);
		setFieldSuccess('');
		setBlock(false);
		setEmail('');
	};

	const handleForgotPasswordSubmit = async (event) => {
		event.preventDefault();
		setFieldError({ email: '' });

		if (!email) {
			setFieldError({ email: 'El campo correo es obligatorio' });
			return;
		}

		try {
			await generate(email);
			setFieldSuccess('Correo enviado, revise su Bandeja de entrada');
			setBlock(true);
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	const { login, loading, error, getToken } = useAuth();
	const navigate = useNavigate();
	const token = getToken();

	const isDemo = import.meta.env.VITE_IS_DEMO === 'true';

	const mensaje = isDemo ? 'DEMO' : '';

	useEffect(() => {
		if (token) {
			navigate('/');
		}
	}, [token, navigate]);

	const handleTogglePassword = () => {
		setShowPassword(!showPassword);
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setFieldError({ email: '', password: '' });

		if (!email) {
			setFieldError((prev) => ({
				...prev,
				email: 'El campo correo electrónico es requerido',
			}));
			return;
		}
		if (!password) {
			setFieldError((prev) => ({
				...prev,
				password: 'El campo contraseña es requerido',
			}));
			return;
		}

		try {
			localStorage.removeItem('selectedDateType');
			localStorage.removeItem('opportunitiesFilters');
			await login(email, password);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Flex alignItems='center' justifyContent='flex-end' w='full'>
			<Box
				bg={{ base: 'white', _dark: 'uni.gray.500' }}
				py={10}
				px={{ base: 5, md: 14 }}
				borderRadius='20px'
				boxShadow='2xl'
				w='full'
				maxW='md'
			>
				<VStack as='form' gap='20px' onSubmit={handleSubmit}>
					<VStack>
						<Box w='200px'>
							Logo
						</Box>

						<Heading fontSize='2xl' fontWeight='bold'>
							SGA UNI {mensaje}
						</Heading>
					</VStack>

					{error && <Alert status='error' title={error} />}
					{fieldSuccess && <Alert status='success' title={fieldSuccess} />}
					{isVisible && successMessage && (
						<Alert status='success' title={successMessage} />
					)}
					{!isForgotPassword && (
						<>
							<Stack w='full'>
								<Field
									label='Correo electrónico'
									invalid={!!fieldError.email}
									errorText={fieldError.email}
								>
									<InputGroup width='100%' startElement={<LuMail />}>
										<Input
											placeholder='Ingresar correo electrónico'
											type='email'
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											size='sm'
											ps={`calc(var(--input-height))`}
										/>
									</InputGroup>
								</Field>

								<Field
									label='Contraseña'
									invalid={!!fieldError.password}
									errorText={fieldError.password}
								>
									<InputGroup width='100%' startElement={<LuLock />}>
										<Group attached width='100%'>
											<Input
												placeholder='Ingresar contraseña'
												type={showPassword ? 'text' : 'password'}
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												size='sm'
												ps={`calc(var(--input-height))`}
											/>
											<InputAddon
												onClick={handleTogglePassword}
												bg='transparent'
											>
												{showPassword ? <LuEye /> : <LuEyeOff />}
											</InputAddon>
										</Group>
									</InputGroup>
								</Field>
							</Stack>

							<Button
								type='submit'
								w='full'
								loading={loading}
								loadingText='Ingresando...'
								bg='uni.secondary'
								color='white'
								size='sm'
							>
								Iniciar sesión
							</Button>
						</>
					)}
					{isForgotPassword ? (
						<VStack as='form' gap='20px'>
							<Heading fontSize='xl'>Restablecer Contraseña</Heading>
							<Text color='gray.500'>
								Ingresa tu correo para recibir instrucciones
							</Text>

							<Field
								label='Correo electrónico'
								invalid={!!fieldError.email}
								errorText={fieldError.email}
							>
								<InputGroup width='100%' startElement={<LuMail />}>
									<Input
										placeholder='Ingresar correo electrónico'
										type='email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										size='sm'
										ps={`calc(var(--input-height))`}
									/>
								</InputGroup>
							</Field>

							<Button
								w='full'
								colorScheme='blue'
								size='sm'
								loadingText='Enviando...'
								disabled={block}
								loading={LoadingToken}
								onClick={handleForgotPasswordSubmit} // Usamos el evento onClick para manejar el envío
							>
								Enviar
							</Button>
							<Button variant='link' onClick={toggleForgotPassword}>
								Volver al inicio de sesión
							</Button>
						</VStack>
					) : (
						<VStack as='form' gap='20px' onSubmit={handleSubmit}>
							{/* Formulario de login */}
							<Button variant='link' onClick={toggleForgotPassword}>
								¿Olvidaste tu contraseña?
							</Button>
						</VStack>
					)}
				</VStack>
			</Box>
		</Flex>
	);
};
