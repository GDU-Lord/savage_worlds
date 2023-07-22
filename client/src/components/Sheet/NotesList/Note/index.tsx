import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input from "../../../Input";
import { Note as NoteClass } from "../../../../store/slices/sheet/notes";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import { word } from "../../../Language/language";

export interface props {
    id: string;
};

export default function Hindrance ({ id }: props) {

    const dispatch = useDispatch();
    const { saveData, updateNote, deleteNote, toggleHiddenNote } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    const t = state.notes.list.byId[id];

    function update (field: "name" | "notes", val: string) {
        const tool = new NoteClass(t, true);
        tool[field] = val;
        updateNote(tool);
        saveData();
    }

    function remove () {
        deleteNote(id);
        saveData();
    }

    function updateHidden () {
        toggleHiddenNote(id);
    }

    const getName = (name: string) => name.trim() === "" ? "---" : name;

    return (
        <div className={s.component}>
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