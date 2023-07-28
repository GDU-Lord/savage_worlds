import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input, { validateNumber } from "../../../Input";
import { Armor as ArmorClass } from "../../../../store/slices/sheet/armor";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { word } from "../../../Language/language";

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
                <div className={s.big_block}>
                    <div className={s.subtitle}>{word("title")}</div>
                    <Input
                        placeholder={word("title")}
                        value={armor.name.toString()}
                        onUpdate={val => updateName(val)}
                        disabled={state.sheet.locked}
                    />
                </div>
                <div className={s.double_block}>
                    <div className={s.small_block}>
                        <div className={s.subtitle}>{word("armor")}</div>
                        <Input
                            placeholder={word("armor")}
                            value={armor.armor.toString()}
                            validate={validateNumber}
                            onUpdate={val => update("armor", val)}
                            disabled={state.sheet.locked}
                        />
                        <div className={s.subtitle}>{word("price")}</div>
                        <Input
                            placeholder={word("price")}
                            value={armor.price.toString()}
                            validate={validateNumber}
                            onUpdate={val => update("price", val)}
                            disabled={state.sheet.locked}
                        />
                    </div>
                    <div className={s.small_block}>
                        <div className={s.subtitle}>{word("weight")}</div>
                        <Input
                            placeholder={word("weight")}
                            value={armor.weight.toString()}
                            validate={validateNumber}
                            onUpdate={val => update("weight", val)}
                            disabled={state.sheet.locked}
                        />
                        <div className={s.subtitle}>{word("min_strength")}</div>
                        <Input
                            placeholder={word("min_strength")}
                            value={armor.minStrength.toString()}
                            validate={validateNumber}
                            onUpdate={val => update("minStrength", val)}
                            disabled={state.sheet.locked}
                        />
                    </div>
                </div>
            </div>
            <div className={s.container2}>
                <button onClick={() => toggle("head")} className={`${s.button} ${armor.head ? s.select : ""}`} disabled={state.sheet.locked}>{word("h_head")}</button>
                <button onClick={() => toggle("torso")} className={`${s.button} ${armor.torso ? s.select : ""}`} disabled={state.sheet.locked}>{word("t_torso")}</button>
                <button onClick={() => toggle("arms")} className={`${s.button} ${armor.arms ? s.select : ""}`} disabled={state.sheet.locked}>{word("a_arms")}</button>
                <button onClick={() => toggle("legs")} className={`${s.button} ${armor.legs ? s.select : ""}`} disabled={state.sheet.locked}>{word("l_legs")}</button>
            </div>
            <div className={s.container3}>
                <button onClick={() => toggle("worn")} className={`${s.button} ${armor.worn ? s.select : ""}`} disabled={state.sheet.locked}>{word("worn")}</button>
                <button onClick={remove} className={s.remove} disabled={state.sheet.locked}>X</button>
            </div></>}
        </div>
    );

}