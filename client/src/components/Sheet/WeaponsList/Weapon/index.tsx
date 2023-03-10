import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input from "../../../Input";
import { Weapon as WeaponClass } from "../../../../store/slices/sheet/weapons";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";

export interface props {
    id: string;
};

type damage = WeaponClass["damage"];
type range = WeaponClass["range"];

export default function Weapon ({ id }: props) {

    const dispatch = useDispatch();
    const { saveData, updateWeapon, deleteWeapon, updateDerivedStatistics, toggleHiddenWeapon } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        updateDerivedStatistics(state);
    });

    const w = state.weapons.list.byId[id];

    function toggle (field: "worn") {
        const weapon = new WeaponClass(w, true);
        weapon[field] = !weapon[field];
        updateWeapon(weapon);
        saveData();
    }

    const validate = (val: string) => !isNaN(+val);
    const validateDamage = (val: string) => val.search(/(^|^(\((к|d)(4|6|8|10|12)((\+|\-)[1-9][0-9]{0,}|)\)\+))[1-9][0-9]{0,}(к|d)(4|6|8|10|12)($|(\+|\-)[1-9][0-9]{0,}$)/) > -1;
    const validateRange = (val: string) => val.search(/^[1-9][0-9]{0,}\/[1-9][0-9]{0,}\/[1-9][0-9]{0,}$/) > -1;

    function update (field: "price" | "weight" | "minStrength" | "rof" | "ap", val: string) {
        const weapon = new WeaponClass(w, true);
        weapon[field] = +val;
        updateWeapon(weapon);
        saveData();
    }

    function updateText (field: "name" | "notes", val: string) {
        const weapon = new WeaponClass(w, true);
        weapon[field] = val;
        updateWeapon(weapon);
        saveData();
    }

    function updateRange (val: range) {
        const weapon = new WeaponClass(w, true);
        weapon.range = val;
        updateWeapon(weapon);
        saveData();
    }

    function updateDamage (val: damage) {
        const weapon = new WeaponClass(w, true);
        weapon.damage = val.replace(/^\((d|к)(4|6|8|10|12)((\+|\-)[1-9][0-9]{0,}|)\)\+/, "") as damage;
        updateWeapon(weapon);
        saveData();
    }

    function updateType (val: "range" | "melee") {
        const weapon = new WeaponClass(w, true);
        weapon.type = val;
        updateWeapon(weapon);
        saveData();
    }

    function remove () {
        deleteWeapon(id);
        saveData();
    }

    // adds strength die + mod for malee weapons (d10+2)+2d6+3 and lowers down weapon die if it's lower than the strength die
    function getDamage (val: damage) {
        if(w.type === "range") return val;
        const s = state.attributes.strength;
        const mod = s[1] === 0 ? "" : s[1] > 0 ? `+${s[1]}` : s[1].toString();
        const die = Math.min(+val.replace(/^[1-9][0-9]{0,}(d|к)/, "").replace(/(\+|\-)[1-9][0-9]{0,}$/, ""), s[0]);
        const val2 = val.replace(/d(4|6|8|10|12)/, `d${die}`).replace(/к(4|6|8|10|12)/, `к${die}`);
        const damage = `(d${s[0]}${mod})+${val2}`;
        return damage;
    }

    function updateHidden () {
        toggleHiddenWeapon(id);
    }

    const ap = w.ap === 0 ? "" : `[${w.ap}]`;

    return (
        <div className={s.weapon}>
            <div onClick={updateHidden} className={s.title}>{w.name.toString()} {getDamage(w.damage)} {ap}</div>
            {!w.hidden && <><div className={s.container}>
                <div className={s.subtitle}>Назва</div>
                <Input
                    placeholder="Назва"
                    value={w.name.toString()}
                    onUpdate={val => updateText("name", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Ушкодження</div>
                <Input
                    placeholder="Ушкодження"
                    value={getDamage(w.damage)}
                    validate={validateDamage}
                    onUpdate={val => updateDamage(val as damage)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Проникнення</div>
                <Input
                    placeholder="Проникнення"
                    value={w.ap.toString()}
                    validate={validate}
                    onUpdate={val => update("ap", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Дистанція</div>
                <Input
                    placeholder="Дистанція"
                    value={w.range.toString()}
                    validate={validateRange}
                    onUpdate={val => updateRange(val as range)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Частота</div>
                <Input
                    placeholder="Частота"
                    value={w.rof.toString()}
                    validate={validate}
                    onUpdate={val => update("rof", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Мін. сила</div>
                <Input
                    placeholder="Мін. сила"
                    value={w.minStrength.toString()}
                    validate={validate}
                    onUpdate={val => update("minStrength", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Ціна</div>
                <Input
                    placeholder="Ціна"
                    value={w.price.toString()}
                    validate={validate}
                    onUpdate={val => update("price", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Вага</div>
                <Input
                    placeholder="Вага"
                    value={w.weight.toString()}
                    validate={validate}
                    onUpdate={val => update("weight", val)}
                    disabled={state.sheet.locked}
                />
                <div className={s.subtitle}>Додатково</div>
                <Input
                    placeholder="Додатково"
                    value={w.notes.toString()}
                    onUpdate={val => updateText("notes", val)}
                    disabled={state.sheet.locked}
                />
            </div>
            <div className={s.container2}>
                <button onClick={() => updateType("melee")} className={`${s.button} ${w.type === "melee" ? s.select : ""}`} disabled={state.sheet.locked}>Ближня</button>
                <button onClick={() => updateType("range")} className={`${s.button} ${w.type === "range" ? s.select : ""}`} disabled={state.sheet.locked}>Дальня</button>
            </div>
            <div className={s.container3}>
                <button onClick={() => toggle("worn")} className={`${s.button} ${w.worn ? s.select : ""}`} disabled={state.sheet.locked}>Одягнена</button>
                <button onClick={remove} className={s.remove} disabled={state.sheet.locked}>X</button>
            </div></>}
        </div>
    );

}