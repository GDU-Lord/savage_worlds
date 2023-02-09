import { createSlice } from "@reduxjs/toolkit";
import { state as attributes} from "./attributes";
import { state as skills} from "./skills";
import { state as other} from "./other";
import { state as armor } from "./armor";
import { state as weapons } from "./weapons";
import { state as tools } from "./tools";
import { RootState } from "../../reducers";

export interface state {
    parry: number;
    toughness: number;
    armor: number;
    maxWeight: number;
    weight: number;
};

export interface statistics {
    attributes: attributes;
    skills: skills;
    other: other;
    armor: armor;
    weapons: weapons;
    tools: tools;
}

const slice = createSlice({
    name: "derived",
    initialState: {
        parry: 2,
        toughness: 4,
        armor: 0,
        maxWeight: 20,
        weight: 0
    } as state,
    reducers: {
        updateDerivedStatistics(state, {payload: { attributes, skills, armor, other, weapons, tools }}: {payload: statistics}) {
            const fighting = skills.fighting.level;
            const { vigor, strength } = attributes;
            state.parry = Math.floor((fighting[0] + fighting[1]) / 2) + 2;
            state.toughness = Math.floor((vigor[0] + vigor[1]) / 2) + 2;
            const id = armor.list.allIds.find(id => {
                const a = armor.list.byId[id];
                return a.torso && a.worn;
            });
            state.armor = id != null ? armor.list.byId[id].armor : 0;
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
            state.weight = weight; // depend on equipment
            state.maxWeight = (strength[0] + strength[1]) * other.weightAmplifier;
        }
    }
});

export default slice.reducer;
export const derivedActions = slice.actions;