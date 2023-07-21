import { useEffect } from "react";
import words, { lang as lng, language } from "../../words";
import { useDispatch, useSelector } from "react-redux";
import { RootState, actions } from "../../store/reducers";
import { bindActionCreators } from "@reduxjs/toolkit";

let lang: language = lng.EN;

export function word (token: keyof typeof words) {
    return (words[token] ?? {})[lang];
}

function setLang (language: language) {
    lang = language;
    const lng_letters = {
        [lng.UA]: "ua",
        [lng.EN]: "en",
        [lng.RD]: "rd",
    };
    document.documentElement.lang = lng_letters[lang];
}

interface Window {
    Radetzky203: () => void;
};

export default function Language ({ children }: { children: JSX.Element | JSX.Element[] }) {
    
    const { language } = useSelector((state: RootState) => state.sheet.sheet);
    const dispatch = useDispatch();
    const { setLanguage } = bindActionCreators(actions, dispatch);

    setLang(language);

    (window as unknown as Window).Radetzky203 = function () {
        setLanguage(lng.RD);
    }

    useEffect(() => {
        setLang(language);
    }, [language]);

    return (<>
        {language === lng.EN && children}
        {language === lng.UA && children}
        {language === lng.RD && children}
    </>);
}