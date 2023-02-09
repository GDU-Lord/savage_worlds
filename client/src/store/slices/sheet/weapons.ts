import { createSlice } from "@reduxjs/toolkit";
import { CopyObject, ObjectId } from "../../../scripts";

export interface weapon {
    id?: string;
    name: string; // format: name (bullet type)
    price: number;
    weight: number;
    type: "melee" | "range";
    range: `${number}/${number}/${number}`;
    rof: number;
    ap: number;
    minStrength: number;
    damage: `${number}${"к" | "d"}${die}${`${"+" | "-"}${number}` | ""}`; // 2d5+3
    notes: string;
    worn: boolean;
    hidden: boolean;
}

export class Weapon implements weapon {

    static counter: number = 0;

    id: string;
    name: string;
    price: number;
    weight: number;
    type: "melee" | "range";
    range: `${number}/${number}/${number}`;
    rof: number;
    ap: number;
    minStrength: number;
    damage: `${number}${"к" | "d"}${die}${`${"+" | "-"}${number}` | ""}`;
    notes: string;
    worn: boolean;
    hidden: boolean;

    constructor (weapon: weapon, persist_id: boolean = false) {

        this.name = weapon.name;
        this.price = weapon.price;
        this.weight = weapon.weight;
        this.type = weapon.type;
        this.range = weapon.range;
        this.rof = weapon.rof;
        this.ap = weapon.ap;
        this.minStrength = weapon.minStrength;
        this.damage = weapon.damage;
        this.notes = weapon.notes;
        this.worn = weapon.worn;
        this.hidden = weapon.hidden ?? true;

        const newId = ObjectId();
        this.id = persist_id ? weapon.id ?? newId : newId;

    }

}

export interface state {
    list: {
        byId: {
            [key: string]: weapon;
        };
        allIds: string[];
    };
}

const slice = createSlice({
    name: "weapons",
    initialState: {
        list: {
            byId: {},
            allIds: []
        }
    } as state,
    reducers: {
        addWeapons (state, { payload: list }: {payload: Weapon[]}) {
            for(const weapon of list) {
                state.list.allIds.push(weapon.id);
                state.list.byId[weapon.id] = weapon;
            }
        },
        updateWeapon (state, { payload: weapon }: { payload: Weapon }) {
            state.list.byId[weapon.id] = weapon;
        },
        deleteWeapon (state, { payload: id }: { payload: string }) {
            const index = state.list.allIds.findIndex(val => val === id);
            if(index >= 0) {
                state.list.allIds.splice(index, 1);
                delete state.list.byId[id];
            }
        },
        initWeapons (state, { payload } : {payload: state}) {
            payload = CopyObject(payload);
            for(const id in payload.list.byId) {
                payload.list.byId[id].hidden = payload.list.byId[id].hidden ?? true;
            }
            return payload;
        },
        toggleHiddenWeapon (state, { payload: id } : { payload: string }) {
            const weapon = new Weapon(state.list.byId[id], true);
            weapon.hidden = !weapon.hidden;
            state.list.byId[id] = weapon;
        }
    }
});

export default slice.reducer;
export const weaponsActions = slice.actions;