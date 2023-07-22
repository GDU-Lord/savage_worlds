import { createSlice } from "@reduxjs/toolkit";
import { CopyObject, ObjectId } from "../../../scripts";

export interface weapon {
    id?: string;
    name: string; // format: name (bullet type)
    price: number;
    weight: number;
    type: "melee" | "range" | "throwable";
    range: `${number}/${number}/${number}`;
    rof: number;
    blast: "s" | "m" | "l" | "c";
    ap: number;
    minStrength: number;
    damage: `${number}${"к" | "d"}${die}${`${"+" | "-"}${number}` | ""}`; // 2d5+3
    notes: string;
    worn: boolean;
    hidden: boolean;
    amount: number;
}

export class Weapon implements weapon {

    static counter: number = 0;

    id: string;
    name: string;
    price: number;
    weight: number;
    type: "melee" | "range" | "throwable";
    range: `${number}/${number}/${number}`;
    rof: number;
    ap: number;
    blast: "s" | "m" | "l" | "c";
    minStrength: number;
    damage: `${number}${"к" | "d"}${die}${`${"+" | "-"}${number}` | ""}`;
    notes: string;
    worn: boolean;
    hidden: boolean;
    amount: number;

    constructor (weapon: weapon, persist_id: boolean = false) {

        this.name = weapon.name ?? "";
        this.price = weapon.price ?? 0;
        this.weight = weapon.weight ?? 0;
        this.type = weapon.type ?? "range";
        this.range = weapon.range ?? "5/10/20";
        this.rof = weapon.rof ?? 1;
        this.blast = weapon.blast ?? "s";
        this.ap = weapon.ap ?? 0;
        this.minStrength = weapon.minStrength ?? 6;
        this.damage = weapon.damage ?? "1d6";
        this.notes = weapon.notes ?? "";
        this.worn = weapon.worn ?? true;
        this.hidden = weapon.hidden ?? true;
        this.amount = weapon.amount ?? 1;

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
            state.list.byId[weapon.id] = new Weapon(weapon, true);
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