import type { Patient, Message, Visit } from './types';

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
            visitHistory: [
                { date: '2023-10-15T10:00:00Z', summary: 'Consulta inicial post-operatoria. Se retiran suturas.' },
                { date: '2023-10-08T14:30:00Z', summary: 'Cirugía de reemplazo de rodilla.' },
            ],
            phone: '+1234567890',
            email: 'carlos.r@example.com',
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
            visitHistory: [
                { date: '2023-10-18T09:00:00Z', summary: 'Revisión de quemadura. Se observa buena evolución.' },
                { date: '2023-10-12T17:00:00Z', summary: 'Atención inicial por quemadura con líquido caliente.' },
            ],
            email: 'ana.torres@example.com',
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
            visitHistory: [
                { date: '2023-10-10T11:30:00Z', summary: 'Curación y evaluación de úlcera. Se ajusta tratamiento.' },
                { date: '2023-10-03T11:00:00Z', summary: 'Control de pie diabético, detección de úlcera.' },
                { date: '2023-09-25T10:30:00Z', summary: 'Consulta de rutina para diabetes.' },
            ],
            phone: '+0987654321',
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
            text: `**Análisis de Reporte del Paciente**

**1. Resumen del Reporte del Paciente:**
*   El paciente envía una foto de seguimiento de su cicatriz post-quirúrgica en la rodilla.

**2. Observaciones Detalladas de la Imagen:**
*   **Morfología y Coloración:** Se observa una incisión lineal, con una coloración rosada a lo largo de la cicatriz, lo cual es consistente con tejido en fase de maduración. La piel perilesional no muestra eritema significativo.
*   **Bordes de la Herida:** Los bordes están completamente afrontados y cerrados. No hay signos de dehiscencia.
*   **Signos de Inflamación/Infección:** No hay signos evidentes de inflamación, como hinchazón, enrojecimiento excesivo o calor. No se observa exudado purulento.
*   **Tejido Circundante:** La piel alrededor de la incisión parece sana e intacta.

**3. Contexto Clínico y Posibles Consideraciones:**
*   El estado de la herida corresponde a una fase de remodelación o maduración de la cicatrización, esperable para el tiempo postoperatorio.

**4. Recomendaciones Generales de Cuidado (No prescriptivas):**
*   Continuar manteniendo la zona limpia y seca.
*   Proteger la cicatriz de la exposición solar directa para evitar hiperpigmentación.
*   Realizar suaves masajes (si el médico lo ha indicado) para mejorar la flexibilidad.

**5. Signos de Alarma (Cuándo consultar de inmediato):**
*   Aparición de enrojecimiento que se expande, dolor intenso, supuración o fiebre.

**Disclaimer:**
**Importante:** Este es un análisis preliminar generado por IA. **No sustituye el juicio clínico ni una consulta médica profesional.** El diagnóstico y tratamiento deben ser realizados por un profesional de la salud cualificado.`,
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