import { useParams } from "react-router";

export const EnrolledCourseGroupsView = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Course Groups for Program ID: {id}</h1>
    </div>
  )
}