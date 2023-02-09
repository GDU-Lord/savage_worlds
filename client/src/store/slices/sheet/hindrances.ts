import { createSlice } from "@reduxjs/toolkit";
import { CopyObject, ObjectId } from "../../../scripts";

export interface hindrance {
    id?: string;
    name: string;
    notes: string;
    hidden: boolean;
}

export class Hindrance implements hindrance {

    static counter: number = 0;

    id: string;
    name: string;
    notes: string;
    hidden: boolean;

    constructor (tool: hindrance, persist_id: boolean = false) {

        this.name = tool.name;
        this.notes = tool.notes;
        this.hidden = tool.hidden ?? true;

        const newId = ObjectId();
        this.id = persist_id ? tool.id ?? newId : newId;

    }
    
}

export interface state {
    list: {
        byId: {
            [key: string]: hindrance;
        };
        allIds: string[];
    };
};

const slice = createSlice({
    name: "hindtances",
    initialState: {
        list: {
            byId: {},
            allIds: []
        }
    } as state,
    reducers: {
        addHindrances (state, { payload: list }: {payload: Hindrance[]}) {
            for(const tool of list) {
                state.list.allIds.push(tool.id);
                state.list.byId[tool.id] = tool;
            }
        },
        updateHindrance (state, { payload: hindrance }: { payload: Hindrance }) {
            state.list.byId[hindrance.id] = hindrance;
        },
        deleteHindrance (state, { payload: id }: { payload: string }) {
            const index = state.list.allIds.findIndex(val => val === id);
            if(index >= 0) {
                state.list.allIds.splice(index, 1);
                delete state.list.byId[id];
            }
        },
        initHindrances (state, { payload } : {payload: state}) {
            payload = CopyObject(payload);
            for(const id in payload.list.byId) {
                payload.list.byId[id].hidden = payload.list.byId[id].hidden ?? true;
            }
            return payload;
        },
        toggleHiddenHindrance (state, { payload: id } : { payload: string }) {
            const hindrance = new Hindrance(state.list.byId[id], true);
            hindrance.hidden = !hindrance.hidden;
            state.list.byId[id] = hindrance;
        }
    }
});

export default slice.reducer;
export const hindrancesActions = slice.actions;