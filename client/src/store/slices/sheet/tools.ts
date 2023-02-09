import { createSlice } from "@reduxjs/toolkit";
import { CopyObject, ObjectId } from "../../../scripts";

export interface tool {
    id?: string;
    name: string;
    amount: number;
    weight: number;
    notes: string;
    hidden: boolean;
}

export class Tool implements tool {

    static counter: number = 0;

    id: string;
    name: string;
    amount: number;
    weight: number;
    notes: string;
    hidden: boolean;

    constructor (tool: tool, persist_id: boolean = false) {

        this.name = tool.name;
        this.amount = tool.amount;
        this.weight = tool.weight;
        this.notes = tool.notes;
        this.hidden = tool.hidden;

        const newId = ObjectId();
        this.id = persist_id ? tool.id ?? newId : newId;

    }
    
}

export interface state {
    list: {
        byId: {
            [key: string]: tool;
        };
        allIds: string[];
    };
};

const slice = createSlice({
    name: "tools",
    initialState: {
        list: {
            byId: {},
            allIds: []
        }
    } as state,
    reducers: {
        addTools (state, { payload: list }: {payload: Tool[]}) {
            for(const tool of list) {
                state.list.allIds.push(tool.id);
                state.list.byId[tool.id] = tool;
            }
        },
        updateTool (state, { payload: tool }: { payload: Tool }) {
            state.list.byId[tool.id] = tool;
        },
        deleteTool (state, { payload: id }: { payload: string }) {
            const index = state.list.allIds.findIndex(val => val === id);
            if(index >= 0) {
                state.list.allIds.splice(index, 1);
                delete state.list.byId[id];
            }
        },
        initTools (state, { payload } : {payload: state}) {
            payload = CopyObject(payload);
            for(const id in payload.list.byId) {
                payload.list.byId[id].hidden = payload.list.byId[id].hidden ?? true;
            }
            return payload;
        },
        toggleHiddenTool (state, { payload: id } : { payload: string }) {
            const tool = new Tool(state.list.byId[id], true);
            tool.hidden = !tool.hidden;
            state.list.byId[id] = tool;
        }
    }
});

export default slice.reducer;
export const toolsActions = slice.actions;