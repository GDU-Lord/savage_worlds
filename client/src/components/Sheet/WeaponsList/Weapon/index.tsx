import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../../store/reducers";
import Input, { validateNumber } from "../../../Input";
import { Weapon as WeaponClass, weapon } from "../../../../store/slices/sheet/weapons";
import s from "./index.module.sass";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { word } from "../../../Language/language";
import { getDamage, getBlast } from "../../../../scripts";
import Level from "../../../Level";

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

    const validateDamage = (val: string) => val.search(/(^|^(\((к|d)(4|6|8|10|12)((\+|\-)[1-9][0-9]{0,}|)\)\+))[1-9][0-9]{0,}(к|d)(4|6|8|10|12)($|(\+|\-)[1-9][0-9]{0,}$)/) > -1;
    const validateRange = (val: string) => val.search(/^[1-9][0-9]{0,}\/[1-9][0-9]{0,}\/[1-9][0-9]{0,}$/) > -1;
    const validateBlast = (val: string) => val.search(/^(S|M|L|C|S\(2\)|M\(4\)|L\(6\)|C\(9\))$/) > -1;

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

    function updateType (val: "range" | "melee" | "throwable") {
        const weapon = new WeaponClass(w, true);
        weapon.type = val;
        updateWeapon(weapon);
        saveData();
    }

    function updateBlast (val: string) {
        const value = (val.match(/(S|M|L|C)/)?.[0] ?? "s").toLowerCase() as WeaponClass["blast"];
        const weapon = new WeaponClass(w, true);
        weapon.blast = value;
        updateWeapon(weapon);
        saveData();
    }

    function remove () {
        deleteWeapon(id);
        saveData();
    }

    // adds strength die + mod for malee weapons (d10+2)+2d6+3 and lowers down weapon die if it's lower than the strength die
    // function getDamage (val: damage) {
    //     if(w.type === "range") return val;
    //     const s = state.attributes.strength;
    //     const mod = s[1] === 0 ? "" : s[1] > 0 ? `+${s[1]}` : s[1].toString();
    //     const die = Math.min(+val.replace(/^[1-9][0-9]{0,}(d|к)/, "").replace(/(\+|\-)[1-9][0-9]{0,}$/, ""), s[0]);
    //     const val2 = val.replace(/d(4|6|8|10|12)/, `d${die}`).replace(/к(4|6|8|10|12)/, `к${die}`);
    //     const damage = `(d${s[0]}${mod})+${val2}`;
    //     return damage;
    // }

    function updateHidden () {
        toggleHiddenWeapon(id);
    }

    function changeAmmount (n: number) {
        const tool = new WeaponClass(w, true);
        tool.amount += n;
        updateWeapon(tool);
        saveData();
    }

    // const ap = w.ap === 0 ? "" : `[${w.ap}]`;

    let amountText = "";
    
    if(w.type === "throwable" && w.amount !== 1)
        amountText = " x" + w.amount;

    return (
        <div className={s.weapon}>
            <div onClick={updateHidden} className={s.title}>{w.name.toString()} {getDamage(w, state.attributes.strength)}{amountText}</div>
            {!w.hidden && <><div className={s.container}>
                <div className={s.block_container}>
                    <div className={s.double_block}>
                        <div className={s.small_block}>
                            <div className={s.subtitle}>{word("title")}</div>
                            <Input
                                placeholder={word("title")}
                                value={w.name.toString()}
                                onUpdate={val => updateText("name", val)}
                                disabled={state.sheet.locked}
                            />
                            <div className={s.subtitle}>{word("damage")}</div>
                            <Input
                                placeholder={word("damage")}
                                value={w.damage}
                                validate={validateDamage}
                                onUpdate={val => updateDamage(val as damage)}
                                disabled={state.sheet.locked}
                            />
                            <div className={s.subtitle}>{word("armor_piercing")}</div>
                            <Input
                                placeholder={word("armor_piercing")}
                                value={w.ap.toString()}
                                validate={validateNumber}
                                onUpdate={val => update("ap", val)}
                                disabled={state.sheet.locked}
                            />
                            {(w.type === "range" || w.type === "throwable") && <>
                            <div className={s.subtitle}>{word("range")}</div>
                            <Input
                                placeholder={word("range")}
                                value={w.range.toString()}
                                validate={validateRange}
                                onUpdate={val => updateRange(val as range)}
                                disabled={state.sheet.locked}
                            /></>}
                        </div>
                        <div className={s.small_block}>
                            {w.type === "range" && <>
                            <div className={s.subtitle}>{word("rate_of_fire")}</div>
                            <Input
                                placeholder={word("rate_of_fire")}
                                value={w.rof.toString()}
                                validate={validateNumber}
                                onUpdate={val => update("rof", val)}
                                disabled={state.sheet.locked}
                            /></>}
                            {w.type === "throwable" && <>
                            <div className={s.subtitle}>{word("blast")}</div>
                            <Input
                                placeholder={word("blast")}
                                value={getBlast(w.blast.toString() as weapon["blast"])}
                                validate={validateBlast}
                                onUpdate={val => updateBlast(val)}
                                disabled={state.sheet.locked}
                            /></>}
                            <div className={s.subtitle}>{word("min_strength")}</div>
                            <Input
                                placeholder={word("min_strength")}
                                value={w.minStrength.toString()}
                                validate={validateNumber}
                                onUpdate={val => update("minStrength", val)}
                                disabled={state.sheet.locked}
                            />
                            <div className={s.subtitle}>{word("price")}</div>
                            <Input
                                placeholder={word("price")}
                                value={w.price.toString()}
                                validate={validateNumber}
                                onUpdate={val => update("price", val)}
                                disabled={state.sheet.locked}
                            />
                            <div className={s.subtitle}>{word("weight")}</div>
                            <Input
                                placeholder={word("weight")}
                                value={w.weight.toString()}
                                validate={validateNumber}
                                onUpdate={val => update("weight", val)}
                                disabled={state.sheet.locked}
                            />
                        </div>
                    </div>
                </div>
                <div className={s.big_block}>
                    <div className={s.subtitle}>{word("details")}</div>
                    <Input
                        big={true}
                        placeholder={word("details")}
                        value={w.notes.toString()}
                        onUpdate={val => updateText("notes", val)}
                        disabled={state.sheet.locked}
                    />
                </div>
            </div>
            {w.type === "throwable" && <div className={s.container4}><div className={s.subtitle}>{word("quantity")}</div>
            <Level type="weaponAmount" name={id} always_active={true}/></div>}
            <div className={s.container2}>
                <button onClick={() => updateType("melee")} className={`${s.button} ${w.type === "melee" ? s.select : ""}`} disabled={state.sheet.locked}>{word("melee")}</button>
                <button onClick={() => updateType("range")} className={`${s.button} ${w.type === "range" ? s.select : ""}`} disabled={state.sheet.locked}>{word("ranged")}</button>
                <button onClick={() => updateType("throwable")} className={`${s.button} ${w.type === "throwable" ? s.select : ""}`} disabled={state.sheet.locked}>{word("throwable")}</button>
            </div>
            <div className={s.container3}>
                <button onClick={() => toggle("worn")} className={`${s.button} ${w.worn ? s.select : ""}`} disabled={state.sheet.locked}>{word("worn")}</button>
                <button onClick={remove} className={s.remove} disabled={state.sheet.locked}>X</button>
            </div></>}
            {w.type === "throwable" && w.hidden && <div className={s.amount}>
                <button onClick={() => changeAmmount(-1)} className={s.red}>-</button>
                <button onClick={() => changeAmmount(1)} className={s.green}>+</button>
            </div>}
        </div>
    );

}