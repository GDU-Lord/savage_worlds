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
import Summary from "../../components/Summary";

export interface props {

};

function createCharURL (token: string) {
    return window.location.origin + "/summary?token=" + token;
}

export default function SummaryPage (props: props) {

    const [searchParams, setSearchParams] = useSearchParams();

    const state = useSelector((state: RootState) => state.sheet);
    const summaryState = useSelector((state: RootState) => state.summary);
    const nav = useNavigate();

    const dispatch = useDispatch();
    const { setWounds, setDistracted, setShaken, setVoulnerable } = bindActionCreators(actions, dispatch);

    useEffect(() => {
        const token = searchParams.get("token") ?? "";
        loadSheet(token);
    }, []);

    async function loadSheet (token: string) {
        socket.emit("character-get", token);
    }

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
                    text: word("character"),
                    callback () {
                        nav("/character?token="+state.text.token);
                    }
                }
            ],
        }
    ];

    const blocks2: block[] = [
        {
            texts: [word("actions")],
            inputs: [],
            buttons: [
                {
                    text: `${word("wounds")} (${summaryState.wounds+state.other.wounds})`,
                    callback () {
                        
                    },
                },
                {
                    text: word("add_wound"),
                    callback () {
                        setWounds(summaryState.wounds+1);
                    },
                },
                {
                    text: word("subtract_wound"),
                    callback () {
                        setWounds(summaryState.wounds-1);
                    },
                },
                {
                    text: summaryState.shaken ? word("shaken") : word("not_shaken"),
                    callback () {
                        setShaken(!summaryState.shaken);
                    },
                },
                {
                    text: summaryState.voulnerable ? word("voulnerable") : word("not_voulnerable"),
                    callback () {
                        setVoulnerable(!summaryState.voulnerable);
                    },
                },
                {
                    text: summaryState.distracted ? word("distracted") : word("not_distracted"),
                    callback () {
                        setDistracted(!summaryState.distracted);
                    },
                },
            ],
        }
    ];

    return (<>
        <Page blocks={blocks}/>
        <Summary/>
        <Page blocks={blocks2} language={false}/>
    </>);

}