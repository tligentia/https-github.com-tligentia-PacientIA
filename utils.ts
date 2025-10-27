/**
 * Convierte un string con formato simple de markdown (negritas y saltos de línea) a un objeto para dangerouslySetInnerHTML.
 * @param text - El texto a formatear.
 * @returns Un objeto con la clave __html conteniendo el HTML.
 */
export const parseTextToHTML = (text: string) => {
    const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const withLineBreaks = bolded.replace(/\n/g, '<br />');
    return { __html: withLineBreaks };
};

/**
 * Convierte un objeto File a una cadena de texto en formato Base64 (Data URL).
 * @param file - El archivo a convertir.
 * @returns Una promesa que se resuelve con la cadena de texto en Base64.
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

/**
 * Formatea una fecha a un formato 'DD de MMMM, YYYY' en español.
 * @param dateString - La fecha en formato string.
 * @returns La fecha formateada.
 */
export const formatDateToSpanish = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    // Get month name in Spanish
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    // Capitalize the first letter of the month
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    return `${day} de ${capitalizedMonth}, ${year}`;
};

/**
 * Encodes raw audio bytes into a Base64 string.
 * @param bytes The Uint8Array containing audio data.
 * @returns The Base64 encoded string.
 */
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a Base64 string into raw audio bytes.
 * @param base64 The Base64 encoded string.
 * @returns A Uint8Array containing the audio data.
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converts raw PCM audio data into an AudioBuffer.
 * @param data The raw audio data as a Uint8Array.
 * @param ctx The AudioContext to use for creating the buffer.
 * @param sampleRate The sample rate of the audio.
 * @param numChannels The number of audio channels.
 * @returns A Promise that resolves to an AudioBuffer.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Generates initials from a full name.
 * @param name - The full name string.
 * @returns A string with the initials (e.g., "CR" for "Carlos Ramirez").
 */
export const getInitials = (name: string): string => {
    if (!name || typeof name !== 'string' || name.trim() === '') return '?';
    const names = name.trim().split(' ').filter(Boolean);
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    }
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};