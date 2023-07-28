import { useDispatch, useSelector } from "react-redux";
import s from "./index.module.sass";
import { RootState, actions } from "../../store/reducers";
import { word as wd } from "../Language/language";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { skills } from "../../character";
import { attribute } from "../../store/slices/sheet/attributes";
import words from "../../words";
import { weapon } from "../../store/slices/sheet/weapons";
import { getDamage, parseModifier } from "../../scripts";

export interface props {

};

/* 

* toughness of head, torso, arms, legs
* parry
* wounds
* fatigue
* weapons
* attributes
    * agility
    * spirit
    * vigor
    * strength
    * smarts
* skills
    * fighting
    * shooting
    * athletics
    * intimidation
    * taunt
    * psionics
    * faith
    * occult
    * weird science
    * spellcasting
    
Ніж d4+d10+5 [1]
Пістолет 2d10+5 [1] (5)

*/

function word (str: keyof typeof words) {
    let res = wd(str);
    return res.slice(0, 8);
}

export default function Summary (props: props) {

    const state = useSelector((state: RootState) => state.sheet);
    const summaryState = useSelector((state: RootState) => state.summary);
    
    const dispatch = useDispatch();
    const { updateDerivedStatistics } = bindActionCreators(actions, dispatch);

    console.log(state);

    useEffect(() => {
        // window.document.title
        updateDerivedStatistics(state);
    }, [state]);

    document.head.querySelector("title")!.innerText = state.text.name.trim() === "" ? word("character") : state.text.name;

    // armor level
    let head = 0;
    let arms = 0;
    let torso = 0;
    let legs = 0;

    const modifier = -state.other.fatigue-summaryState.wounds-state.other.wounds-(summaryState.distracted ? 2 : 0);

    for(const id of state.armor.list.allIds) {
        const armor = state.armor.list.byId[id];
        if(armor.head) head = Math.max(head, armor.armor);
        if(armor.torso) torso = Math.max(torso, armor.armor);
        if(armor.arms) arms = Math.max(head, armor.armor);
        if(armor.legs) legs = Math.max(legs, armor.armor);
    }

    // skills

    const skillList: (keyof skills)[][] = [["fighting", "shooting", "athletics"], ["intimidation", "taunt", "persuasion"], ["faith", "focus", "spellcasting", "occult", "psionics"]];

    const parseSkills = (skillName: keyof skills, key: number) => {
        const skill = state.skills[skillName];
        let mod = skill.level[1] + modifier;
        let die = skill.level[0];
        // setting up a default die and modifier for untrained skills
        if(die === 0) {
            mod -= 2;
            die = 4;
        }
        const modText = parseModifier(mod);
        return (<div key={key} className={s.text_field}><i>{word(skillName)}</i>: <b>d{die}{modText}</b></div>);
    }

    const list0 = skillList[0].map(parseSkills);
    const list1 = skillList[1].map(parseSkills);
    const list2 = skillList[2].map(parseSkills);
    const attributes: JSX.Element[] = [];

    // attributes

    for(const i in state.attributes) {
        const attribute = state.attributes[i as attribute];
        let mod = attribute[1] + modifier;
        let die = attribute[0];
        if(die === 0) {
            mod -= 2;
            die = 4;
        }
        const modText = mod === 0 ? "" : ((mod > 0 ? "+" : "") + String(mod));
        attributes.push(<div key={i} className={s.text_field}><i>{word(i as attribute)}</i>: <b>d{die}{modText}</b></div>);
    }

    // weapons

    const weapons = state.weapons.list.allIds.map((id, index) => {
        const weapon = state.weapons.list.byId[id];
        // range
        const range = weapon.type === "range" ? `(${weapon.range})` : "";

        const damage = getDamage(weapon, state.attributes.strength, 0);
        
        return (<div className={s.text_field} key={index}>
            <i>{weapon.name} {range}</i><br/>
            <b>{damage}</b>
        </div>);
    });

    const parry = state.derived.parry-(summaryState.voulnerable ? 2 : 0);

    return (
        <div className={s.component}>
            <div className={s.block}>
                <div className={s.derived}>
                    <div className={s.text_field}>
                        <i>{word("h_head")}</i> <b>{state.derived.toughness+head}({head})</b><br/>
                        <i>{word("t_torso")}</i> <b>{state.derived.toughness+torso}({torso})</b><br/>
                        <i>{word("a_arms")}</i> <b>{state.derived.toughness+arms}({arms})</b><br/>
                        <i>{word("l_legs")}</i> <b>{state.derived.toughness+legs}({legs})</b><br/>
                    </div><br/>
                    <div className={s.text_field}><i>{word("parry")}:</i> <b>{parry}</b></div>
                    <div className={s.text_field}><i>{word("modifier")}:</i> <b>{modifier}</b></div>
                </div><br/>
                <div className={s.attributes}>
                    {attributes}<br/>
                </div>
                <div className={s.weapons}>
                    {weapons}
                </div>
            </div>
            <div className={s.block}>
                <div className={s.skills}>
                    {list0}<br/>
                    {list1}<br/>
                    {list2}<br/>
                </div>
            </div>
        </div>
    );

}