import type { Language, MessageStyle, Situation } from "@/types";

type StyleAlts = Record<MessageStyle, string[]>;
type LangAlts = Record<Language, StyleAlts>;

/** Alternate phrasings used when regenerating (seed > 0). */
export const SITUATION_VARIATIONS: Partial<Record<Situation, LangAlts>> = {
  "running-late": {
    english: {
      short: [
        "About 15 min behind — on my way now.",
        "Running a bit late. Heading over.",
        "Running ~10 min late — sorry, omw.",
      ],
      natural: [
        "Just a heads up — I'm about 15 minutes behind. Still on my way, sorry!",
        "Wanted to let you know I'm running late. Should be there soon.",
        "Hey — running behind. ETA in about 15 min. Thanks for waiting!",
      ],
      professional: [
        "I'm running approximately 15 minutes behind schedule and am en route. Thank you for your patience.",
        "Please note I am delayed by roughly 15 minutes. I apologize and am on my way.",
        "I am delayed by about 15 minutes and am currently en route. Thank you for your understanding.",
      ],
    },
    spanish: {
      short: [
        "Voy unos 15 min tarde — ya voy.",
        "Llego un poco tarde. En camino.",
      ],
      natural: [
        "Te aviso que voy como 15 minutos tarde. Ya voy, ¡perdón!",
        "Quería avisarte que me retrasé un poco. Llego pronto.",
      ],
      professional: [
        "Lamento informar que voy con unos 15 minutos de retraso. Ya estoy en camino.",
        "Le informo que me encuentro retrasado/a unos 15 minutos. Disculpe las molestias.",
      ],
    },
    spanglish: {
      short: [
        "Like 15 min behind — on my way.",
        "Running un poco late. Heading over.",
      ],
      natural: [
        "Heads up — voy like 15 min late. Still on my way, sorry!",
        "Quería avisarte I'm running late. Llego pronto.",
      ],
      professional: [
        "Running like 15 min behind schedule y en route. Thanks por la paciencia.",
        "Delayed unos 15 min. Sorry y on my way.",
      ],
    },
  },
  cancel: {
    english: {
      short: ["Can't make it today. Sorry!", "Need to cancel today — my apologies.", "Have to bail today — sorry!"],
      natural: [
        "I'm sorry but I have to cancel today. Something came up — hope we can reschedule.",
        "Unfortunately I can't make it today. Last-minute thing came up.",
        "Hey — I need to cancel today. Sorry for the short notice. Rain check?",
      ],
      professional: [
        "I must cancel today's commitment due to an unforeseen conflict. I apologize for the inconvenience.",
        "I regret that I am unable to attend today. Please accept my sincere apologies.",
        "I need to cancel today due to a scheduling conflict. I apologize and am happy to reschedule.",
      ],
    },
    spanish: {
      short: ["No puedo hoy. ¡Perdón!", "Tengo que cancelar hoy — disculpa."],
      natural: [
        "Lo siento, hoy no puedo. Surgió algo — ojalá reprogramemos.",
        "Lamentablemente no puedo hoy. Fue de último momento.",
      ],
      professional: [
        "Debo cancelar el compromiso de hoy por un conflicto imprevisto. Disculpe las molestias.",
        "Lamento no poder asistir hoy. Acepte mis sinceras disculpas.",
      ],
    },
    spanglish: {
      short: ["No puedo today. Sorry!", "Need to cancel hoy — my apologies."],
      natural: [
        "Sorry pero tengo que cancel hoy. Algo salió — hope reschedule.",
        "Unfortunately no puedo today. Last-minute thing.",
      ],
      professional: [
        "Debo cancel today's commitment por un conflict. Sorry por las molestias.",
        "Lamento no poder attend hoy. Please accept mis disculpas.",
      ],
    },
  },
  reschedule: {
    english: {
      short: ["Can we move this to another day?", "Rain check? Need to reschedule.", "Can we push this to later this week?"],
      natural: [
        "Any chance we can pick a different day? Something came up on my end.",
        "Would you be open to rescheduling? I want to make sure we still connect.",
        "Mind if we move this? Something popped up — still want to make it happen.",
      ],
      professional: [
        "I would like to request rescheduling due to a scheduling conflict. Please share your availability.",
        "May we arrange an alternative time? I am flexible and happy to accommodate your schedule.",
        "Could we reschedule? I have a conflict and would appreciate another time that works for you.",
      ],
    },
    spanish: {
      short: ["¿Lo movemos a otro día?", "¿Lo dejamos para después?"],
      natural: [
        "¿Hay chance de otro día? Me salió algo.",
        "¿Te parece reprogramar? Quiero que nos veamos igual.",
      ],
      professional: [
        "Me gustaría solicitar reprogramar por un conflicto de horario. ¿Cuál es tu disponibilidad?",
        "¿Podemos acordar otro horario? Tengo flexibilidad para adaptarme.",
      ],
    },
    spanglish: {
      short: ["¿Move to otro día?", "¿Rain check? Need reschedule."],
      natural: [
        "¿Any chance otro día? Algo salió on my end.",
        "¿Open to reschedule? Quiero que still connect.",
      ],
      professional: [
        "Me gustaría request reschedule por scheduling conflict. Share tu availability.",
        "¿Arrange alternative time? Flexible para accommodate tu schedule.",
      ],
    },
  },
  apologize: {
    english: {
      short: ["I'm sorry. That was on me.", "My bad — I apologize.", "Sorry — I messed up."],
      natural: [
        "I've been thinking about it and I owe you an apology. I didn't handle that well.",
        "I want to say sorry. I know I messed up and I'll do better.",
        "Hey — I owe you an apology. That wasn't fair to you and I'm sorry.",
      ],
      professional: [
        "Please accept my sincere apology. I take full responsibility and am committed to improving.",
        "I apologize for my actions. I understand the impact and will ensure this does not recur.",
        "I sincerely apologize for my mistake and take responsibility for the inconvenience caused.",
      ],
    },
    spanish: {
      short: ["Lo siento. Fue mi culpa.", "Perdón — la regué."],
      natural: [
        "Lo he pensado y te debo una disculpa. No lo manejé bien.",
        "Quiero pedir perdón. Sé que la regué y voy a mejorar.",
      ],
      professional: [
        "Acepta mis sinceras disculpas. Asumo la responsabilidad y me comprometo a mejorar.",
        "Me disculpo por mis acciones. Entiendo el impacto y evitaré que se repita.",
      ],
    },
    spanglish: {
      short: ["Sorry. Fue my fault.", "My bad — apologize."],
      natural: [
        "Lo pensé y te debo una apology. No lo handled bien.",
        "Quiero say sorry. Sé que messed up y voy a improve.",
      ],
      professional: [
        "Please accept mis sincere disculpas. Full responsibility y committed a improve.",
        "Apologize por mis actions. Entiendo el impact y no va a recur.",
      ],
    },
  },
  "dont-want-to-go": {
    english: {
      short: ["Gonna sit this one out.", "Not feeling up to it tonight.", "Gonna pass tonight — thanks though!"],
      natural: [
        "I think I'm gonna pass tonight. Pretty wiped and need to recharge — rain check?",
        "Honestly not feeling up to going out. Hope that's okay!",
        "I'm gonna skip tonight — long day and need to rest. Hope we can do another time!",
      ],
      professional: [
        "I won't be able to attend tonight. I appreciate the invitation and hope to join another time.",
        "I regret that I cannot make it this evening. Thank you for understanding.",
        "I must decline tonight due to prior commitments. Thank you for the invitation.",
      ],
    },
    spanish: {
      short: ["Me lo salto esta vez.", "No me provoca salir hoy."],
      natural: [
        "Creo que paso esta noche. Estoy cansado/a — ¿lo dejamos para después?",
        "La verdad no me provoca salir. ¡Espero que esté bien!",
      ],
      professional: [
        "No podré asistir esta noche. Agradezco la invitación y espero ir otra vez.",
        "Lamento no poder ir esta noche. Gracias por entender.",
      ],
    },
    spanglish: {
      short: ["Gonna sit this one out.", "No me provoca salir tonight."],
      natural: [
        "Creo que pass tonight. Pretty wiped — ¿rain check?",
        "Honestly no me provoca salir. Hope está bien!",
      ],
      professional: [
        "No podré attend tonight. Appreciate la invite y hope join otra time.",
        "Lamento no poder make it this evening. Thanks por entender.",
      ],
    },
  },
  work: {
    english: {
      short: ["Need to handle something at work today.", "Taking time for a work matter.", "Tied up with work — back soon."],
      natural: [
        "I have a work thing I need to take care of today. I'll be back online as soon as I can.",
        "Something came up at work — I'll be tied up for a bit but will update you.",
        "Got pulled into something at work. I'll message you when I'm free.",
      ],
      professional: [
        "I need to address a work-related matter today and will be temporarily unavailable.",
        "I am attending to a professional obligation and will follow up upon my return.",
        "I am handling a work matter and will respond as soon as I am available.",
      ],
    },
    spanish: {
      short: ["Tengo un asunto de trabajo hoy.", "Me ocupo de algo del trabajo."],
      natural: [
        "Tengo algo del trabajo que atender hoy. Vuelvo en cuanto pueda.",
        "Surgió algo en el trabajo — estaré ocupado/a un rato pero te aviso.",
      ],
      professional: [
        "Debo atender un asunto laboral hoy y estaré temporalmente no disponible.",
        "Estoy atendiendo una obligación profesional y haré seguimiento al regresar.",
      ],
    },
    spanglish: {
      short: ["Work matter hoy.", "Taking time para algo del trabajo."],
      natural: [
        "Tengo work thing hoy. Back online ASAP.",
        "Algo salió at work — tied up un rato pero te update.",
      ],
      professional: [
        "Need address work matter hoy — temporarily unavailable.",
        "Attending professional obligation — follow up al regresar.",
      ],
    },
  },
  school: {
    english: {
      short: ["Won't be in class today.", "Missing class — will catch up."],
      natural: [
        "I won't make it to class today. I'll get notes from someone and catch up on the work.",
        "Can't be in class today — I'll make sure to get caught up on everything.",
      ],
      professional: [
        "I will be absent from class today and will review all covered material promptly.",
        "I am unable to attend class today. I will obtain notes and complete any missed assignments.",
      ],
    },
    spanish: {
      short: ["No voy a clase hoy.", "Falto hoy — me pongo al día."],
      natural: [
        "No llego a clase hoy. Pido apuntes y me pongo al día.",
        "No puedo ir a clase — me aseguro de ponerme al corriente.",
      ],
      professional: [
        "Estaré ausente de clase hoy y revisaré el material a la brevedad.",
        "No podré asistir a clase hoy. Obtendré apuntes y completaré las tareas.",
      ],
    },
    spanglish: {
      short: ["No voy a class hoy.", "Missing class — catch up."],
      natural: [
        "No make it to class hoy. Get notes y catch up.",
        "Can't be in class hoy — get caught up en todo.",
      ],
      professional: [
        "Absent de class hoy — review material promptly.",
        "Unable to attend class hoy. Get notes y complete assignments.",
      ],
    },
  },
  family: {
    english: {
      short: ["Thinking of you!", "Love you — talk soon.", "Just checking in ❤️"],
      natural: [
        "Just wanted to check in and say I'm thinking of you. Hope you're doing well!",
        "Hey, love you and hope you're having a good day.",
        "Wanted to say hi — thinking of you and hope today is treating you well.",
      ],
      professional: [
        "I wanted to reach out and let you know you're on my mind. I hope all is well.",
        "I hope you're doing well. Please let me know if you need anything.",
        "I wanted to check in and wish you a good day. Please reach out if I can help.",
      ],
    },
    spanish: {
      short: ["¡Pensando en ti!", "Te quiero — hablamos pronto."],
      natural: [
        "Solo quería saludar y decir que pienso en ti. ¡Espero que estés bien!",
        "Oye, te quiero y espero que tengas buen día.",
      ],
      professional: [
        "Quería comunicarme y decirte que estás en mis pensamientos. Espero que todo vaya bien.",
        "Espero que estés bien. Avísame si necesitas algo.",
      ],
    },
    spanglish: {
      short: ["¡Thinking of you!", "Te quiero — talk soon."],
      natural: [
        "Solo quería check in — thinking of you. Hope estés bien!",
        "Hey, love you y hope buen día.",
      ],
      professional: [
        "Quería reach out — estás on my mind. Hope todo bien.",
        "Hope estés bien. Avísame si necesitas algo.",
      ],
    },
  },
  dating: {
    english: {
      short: ["Had a great time!", "Really enjoyed tonight 😊", "Fun night — thanks!"],
      natural: [
        "I had a really nice time. Would love to see you again — let me know when you're free!",
        "Great hanging out! You're easy to talk to. Let's do it again soon.",
        "Really enjoyed tonight. I'd love to hang out again — what does your week look like?",
      ],
      professional: [
        "Thank you for a lovely evening. I would welcome the chance to see you again.",
        "I genuinely enjoyed our time together and would like to plan another date.",
        "I appreciated our time together and would be happy to plan another outing.",
      ],
    },
    spanish: {
      short: ["¡La pasé genial!", "Disfruté mucho esta noche 😊"],
      natural: [
        "La pasé muy bien. Me encantaría verte de nuevo — ¡avísame!",
        "¡Genial salir! Es fácil hablar contigo. Repetimos pronto.",
      ],
      professional: [
        "Gracias por una noche encantadora. Me encantaría verte otra vez.",
        "Disfruté de verdad nuestro tiempo juntos y me gustaría planear otra cita.",
      ],
    },
    spanglish: {
      short: ["¡Great time!", "Really enjoyed tonight 😊"],
      natural: [
        "Really nice time. Would love verte again — avísame!",
        "Great hanging out! Easy to talk contigo. Repetimos soon.",
      ],
      professional: [
        "Thanks por lovely evening. Welcome chance verte again.",
        "Genuinely enjoyed nuestro time — me gustaría plan otra date.",
      ],
    },
  },
};

export function pickVariation(
  situation: Situation,
  style: MessageStyle,
  language: Language,
  seed: number,
): string | null {
  const alts = SITUATION_VARIATIONS[situation]?.[language]?.[style];
  if (!alts || alts.length === 0) return null;
  return alts[(seed - 1) % alts.length] ?? alts[0];
}
