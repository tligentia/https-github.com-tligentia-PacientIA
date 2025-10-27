import type { Patient, Message } from '../types';

export const mockPatients: Patient[] = [
    {
        id: '1',
        name: 'Carlos Ramirez',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Antonio_Banderas_Deauville_2014.jpg/800px-Antonio_Banderas_Deauville_2014.jpg',
        lastMessage: 'Aquí está la foto de hoy. ¿Cómo la ve?',
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        details: {
            age: 45,
            condition: 'Herida post-quirúrgica (rodilla)',
            // FIX: Replaced 'lastVisit' with 'visitHistory' to match the 'Patient' type.
            visitHistory: [{ date: '2023-10-15', summary: 'Consulta de seguimiento' }],
        },
    },
    {
        id: '2',
        name: 'Ana Torres',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Pen%C3%A9lope_Cruz_at_the_2023_Goya_Awards.jpg/800px-Pen%C3%A9lope_Cruz_at_the_2023_Goya_Awards.jpg',
        lastMessage: 'Buenos días, doctor. La hinchazón ha bajado un poco.',
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        details: {
            age: 32,
            condition: 'Quemadura de segundo grado (brazo)',
            // FIX: Replaced 'lastVisit' with 'visitHistory' to match the 'Patient' type.
            visitHistory: [{ date: '2023-10-18', summary: 'Consulta de seguimiento' }],
        },
    },
    {
        id: '3',
        name: 'Jorge Mendoza',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Morgan_Freeman_2012.jpg/800px-Morgan_Freeman_2012.jpg',
        lastMessage: 'Sigo con la molestia al caminar.',
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        details: {
            age: 68,
            condition: 'Úlcera de pie diabético',
            // FIX: Replaced 'lastVisit' with 'visitHistory' to match the 'Patient' type.
            visitHistory: [{ date: '2023-10-10', summary: 'Consulta de seguimiento' }],
        },
    },
];

export const mockMessages: Record<string, Message[]> = {
    '1': [
        {
            id: '101',
            text: 'Hola Doctor, le envío la foto de la cicatriz como me pidió.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            userType: 'patient',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Knee_replacement_incision_14_days_after_surgery.jpg/640px-Knee_replacement_incision_14_days_after_surgery.jpg'
        },
        {
            id: '102',
            text: `**Análisis de IA:**

**Resumen del Paciente:**
- El paciente envía una foto de su cicatriz post-quirúrgica.

**Observaciones de la Imagen:**
- **Coloración:** Tonalidad rosada, consistente con tejido de cicatrización. No se observa enrojecimiento excesivo en los alrededores.
- **Signos de Inflamación:** No hay signos evidentes de hinchazón o supuración.
- **Bordes de la Herida:** Los bordes están bien definidos y cerrados. La línea de la incisión es limpia.
- **Exudado/Secreción:** No se observa secreción.
- **Tejido Circundante:** La piel alrededor parece sana.

**Conclusión Preliminar:**
- La herida muestra un proceso de cicatrización normal y sin complicaciones aparentes.

**Descargo de Responsabilidad:** Este es un análisis preliminar generado por IA y no sustituye una consulta médica profesional.
`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 10000).toISOString(),
            userType: 'ai',
        },
        {
            id: '103',
            text: 'Gracias, Carlos. La evolución parece muy favorable. Continuemos con los cuidados indicados y envíeme una nueva foto en 2 días.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5).toISOString(),
            userType: 'doctor',
        },
         {
            id: '104',
            text: 'Aquí está la foto de hoy. ¿Cómo la ve?',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            userType: 'patient',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Total_knee_replacement_scar_3_weeks_after_surgery.jpg/640px-Total_knee_replacement_scar_3_weeks_after_surgery.jpg'
        },
    ],
    '2': [
         {
            id: '201',
            text: 'Doctor, así va la quemadura.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            userType: 'patient',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Second-degree_burn.jpg/640px-Second-degree_burn.jpg'
        },
         {
            id: '202',
            text: 'Buenos días, Ana. Veo que se está formando una nueva capa de piel. ¿Siente mucho dolor o picazón?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
            userType: 'doctor',
        },
         {
            id: '203',
            text: 'Buenos días, doctor. La hinchazón ha bajado un poco. La picazón es leve.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            userType: 'patient',
        },
    ],
    '3': [],
};