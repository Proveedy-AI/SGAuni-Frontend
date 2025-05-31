import { CreateMethod } from "@/components/forms/management/admission/CreateMethod"
import { ViewMethod } from "@/components/forms/management/admission/ViewMethod"
import { AdmissionMethodTable } from "@/components/tables/AdmissionMethodTable"
import { ADMISSION_METHODS } from "@/data"
import { Box, Heading, VStack } from "@chakra-ui/react"
import { useState } from "react"

export const AdmissionMethod = () => {
  const [admissionMethods, setAdmissionMethods] = useState(ADMISSION_METHODS);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState({
    create: false,
    view: false,
    edit: false,
    delete: false
  });

  // Funciones para abrir y cerrar modales
  const handleOpenModal = (modalType, method) => {
    if (method) setSelectedMethod(method);
    setIsModalOpen(prev => ({...prev, [modalType]: true }));
  }

  const handleCloseModal = (modalType) => {
    setIsModalOpen(prev => ({...prev, [modalType]: false }));
    setSelectedUser(null);
  }

  return (
    <Box>
      <Heading size={{ xs: 'xs', sm: 'sm', md: 'md', }}>Usuarios</Heading>
      
      <VStack py='4' align='start' gap='3'>
        <CreateMethod handleOpenModal={handleOpenModal} isCreateModalOpen={isModalOpen.create} setIsModalOpen={setIsModalOpen} />

        <AdmissionMethodTable methods={admissionMethods} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal } />

      </VStack>

      <ViewMethod selectedMethod={selectedMethod} isViewModalOpen={isModalOpen.view} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal} />
    </Box>
  )
}