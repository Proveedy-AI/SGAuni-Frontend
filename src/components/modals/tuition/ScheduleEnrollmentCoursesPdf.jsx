import { CoursesByPeriodDocument } from '@/components/pdf';
import { Button, ModalSimple } from '@/components/ui';
import { useReadCurriculumMaps } from '@/hooks/curriculum_maps';
import { useReadCurriculumMapsCourses } from '@/hooks/curriculum_maps_courses';
import { Stack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

export const ScheduleEnrollmentCoursesPdf = ({ program, allCourseGroups }) => {
  const [open, setOpen] = useState(false);

  const { data: curriculumMap } = useReadCurriculumMaps(
    { program: program?.program, is_current: true },
    {
      enabled: open && !!program?.program,
    }
  )

  const curriculumMapId = curriculumMap?.results?.[0]?.id;

  const { data: dataCurriculumMapCourses } = useReadCurriculumMapsCourses(
    { curriculum_map: curriculumMapId },
    { enabled: !!curriculumMapId }
  );

  const uniqueApprovedCourses = [];
  const seenNames = new Set();

  allCourseGroups
    .filter(c => c.status_review === 4)
    .forEach(c => {
      if (!seenNames.has(c.course_name)) {
        seenNames.add(c.course_name);
        uniqueApprovedCourses.push(c);
      }
    });

  const coursesByCycle = uniqueApprovedCourses.reduce((acc, course) => {
    const cycle = course.cycle;
    if (!acc[cycle]) acc[cycle] = [];
    // Buscar el curso en dataCurriculumMapCourses para obtener los prerrequisitos
    const curriculumCourse = dataCurriculumMapCourses?.results?.find(
      cmc => cmc.course_name === course.course_name
    );
    
    const prerequisite = curriculumCourse?.prerequisite.map(pr => {
      const prereqCourse = dataCurriculumMapCourses?.results?.find(c => c.course_code === pr);
      return `${prereqCourse?.course_code} - ${prereqCourse?.course_name}`;
    }) || [];

    acc[cycle].push({
      course_name: course.course_name,
      courses_code: curriculumCourse?.course_code,
      credits: course.credits,
      is_mandatory: course.is_mandatory,
      prerequisite: prerequisite,
    });
    return acc;
  }, {});

  return (
    <ModalSimple
      title="Documento de Cursos Aprobados"
      placement='center'
      trigger={
        <Button variant='outline' colorPalette='blue' size='xs'>
         <FaDownload /> Cursos Aprobados
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='6xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <CoursesByPeriodDocument program={program} coursesByCycle={coursesByCycle} />
      </Stack>
    </ModalSimple>
  )
};

ScheduleEnrollmentCoursesPdf.propTypes = {
  program: PropTypes.object.isRequired,
  allCourseGroups: PropTypes.array.isRequired,
}

