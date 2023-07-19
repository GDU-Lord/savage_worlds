import { createSlice } from "@reduxjs/toolkit";
import { attribute } from "./attributes";
import { word } from "../../../components/Language/language";
import words from "../../../words";

export type state = {
    [key: string]: skill;
};

export interface payload {
    name: string;
    value: level;
};

export interface skill {
    id: string;
    level: level;
    name: string;
    attribute: attribute | "none";
    core: boolean;
    custom: boolean;
};

export class Skill implements skill {

    static list: state = {};

    static copy () {
        const res: state = {};
        for(const i in this.list) {
            const { name, level, id, attribute, core } = this.list[i];
            res[i] = new Skill(name, [...level], id, attribute as attribute, core);
        }
        return res;
    }

    id: string;
    level: level;
    name: string;
    attribute: attribute;
    core: boolean;
    custom: boolean;

    constructor (name: string, level: level, id: string, attribute: attribute, core: boolean = false, custom: boolean = false) {
        
        if(name === "") name = word(id as keyof typeof words) ?? word("untitled");

        this.name = name;
        this.level = level;
        this.id = id;
        this.attribute = attribute;
        this.core = core;
        this.custom = custom;
        Skill.list[this.id] = this;
    }

}

new Skill("", [4, 0], "common_knowledge", "smarts", true);
new Skill("", [4, 0], "notice", "smarts", true);
new Skill("", [4, 0], "persuasion", "spirit", true);
new Skill("", [4, 0], "stealth", "agility", true);
new Skill("", [4, 0], "athletics", "agility", true);

new Skill("", [0, 0], "boating", "agility");
new Skill("", [0, 0], "driving", "agility");
new Skill("", [0, 0], "fighting", "agility");
// new Skill("Злам замків", [0, 0], "lockpicking", "agility");
new Skill("", [0, 0], "thievery", "agility");
new Skill("", [0, 0], "piloting", "agility");
new Skill("", [0, 0], "riding", "agility");
new Skill("", [0, 0], "shooting", "agility");
// new Skill("Плавання", [0, 0], "swimming", "agility");
// new Skill("Кидання", [0, 0], "throwing", "agility");

new Skill("", [0, 0], "gambling", "smarts");
new Skill("", [0, 0], "healing", "smarts");
// new Skill("Розслідування", [0, 0], "investigation", "smarts");
new Skill("", [0, 0], "research", "smarts");
new Skill("", [0, 0], "repair", "smarts");
// new Skill("Вуличний жаргон", [0, 0], "streetwise", "smarts");
new Skill("", [0, 0], "battle", "smarts");
new Skill("", [0, 0], "hacking", "smarts");
new Skill("", [0, 0], "electronics", "smarts");
new Skill("", [0, 0], "weird_science", "smarts");
new Skill("", [0, 0], "survival", "smarts");
new Skill("", [0, 0], "taunt", "smarts");
new Skill("", [0, 0], "psionics", "smarts");
new Skill("", [0, 0], "spellcasting", "smarts");
// new Skill("Слідопитство", [0, 0], "tracking", "smarts");

new Skill("", [0, 0], "guts", "spirit");
new Skill("", [0, 0], "intimidation", "spirit");
new Skill("", [0, 0], "performance", "spirit");
new Skill("", [0, 0], "faith", "spirit");
new Skill("", [0, 0], "focus", "spirit");

// new Skill("Сходження", [0, 0], "climbing", "strength");

const skill_attribute_regex = /(?<=([a-zA-Z0-9] ){1,}\()(Smarts|Vigor|Agility|Spirit|Strength)(?=\))/gi;

function decodeSkillName (id: string): [string, attribute] {
    const index = id.search(skill_attribute_regex);
    if(index === -1) return [id, "none" as attribute];
    const attribute = (id.match(skill_attribute_regex)?.[0].toLowerCase() ?? "none") as attribute;
    id = id.slice(0, Math.max(index-1, 0));
    return [id, attribute];
}

const slice = createSlice({
    name: "attributes",
    initialState: Skill.copy() as state,
    reducers: {
        setSkill(state, { payload }: { payload: payload }) {

            const skill = state[payload.name]; // payload.name = skill.id

            if(skill.custom && payload.value[0] === 0 && payload.value[1] === 0) {
                delete state[payload.name];
                return;
            }
            
            state[payload.name] = new Skill(skill.name, payload.value, skill.id, skill.attribute as attribute, skill.core);

        },
        initSkills (state, { payload: skills } : {payload: {
            [key: string]: [number, number];
        }}) {

            const newState = {} as state;
            
            for(const id in skills) {
                let skill = state[id];
                if(skill == null && (skills[id][0] !== 0 || skills[id][1] !== 0)) {
                    const [name, attribute] = decodeSkillName(id);
                    skill = {
                        attribute,
                        level: [0, 0],
                        name,
                        id: id,
                        core: false,
                        custom: true
                    } as skill;
                }
                if(skill == null) continue;
                const skillName = skill.custom ? skill.name : "";
                newState[id] = new Skill(skillName, skills[id] as level, skill.id, skill.attribute as attribute, skill.core, skill.custom);
            }

            return newState;

        },
        addCustomSkill (state, { payload: id }: { payload: string }) {
            const [name, attribute] = decodeSkillName(id);
            state[id] = new Skill(name, [4,0], id, attribute, false, true);
        }
    }
});

export default slice.reducer;
export const skillsActions = slice.actions;