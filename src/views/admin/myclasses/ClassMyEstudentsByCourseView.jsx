import { useParams } from "react-router";

export const ClassMyEstudentsByCourseView = () => {
  const { id, courseId } = useParams();
  console.log(`ID: ${id}, Course ID: ${courseId}`);
  return (
    <div>
      <h1>Estudiantes del Curso</h1>
    </div>
  )
}