import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Page, { block } from "../../components/Page";
import { SERVER_URL } from "../../config";
import { actions, RootState } from "../../store/reducers";
import { updateCharacter } from "../../character";
import { useEffect } from "react";
import { campaign } from "../MasterTokenPage";
import Clipboard from "../../components/Clipboard";

export interface props {

};

export default function MasterPage (props: props) {

    const state = useSelector((state: RootState) => state.master);
    const nav = useNavigate();

    useEffect(() => {
        if(state.token === "")
            nav("/");
    });

    const dispatch = useDispatch();

    const { updateCharacters, updateToken } = bindActionCreators(actions, dispatch);

    const characters: block["buttons"] = state.characters.map(({ name, token }) => ({
        text: name === "" ? "---" : name,
        callback: async () => {

            window.open("/character?token=" + token);

        }
    }));

    const blocks: block[] = [
        {
            texts: ["Токен кампанії:", <Clipboard value={state.token} text="Скопіювати токен"/>],
            inputs: [],
            buttons: [
                {
                    text: "Скинути токен",
                    callback: async () => {
                        const res = await fetch(SERVER_URL + "/campaign/reset", {
                            method: "put",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                token: state.token
                            })
                        });
                        const token = await res.text();
                        updateToken(token);
                    }
                },
                {
                    text: "Оновити",
                    callback: async () => {
                        const res = await fetch(SERVER_URL + "/campaign/get?master_token=" + state.token);
                        const campaign = await res.json() as campaign;
                        updateToken(campaign.token);
                        updateCharacters(campaign.characters);
                    }
                }
            ]
        },
        {
            texts: ["Персонажі"],
            inputs: [],
            buttons: characters
        },
        {
            texts: [],
            inputs: [],
            buttons:[
                {
                    text: "Додати персонажа",
                    callback: async (inputs) => {
                        
                        const res = await fetch(SERVER_URL + "/character/create", {
                            body: JSON.stringify({
                                master_token: state.token
                            }),
                            headers: { "Content-Type": "application/json" },
                            method: "put"
                        });

                        const character = await res.json();

                        window.open("/character?token=" + character.token);

                        const r = await fetch(SERVER_URL + "/campaign/get?master_token=" + state.token);
                        const campaign = await r.json() as campaign;
                        updateToken(campaign.token);
                        updateCharacters(campaign.characters);

                    }
                },
                {
                    text: "Видалити персонажа",
                    callback: async (inputs) => {
                        
                        const token = prompt("Введіть токен персонажа");

                        if(token == null) return;

                        const sure = window.confirm("Ви впевнені, що хочете видалити персонажа?");
                        
                        if(!sure) return;

                        const res = await fetch(SERVER_URL + "/character/delete", {
                            body: JSON.stringify({
                                master_token: state.token,
                                token: token
                            }),
                            headers: { "Content-Type": "application/json" },
                            method: "put"
                        });

                        if(res.status !== 200) return;

                        const res2 = await fetch(SERVER_URL + "/campaign/get?master_token=" + state.token);
                        const campaign = await res2.json() as campaign;
                        updateToken(campaign.token);
                        updateCharacters(campaign.characters);

                    }
                },
                {
                    text: "Меню",
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