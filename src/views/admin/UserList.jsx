import { UserTable } from "@/components/tables"
import { Box, Heading, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { USERS } from "@/data"
import { CreateAndFilterUser } from "@/components/forms/management/CreateAndFilterUser"
import { ViewUserModal } from "@/components/forms/management/ViewUserModal"
import { EditUserModal } from "@/components/forms/management/EditUserModal"
import { DeleteUserModal } from "@/components/forms/management/DeleteUserModal"
import { ToogleRoleUserModal } from "@/components/forms/management/ToogleRoleUserModal"

export const UserList = () => {
  const [users, setUsers] = useState(USERS);
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
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Heading size={{ xs: 'xs', sm: 'sm', md: 'md', }}>Usuarios</Heading>
      
      <VStack py='4' align='start' gap='3'>
        {/* Componente para crear y filtrar usuarios */}
        <CreateAndFilterUser search={search} setSearch={setSearch} handleOpenModal={handleOpenModal} isCreateModalOpen={isModalOpen.create} setIsModalOpen={setIsModalOpen} setUsers={setUsers} handleCloseModal={handleCloseModal} />

        {/* Tabla de usuarios */}
        <UserTable users={filteredUsers} setUsers={setUsers} handleOpenModal={handleOpenModal} />
      </VStack>

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