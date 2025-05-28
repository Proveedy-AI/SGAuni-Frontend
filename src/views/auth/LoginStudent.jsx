import { Alert, Button, Field, InputGroup, toaster } from '@/components/ui';
import { useAuth, useGenerateTokenRecovery } from '@/hooks/auth';
import {
	Box,
	Flex,
	Group,
	Heading,
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

	/*const { login, loading, error, getToken } = useAuth();
	const navigate = useNavigate();
	const token = getToken();

	

	

	useEffect(() => {
		if (token) {
			navigate('/');
		}
	}, [token, navigate]);*/

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
			//await login(email, password);
		} catch (e) {
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
									fontSize='24px' // Tamaño de fuente 16px
									fontWeight={400} // Peso de fuente 400
									lineHeight='100%' // Altura de línea 100%
									letterSpacing='0%' // Espaciado de letras 0%
									textAlign='center' // Alineación horizontal al centro
								>
									Iniciar Sesión
								</Text>

								<Text
									fontSize='16px' // Tamaño de fuente 16px
									fontWeight={400} // Peso de fuente 400
									lineHeight='100%' // Altura de línea 100%
									letterSpacing='0%' // Espaciado de letras 0%
									textAlign='center' // Alineación horizontal al centro
								>
									Por favor ingresa tus datos institucionales
								</Text>
							</>
						) : (
							<>
								<Text
									fontSize='24px' // Tamaño de fuente 16px
									fontWeight={400} // Peso de fuente 400
									lineHeight='100%' // Altura de línea 100%
									letterSpacing='0%' // Espaciado de letras 0%
									textAlign='center' // Alineación horizontal al centro
								>
									Restablecer Contraseña
								</Text>

								<Text
									fontSize='16px' // Tamaño de fuente 16px
									fontWeight={400} // Peso de fuente 400
									lineHeight='100%' // Altura de línea 100%
									letterSpacing='0%' // Espaciado de letras 0%
									textAlign='center' // Alineación horizontal al centro
								>
									Ingresa tu correo para recibir instrucciones
								</Text>
							</>
						)}

						{/* Mostrar mensajes de error o éxito */}
						{fieldSuccess && <Alert status='success' title={fieldSuccess} />}
						{isVisible && successMessage && (
							<Alert status='success' title={successMessage} />
						)}

						{/* Formulario de inicio de sesión */}
						{!isForgotPassword && (
							<VStack w={'full'} gap='20px' mt={10}>
								<Stack w='full'>
									<Field
										label='usuario o correo institucional'
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
									loadingText='Ingresando...'
									bg='uni.secondary'
									color='white'
									size='sm'
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
									bg='uni.secondary'
									color='white'
									size='sm'
									loadingText='Enviando...'
									disabled={block}
									loading={LoadingToken}
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

					<VStack w={'full'}>
						<Text
							fontSize='14px'
							color='gray'
							fontWeight={100}
							textAlign='center'
						>
							Ingresa al portal administrativo
						</Text>
						<Button
							type='submit'
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
							Soy usuario administrativo
						</Button>
					</VStack>
				</VStack>
			</Box>
		</Flex>
	);
};
