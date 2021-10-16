import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";
//Lógica compartilhada == rook
type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

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
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestion] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on("value", (room) => {
      //Esta ouvindo um evento dom firebase uma unica vez(once), para escutar mais de uma vez usa o `on`
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
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(([key,like]) => like.authorId === user?.id)?.[0], // ?. -> Se nao retornar nada, quer dizer que vai retornar nada, caso tenha retornado algo, acessa a posicao 0
            //passa o araay ate achar uma condicao que seja verdadeira -> se encontrou ou nao
          };
        }
      );
      setQuestion(parsedQuestions);
      setTitle(databaseRoom.title);
    });

    return () => {
      roomRef.off("value"); // Para de escutar o evento
    };
  }, [roomId, user?.id]); //DIspara evento sempre que algo mudar, o segundo parametro é um array de dependências, se dependias == vazio, executa apenas uma vez
  //Toda vez que o roomId mudar, executa novamente o useEffect()

  return { questions, title };
}
