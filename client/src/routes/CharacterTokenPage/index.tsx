import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Page, { block } from "../../components/Page";
import { word } from "../../components/Language/language";

export interface props {

};

export default function CharacterTokenPage (props: props) {
    
    const nav = useNavigate();
    const dispatch = useDispatch();

    const blocks: block[] = [
        {
            texts: [word("provide_your_token")],
            inputs: ["token"],
            buttons: [
                {
                    text: word("confirm"),
                    callback: async (inputs) => {

                        const token = inputs[0].value;

                        nav("/character?token=" + token);

                    }
                },
                {
                    text: word("back"),
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