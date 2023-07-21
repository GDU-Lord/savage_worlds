import { createSlice } from "@reduxjs/toolkit";
import { state as attributes} from "./attributes";
import { state as hindrances} from "./hindrances";
import { state as edges} from "./edges";
import { state as skills} from "./skills";
import { state as other} from "./other";
import { state as armor } from "./armor";
import { state as weapons } from "./weapons";
import { state as tools } from "./tools";
import { RootState } from "../../reducers";
import { state as shields } from "./shields";

export interface state {
    parry: number;
    toughness: number;
    armor: number;
    maxWeight: number;
    weight: number;
    totalPoints: number;
    maxPoints: number;
};

export interface statistics {
    attributes: attributes;
    skills: skills;
    other: other;
    armor: armor;
    weapons: weapons;
    shields: shields;
    hindrances: hindrances;
    edges: edges;
    tools: tools;
}

// add hindrances and edges
// add big hindrances (^)
// add ignore flag (*)

const slice = createSlice({
    name: "derived",
    initialState: {
        parry: 2,
        toughness: 4,
        armor: 0,
        maxWeight: 20,
        weight: 0,
        totalPoints: 0,
        maxPoints: 0
    } as state,
    reducers: {
        updateDerivedStatistics(state, {payload: { edges, hindrances, attributes, skills, armor, other, weapons, tools, shields }}: {payload: statistics}) {

            // derived stats


            // shields

            let shieldBonus = 0;

            for(const id of shields.list.allIds) {
                const shield = shields.list.byId[id];
                if(!shield.worn) continue;
                shieldBonus += shield.bonus;
            }

            const fighting = skills.fighting.level;
            const { vigor, strength } = attributes;

            state.parry = Math.floor((fighting[0] + fighting[1]) / 2) + 2 + shieldBonus;
            state.toughness = Math.floor((vigor[0] + vigor[1]) / 2) + 2 + other.size;

            // armor

            const id = armor.list.allIds.find(id => {
                const a = armor.list.byId[id];
                return a.torso && a.worn;
            });

            state.armor = id != null ? armor.list.byId[id].armor : 0;

            // weight

            let weight = 0;

            for(const id of armor.list.allIds) {
                const item = armor.list.byId[id];
                if(item.worn)
                    weight += item.weight;
            }

            for(const id of weapons.list.allIds) {
                const item = weapons.list.byId[id];
                if(item.worn)
                    weight += item.weight;
            }

            for(const id of tools.list.allIds) {
                const item = tools.list.byId[id];
                weight += item.weight * item.amount;
            }

            // XP points

            let maxPoints = other.attributePoints * 2 + other.bonusPoints + other.skillPoints;
            let totalPoints = 0;
            let hindranceCount = 0;

            hindrances.list.allIds.forEach(id => {
                const hindrance = hindrances.list.byId[id];
                if(hindrance.name[0] === "*") // ignore
                    return;
                if(hindrance.name[0] === "^") // major
                    hindranceCount++;
                hindranceCount++;
            });

            maxPoints += Math.min(hindranceCount, 4); // hindrance barrier

            edges.list.allIds.forEach(id => {
                const edge = edges.list.byId[id];
                if(edge.name[0] === "*") // ignore
                    return;
                totalPoints += 2;
            });

            if(maxPoints - totalPoints < 22) // edge barrier
                totalPoints = Infinity;

            for(const i in attributes) {
                const die = attributes[i as keyof attributes][0];
                totalPoints += ((die-2) / 2 - 1) * 2;
            }

            if(maxPoints - totalPoints < 12) // attribute barrier
                totalPoints = Infinity;

            for(const i in skills) {
                const skill = skills[i];
                let level = Math.max((skill.level[0]-2) / 2, 0); // cost based on the die
                if(skill.core) level--;
                if(skill.name[0] === "*") // ignore
                    level = 0;
                if(skill.attribute !== "none")
                    level += Math.max(skill.level[0]-attributes[skill.attribute][0], 0) / 2; // cost of the attribute overflow
                totalPoints += level;
            }

            totalPoints += other.extraSpend;

            state.totalPoints = totalPoints;
            state.maxPoints = maxPoints;
            state.weight = weight;
            state.maxWeight = ((strength[0] - 2) * 2 + strength[1] * 4) * other.weightAmplifier;
        }
    }
});

export default slice.reducer;
export const derivedActions = slice.actions;