// Ejemplo de uso del GenerateRegistrationPdfModal
import { GenerateRegistrationPdfModal } from '@/components/modals/procedures/GenerateRegistrationPdfModal';

// Datos de ejemplo
const registration_info = {
  program_enrollment: "MAESTRÍA EN GERENCIA PÚBLICA",
  student_full_name: "QUINTANILLA CAYLLAHUA WILFREDO EZEQUIEL",
  courses_groups: [
    {
      cycle: "2",
      group_code: "GP-020",
      course_name: "ORGANIZACIÓN ESTRATÉGICA",
      credits: 2,
    },
    {
      cycle: "2",
      group_code: "GP-021",
      course_name: "SISTEMAS DE CONTROL",
      credits: 2,
    },
    {
      cycle: "2",
      group_code: "GP-022",
      course_name: "REFORMA Y MODERNIZACIÓN DEL ESTADO",
      credits: 2,
    },
    {
      cycle: "2",
      group_code: "GP-023",
      course_name: "DESARROLLO SOSTENIBLE Y GESTIÓN PÚBLICA",
      credits: 2,
    },
    {
      cycle: "2",
      group_code: "GP-024",
      course_name: "TEORÍA DEL DERECHO",
      credits: 2,
    },
    {
      cycle: "2",
      group_code: "GP-025",
      course_name: "METODOLOGÍA DE INVESTIGACIÓN CIENTÍFICA II",
      credits: 2,
    },
  ],
  total_courses: 6,
  total_credits: 12,
};

// Uso en un componente
export const ExampleUsage = () => {
  return (
    <div>
      <h1>Ejemplo de Boleta de Matrícula</h1>
      <GenerateRegistrationPdfModal registration_info={registration_info} />
    </div>
  );
};

export default ExampleUsage;
