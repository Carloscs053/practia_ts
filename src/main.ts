import './style.css'
import { type PreguntaAPI, type Pregunta } from './types';
import he from 'he';

const quizContainer = document.getElementById('quiz-container') as HTMLDivElement;
const questionCounter = document.getElementById('question-counter') as HTMLParagraphElement;
const questionText = document.getElementById('question-text') as HTMLHeadingElement;
const answerContainer = document.getElementById('answers-container') as HTMLDivElement;
const constrolsContainer = document.getElementById('constrols-container') as HTMLDivElement;
const finalScore = document.getElementById('final-score') as HTMLParagraphElement;
const startButton = document.getElementById('start-button') as HTMLButtonElement;
const loadingIndicator = document.getElementById('loading-indicator') as HTMLParagraphElement;

let preguntas: Pregunta[] = [];
let puntuacion: number = 0;
let indicePreguntaActual: number = 0;
const PREGUNTAS_TOTALES: number = 10;

async function getPreguntasYProcesado(): Promise<Pregunta[]> {
    enseñarCargando(true)
    const baseUrl: string = `https://opentdb.com/api.php?amount=${PREGUNTAS_TOTALES}`

    try {
        const response: Response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Error en la API')
        
        const data = await response.json();

        const preguntasProcesadas: Pregunta[] = data.results.map((preguntaAPI: PreguntaAPI) => {
            const respuestas = [
                ...preguntaAPI.incorrect_answers.map(ans => he.decode(ans)),
                he.decode(preguntaAPI.correct_answer)
            ]

            return {
                ...preguntaAPI,
                pregunta: he.decode(preguntaAPI.question),
                respuesta_correcta: he.decode(preguntaAPI.correct_answer),
                respuestas_incorrectas: preguntaAPI.incorrect_answers.map(ans => he.decode(ans)),
                respuestas: respuestas
            }
        })

        console.log(preguntasProcesadas)

        return preguntasProcesadas
    } catch (error) {
        console.error('Falló el fetch: ', error)
        return []
    } finally {
        enseñarCargando(false)
    }
}

function cargarPregunta() {
    const pregunta = preguntas[indicePreguntaActual]
    if (!pregunta) return

    
        //quizContainer.classList.remove('hidden')
        //constrolsContainer.classList.add('hidden')

        questionText.textContent = pregunta.pregunta
        questionCounter.textContent = `Pregunta ${indicePreguntaActual + 1} / ${preguntas.length}`
        answerContainer.innerHTML = ''

        pregunta.respuestas.forEach(respuesta => {
            const button = document.createElement('button')
            button.className = 'answer-button'
            button.textContent = respuesta
            button.dataset.answer = respuesta
            answerContainer.appendChild(button)
        })
}

function mostrarGameOver() {
    
        //quizContainer.classList.add('hidden')
       // constrolsContainer.classList.remove('hidden')
        finalScore.textContent = `¡Juego terminado! Tu puntuación: ${puntuacion} / ${preguntas.length}`
        startButton.classList.remove('hidden')
        startButton.textContent = 'Jugar de nuevo'
    
}

function enseñarCargando(cargando: boolean) {
    loadingIndicator.classList.toggle('hidden', !cargando)
}

async function empezarJuego() { 
       // constrolsContainer.classList.remove('hidden')
        finalScore.textContent = ''
    
    preguntas = await getPreguntasYProcesado()
    puntuacion = 0
    indicePreguntaActual = 0

    if (preguntas.length > 0) {
        startButton.classList.add('hidden')
        cargarPregunta()
    } else {
       
            finalScore.textContent = 'Error al cargar las preguntas. Inténtalo de nuevo. '
           // constrolsContainer.classList.remove('hidden')
        
    }
}

function manejadorClickRespuesta() {
    const target = event?.target
    if (!(target instanceof HTMLElement) || !target.matches('.answer-button') || !answerContainer) {
        return
    }

    answerContainer.querySelectorAll('.answer-button').forEach(button => {
        if (button instanceof HTMLButtonElement) {
            button.disabled = true
        }
    })

    const respuestaElegida = target.dataset.answer
    if (!respuestaElegida) return

    const preguntaActual = preguntas[indicePreguntaActual]
    const esCorrecta = preguntaActual.respuesta_correcta === respuestaElegida

    if (esCorrecta) {
        puntuacion++
        target.classList.add('correct')
    } else {
        target.classList.add('incorrect')
    }

    setTimeout(() => {
        indicePreguntaActual++
        if (indicePreguntaActual >= preguntas.length) {
            mostrarGameOver()
        } else {
            cargarPregunta()
        }
    }, 1000)
}

startButton.addEventListener('click', () => empezarJuego())

if (startButton) {
    
}
if (answerContainer) {
    answerContainer.addEventListener('click', () => manejadorClickRespuesta())
}