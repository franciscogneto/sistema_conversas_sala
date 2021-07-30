import illustrationImg from "../assets/images/illustration.svg"; //importando a imagem
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import "../styles/auth.scss";
import { Button } from "../components/button";

import { useHistory } from "react-router-dom";
import { FormEvent, useContext, useState } from "react";
import { firebase, auth, database } from "../services/firebase";
import { AuthContext } from "../contexts/AuthContext";
//webpack (snowpack, vite, ...): module blander -> pega a extensão do arquivo
//&amp; = &; & é utilizado no html para indicar símbolos

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useContext(AuthContext);
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    console.log("aquiii");
    console.log(typeof signInWithGoogle);
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === "") {
      return;
    }
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Sala não existe.");
      return;
    }

    return history.push(`rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo </strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="logo" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="digite o código da sala"
              onChange={(event) => {
                setRoomCode(event.target.value);
              }}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
