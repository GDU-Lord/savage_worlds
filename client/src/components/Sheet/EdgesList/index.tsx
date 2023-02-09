import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../store/reducers";
import { Edge as EdgeClass } from "../../../store/slices/sheet/edges";
import Tab from "../Tab";
import Edge from "./Edge";
import s from "./index.module.sass";

export interface props {

};

export default function ToolsList (props: props) {

    const dispatch = useDispatch();
    const { saveData, addEdges, updateDerivedStatistics } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        updateDerivedStatistics(state);
    });

    const list = state.edges.list.allIds.map((id, index) => {
        return (<Edge id={id} key={index}/>);
    });

    function add () {
        addEdges([
            new EdgeClass({
                hidden: false,
                name: "",
                notes: ""
            })
        ]);
        saveData();
    }

    return (
        <div className={s.edges_list}>
            <Tab name="edges" title="Сильні сторони">
                {list}
                {!state.sheet.locked && <button className={s.add} onClick={add} disabled={state.sheet.locked}>+</button>}
            </Tab>
        </div>
    );

}