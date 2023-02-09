import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Clipboard from "../../components/Clipboard";
import Page, { block, button } from "../../components/Page";
import Sheet from "../../components/Sheet";
import { actions, RootState } from "../../store/reducers";
import { socket } from "../../scripts";

export interface props {

};

function createCharURL (token: string) {
    return window.location.origin + "/character?token=" + token;
}

export default function CharacterPage (props: props) {

    const [searchParams, setSearchParams] = useSearchParams();

    const state = useSelector((state: RootState) => state.sheet);
    const nav = useNavigate();

    const dispatch = useDispatch();
    const { setLocked } = bindActionCreators(actions, dispatch);

    useEffect(() => {
        const token = searchParams.get("token") ?? "";
        loadSheet(token);
    }, []);

    async function loadSheet (token: string) {
        socket.emit("character-get", token);
    }

    const editButton: button = {
        text: "Змінити",
        callback () {
            setLocked(false);
        }
    };
    const lockButton: button = {
        text: "Заблокувати",
        callback () {
            setLocked(true);
        }
    };

    const title = state.text.name.trim() === "" ? "---" : state.text.name;

    const blocks: block[] = [
        {
            texts: [title, <Clipboard text="Скопіювати посилання" value={createCharURL(state.text.token)}/>],
            inputs: [],
            buttons: [
                {
                    text: "Меню",
                    callback () {
                        nav("/");
                    },
                },
                state.sheet.locked ? editButton : lockButton
            ],
        }
    ];

    return (<>
        <Page blocks={blocks}/>
        <Sheet/>
    </>);

}