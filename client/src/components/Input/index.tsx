import { useEffect, useRef } from "react";
import s from "./index.module.sass";

export interface props {
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    big?: boolean;
    validate?: (value: string, input?: HTMLInputElement | HTMLTextAreaElement) => boolean;
    onUpdate?: (value: string) => void;
};


export default function Input ({ disabled = false, big = false, placeholder = "", value = "", validate = () => true, onUpdate = () => {}}: props) {

    const ref = useRef() as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement>;

    let isFocused = false;

    function update (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const inp = e.target;
        check(e.target);
        isFocused = true;
        resize(inp);
    }

    function resize (inp: HTMLInputElement | HTMLTextAreaElement) {
        if(!big) return;
        const lines = inp.value.split("\n").length;
        const style = getComputedStyle(inp);
        const fontSize = style.getPropertyValue("line-height");
        if(fontSize.search("px") >= 0)
            inp.style.height = (+fontSize.replace("px", "") * lines) + "px";
        if(fontSize.search("vw") >= 0)
            inp.style.height = (+fontSize.replace("vw", "") * lines) + "px";
    }

    function check (inp: HTMLInputElement | HTMLTextAreaElement) {
        const isValid = validate(inp.value, inp);
        if(isValid)
            return inp.classList.remove(s.red);
        inp.classList.add(s.red);
    }

    function blur (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
        isFocused = false;
        if(!e.target.classList.contains(s.red))
            onUpdate(e.target.value);
    }

    function focus (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
        isFocused = true;
    }

    useEffect(() => {

        ref.current.value = value;
        check(ref.current);
        resize(ref.current);

        window.addEventListener("keydown", e => {
            if(!big && e.key === "Enter" && isFocused)
                ref.current.blur();
        });

    });

    if(big)
        return (<textarea disabled={disabled} ref={ref as any} className={s.input} placeholder={placeholder} defaultValue={value} onChange={update} onBlur={blur} onFocus={focus}></textarea>);

    return (
        <input disabled={disabled} ref={ref as any} className={s.input} placeholder={placeholder} defaultValue={value} onChange={update} onBlur={blur} onFocus={focus}/>
    );

}