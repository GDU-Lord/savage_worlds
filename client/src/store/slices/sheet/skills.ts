import { createSlice } from "@reduxjs/toolkit";
import { attribute } from "./attributes";

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

    constructor (name: string, level: level, id: string, attribute: attribute, core: boolean = false) {
        this.name = name;
        this.level = level;
        this.id = id;
        this.attribute = attribute;
        this.core = core;
        Skill.list[this.id] = this;
    }

}

new Skill("Загальні Знання", [4, 0], "common_knowledge", "smarts", true);
new Skill("Уважність", [4, 0], "notice", "smarts", true);
new Skill("Переконання", [4, 0], "persuasion", "spirit", true);
new Skill("Непомітність", [4, 0], "stealth", "agility", true);
new Skill("Атлетика", [4, 0], "athletics", "agility", true);

new Skill("Судноплавство", [0, 0], "boating", "agility");
new Skill("Водіння", [0, 0], "driving", "agility");
new Skill("Боротьба", [0, 0], "fighting", "agility");
// new Skill("Злам замків", [0, 0], "lockpicking", "agility");
new Skill("Крадіжка", [0, 0], "thievery", "agility");
new Skill("Пілотування", [0, 0], "piloting", "agility");
new Skill("Їзда верхи", [0, 0], "riding", "agility");
new Skill("Стрільба", [0, 0], "shooting", "agility");
// new Skill("Плавання", [0, 0], "swimming", "agility");
// new Skill("Кидання", [0, 0], "throwing", "agility");

new Skill("Азартні ігри", [0, 0], "gambling", "smarts");
new Skill("Лікування", [0, 0], "healing", "smarts");
// new Skill("Розслідування", [0, 0], "investigation", "smarts");
new Skill("Дослідження", [0, 0], "research", "smarts");
new Skill("Ремонт", [0, 0], "repair", "smarts");
// new Skill("Вуличний жаргон", [0, 0], "streetwise", "smarts");
new Skill("Бій", [0, 0], "battle", "smarts");
new Skill("Хакерство", [0, 0], "hacking", "smarts");
new Skill("Електроніка", [0, 0], "electronics", "smarts");
new Skill("Дивна наука", [0, 0], "weird_science", "smarts");
new Skill("Виживання", [0, 0], "survival", "smarts");
new Skill("Насмішка", [0, 0], "taunt", "smarts");
new Skill("Псионіка", [0, 0], "psionics", "smarts");
new Skill("Заклинання", [0, 0], "spellcasting", "smarts");
// new Skill("Слідопитство", [0, 0], "tracking", "smarts");

new Skill("Сміливість", [0, 0], "guts", "spirit");
new Skill("Залякування", [0, 0], "intimidation", "spirit");
new Skill("Виступ", [0, 0], "performance", "spirit");
new Skill("Віра", [0, 0], "faith", "spirit");
new Skill("Концентрація", [0, 0], "focus", "spirit");

// new Skill("Сходження", [0, 0], "climbing", "strength");

const slice = createSlice({
    name: "attributes",
    initialState: Skill.copy() as state,
    reducers: {
        setSkill(state, { payload }: { payload: payload }) {

            const skill = state[payload.name]; // payload.name = skill.id

            if(skill.attribute === "none" && payload.value[0] === 0 && payload.value[1] === 0) {
                delete state[payload.name];
                return;
            }
            
            state[payload.name] = new Skill(skill.name, payload.value, skill.id, skill.attribute as attribute, skill.core);

        },
        initSkills (state, { payload: skills } : {payload: {
            [key: string]: [number, number];
        }}) {
            
            for(const id in skills) {
                let skill = state[id];
                if(skill == null && (skills[id][0] !== 0 || skills[id][1] !== 0)) 
                    skill = {
                        attribute: "none",
                        level: [0, 0],
                        name: id,
                        id: id,
                        core: false
                    } as skill;
                if(skill == null) continue;
                state[id] = new Skill(skill.name, skills[id] as level, skill.id, skill.attribute as attribute, skill.core);
            }

        },
        addCustomSkill (state, { payload: id }: { payload: string }) {
            state[id] = new Skill(id, [4,0], id, "none" as attribute, false);
        }
    }
});

export default slice.reducer;
export const skillsActions = slice.actions;