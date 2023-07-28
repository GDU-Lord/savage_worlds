import React, { ReactElement, useState } from "react";
import s from "./index.module.sass";
import { lang, language } from "../../words";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState, actions } from "../../store/reducers";

export interface button {
    text: string;
    callback: (inputs: NodeListOf<HTMLInputElement>) => void;
}

export interface block {
    texts: (string | ReactElement)[]; // contents
    inputs: string[]; // names
    buttons: button[]; // objects
}

export interface props {
    blocks: block[];
    language?: boolean;
};

export default function Page ({ blocks, language = true }: props) {

    function onClick (e: React.MouseEvent<HTMLButtonElement>, callback: (inputs: NodeListOf<HTMLInputElement>) => void) {
        const button = e.target as HTMLButtonElement;
        const block = button.parentNode as HTMLDivElement;
        const inputs = block.querySelectorAll("input");
        callback(inputs);
    }

    const dispatch = useDispatch();
    const { setLanguage } = bindActionCreators(actions, dispatch);
    const state = useSelector((state: RootState) => state.sheet.sheet);

    const list = blocks.map((block, index) => {

        const texts = block.texts.map((text, index) => {
            return (<div key={index} className={s.title}>{text}</div>);
        });

        const inputs = block.inputs.map((name, index) => {
            return (<input key={index} name={name}></input>);
        });

        const buttons = block.buttons.map(({ text, callback }, index) => {
            return (<button key={index} onClick={e => onClick(e, callback)}>{text}</button>);
        });

        return (<div key={index} className={s.block}>
            {texts}
            {inputs}
            {buttons}
        </div>);

    });

    const languages = [["EN", lang.EN], ["UA", lang.UA]].map(([text, value], index) => {
        
        const selectClass = state.language === value ? s.selected : "";
        return (<button key={index} className={s.language+" "+selectClass} onClick={() => setLanguage(value as language)}>{text}</button>);
    });

    return (
        <div className={s.page}>
            {list}
            {language && <div className={s.language_container}>{languages}</div>}
        </div>
    );

}

// block
    // title
    // input