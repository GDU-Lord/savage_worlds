import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input from "../../../Input";
import { Tool as ToolClass } from "../../../../store/slices/sheet/tools";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import Level from "../../../Level";
import { useEffect } from "react";

export interface props {
    id: string;
};

export default function Tool ({ id }: props) {

    const dispatch = useDispatch();
    const { saveData, updateTool, deleteTool, updateDerivedStatistics, toggleHiddenTool } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        updateDerivedStatistics(state);
    });

    const t = state.tools.list.byId[id];

    const validateWeight = (val: string) => !isNaN(+val);

    function update (field: "name" | "notes", val: string) {
        const tool = new ToolClass(t, true);
        tool[field] = val;
        updateTool(tool);
        saveData();
    }

    function updateWeight (val: string) {
        const tool = new ToolClass(t, true);
        tool.weight = +val;
        updateTool(tool);
        saveData();
    }

    function remove () {
        deleteTool(id);
        saveData();
    }

    function updateHidden () {
        toggleHiddenTool(id);
    }

    function changeAmmount (n: number) {
        const tool = new ToolClass(t, true);
        tool.amount += n;
        updateTool(tool);
        saveData();
    }

    return (
        <div className={s.tool}>
            <div onClick={updateHidden} className={s.title}>{t.name.toString()} x{t.amount}</div>
            {!t.hidden && <><div className={s.container}>
                <div className={s.subtitle}>Назва</div>
                <Input
                    placeholder="Назва"
                    value={t.name.toString()}
                    onUpdate={val => update("name", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Опис</div>
                <Input
                    placeholder="Опис"
                    value={t.notes.toString()}
                    onUpdate={val => update("notes", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Вага</div>
                <Input
                    placeholder="Вага"
                    value={t.weight.toString()}
                    validate={validateWeight}
                    onUpdate={val => updateWeight(val)}
                    disabled={state.sheet.locked}
                />
            </div>
            <div className={s.subtitle}>Кількість</div>
            <Level type="toolAmount" name={id} always_active={true}/>
            <button onClick={remove} className={s.button} disabled={state.sheet.locked}>X</button>
            </>}
            {t.hidden && <div className={s.amount}>
                <button onClick={() => changeAmmount(-1)} className={s.red}>-</button>
                <button onClick={() => changeAmmount(1)} className={s.green}>+</button>
            </div>}
        </div>
    );

}