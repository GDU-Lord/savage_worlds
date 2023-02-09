import s from "./index.module.sass";

export interface props {
    value: string;
    text: string;
};

function copyToClipboard(text: string) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(text);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = text;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    }
}

export default function Clipboard ({ value, text }: props) {

    function copy (e: React.MouseEvent) {
        // window.navigator.clipboard.writeText(value);
        copyToClipboard(value);
    }

    return (
        <div className={s.clipboard} onClick={copy}>{text}</div>
    );

}