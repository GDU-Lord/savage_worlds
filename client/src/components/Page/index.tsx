import React, { ReactElement } from "react";
import s from "./index.module.sass";

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
};

export default function Page ({ blocks }: props) {

    function onClick (e: React.MouseEvent<HTMLButtonElement>, callback: (inputs: NodeListOf<HTMLInputElement>) => void) {
        const button = e.target as HTMLButtonElement;
        const block = button.parentNode as HTMLDivElement;
        const inputs = block.querySelectorAll("input");
        callback(inputs);
    }

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

    return (
        <div className={s.page}>
            {list}
        </div>
    );

}

// block
    // title
    // input