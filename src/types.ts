


export interface PreguntaAPI {
    type: string;
    difficulty: "easy" | "medium" | "hard"; 
    category: string;
    question: string; 
    correct_answer: string; 
    incorrect_answers: string[]; 
}

// Interfaz para la respuesta completa de la API
export interface RespuestaAPI {
    response_code: number; 
    results: PreguntaAPI[]; 
}


export interface Pregunta extends PreguntaAPI {
    respuestas: string[];
    
    pregunta: string;
    respuesta_correcta: string;
}