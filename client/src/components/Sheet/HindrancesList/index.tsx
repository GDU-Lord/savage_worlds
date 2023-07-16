import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../store/reducers";
import { Hindrance as HindranceClass } from "../../../store/slices/sheet/hindrances";
import Tab from "../Tab";
import Hindrance from "./Hindrance";
import s from "./index.module.sass";

export interface props {

};

export default function ToolsList (props: props) {

    const dispatch = useDispatch();
    const { saveData, addHindrances, updateDerivedStatistics } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        updateDerivedStatistics(state);
    });

    const list = state.hindrances.list.allIds.map((id, index) => {
        return (<Hindrance id={id} key={index}/>);
    });

    function add () {
        addHindrances([
            new HindranceClass({
                name: "",
                notes: "",
                hidden: false
            })
        ]);
        saveData();
    }

    return (
        <div className={s.hindrance_list}>
            {(list.length > 0 || !state.sheet.locked) && <Tab name="hindrances" title="Слабкі сторони">
                {list}
                {!state.sheet.locked && <button className={s.add} onClick={add} disabled={state.sheet.locked}>+</button>}
            </Tab>}
        </div>
    );

}