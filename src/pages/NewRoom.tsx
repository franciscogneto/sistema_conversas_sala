import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";

import { Button } from "../components/button";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import "../styles/auth.scss";
import { AuthContext } from "../contexts/AuthContext";

export function NewRoom() {
  //const { user} = useContext(AuthContext);

  /*async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }
        //history.push('/rooms/new');
    }*/

  // const {value,setValue} = useContext(TestContext);

  function handleCreateRoom() {}

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
            <input type="text" placeholder="nome da sala" />
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
