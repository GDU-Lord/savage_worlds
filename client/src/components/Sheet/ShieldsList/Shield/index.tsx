import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input from "../../../Input";
import { Shield as ShieldClass } from "../../../../store/slices/sheet/shields";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";

export interface props {
    id: string;
};

export default function Shield ({ id }: props) {

    const dispatch = useDispatch();
    const { saveData, updateShield, deleteShield, updateDerivedStatistics, toggleHiddenShield } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        updateDerivedStatistics(state);
    });

    const shield = state.shields.list.byId[id];

    function toggleWorn () {
        const shield = new ShieldClass(state.shields.list.byId[id], true);
        shield.worn = !shield.worn;
        updateShield(shield);
        saveData();
    }

    const validate = (val: string) => !isNaN(+val);

    function update (field: "bonus" | "cover" | "price" | "weight" | "minStrength", val: string) {
        const shield = new ShieldClass(state.shields.list.byId[id], true);
        shield[field] = +val;
        updateShield(shield);
        saveData();
    }

    function updateName (val: string) {
        const shield = new ShieldClass(state.shields.list.byId[id], true);
        shield.name = val;
        updateShield(shield);
        saveData();
    }

    function remove () {
        deleteShield(id);
        saveData();
    }

    function updateHidden () {
        toggleHiddenShield(id);
    }

    return (
        <div className={s.armor}>
            <div onClick={updateHidden} className={s.title}>{shield.name.toString()} ({shield.bonus})</div>
            {!shield.hidden && <><div className={s.container}>
                <div className={s.subtitle}>Назва</div>
                <Input
                    placeholder="Назва"
                    value={shield.name.toString()}
                    onUpdate={val => updateName(val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Бонус</div>
                <Input
                    placeholder="Бонус"
                    value={shield.bonus.toString()}
                    validate={validate}
                    onUpdate={val => update("bonus", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Укриття</div>
                <Input
                    placeholder="Бонус"
                    value={shield.cover.toString()}
                    validate={validate}
                    onUpdate={val => update("bonus", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Ціна</div>
                <Input
                    placeholder="Ціна"
                    value={shield.price.toString()}
                    validate={validate}
                    onUpdate={val => update("price", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Вага</div>
                <Input
                    placeholder="Вага"
                    value={shield.weight.toString()}
                    validate={validate}
                    onUpdate={val => update("weight", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Мін. сила</div>
                <Input
                    placeholder="Мін. сила"
                    value={shield.minStrength.toString()}
                    validate={validate}
                    onUpdate={val => update("minStrength", val)}
                    disabled={state.sheet.locked}
                />
            </div>
            <div className={s.container3}>
                <button onClick={() => toggleWorn()} className={`${s.button} ${shield.worn ? s.select : ""}`} disabled={state.sheet.locked}>Одягнений</button>
                <button onClick={remove} className={s.remove} disabled={state.sheet.locked}>X</button>
            </div></>}
        </div>
    );

}