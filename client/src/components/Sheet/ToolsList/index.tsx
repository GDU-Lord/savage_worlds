import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../store/reducers";
import { Tool as ToolClass } from "../../../store/slices/sheet/tools";
import Tool from "./Tool";
import s from "./index.module.sass";
import Tab from "../Tab";
import { word } from "../../Language/language";

export interface props {

};

export default function ToolsList (props: props) {

    const dispatch = useDispatch();
    const { saveData, addTools, updateDerivedStatistics } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        updateDerivedStatistics(state);
    });

    const list = state.tools.list.allIds.map((id, index) => {
        return (<Tool id={id} key={index}/>);
    });

    function add () {
        addTools([
            new ToolClass({
                hidden: false,
                name: "",
                notes: "",
                amount: 1,
                weight: 0
            })
        ]);
        saveData();
    }

    return (
        <div className={s.tools_list}>
            {(list.length > 0 || !state.sheet.locked) && <Tab name="tools" title={word("resources_tools")}>
                {list}
                {!state.sheet.locked && <button className={s.add} onClick={add} disabled={state.sheet.locked}>+</button>}
            </Tab>}
        </div>
    );

}