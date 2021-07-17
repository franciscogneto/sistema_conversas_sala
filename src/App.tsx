import firebase from "firebase";
import { createContext, useState, useEffect } from "react";
import { Route, BrowserRouter } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { auth } from "./services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
};

//quando faço 'as any' ignora a tipagem do typescript
export const AuthContext = createContext({} as AuthContextType); //passa a informação a ser armazenada dentro do contexto
//sempre tem que prover uma informação p´ro contexto, se fort string coloca '' e se for objeto coloca {}

function App() {
  const [user, setUser] = useState<User>(); //criando estado e adicionando o tipo para não dar pau na hora de usar a funcao setUser saber o q vai receber
  //as informações do useState só ficam disponíveis enquanto o usuário estiver mexendo, sendo assim quando der F5 ou saiur e voltar terá perdido os dados, para driblar isso tem que recuperar o estado

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing Information from Google Account");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    }); //event listener, caso o firebase identifique que já logou algum usuário, retorna o usuário
  }, []); //Primeiro parâmetro a função a ser executada e o segundo quando será executada, [] vázio executará apenas uma vez (na inicialização do componente)

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing Information from Google Account");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
        <Route path="/" exact={true} component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
      </AuthContext.Provider>
      //Tudo que esta dentro do provider enxergara o contexto
    </BrowserRouter>
  );
}

export default App;
