import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../store/reducers";
import { payload, state as textState } from "../../../store/slices/sheet/text";
import Input from "../../Input";
import Tab from "../Tab";
import s from "./index.module.sass";
import words from "../../../words";
import { word } from "../../Language/language";

export interface props {

};

export default function TextStats (props: props) {

    const stats: (keyof textState)[] = ["name", "playerName", "race"];
    const names: (keyof typeof words)[] = ["name", "player_name", "rase"];

    const state = useSelector((state: RootState) => state.sheet);
    const dispatch = useDispatch();
    const { saveData, setTextStatistic } = bindActionCreators(actions, dispatch);

    function update (stat: payload["name"], value: string) {
        setTextStatistic({
            name: stat,
            value
        });
        saveData();
    }

    const list = stats.map((stat, index) => {

        return (<div className={s.stat} key={index}><div className={s.stat_title}>{word(names[index])}</div><Input
            onUpdate={val => update(stat, val)}
            value={state.text[stat]}
            disabled={state.sheet.locked}
        /></div>);

    });

    return (
        <div className={s.text}>
            <Tab name="text" title={word("description")}>{list}</Tab>
        </div>
    );

}