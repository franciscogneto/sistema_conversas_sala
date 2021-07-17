import illustrationImg from "../assets/images/illustration.svg"; //importando a imagem
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import "../styles/auth.scss";
import { Button } from "../components/button";

import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { firebase, auth } from "../services/firebase";
import { AuthContext } from "../App";
//webpack (snowpack, vite, ...): module blander -> pega a extensão do arquivo
//&amp; = &; & é utilizado no html para indicar símbolos

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useContext(AuthContext);

  async function handleCreateRoom() {
    console.log("aquiii");
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
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
          <form>
            <input type="text" placeholder="digite o código da sala" />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
