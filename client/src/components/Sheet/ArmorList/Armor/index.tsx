import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input from "../../../Input";
import { Armor as ArmorClass } from "../../../../store/slices/sheet/armor";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";

export interface props {
    id: string;
};

export default function Armor ({ id }: props) {

    const dispatch = useDispatch();
    const { saveData, updateArmor, deleteArmor, updateDerivedStatistics, toggleHiddenArmor } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        updateDerivedStatistics(state);
    });

    const armor = state.armor.list.byId[id];

    function toggle (field: "head" | "torso" | "arms" | "legs" | "worn") {
        const armor = new ArmorClass(state.armor.list.byId[id], true);
        armor[field] = !armor[field];
        updateArmor(armor);
        saveData();
    }

    const validate = (val: string) => !isNaN(+val);

    function update (field: "armor" | "price" | "weight" | "minStrength", val: string) {
        const armor = new ArmorClass(state.armor.list.byId[id], true);
        armor[field] = +val;
        updateArmor(armor);
        saveData();
    }

    function updateName (val: string) {
        const armor = new ArmorClass(state.armor.list.byId[id], true);
        armor.name = val;
        updateArmor(armor);
        saveData();
    }

    function remove () {
        deleteArmor(id);
        saveData();
    }

    function updateHidden () {
        toggleHiddenArmor(id);
    }

    return (
        <div className={s.armor}>
            <div onClick={updateHidden} className={s.title}>{armor.name.toString()} ({armor.armor})</div>
            {!armor.hidden && <><div className={s.container}>
                <div className={s.subtitle}>Назва</div>
                <Input
                    placeholder="Назва"
                    value={armor.name.toString()}
                    onUpdate={val => updateName(val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Броня</div>
                <Input
                    placeholder="Захист"
                    value={armor.armor.toString()}
                    validate={validate}
                    onUpdate={val => update("armor", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Ціна</div>
                <Input
                    placeholder="Ціна"
                    value={armor.price.toString()}
                    validate={validate}
                    onUpdate={val => update("price", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Вага</div>
                <Input
                    placeholder="Вага"
                    value={armor.weight.toString()}
                    validate={validate}
                    onUpdate={val => update("weight", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Мін. сила</div>
                <Input
                    placeholder="Мін. сила"
                    value={armor.minStrength.toString()}
                    validate={validate}
                    onUpdate={val => update("minStrength", val)}
                    disabled={state.sheet.locked}
                />
            </div>
            <div className={s.container2}>
                <button onClick={() => toggle("head")} className={`${s.button} ${armor.head ? s.select : ""}`} disabled={state.sheet.locked}>Г</button>
                <button onClick={() => toggle("torso")} className={`${s.button} ${armor.torso ? s.select : ""}`} disabled={state.sheet.locked}>Т</button>
                <button onClick={() => toggle("arms")} className={`${s.button} ${armor.arms ? s.select : ""}`} disabled={state.sheet.locked}>Р</button>
                <button onClick={() => toggle("legs")} className={`${s.button} ${armor.legs ? s.select : ""}`} disabled={state.sheet.locked}>Н</button>
            </div>
            <div className={s.container3}>
                <button onClick={() => toggle("worn")} className={`${s.button} ${armor.worn ? s.select : ""}`} disabled={state.sheet.locked}>Одягнена</button>
                <button onClick={remove} className={s.remove} disabled={state.sheet.locked}>X</button>
            </div></>}
        </div>
    );

}