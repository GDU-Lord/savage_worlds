import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Page, { block } from "../../components/Page";
import { SERVER_URL } from "../../config";
import { actions } from "../../store/reducers";

export interface props {

};

export default function HomePage (props: props) {

    const nav = useNavigate();
    const dispatch = useDispatch();

    const { updateToken, updateCharacters } = bindActionCreators(actions, dispatch);

    const blocks: block[] = [
        {
            texts: ["Меню"],
            inputs: [],
            buttons: [
                {
                    text: "Відкрити персонажа",
                    callback (inputs) {
                        nav("/character/token")
                    }
                },
                {
                    text: "Відкрити кампанію",
                    callback (inputs) {
                        nav("/master/token")
                    }
                },
                {
                    text: "Створити кампанію",
                    async callback (inputs) {
                        
                        const res = await fetch(SERVER_URL+"/campaign/create", {
                            method: "put"
                        });

                        const { token, characters } = await res.json();

                        if(token == null) return alert("Error");

                        updateToken(token);
                        updateCharacters(characters);

                        nav("/master");

                    }
                },
            ]
        }
    ];

    return (
        <Page blocks={blocks}/>
    );

}