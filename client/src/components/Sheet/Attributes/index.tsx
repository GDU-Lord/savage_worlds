import { state as attributesState } from "../../../store/slices/sheet/attributes";
import Level from "../../Level";
import Tab from "../Tab";
import s from "./index.module.sass";

export interface props {

};

export default function Attributes (props: props) {

    const attributes: (keyof attributesState)[] = ["agility", "smarts", "spirit", "strength", "vigor"];
    const names = ["Спритність", "Розум", "Дух", "Сила", "Витривалість"];

    const list = attributes.map((attribute, index) => {

        return (<div className={s.attribute} key={index}><div className={s.attribute_title}>{names[index]}</div><Level type="attributes" name={attribute}/></div>);

    });

    return (
        <div className={s.attributes}>
            <Tab name="attributes" title="Атрибути">{list}</Tab>
        </div>
    );

}