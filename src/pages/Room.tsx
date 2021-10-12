import { FormEvent, useState } from "react";
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
export function Room() {
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const roomId = params.id;
  const { user } = useAuth(); // tem que estar autenticado

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
          <h1>Sala de React</h1>
          <span>4 Perguntas</span>
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
      </main>
    </div>
  );
}
