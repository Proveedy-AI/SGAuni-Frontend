import { UserTable } from '@/components/tables';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { CreateAndFilterUser } from '@/components/forms/management/user/CreateAndFilterUser';
import { EditUserModal } from '@/components/forms/management/user/EditUserModal';
import { ToogleRoleUserModal } from '@/components/forms/management/user/ToogleRoleUserModal';
import { useReadUsers } from '@/hooks/users';
import { Link } from 'react-router';
import { FiAlertCircle } from 'react-icons/fi';

export const UserList = () => {
	const {
		data: dataUsers,
		refetch: fetchUsers,
		isLoading,
		error,
	} = useReadUsers();

	const [selectedUser, setSelectedUser] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState({
		create: false,
		view: false,
		edit: false,
		delete: false,
		toogleRole: false,
	});

	// Funciones para abrir y cerrar modales
	const handleOpenModal = (modalType, user) => {
		if (user) setSelectedUser(user);
		setIsModalOpen((prev) => ({ ...prev, [modalType]: true }));
	};

	const handleCloseModal = (modalType) => {
		setIsModalOpen((prev) => ({ ...prev, [modalType]: false }));
		setSelectedUser(null);
	};

	// Filtro de búsqueda
	const [search, setSearch] = useState('');
	const filteredUsers = dataUsers?.results?.filter((user) => {
		const searchLower = search.toLowerCase();
		return (
			(user.username || '').toLowerCase().includes(searchLower) ||
			(user.full_name || '').toLowerCase().includes(searchLower) ||
			(user.phone || '').toLowerCase().includes(searchLower) ||
			(user.uni_email || '').toLowerCase().includes(searchLower) ||
			(user.category || '').toLowerCase().includes(searchLower)
		);
	});

	return (
		<>
			<Box spaceY='4'>
				<Heading
					size={{ xs: 'xs', sm: 'sm', md: 'md' }}
					color='its.gray.200'
					fontWeight='bold'
				>
					Usuarios
				</Heading>

				{error && (
					<Box
						display='flex'
						flexDirection='column'
						alignItems='center'
						justifyContent='center'
						py={8}
					>
						<Box color='red.500' mb={2}>
							<FiAlertCircle size={24} />
						</Box>
						<Text mb={4} color='red.600' fontWeight='bold'>
							Error al cargar los usuarios: {error.message}
						</Text>
						<Link
							style={{
								background: '#E53E3E',
								color: 'white',
								padding: '8px 16px',
								borderRadius: '4px',
								border: 'none',
								cursor: 'pointer',
							}}
							onClick={() => window.location.reload()}
						>
							Recargar página
						</Link>
					</Box>
				)}

				{isLoading && <Box>Cargando contenido...</Box>}

				{!isLoading && !error && filteredUsers && (
					<VStack py='4' align='start' gap='3'>
						{/* Componente para crear y filtrar usuarios */}
						<CreateAndFilterUser
							search={search}
							setSearch={setSearch}
							handleOpenModal={handleOpenModal}
							isCreateModalOpen={isModalOpen.create}
							setIsModalOpen={setIsModalOpen}
							fetchUsers={fetchUsers}
							handleCloseModal={handleCloseModal}
						/>

						{/* Tabla de usuarios */}

						<UserTable
							users={filteredUsers}
							fetchUsers={fetchUsers}
							handleOpenModal={handleOpenModal}
						/>
					</VStack>
				)}
				

				{/* Modal para editar usuario */}
				<EditUserModal
					fetchUsers={fetchUsers}
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
					isEditModalOpen={isModalOpen.edit}
					setIsModalOpen={setIsModalOpen}
					handleCloseModal={handleCloseModal}
				/>
				{/* Modal para agregar/quitar rol al usuario */}
				<ToogleRoleUserModal
					users={filteredUsers}
					fetchUsers={fetchUsers}
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
					handleCloseModal={handleCloseModal}
					isToogleRoleModalOpen={isModalOpen.toogleRole}
					setIsModalOpen={setIsModalOpen}
				/>
			</Box>
		</>
	);
};
