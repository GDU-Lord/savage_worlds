import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input from "../../../Input";
import { Hindrance as HindranceClass } from "../../../../store/slices/sheet/hindrances";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { word } from "../../../Language/language";

export interface props {
    id: string;
};

export default function Hindrance ({ id }: props) {

    const dispatch = useDispatch();
    const { saveData, updateHindrance, deleteHindrance, updateDerivedStatistics, toggleHiddenHindrance } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        updateDerivedStatistics(state);
    });

    const t = state.hindrances.list.byId[id];

    function update (field: "name" | "notes", val: string) {
        const tool = new HindranceClass(t, true);
        tool[field] = val;
        updateHindrance(tool);
        saveData();
    }

    function remove () {
        deleteHindrance(id);
        saveData();
    }

    function updateHidden () {
        toggleHiddenHindrance(id);
    }

    const getName = (name: string) => name.trim() === "" ? "---" : name;

    return (
        <div className={s.hindrance}>
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