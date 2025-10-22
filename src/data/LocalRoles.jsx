export const ROLES = [
  { 
    label: 'Coordinador Académico', 
    value: 'coordinador_academico',
    permissions: ['view.admission', 'view.applicants.list', 'create.program']
  },
  { 
    label: 'Administrador de cobranzas', 
    value: 'administrador_cobranzas',
    permissions: ['review.payment.orders']
  },
  { 
    label: 'Sistemas', 
    value: 'sistemas',
    permissions: null
  },
  { 
    label: 'Director', 
    value: 'director',
    permissions: ['view.admission', 'view.applicants.list', 'create.program', 'qualify']
  },
  { 
    label: 'Docente', 
    value: 'docente',
    permissions: ['qualify']
  },
]

export const PERMISSIONS = [
  {
    label: 'Ver admisión',
    value: 'view.admission',
    roleType: 'admission'
  },
  {
    label: 'Ver lista de postulantes',
    value:'view.applicants.list ',
    roleType: 'admission'
  },
  {
    label: 'Crear programa de admisión',
    value:'create.program',
    roleType: 'admission'
  },
  {
    label: 'Calificar',
    value:'qualify',
    roleType: 'admission'
  },
  {
    label: 'Ver matrícula',
    value:'view.registration',
    roleType: 'registration'
  },
  {
    label: 'Ver lista de matrículas',
    value:'view.registration.list',
    roleType: 'registration'
  },
  {
    label: 'Revisar órdenes de pago',
    value:'review.payment.orders',
    roleType: 'registration'
  },
  {
    label: 'Aprobar matrícula',
    value:'approve.registration',
    roleType: 'registration'
  },
  {
    label: 'Ver horarios',
    value:'view.schedules',
    roleType: 'schedules'
  },
]