import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
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

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
};

export function Room() {
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const roomId = params.id;
  const { user } = useAuth(); // tem que estar autenticado
  const [questions, setQuestion] = useState<Question[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.once("value", (room) => {
      //Esta ouvindo um evento dom firebase uma unica vez, para escutar mais de uma vez usa o `on`
      //console.log(room.val()); // pega os valores da room
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}; // Para caso o objecto venha como null
      console.log(firebaseQuestions);

      //Cria um array com os objetos
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighLighted: value.isHighLighted,
            isAnswered: value.isAnswered,
          };
        }
      );
      setQuestion(parsedQuestions);
      setTitle(databaseRoom.title);
    });
  }, [roomId]); //DIspara evento sempre que algo mudar, o segundo parametro é um array de dependências, se dependias == vazio, executa apenas uma vez
  //Toda vez que o roomId mudar, executa novamente o useEffect()

  async function handleSendQuestion(event: FormEvent) {
    // if e else = oeprador ternário (condicao) ? (se true) : (se false)
    event.preventDefault(); // Pra n'ao recarregar a tela
    if (newQuestion.trim() == "") {
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
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} Perguntas</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar Pergunta
            </Button>
          </div>
        </form>
        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
