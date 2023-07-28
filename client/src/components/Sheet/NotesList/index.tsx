import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../store/reducers";
import { Note as NoteClass } from "../../../store/slices/sheet/notes";
import Tab from "../Tab";
import Note from "../NotesList/Note";
import s from "./index.module.sass";
import { word } from "../../Language/language";

export interface props {

};

export default function NotesList (props: props) {

    const dispatch = useDispatch();
    const { saveData, addNotes, updateDerivedStatistics } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        updateDerivedStatistics(state);
    });

    const list = state.notes.list.allIds.map((id, index) => {
        return (<Note id={id} key={index}/>);
    });

    function add () {
        addNotes([
            new NoteClass({
                name: "",
                notes: "",
                hidden: false
            })
        ]);
        saveData();
    }

    return (
        <div className={s.component}>
            {(list.length > 0 || !state.sheet.locked) && <Tab name="notes" title={word("notes")}>
                {list}
                {!state.sheet.locked && <button className={s.add} onClick={add} disabled={state.sheet.locked}>+</button>}
            </Tab>}
        </div>
    );

}