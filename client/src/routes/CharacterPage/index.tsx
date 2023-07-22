import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Clipboard from "../../components/Clipboard";
import Page, { block, button } from "../../components/Page";
import Sheet from "../../components/Sheet";
import { actions, RootState } from "../../store/reducers";
import { socket } from "../../scripts";
import { word } from "../../components/Language/language";

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
        text: word("edit"),
        callback () {
            setLocked(false);
        }
    };
    const lockButton: button = {
        text: word("lock"),
        callback () {
            setLocked(true);
        }
    };

    const title = state.text.name.trim() === "" ? "---" : state.text.name;

    const blocks: block[] = [
        {
            texts: [title, <Clipboard text={word("copy_link")} value={createCharURL(state.text.token)}/>],
            inputs: [],
            buttons: [
                {
                    text: word("back"),
                    callback () {
                        nav("/");
                    },
                },
                {
                    text: word("summary"),
                    callback () {
                        nav("/summary?token="+state.text.token);
                    }
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