import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input from "../../../Input";
import { Tool as ToolClass } from "../../../../store/slices/sheet/tools";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import Level from "../../../Level";
import { useEffect } from "react";
import { word } from "../../../Language/language";

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

    let amountText = "";
    
    if(t.amount !== 1)
        amountText = "x" + t.amount;

    let name = t.name.toString();

    if(t.amount === 1 && name === "")
        name = word("untitled");

    return (
        <div className={s.tool}>
            <div onClick={updateHidden} className={s.title}>{name} {amountText}</div>
            {!t.hidden && <><div className={s.container}>
                <div className={s.subtitle}>{word("title")}</div>
                <Input
                    placeholder={word("title")}
                    value={t.name.toString()}
                    onUpdate={val => update("name", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>{word("description")}</div>
                <Input
                    big={true}
                    placeholder={word("description")}
                    value={t.notes.toString()}
                    onUpdate={val => update("notes", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>{word("weight")}</div>
                <Input
                    placeholder={word("weight")}
                    value={t.weight.toString()}
                    validate={validateWeight}
                    onUpdate={val => updateWeight(val)}
                    disabled={state.sheet.locked}
                />
            </div>
            <div className={s.subtitle}>{word("quantity")}</div>
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