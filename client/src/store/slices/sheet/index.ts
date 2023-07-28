import { combineReducers } from "@reduxjs/toolkit";
import attributes, { attributesActions } from "./attributes";
import armor, { armorActions } from "./armor";
import shields, { shieldsActions } from "./shields";
import weapons, { weaponsActions } from "./weapons";
import skills, { skillsActions } from "./skills";
import other, { otherActions } from "./other";
import derived, { derivedActions } from "./derived";
import tools, { toolsActions } from "./tools";
import edges, { edgesActions } from "./edges";
import hindrances, { hindrancesActions } from "./hindrances";
import notes, { notesActions } from "./notes";
import text, { textActions } from "./text";
import tabs, { tabsActions } from "./tabs";
import sheet, { sheetActions as _sheetActions } from "./sheet";

const reducers = combineReducers({ sheet, attributes, skills, other, derived, armor, weapons, tools, edges, hindrances, notes, text, tabs, shields });

export const sheetActions = { ..._sheetActions, ...attributesActions, ...skillsActions, ...otherActions, ...derivedActions, ...armorActions, ...weaponsActions, ...toolsActions, ...edgesActions, ...hindrancesActions, ...notesActions, ...textActions, ...tabsActions, ...shieldsActions };
export default reducers;