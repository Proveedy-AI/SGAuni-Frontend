import { useState, useEffect } from 'react';
import {
	Avatar,
	Field,
	Modal,
	PasswordInput,
	toaster,
	useContrastingColor,
} from '@/components/ui';
import {
	Badge,
	Box,
	Button,
	Flex,
	Grid,
	Heading,
	HStack,
	Input,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useChangePassword } from '@/hooks/auth';
import { useReadUsers, useUpdateUser } from '@/hooks/users';

export const AccountProfile = () => {
	const { contrast } = useContrastingColor();
	//const user = getUser();

	const user = {
		username: 'Juan Pérez',
		email: 'juan.perez@example.com',
		phone_number: '+1 234 567 890',
		country: { name: 'España', id: 1 },
		roles: [{ name: 'Administrador' }, { name: 'Usuario' }],
		color: '#FF5733', // Color personalizado
	};
	const { update, loading: loadingUpdate } = useUpdateUser();
	const { changePassword, loading: loadingPassword } = useChangePassword();
	const { data: dataUsers, fetchUsers, loading: loadingRead } = useReadUsers();

	const userInfo = dataUsers.find((u) => u.id === user.sub) || {};

	const [fullname, setFullname] = useState(user.username);
	const [email, setEmail] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [country, setCountry] = useState({ label: '', value: 0 });
	const [roles, setRoles] = useState([]);
	const [color, setColor] = useState('#F2F2F2');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!loadingRead && Object.keys(userInfo).length > 0) {
			setFullname(userInfo.fullname || '');
			setEmail(userInfo.email || '');
			setPhoneNumber(userInfo.phone_number || '');
			setCountry({
				label: userInfo.country?.name,
				value: userInfo.country?.id,
			});
			setRoles(userInfo.roles || []);
			setColor(userInfo.color);
		}
	}, [userInfo]);

	const handleUpdateProfile = async (e) => {
		e.preventDefault();

		const payload = {
			fullname,
			email,
			country_id: country.value,
			phone_number: phoneNumber,
		};

		try {
			await update(payload, userInfo.id);
			toaster.create({
				title: 'Perfil actualizado correctamente.',
				type: 'success',
			});
			fetchUsers();
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	const handleChangePassword = async () => {
		if (newPassword !== confirmPassword) {
			return;
		}
		const payload = {
			user_id: user.sub,
			current_password: currentPassword,
			new_password: newPassword,
		};

		try {
			await changePassword(payload);
			toaster.create({
				title: 'Contraseña actualizada',
				type: 'success',
			});
			setIsOpen(false);

			// Limpiar los campos del formulario
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	return (
		<Box spaceY='5'>
			<Heading
				size={{
					xs: 'xs',
					sm: 'sm',
					md: 'md',
				}}
			>
				Propiedades de cuenta
			</Heading>

			<VStack
				bg={{ base: 'white', _dark: 'uni.gray.500' }}
				p='6'
				align='start'
				borderRadius='10px'
				overflow='hidden'
				boxShadow='md'
				gap='6'
			>
				<HStack justify='space-between' w='full'>
					<HStack>
						<Avatar
							bgColor={color}
							color={contrast(color)}
							name={fullname}
							shape='rounded'
							size='xl'
						/>
						<Stack gap='0'>
							<Text fontWeight='medium'>{fullname}</Text>
							{/* <HStack align='center' color='uni.secondary' gap='2' fontSize='sm'>
              <Text>Cambiar perfil</Text>
              <FiCamera />
            </HStack> */}
						</Stack>
					</HStack>
					<Button
						size='sm'
						onClick={handleUpdateProfile}
						isLoading={loadingUpdate}
						bg='uni.secondary'
						color='white'
						w={{ base: 'full', sm: 'auto' }}
					>
						Guardar Cambios
					</Button>
				</HStack>

				<Grid
					w='full'
					templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
					gap='6'
				>
					<Box minW='50%'>
						<Stack css={{ '--field-label-width': '140px' }}>
							<Field
								orientation={{
									base: 'vertical',
									sm: 'horizontal',
								}}
								label='Nombre y Apellidos:'
							>
								<Input
									value={fullname}
									onChange={(e) => setFullname(e.target.value)}
									variant='flushed'
									flex='1'
									size='sm'
								/>
							</Field>

							<Field
								orientation={{
									base: 'vertical',
									sm: 'horizontal',
								}}
								label='Correo electrónico:'
							>
								<Input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									variant='flushed'
									flex='1'
									size='sm'
								/>
							</Field>
						</Stack>
					</Box>

					<Box minW='50%'>
						<Stack css={{ '--field-label-width': '140px' }}>
							<Field
								orientation={{
									base: 'vertical',
									sm: 'horizontal',
								}}
								label='Teléfono:'
							>
								<Input
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									variant='flushed'
									flex='1'
									size='sm'
								/>
							</Field>
						</Stack>
					</Box>
					<Stack css={{ '--field-label-width': '140px' }}>
						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='Roles asignados:'
						>
							<Flex w='full' align='start' gap='2' wrap='wrap'>
								{roles.length > 0 ? (
									roles.map((role, index) => (
										<Badge
											key={index}
											bg={{
												base: 'uni.200',
												_dark: 'uni.blue.400',
											}}
										>
											{role.name}
										</Badge>
									))
								) : (
									<Text fontSize='sm' color='gray.500'>
										Sin roles asignados
									</Text>
								)}
							</Flex>
						</Field>
					</Stack>
				</Grid>

				<Stack css={{ '--field-label-width': '140px' }}>
					<Field
						orientation={{ base: 'vertical', sm: 'horizontal' }}
						label='Contraseña:'
					>
						<Modal
							title='Cambiar contraseña'
							placement='center'
							size='xl'
							open={isOpen}
							onOpenChange={(e) => setIsOpen(e.open)}
							trigger={
								<Button
									onClick={() => setIsOpen(true)}
									bg='uni.secondary'
									color='white'
									size='xs'
									w={{ base: 'full', sm: 'auto' }}
								>
									Cambiar contraseña
								</Button>
							}
							onSave={handleChangePassword}
							loading={loadingPassword}
						>
							<Stack>
								<Text>
									Asegúrate de crear una contraseña larga e incluir caracteres
									especiales para reforzar la seguridad.
								</Text>
								<Field label='Contraseña actual:'>
									<PasswordInput
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										size='xs'
									/>
								</Field>
								<Field
									label='Nueva contraseña:'
									invalid={
										newPassword !== confirmPassword && confirmPassword !== ''
									}
									errorText='Las contraseñas no coinciden.'
								>
									<PasswordInput
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										size='xs'
									/>
								</Field>
								<Field
									label='Confirmar contraseña:'
									invalid={
										newPassword !== confirmPassword && confirmPassword !== ''
									}
									errorText='Las contraseñas no coinciden.'
								>
									<PasswordInput
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										size='xs'
									/>
								</Field>
							</Stack>
						</Modal>
					</Field>
				</Stack>
			</VStack>
		</Box>
	);
};
