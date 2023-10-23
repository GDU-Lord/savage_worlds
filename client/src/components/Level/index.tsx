import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { characterSave } from "../../character";
import { actions, RootState } from "../../store/reducers";
import { attribute } from "../../store/slices/sheet/attributes";
import { state as otherState } from "../../store/slices/sheet/other";
import { Tool as ToolClass } from "../../store/slices/sheet/tools";
import { Weapon as WeaponClass } from "../../store/slices/sheet/weapons";
import Input, { validateNumber } from "../Input";
import s from "./index.module.sass";

export interface props {
    type: "attributes" | "skills" | "other" | "toolAmount" | "weaponAmount";
    name: string | attribute;
    always_active?: boolean;
    core?: boolean;
};

export default function Level ({ type, name, core = false, always_active = false }: props) {

    const state = useSelector((state: RootState) => state.sheet);

    let [die, mod] = [0, 0] as level;

    if(type === "attributes")
        [die, mod] = state.attributes[name as attribute];
    if(type === "skills")
        [die, mod] = state.skills[name].level;
    if(type === "other")
        mod = state.other[name as keyof otherState];
    if(type === "toolAmount")
        mod = state.tools.list.byId[name].amount;
    if(type === "weaponAmount")
        mod = state.weapons.list.byId[name].amount;

    const dispatch = useDispatch();
    const { saveData, setAttribute, setSkill, updateDerivedStatistics, setOtherStatistic, updateTool, updateWeapon } = bindActionCreators(actions, dispatch);

    function setModifier (value: string) {
        mod = +value;
        update();
    }

    function setDie (value: die) {
        die = value;
        update();
    }

    useEffect(() => {
       
        updateDerivedStatistics(state);

    });

    function update () {
        switch(type) {
            case "attributes":
                setAttribute({
                    name: name as attribute,
                    value: [die, mod]
                });
                break;
            case "skills":
                setSkill({
                    name,
                    value: [die, mod]
                });
                break;
            case "other":
                setOtherStatistic({
                    name: name as keyof otherState,
                    value: mod
                });
                break;
            case "toolAmount":
                const tool = new ToolClass(state.tools.list.byId[name], true);
                tool.amount = mod;
                updateTool(tool);
                break;
            case "weaponAmount":
                const weapon = new WeaponClass(state.weapons.list.byId[name], true);
                weapon.amount = mod;
                updateWeapon(weapon);
                break;
        }
        saveData();
    }

    function adjust (e: React.MouseEvent<HTMLButtonElement>, n: number) {
        mod += n;
        update();
    }

    const locked = state.sheet.locked && !always_active;
    const modNum = die === 0 ? mod-2 : mod;
    const modStr = modNum === 0 ? "" : modNum > 0 ? "+"+modNum : modNum.toString();

    return (
        <div className={s.level}>
            { (type === "other" || type === "toolAmount" || type === "weaponAmount" || !locked) && <>
            { type !== "other" && type !== "toolAmount" && type !== "weaponAmount" && <>
                <button disabled={type === "attributes" || core || locked} onClick={() => setDie(0)} className={s.die+" "+(die === 0 ? s.select : null)}>0</button>
                <button onClick={() => setDie(4)} className={s.die+" "+(die === 4 ? s.select : null)} disabled={locked}>4</button>
                <button onClick={() => setDie(6)} className={s.die+" "+(die === 6 ? s.select : null)} disabled={locked}>6</button>
                <button onClick={() => setDie(8)} className={s.die+" "+(die === 8 ? s.select : null)} disabled={locked}>8</button>
                <button onClick={() => setDie(10)} className={s.die+" "+(die === 10 ? s.select : null)} disabled={locked}>10</button>
                <button onClick={() => setDie(12)} className={s.die+" "+(die === 12 ? s.select : null)} disabled={locked}>12</button>
            </> }
            <Input
                placeholder="0"
                value={mod.toString()}
                validate={validateNumber}
                onUpdate={setModifier}
                disabled={locked}
            />
            <button onClick={e => adjust(e, -1)} className={s.adjust+" "+s.minus} disabled={locked}>-</button>
            <button onClick={e => adjust(e, 1)} className={s.adjust+" "+s.plus} disabled={locked}>+</button>
            </> }
            { (type !== "other" && type !== "toolAmount" && type !== "weaponAmount" && locked) && <>
                <div className={s.lockedDie}>d{die === 0 ? 4 : die}</div><div className={s.lockedMod}>{modStr}</div><div className={s.lockedDieImg + " " + s["d"+(die === 0 ? 4 : die)]}></div>
            </>}
        </div>
    );

}