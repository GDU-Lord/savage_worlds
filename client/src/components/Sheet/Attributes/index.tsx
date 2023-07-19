import { state as attributesState } from "../../../store/slices/sheet/attributes";
import { word } from "../../Language/language";
import Level from "../../Level";
import Tab from "../Tab";
import s from "./index.module.sass";

export interface props {

};

export default function Attributes (props: props) {

    const attributes: (keyof attributesState)[] = ["agility", "smarts", "spirit", "strength", "vigor"];

    const list = attributes.map((attribute, index) => {

        return (<div className={s.attribute} key={index}><div className={s.attribute_title}>{word(attribute)}</div><Level type="attributes" name={attribute}/></div>);

    });

    return (
        <div className={s.attributes}>
            <Tab name="attributes" title={word("attributes")}>{list}</Tab>
        </div>
    );

}