import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input from "../../../Input";
import { Shield as ShieldClass } from "../../../../store/slices/sheet/shields";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { word } from "../../../Language/language";

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
            <div onClick={updateHidden} className={s.title}>{shield.name.toString()} ({shield.bonus}) [{shield.cover}]</div>
            {!shield.hidden && <><div className={s.container}>
                <div className={s.double_block}>
                    <div className={s.small_block}>
                        <div className={s.subtitle}>{word("title")}</div>
                        <Input
                            placeholder={word("title")}
                            value={shield.name.toString()}
                            onUpdate={val => updateName(val)}
                            disabled={state.sheet.locked}
                        />
                        <div className={s.subtitle}>{word("bonus")}</div>
                        <Input
                            placeholder={word("bonus")}
                            value={shield.bonus.toString()}
                            validate={validate}
                            onUpdate={val => update("bonus", val)}
                            disabled={state.sheet.locked}
                        />
                        <div className={s.subtitle}>{word("cover")}</div>
                        <Input
                            placeholder={word("cover")}
                            value={shield.cover.toString()}
                            validate={validate}
                            onUpdate={val => update("cover", val)}
                            disabled={state.sheet.locked}
                        />
                    </div>
                    <div className={s.small_block}>
                        <div className={s.subtitle}>{word("price")}</div>
                        <Input
                            placeholder={word("price")}
                            value={shield.price.toString()}
                            validate={validate}
                            onUpdate={val => update("price", val)}
                            disabled={state.sheet.locked}
                        />
                        <div className={s.subtitle}>{word("weight")}</div>
                        <Input
                            placeholder={word("weight")}
                            value={shield.weight.toString()}
                            validate={validate}
                            onUpdate={val => update("weight", val)}
                            disabled={state.sheet.locked}
                        />
                        <div className={s.subtitle}>{word("min_strength")}</div>
                        <Input
                            placeholder={word("min_strength")}
                            value={shield.minStrength.toString()}
                            validate={validate}
                            onUpdate={val => update("minStrength", val)}
                            disabled={state.sheet.locked}
                        />
                    </div>
                </div>
            </div>
            <div className={s.container3}>
                <button onClick={() => toggleWorn()} className={`${s.button} ${shield.worn ? s.select : ""}`} disabled={state.sheet.locked}>{word("worn")}</button>
                <button onClick={remove} className={s.remove} disabled={state.sheet.locked}>X</button>
            </div></>}
        </div>
    );

}