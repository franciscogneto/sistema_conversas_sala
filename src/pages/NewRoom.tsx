import { Link, useHistory } from "react-router-dom";
import { useContext, FormEvent, useState } from "react";

import { Button } from "../components/button";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import "../styles/auth.scss";
import { AuthContext } from "../contexts/AuthContext";

import { database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

export function NewRoom() {
  const { user, signInWithGoogle } = useAuth();
  const history = useHistory();
  /*async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }
        //history.push('/rooms/new');
    }*/

  // const {value,setValue} = useContext(TestContext);
  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(event: FormEvent) {
    // toda funcao recebe o evento, que neste vcaso é o formevent
    event.preventDefault(); // não pisca a tela
    if (newRoom.trim() == "") {
      return;
    }

    const roomRef = database.ref("rooms");
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });
    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Toda Pergunta tem uma resposta</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="logo" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="nome da sala"
              onChange={(event) => {
                setNewRoom(event.target.value);
              }}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
