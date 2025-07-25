import { Alert, Button, Field, InputGroup, toaster } from '@/components/ui';
import { useProvideAuth } from '@/hooks/auth';
import { useRecoveryPass } from '@/hooks/users/recoverypass';
import {
	Box,
	Flex,
	Group,
	Image,
	Input,
	InputAddon,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuEye, LuEyeOff, LuLock, LuMail } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router';

export const LoginAdmin = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [fieldError, setFieldError] = useState({ username: '', password: '' });
	const [fieldErrorCredential, setFieldErrorCredential] = useState('');
	const [fieldSuccess, setFieldSuccess] = useState('');
	const [isForgotPassword, setIsForgotPassword] = useState(false);
	const { login, loading: LoadingToken, getAccessToken } = useProvideAuth();
	const [block, setBlock] = useState(false);

	const location = useLocation();
	const [isVisible, setIsVisible] = useState(false);
	const redirectUrl = `${import.meta.env.VITE_DOMAIN_MAIN}/auth/reset-password`;

	const { refetch: validateUser, isFetching } = useRecoveryPass({
		email: username,
		password_redirect_url: redirectUrl,
	});

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
		setUsername('');
	};

	const handleForgotPasswordSubmit = async () => {
		if (!username) {
			setFieldError((prev) => ({
				...prev,
				username: 'El campo correo electrónico es requerido',
			}));
			return;
		}

		try {
			const result = await validateUser();
			if (result?.status == 'success') {
				setFieldSuccess('Correo enviado, revise su bandeja de entrada');
			} else {
				setFieldErrorCredential(result?.error?.response?.data?.error);
			}
		} catch (err) {
			toaster.create({
				title: err.message || 'Error al validar el correo',
				type: 'error',
			});
		}
	};

	const token = getAccessToken();
	const navigate = useNavigate();
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
		setFieldError({ username: '', password: '' });

		if (!username) {
			setFieldError((prev) => ({
				...prev,
				username: 'El campo correo electrónico es requerido',
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
			await login(username, password);
		} catch (e) {
			setFieldErrorCredential(e.response.data.detail);
			console.error(e);
		}
	};

	return (
		<Flex alignItems='center' justifyContent='flex-end' w='full'>
			<Box
				bg='white'
				borderRadius='0'
				boxShadow='2xl'
				minH='100vh'
				display='flex'
				flexDirection='column'
				pt={10}
				alignItems='center'
				pb={10}
				w='full'
				maxW='lg'
			>
				<VStack
					as='form'
					gap='20px'
					minW={'70%'}
					onSubmit={handleSubmit}
					flex='1'
					justify='space-between'
				>
					<VStack w={'full'} gap='20px' alignItems='center'>
						<Box
							w='200px'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<Image src='/img/logo-UNI.png' alt='Logo' />
						</Box>

						{!isForgotPassword ? (
							<>
								<Text
									fontSize='24px'
									fontWeight={400}
									lineHeight='100%'
									letterSpacing='0%'
									textAlign='center'
								>
									Iniciar Sesión
								</Text>

								<Text
									fontSize='16px'
									fontWeight={400}
									lineHeight='100%'
									letterSpacing='0%'
									textAlign='center'
								>
									Hola, por favor ingresa tus datos institucionales
								</Text>
							</>
						) : (
							<>
								<Text
									fontSize='24px'
									fontWeight={400}
									lineHeight='100%'
									letterSpacing='0%'
									textAlign='center'
								>
									Restablecer Contraseña
								</Text>

								<Text
									fontSize='16px'
									fontWeight={400}
									lineHeight='100%'
									letterSpacing='0%'
									textAlign='center'
								>
									Ingresa tu correo para recibir instrucciones
								</Text>
							</>
						)}

						{/* Mostrar mensajes de error o éxito */}
						{fieldErrorCredential && (
							<Alert status='error' title={fieldErrorCredential} />
						)}
						{fieldSuccess && <Alert status='success' title={fieldSuccess} />}
						{isVisible && successMessage && (
							<Alert status='success' title={successMessage} />
						)}

						{/* Formulario de inicio de sesión */}
						{!isForgotPassword && (
							<VStack w={'full'} gap='20px'>
								<Stack w='full'>
									<Field
										label='usuario o correo institucional'
										invalid={!!fieldError.username}
										errorText={fieldError.username}
									>
										<InputGroup width='100%' startElement={<LuMail />}>
											<Input
												placeholder='Ingresar correo electrónico'
												type='text'
												value={username}
												onChange={(e) => setUsername(e.target.value)}
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
									loadingText='Ingresando...'
									bg='uni.secondary'
									color='white'
									size='sm'
									loading={LoadingToken}
								>
									Iniciar sesión
								</Button>
								<VStack
									as='form'
									gap='20px'
									alignSelf='flex-end'
									onSubmit={handleSubmit}
								>
									<Button
										variant='link'
										color='uni.secondary'
										onClick={toggleForgotPassword}
									>
										¿Olvidaste tu contraseña?
									</Button>
								</VStack>
							</VStack>
						)}

						{isForgotPassword ? (
							<VStack as='form' gap='20px' mt={10} w='full'>
								<Field
									label='Correo electrónico'
									invalid={!!fieldError?.username}
									errorText={fieldError?.username}
								>
									<InputGroup width='100%' startElement={<LuMail />}>
										<Input
											placeholder='Ingresar correo electrónico'
											type='email'
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											size='sm'
											ps={`calc(var(--input-height))`}
										/>
									</InputGroup>
								</Field>

								<Button
									w='full'
									bg='uni.secondary'
									color='white'
									size='sm'
									loadingText='Enviando...'
									disabled={block}
									loading={isFetching}
									onClick={handleForgotPasswordSubmit}
								>
									Enviar
								</Button>
								<VStack
									as='form'
									gap='20px'
									alignSelf='flex-end'
									onSubmit={handleSubmit}
								>
									<Button
										variant='link'
										color='uni.secondary'
										onClick={toggleForgotPassword}
									>
										Volver al inicio de sesión
									</Button>
								</VStack>
							</VStack>
						) : (
							''
						)}
					</VStack>

					{/*<VStack w={'full'}>
						<Text
							fontSize='14px'
							color='gray'
							fontWeight={100}
							textAlign='center'
						>
							Ingresa al portal de estudiante
						</Text>
						<Button
							type='button'
							onClick={() => navigate('/auth/login')}
							w='full'
							loadingText='Ingresando...'
							variant='outline'
							borderColor='uni.secondary'
							color='uni.secondary'
							size='sm'
							_hover={{
								bg: 'uni.secondary',
								color: 'white',
							}}
							_active={{
								bg: 'uni.secondary',
								color: 'white',
							}}
							_focus={{
								borderColor: 'uni.secondary',
								boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.5)',
							}}
						>
							Soy estudiante
						</Button>
					</VStack>*/}
				</VStack>
			</Box>
		</Flex>
	);
};
