import { useState } from "react";
import { ButtonHTMLAttributes } from "react"; //tras as tipagens dos atributos do botao
import "../styles/button.scss";

/*export function Button(){
    //let counter = 0;
    const [counter,setCounter] = useState(0); // useState retorn um vetor com duas posições [valor inicial do estado, função(usado para alterar o valor de counter)]
    function increment(){
      //  counter++;
        setCounter(counter+1); // o counter não foi alterado, foi setado um novo valor, porém baseado no valor que ja existia antes
    }
    //<button onClick={increment} >0</button> // pode passar a função direto
    return(
        <button onClick={increment} >{counter}</button> //tem que colocar entre chaves pelo fato de TSX executar código apenas entre {}, caso não tivesse o texto de dentro do botão seria 'props.text'
    );
} // quando faz o export direto tem que receber da sseguitne forma: import {Button} from './components/button', e caso o nome da função seja alterado, 
//terá que alterar em todos arquivos que usam ele, diferente se tivesse feito a função e no final escrito 'export default Button'*/
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>; //tipagem do elemento do botao global: HTMLButtonElement
export function Button(props: ButtonProps) {
  return (
    <button className="button" {...props}></button> //Repassa todos atributos de props para o botão
  );
}
