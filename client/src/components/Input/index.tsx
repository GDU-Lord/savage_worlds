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

export const validateNumber = (val: string) => val.search(/^(\-){0,1}[0-9][0-9]{0,}(\.[0-9][0-9]{0,}){0,1}((\+|\-|\/|\*|\^)[0-9][0-9]{0,}(\.[0-9][0-9]{0,}){0,1}){0,1}$/) > -1;


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
        inp.style.height = "0px";
        const style = getComputedStyle(inp);
        const padding = +style.getPropertyValue("padding").replaceAll("vw", "").replaceAll("px", "");
        inp.style.height = inp.scrollHeight - padding * 2 + 1 + "px";
    }

    function check (inp: HTMLInputElement | HTMLTextAreaElement) {
        const isValid = validate(inp.value, inp);
        if(isValid)
            return inp.classList.remove(s.red);
        inp.classList.add(s.red);
    }

    function blur (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
        
        isFocused = false;

        const regex = /^(\-){0,1}[0-9][0-9]{0,}(\.[0-9][0-9]{0,}){0,1}(\*|\/|\+|\-|\^)[0-9][0-9]{0,}(\.[0-9][0-9]{0,}){0,1}$/g;

        let val = e.target.value;

        if(val.search(regex) > -1) {
            if(val.includes("*")) {
                const num = val.split("*").map(val => +val);
                val = String(num[0] * num[1]);
            }
            else if(val.search(/(?<!^)(\-)/) > -1) {
                const num = val.split(/(?<!^)\-/).map(val => +val);
                console.log(val.split(/(?<!^)\-/), num);
                val = String(num[0] - num[1]);
            }
            else if(val.includes("+")) {
                const num = val.split("+").map(val => +val);
                val = String(num[0] + num[1]);
            }
            else if(val.includes("/")) {
                const num = val.split("/").map(val => +val);
                val = String(num[0] / num[1]);
            }
            else if(val.includes("^")) {
                const num = val.split("^").map(val => +val);
                val = String(num[0] ** num[1]);
            }
        }

        e.target.value = val;

        check(e.target);

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