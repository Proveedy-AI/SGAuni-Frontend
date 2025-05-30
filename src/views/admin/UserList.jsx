import { UserTable } from "@/components/tables"
import { Box, Heading, Text, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { CreateAndFilterUser } from "@/components/forms/management/user/CreateAndFilterUser"
import { ViewUserModal } from "@/components/forms/management/user/ViewUserModal"
import { EditUserModal } from "@/components/forms/management/user/EditUserModal"
import { DeleteUserModal } from "@/components/forms/management/user/DeleteUserModal"
import { ToogleRoleUserModal } from "@/components/forms/management/user/ToogleRoleUserModal"
import { useReadUsers } from "@/hooks/users"
import { Link } from "react-router"
import { FiAlertCircle } from "react-icons/fi";

export const UserList = () => {
  const debouncedSearch = null;
  const statusFilter = null;

  const {
		data: dataUsers,
		refetch: fetchUsers,
		isLoading,
		error,
	} = useReadUsers({
		search: debouncedSearch,
		status: statusFilter,
	});

  const [users, setUsers] = useState([]);

  // Actualiza users cuando dataUsers cambie
  useEffect(() => {
    if (dataUsers?.results) setUsers(dataUsers.results);
  }, [dataUsers]);

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
    setIsModalOpen(prev => ({...prev, [modalType]: true }));
  }

  const handleCloseModal = (modalType) => {
    setIsModalOpen(prev => ({...prev, [modalType]: false }));
    setSelectedUser(null);
  }

  // Filtro de búsqueda
  const [search, setSearch] = useState("");
  const filteredUsers = users?.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Heading size={{ xs: 'xs', sm: 'sm', md: 'md', }}>Usuarios</Heading>

      { error && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
          <Box color="red.500" mb={2}>
            <FiAlertCircle size={24} />
          </Box>
          <Text mb={4} color="red.600" fontWeight="bold">
            Error al cargar los usuarios: {error.message}
          </Text>
          <Link
            style={{ background: "#E53E3E", color: "white", padding: "8px 16px", borderRadius: "4px", border: "none", cursor: "pointer"}}
            onClick={() => window.location.reload()}
          >
            Recargar página
          </Link>
        </Box>
      )}

      { isLoading && <Box>Cargando contenido...</Box> }

      { !isLoading && !error && users && (
        <VStack py='4' align='start' gap='3'>
          {/* Componente para crear y filtrar usuarios */}
          <CreateAndFilterUser search={search} setSearch={setSearch} handleOpenModal={handleOpenModal} isCreateModalOpen={isModalOpen.create} setIsModalOpen={setIsModalOpen} setUsers={setUsers} handleCloseModal={handleCloseModal} />

          {/* Tabla de usuarios */}
          <UserTable users={filteredUsers} setUsers={setUsers} handleOpenModal={handleOpenModal} />
        </VStack>
      )}
      


      {/* Modal para ver detalles del usuario - componentes*/}
      <ViewUserModal selectedUser={selectedUser} isViewModalOpen={isModalOpen.view} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal} />

      {/* Modal para editar usuario */}
      <EditUserModal setUsers={setUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser} isEditModalOpen={isModalOpen.edit} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal} />

      {/* Modal para eliminar usuario */}
      <DeleteUserModal selectedUser={selectedUser} setUsers={setUsers} handleCloseModal={handleCloseModal} isDeleteModalOpen={isModalOpen.delete} setIsModalOpen={setIsModalOpen} />

      {/* Modal para agregar/quitar rol al usuario */}
      <ToogleRoleUserModal users={users} setUsers={setUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser} handleCloseModal={handleCloseModal} isToogleRoleModalOpen={isModalOpen.toogleRole} setIsModalOpen={setIsModalOpen} />
    </Box>
  )
}