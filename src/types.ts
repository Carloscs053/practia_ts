// types.ts (CORREGIDO)

// Interfaz para la pregunta de la API (claves en INGLÉS)
export interface PreguntaAPI {
    type: string;
    difficulty: "easy" | "medium" | "hard"; // La API usa inglés
    category: string;
    question: string; 
    correct_answer: string; 
    incorrect_answers: string[]; 
}

// Interfaz para la respuesta completa de la API
export interface RespuestaAPI {
    response_code: number; // <-- Clave en inglés
    results: PreguntaAPI[]; // <-- Clave en inglés
}

// Interfaz para nuestra pregunta "procesada"
// (Esta la controlas tú, puede estar en español)
export interface Pregunta extends PreguntaAPI {
    respuestas: string[];
    // Añadimos las claves en español para usarlas en el resto de la app
    pregunta: string;
    respuesta_correcta: string;
}