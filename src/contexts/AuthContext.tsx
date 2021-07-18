import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode; //ReacNode é o tipo do componente do react
};

//quando faço 'as any' ignora a tipagem do typescript
export const AuthContext = createContext({} as AuthContextType); //passa a informação a ser armazenada dentro do contexto
//sempre tem que prover uma informação p´ro contexto, se fort string coloca '' e se for objeto coloca {}

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>(); //criando estado e adicionando o tipo para não dar pau na hora de usar a funcao setUser saber o q vai receber
  //as informações do useState só ficam disponíveis enquanto o usuário estiver mexendo, sendo assim quando der F5 ou saiur e voltar terá perdido os dados, para driblar isso tem que recuperar o estado

  useEffect(() => {
    //coloca em uma variávfel para a gente pdoer desligar ou no caso parar de 'ouvir'
    //existia um login prefeito por este usuário??
    const unsubscribe = auth.onAuthStateChanged((user) => {
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

    //sempre que declarar um eventListener, tem que se 'descadastar' deste evento no final do use effect para não ficar ouvindo de forma desnecessária
    return () => {
      unsubscribe();
    };
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
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}
