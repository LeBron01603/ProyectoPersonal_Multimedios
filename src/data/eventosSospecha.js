// =========================================================
// eventosSospecha.js — Eventos interactivos de sospecha nocturna/civil
// =========================================================

export const EVENTOS_SOSPECHA = [
  {
    id: 'sus-001',
    texto: 'Un compañero nota que siempre desapareces cuando aparece el Héroe del After en las noticias y te bromea diciendo: "¿No serás vos el héroe?".',
    opciones: [
      {
        texto: 'Invitarlo a estudiar a la biblioteca para demostrar que eres un estudiante común.',
        consecuencia: '¡Acepta! Estudiaron duro. Disipaste los rumores y mejoraste tu responsabilidad.',
        modificaciones: { sospechaIdentidad: -10, responsabilidad: 5 }
      },
      {
        texto: 'Inventar la excusa de que tienes un trabajo de medio tiempo nocturno.',
        consecuencia: 'Te cree a medias, pero deja de preguntar por hoy. Al menos desviaste la sospecha.',
        modificaciones: { sospechaIdentidad: -5 }
      },
      {
        texto: 'Ignorar el comentario y reírte de manera nerviosa.',
        consecuencia: 'Tu risa nerviosa lo deja con serias dudas. Los rumores aumentan en la facultad.',
        modificaciones: { sospechaIdentidad: 10 }
      }
    ]
  },
  {
    id: 'sus-002',
    texto: 'Un profesor nota tus constantes bostezos y te pregunta con severidad sobre tus ausencias de la noche anterior.',
    opciones: [
      {
        texto: 'Mentir y decir que trabajas de noche para pagar tus estudios.',
        consecuencia: 'Se solidariza con tu situación y te disculpa, reduciendo sospechas y ganando simpatía intelectual.',
        modificaciones: { sospechaIdentidad: -10, conocimiento: 5 }
      },
      {
        texto: 'Prometerle que te esforzarás más y te acostarás temprano.',
        consecuencia: 'Agradece tu compromiso estudiantil. Te da consejos y sube tu responsabilidad.',
        modificaciones: { sospechaIdentidad: -5, responsabilidad: 5 }
      },
      {
        texto: 'Quedarte dormido en medio de su regaño.',
        consecuencia: '¡Qué vergüenza! Te echa de la clase. Perdiste energía, responsabilidad y subió la sospecha.',
        modificaciones: { sospechaIdentidad: 15, responsabilidad: -10, energia: -5 }
      }
    ]
  },
  {
    id: 'sus-003',
    texto: 'Alguien escribe en el grupo de WhatsApp de tu carrera que un "estudiante parecido a vos" fue visto salvando un after en Barrio Escalante.',
    opciones: [
      {
        texto: 'Responder con argumentos lógicos desmintiendo que fueras vos.',
        consecuencia: 'La seriedad de tu texto calma los rumores, aunque te costó algo de diversión social.',
        modificaciones: { sospechaIdentidad: -10, diversion: -5 }
      },
      {
        texto: 'Mandar un meme burlándote de los "superhéroes ticos".',
        consecuencia: '¡Todos se ríen! La atención se desvía del rumor hacia el chiste.',
        modificaciones: { sospechaIdentidad: -5, diversion: 5 }
      },
      {
        texto: 'Salir del grupo de WhatsApp sin dar explicaciones.',
        consecuencia: 'Tu extraña reacción hace que sospechen aún más. Tu reputación cae.',
        modificaciones: { sospechaIdentidad: 15, reputacionNocturna: -5 }
      }
    ]
  },
  {
    id: 'sus-004',
    texto: 'Tu mejor amigo te nota extremadamente ojeroso y te interroga seriamente preocupado por tu salud.',
    opciones: [
      {
        texto: 'Decirle que estás entrenando duro para tu actividad física.',
        consecuencia: 'Se alegra por tu disciplina y promete no contarlo para no preocupar a tus profesores.',
        modificaciones: { sospechaIdentidad: -10, energia: 5 }
      },
      {
        texto: 'Decirle que la carga académica te tiene sin dormir.',
        consecuencia: 'Se ofrece a ayudarte con las tareas de la semana, subiendo tu responsabilidad.',
        modificaciones: { sospechaIdentidad: -5, responsabilidad: 5 }
      },
      {
        texto: 'Reaccionar de forma molesta y decirle que no se meta en tus asuntos.',
        consecuencia: 'Se ofende por tu agresividad y se distancia, lo que aumenta las sospechas de que ocultas algo.',
        modificaciones: { sospechaIdentidad: 10, diversion: -5 }
      }
    ]
  }
]
