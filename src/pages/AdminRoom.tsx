import { FormEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import { Button } from "../components/button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import deleteImg from "../assets/images/delete.svg";
import "../styles/room.scss";

type RoomParams = {
  id: string;
};
//Record == objeto
type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
  }
>;

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const history = useHistory();
  const [newQuestion, setNewQuestion] = useState("");
  const roomId = params.id;
  const { user } = useAuth(); // tem que estar autenticado
  const { title, questions } = useRoom(roomId);

  async function handleSendQuestion(event: FormEvent) {
    // if e else = oeprador ternário (condicao) ? (se true) : (se false)
    event.preventDefault(); // Pra n'ao recarregar a tela
    if (newQuestion.trim() === "") {
      return;
    }
    if (!user) {
      //Se o usuário não tiver autenticado
      throw new Error("You must be logged in");
    }
    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighLighted: false,
      isAnswered: false,
    };
    await database.ref(`rooms/${roomId}/questions`).push(question); //Vai criar uma nova informação dentro do objeto rooms/roomsID
    setNewQuestion("");
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que deseja remover essa pergunta?")) {
      const questionRef = await database
        .ref(`rooms/${roomId}/questions/${questionId}`)
        .remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionRef = await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({
        isAnswered: true,
      });
  }

  async function handleHighLightQuestion(questionId: string) {
    const questionRef = await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({
        isHighLighted: true,
      });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutLined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighLighted}
              >
                <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <img src={checkImg} alt="Marcar pergunta como respondida" />
                </button>
                <button
                  type="button"
                  onClick={() => handleHighLightQuestion(question.id)}
                >
                  <img src={answerImg} alt="Dar destaque a pergunta" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
