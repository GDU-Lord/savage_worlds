import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateCharacter } from "../../character";
import Page, { block } from "../../components/Page";
import { SERVER_URL } from "../../config";

export interface props {

};

export default function CharacterTokenPage (props: props) {
    
    const nav = useNavigate();
    const dispatch = useDispatch();

    const blocks: block[] = [
        {
            texts: ["Введіть ваш токен"],
            inputs: ["token"],
            buttons: [
                {
                    text: "Підтвердити",
                    callback: async (inputs) => {

                        const token = inputs[0].value;

                        nav("/character?token=" + token);

                    }
                },
                {
                    text: "Назад",
                    callback: (inputs) => {
                        nav("/");
                    }
                }
            ]
        }
    ];

    return (
        <Page blocks={blocks}/>
    );

}