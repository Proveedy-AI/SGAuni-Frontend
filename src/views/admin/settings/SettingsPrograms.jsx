import { CreateProgram } from "@/components/forms/management/programs/CreateProgram";
import { DeleteProgram } from "@/components/forms/management/programs/DeleteProgram";
import { EditProgram } from "@/components/forms/management/programs/EditProgram";
import { ViewProgram } from "@/components/forms/management/programs/ViewProgram";
import { ProgramTable } from "@/components/tables/ProgramTable";
import { PROGRAMS, COORDINADORES } from "@/data/LocalPrograms"
import { Box, Heading, VStack } from "@chakra-ui/react";
import { useState } from "react";

export const SettingsPrograms = () => {
  const [programs, setPrograms] = useState(PROGRAMS);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState({
    create: false,
    view: false,
    edit: false,
    delete: false,
  });

  // Abre un modal y, opcionalmente, establece el programa seleccionado
  const handleOpenModal = (modalType, program) => {
    if (program) setSelectedProgram(program);
    setIsModalOpen((prev) => ({ ...prev, [modalType]: true }));
  };

  // Cierra un modal y limpia el programa seleccionado
  const handleCloseModal = (modalType) => {
    setIsModalOpen((prev) => ({ ...prev, [modalType]: false }));
    setSelectedProgram(null);
  };

  return (
     <Box>
      <Heading size={{ base: "sm", md: "md" }} mb={4}>
        Programas de Postgrado
      </Heading>

      <VStack py="4" align="start" gap="4">
        {/* Botón y modal para crear un nuevo programa */}
        <CreateProgram setPrograms={setPrograms} handleOpenModal={handleOpenModal} isCreateModalOpen={isModalOpen.create} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal} />

        {/* Tabla de programas con paginación, switch de estado y acciones */}
        <ProgramTable programs={programs} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal}/>
      </VStack>

      {/* Modal para ver un programa */}
      <ViewProgram selectedProgram={selectedProgram} isViewModalOpen={isModalOpen.view} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal}/>

      {/* Modal para editar un programa */}
      <EditProgram setPrograms={setPrograms} selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} isEditModalOpen={isModalOpen.edit} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal} />

      {/* Modal para eliminar un programa */}
      <DeleteProgram selectedProgram={selectedProgram} setPrograms={setPrograms} isDeleteModalOpen={isModalOpen.delete} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal}/>
    </Box>
  );
}
