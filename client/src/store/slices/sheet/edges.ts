import { createSlice } from "@reduxjs/toolkit";
import { CopyObject, ObjectId } from "../../../scripts";

export interface edge {
    id?: string;
    name: string;
    notes: string;
    hidden: boolean;
}

export class Edge implements edge {

    id: string;
    name: string;
    notes: string;
    hidden: boolean;

    constructor (tool: edge, persist_id: boolean = false) {

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
            [key: string]: edge;
        };
        allIds: string[];
    };
};

const slice = createSlice({
    name: "edges",
    initialState: {
        list: {
            byId: {},
            allIds: []
        }
    } as state,
    reducers: {
        addEdges (state, { payload: list }: {payload: Edge[]}) {
            for(const tool of list) {
                state.list.allIds.push(tool.id);
                state.list.byId[tool.id] = tool;
            }
        },
        updateEdge (state, { payload: edge }: { payload: Edge }) {
            state.list.byId[edge.id] = edge;
        },
        deleteEdge (state, { payload: id }: { payload: string }) {
            const index = state.list.allIds.findIndex(val => val === id);
            if(index >= 0) {
                state.list.allIds.splice(index, 1);
                delete state.list.byId[id];
            }
        },
        initEdges (state, { payload } : {payload: state}) {
            payload = CopyObject(payload);
            for(const id in payload.list.byId) {
                payload.list.byId[id].hidden = payload.list.byId[id].hidden ?? true;
            }
            return payload;
        },
        toggleHiddenEdge(state, { payload: id } : { payload: string }) {
            const edge = new Edge(state.list.byId[id], true);
            edge.hidden = !edge.hidden;
            state.list.byId[id] = edge;
        }
    }
});

export default slice.reducer;
export const edgesActions = slice.actions;