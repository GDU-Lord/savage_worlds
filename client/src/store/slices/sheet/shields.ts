import { createSlice } from "@reduxjs/toolkit";
import { CopyObject, ObjectId } from "../../../scripts";

export interface shield {
    bonus: number;
    cover: number;
    price: number;
    weight: number;
    minStrength: number;
    worn: boolean;
    name: string;
    hidden: boolean;
    id?: string;
}

export class Shield implements shield {

    bonus: number;
    cover: number;
    price: number;
    weight: number;
    minStrength: number;
    worn: boolean;
    name: string;
    hidden: boolean;
    id: string;

    constructor (shield: shield, persist_id: boolean = false) {

        this.bonus = shield.bonus;
        this.cover = shield.cover;
        this.price = shield.price;
        this.weight = shield.weight;
        this.minStrength = shield.minStrength;
        this.worn = shield.worn;
        this.name = shield.name;
        this.hidden = shield.hidden ?? true;

        const newId = ObjectId();
        this.id = persist_id ? shield.id ?? newId : newId;

    }
    
}

export interface state {
    list: {
        byId: {
            [key: string]: shield;
        };
        allIds: string[];
    };
};

const slice = createSlice({
    name: "shields",
    initialState: {
        list: {
            byId: {},
            allIds: []
        }
    } as state,
    reducers: {
        addShields (state, { payload: list }: {payload: Shield[]}) {
            for(const shield of list) {
                state.list.allIds.push(shield.id);
                state.list.byId[shield.id] = shield;
            }
        },
        updateShield (state, { payload: shield }: { payload: Shield }) {
            state.list.byId[shield.id] = shield;
        },
        deleteShield (state, { payload: id }: { payload: string }) {
            const index = state.list.allIds.findIndex(val => val === id);
            if(index >= 0) {
                state.list.allIds.splice(index, 1);
                delete state.list.byId[id];
            }
        },
        initShield (state, { payload } : {payload: state}) {
            payload = CopyObject(payload);
            for(const id in payload.list.byId) {
                payload.list.byId[id].hidden = payload.list.byId[id].hidden ?? true;
            }
            return payload;
        },
        toggleHiddenShield (state, { payload: id } : { payload: string }) {
            const shield = new Shield(state.list.byId[id], true);
            shield.hidden = !shield.hidden;
            state.list.byId[id] = shield;
        }
    }
});

export default slice.reducer;
export const shieldsActions = slice.actions;