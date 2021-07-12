import illustrationImg from '../assets/images/illustration.svg'; //importando a imagem
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
//webpack (snowpack, vite, ...): module blander -> pega a extensão do arquivo 
//&amp; = &; & é utilizado no html para indicar símbolos
export function Home(){
    return(
        <div>
             <aside>
                 <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
                 <strong>Crie salas de Q&amp;A ao-vivo </strong>
                 <p>Tire as dúvidas da sua audiência em tempo-real</p>
             </aside>
             <main>
                 <div>
                     <img src={logoImg} alt="logo"/>
                     <button>
                         <img src={googleIconImg} alt="Logo do google"/>
                         Crie sua sala com o Google
                     </button>
                     <div>
                         ou entre em uma sala
                     </div>
                     <form>
                         <input
                            type="text"
                            placeholder="digite o código da sala"
                         />
                         <button type="submit">
                            Entrar na sala
                         </button>
                     </form>
                 </div>
             </main>
        </div>
    );
}