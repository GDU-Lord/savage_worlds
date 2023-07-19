import { bindActionCreators } from "@reduxjs/toolkit";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../store/reducers";
import { skill } from "../../../store/slices/sheet/skills";
import Level from "../../Level";
import Tab from "../Tab";
import s from "./index.module.sass";
import { word } from "../../Language/language";
import { attribute } from "../../../store/slices/sheet/attributes";

export interface props {

};

export default function Skills (props: props) {

    const state = useSelector((state: RootState) => state.sheet);
    const ref = useRef() as React.RefObject<HTMLInputElement>;

    const dispatch = useDispatch();

    const { addCustomSkill, saveData } = bindActionCreators(actions, dispatch);

    const list = Object.values(state.skills).filter((skill: skill) => {
        if(!state.sheet.locked)
            return true;
        else
            return skill.level[0] !== 0 || skill.level[1] !== 0;
    }).map((skill: skill, index) => {
        
        let attribute = "";

        if(skill.attribute !== "none")
            attribute = `(${word(skill.attribute)})`;

        return (<div className={s.skill} key={index}><div className={s.skill_title}>{skill.name}<span className={s.attribute}> {attribute}</span></div><Level type="skills" name={skill.id} core={skill.core}/></div>);

    });

   

    function addSkill () {
        let id = ref.current?.value.trim() ?? "";
        if(id === "")
            return;
        ref.current!.value = "";
        addCustomSkill(id);
        saveData();
    }

    return (
        <div className={s.skills}>
            <Tab name="skills" title={word("skills")}>
                {list}
                
                {!state.sheet.locked && <>
                    <input ref={ref} className={s.custom_id} disabled={state.sheet.locked}/>
                    <button className={s.add} onClick={addSkill} disabled={state.sheet.locked}>+</button>
                </>}
            </Tab>
        </div>
    );

}