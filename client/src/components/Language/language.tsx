import { useEffect } from "react";
import words, { lang as lng, language } from "../../words";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";

let lang: language = lng.EN;

export function word (token: keyof typeof words) {
    return (words[token] ?? {})[lang];
}

function setLang (language: language) {
    lang = language;
    const lng_letters = {
        [lng.UA]: "ua",
        [lng.EN]: "en",
    };
    document.documentElement.lang = lng_letters[lang];
}

export default function Language ({ children }: { children: JSX.Element | JSX.Element[] }) {
    
    const { language } = useSelector((state: RootState) => state.sheet.sheet);

    setLang(language);

    useEffect(() => {
        setLang(language);
    }, [language]);

    return (<>
        {language === lng.EN && children}
        {language === lng.UA && children}
    </>);
}