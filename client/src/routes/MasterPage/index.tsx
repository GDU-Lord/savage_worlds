import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Page, { block } from "../../components/Page";
import { SERVER_URL } from "../../config";
import { actions, RootState } from "../../store/reducers";
import { character, updateCharacter } from "../../character";
import { useEffect } from "react";
import { campaign } from "../MasterTokenPage";
import Clipboard from "../../components/Clipboard";
import { isMobile, socketRequest } from "../../scripts";
import s from "./index.module.sass";
import Board from "../../components/Board";
import { word } from "../../components/Language/language";

export interface props {

};

function extractTag (name: string): string | undefined {
    const regex = /\[.{1,}\]/g;
    return name.match(regex)?.[0];
}

export default function MasterPage (props: props) {

    const state = useSelector((state: RootState) => state.master.campaign);
    const nav = useNavigate();

    useEffect(() => {
        if(state.token === "")
            nav("/");
    });

    const dispatch = useDispatch();

    const { updateCharacters, updateToken, addWindow } = bindActionCreators(actions, dispatch);

    // const characters: block["buttons"] = state.characters.map(({ name, token }) => ({
    //     text: name === "" ? "---" : name,
    //     callback: async () => {

    //         if(isMobile())
    //             window.open("/character?token=" + token);
    //         else
    //             addWindow("/character?token=" + token);

    //     }
    // }));

    const defaultCharList = "characters";

    const characterTabs: { [key: string]: block } = {
        [defaultCharList]: {
            texts: [word("characters")],
            inputs: [],
            buttons: []
        }
    };

    state.characters.forEach((char) => {
        const tag = extractTag(char.name) ?? defaultCharList;
        let name = char.name;
        if(!(tag in characterTabs))
            characterTabs[tag] = {
                texts: [tag],
                inputs: [],
                buttons: []
            };
        if(tag !== defaultCharList)
            name = name.replace(tag, "");
        characterTabs[tag].buttons.push({
            text: name === "" ? "---" : name,
            callback: async () => {
    
                if(isMobile())
                    window.open("/character?token=" + char.token);
                else
                    addWindow("/character?token=" + char.token);
    
            }
        });
    });

    const characterBlocks = Object.values(characterTabs);
    characterBlocks[0].texts[0] = word("characters");

    const blocks: block[] = [
        {
            texts: [word("campaign"), <Clipboard value={state.token} text={word("copy_token")}/>],
            inputs: [],
            buttons: [
                {
                    text: word("revoke_token"),
                    callback: async () => {
                        if(!window.confirm(word("confirm_revoke_token"))) return;
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
                    text: word("update"),
                    callback: async () => {
                        const res = await fetch(SERVER_URL + "/campaign/get?master_token=" + state.token);
                        const campaign = await res.json() as campaign;
                        updateToken(campaign.token);
                        updateCharacters(campaign.characters);
                    }
                }
            ]
        },
        ...characterBlocks,
        {
            texts: [],
            inputs: [],
            buttons:[
                {
                    text: word("add_character"),
                    callback: async (inputs) => {
                        
                        const {data, status} = await socketRequest<character>("character-create", state.token);

                        if(status !== 200)
                            return alert("Помилка!");

                        if(isMobile())
                            window.open("/character?token=" + data.token);
                        else
                            addWindow("/character?token=" + data.token);

                        const r = await fetch(SERVER_URL + "/campaign/get?master_token=" + state.token);
                        const campaign = await r.json() as campaign;
                        updateToken(campaign.token);
                        updateCharacters(campaign.characters);

                    }
                },
                {
                    text: word("delete_character"),
                    callback: async (inputs) => {
                        
                        const token = prompt(word("provide_character_token"));

                        if(token == null) return;

                        const sure = window.confirm(word("confirm_delete_character"));
                        
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
                    text: word("back"),
                    callback: (inputs) => {
                        nav("/");
                    }
                }
            ]
        }
    ];

    return (<div className={s.main}>
        <Page blocks={blocks}/>
        <Board/>
    </div>);

}