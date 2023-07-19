import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input from "../../../Input";
import { Edge as EdgeClass } from "../../../../store/slices/sheet/edges";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { word } from "../../../Language/language";

export interface props {
    id: string;
};

export default function Edge ({ id }: props) {

    const dispatch = useDispatch();
    const { saveData, updateEdge, deleteEdge, updateDerivedStatistics, toggleHiddenEdge } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        updateDerivedStatistics(state);
    });

    const t = state.edges.list.byId[id];

    function update (field: "name" | "notes", val: string) {
        const tool = new EdgeClass(t, true);
        tool[field] = val;
        updateEdge(tool);
        saveData();
    }

    function remove () {
        deleteEdge(id);
        saveData();
    }

    function updateHidden () {
        toggleHiddenEdge(id);
    }

    const getName = (name: string) => name.trim() === "" ? "---" : name;

    return (
        <div className={s.edge}>
            <div onClick={updateHidden} className={s.title}>{getName(t.name.toString())}</div>
            {!t.hidden && <><div>
                {!state.sheet.locked && <Input
                    placeholder={word("title")}
                    value={t.name.toString()}
                    onUpdate={val => update("name", val)}
                    disabled={state.sheet.locked}
                />}
            </div>
            <Input
                placeholder={word("description")}
                big={true}
                value={t.notes.toString()}
                onUpdate={val => update("notes", val)}
                disabled={state.sheet.locked}
            />
            <button onClick={remove} className={s.button} disabled={state.sheet.locked}>X</button>
            </>}
        </div>
    );

}