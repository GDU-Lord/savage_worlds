import { createSlice } from "@reduxjs/toolkit";
import { CopyObject, ObjectId } from "../../../scripts";

export interface armor {
    armor: number;
    price: number;
    weight: number;
    minStrength: number;
    head: boolean;
    torso: boolean;
    arms: boolean;
    legs: boolean;
    worn: boolean;
    name: string;
    hidden: boolean;
    id?: string;
}

export class Armor implements armor {

    armor: number;
    price: number;
    weight: number;
    minStrength: number;
    head: boolean;
    torso: boolean;
    arms: boolean;
    legs: boolean;
    worn: boolean;
    name: string;
    hidden: boolean;
    id: string;

    constructor (armor: armor, persist_id: boolean = false) {

        this.armor = armor.armor;
        this.price = armor.price;
        this.weight = armor.weight;
        this.minStrength = armor.minStrength;
        this.head = armor.head;
        this.torso = armor.torso;
        this.arms = armor.arms;
        this.legs = armor.legs;
        this.worn = armor.worn;
        this.name = armor.name;
        this.hidden = armor.hidden ?? true;

        const newId = ObjectId();
        this.id = persist_id ? armor.id ?? newId : newId;

    }
    
}

export interface state {
    list: {
        byId: {
            [key: string]: armor;
        };
        allIds: string[];
    };
};

const slice = createSlice({
    name: "armor",
    initialState: {
        list: {
            byId: {},
            allIds: []
        }
    } as state,
    reducers: {
        addArmors (state, { payload: list }: {payload: Armor[]}) {
            for(const armor of list) {
                state.list.allIds.push(armor.id);
                state.list.byId[armor.id] = armor;
            }
        },
        updateArmor (state, { payload: armor }: { payload: Armor }) {
            state.list.byId[armor.id] = armor;
        },
        deleteArmor (state, { payload: id }: { payload: string }) {
            const index = state.list.allIds.findIndex(val => val === id);
            if(index >= 0) {
                state.list.allIds.splice(index, 1);
                delete state.list.byId[id];
            }
        },
        initArmor (state, { payload } : {payload: state}) {
            payload = CopyObject(payload);
            for(const id in payload.list.byId) {
                payload.list.byId[id].hidden = payload.list.byId[id].hidden ?? true;
            }
            return payload;
        },
        toggleHiddenArmor (state, { payload: id } : { payload: string }) {
            const armor = new Armor(state.list.byId[id], true);
            armor.hidden = !armor.hidden;
            state.list.byId[id] = armor;
        }
    }
});

export default slice.reducer;
export const armorActions = slice.actions;