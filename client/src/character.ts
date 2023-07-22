import { bindActionCreators } from "@reduxjs/toolkit";
import { actions, RootState } from "./store/reducers";
import { state as toolsState } from "./store/slices/sheet/tools";
import { state as weaponsState } from "./store/slices/sheet/weapons";
import { state as armorState } from "./store/slices/sheet/armor";
import { state as shieldsState } from "./store/slices/sheet/shields";
import { state as edgesState } from "./store/slices/sheet/edges";
import { state as hindrancesState } from "./store/slices/sheet/hindrances";
import { state as notesState } from "./store/slices/sheet/hindrances";
import { socket } from "./scripts";

export type _level = [number, number];

export interface attributes {
    agility: _level;
    strength: _level;
    smarts: _level;
    spirit: _level;
    vigor: _level;
};

export interface skills {
    common_knowledge: _level;
    notice: _level;
    persuasion: _level;
    stealth: _level;
    athletics: _level;
    boating: _level;
    driving: _level;
    fighting: _level;
    thievery: _level;
    piloting: _level;
    riding: _level;
    shooting: _level;
    gambling: _level;
    healing: _level;
    research: _level;
    repair: _level;
    survival: _level;
    taunt: _level;
    intimidation: _level;
    battle: _level;
    hacking: _level;
    electronics: _level;
    weird_science: _level;
    psionics: _level;
    spellcasting: _level;
    performance: _level;
    faith: _level;
    focus: _level;
    academics: _level;
    occult: _level;
};

export interface textStatistics {
    token: string;
    playerName: string;
    name: string;
    race: string;
};

export interface otherStatistics {
    speed: number;
    attributePoints: number;
    skillPoints: number;
    bonusPoints: number;
    extraSpend: number;
    size: number;
    weightAmplifier: number;
    money: number;
    wounds: number;
    fatigue: number;
    bennies: number;
};

export interface note {
    id: string;
    name: string;
    notes: string;
};

export interface edge extends note {};
export interface hindrance extends note {};

export interface tool {
    id: string;
    name: string;
    amount: number;
    weight: number;
    notes: string;
    hidden: boolean;
};

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
    id: string;
};

export interface shield {
    bonus: number;
    cover: number;
    price: number;
    weight: number;
    minStrength: number;
    worn: boolean;
    name: string;
    id: string;
};

export interface weapon {
    id: string;
    name: string;
    price: number;
    weight: number;
    type: string;
    range: string;
    rof: number;
    blast: "s" | "m" | "l" | "c";
    ap: number;
    minStrength: number;
    damage: string;
    notes: string;
    worn: boolean;
    amount: number;
};

export interface character {
    token: string;
    attributes: attributes;
    skills: skills;
    otherStatistics: otherStatistics;
    textStatistics: textStatistics;
    notes: note[];
    edges: edge[];
    hindrances: hindrance[];
    tools: tool[];
    armor: armor[];
    shields: shield[];
    weapons: weapon[];
}

export function updateCharacter (dispatch: any, state: RootState["sheet"], character: character) {

    console.log(character);
    
    const {
        initAttributes,
        initSkills,
        initOtherStatistics,
        initTextStatistics,
        initTools,
        initArmor,
        initShield,
        initEdges,
        initHindrances,
        initNotes,
        initWeapons,
    } = bindActionCreators(actions, dispatch);

    initAttributes({
        agility: character.attributes.agility as level,
        strength: character.attributes.strength as level,
        smarts: character.attributes.smarts as level,
        spirit: character.attributes.spirit as level,
        vigor: character.attributes.vigor as level,
    });

    initSkills(character.skills as unknown as {
        [key: string]: [number, number]; 
    });

    // character.textStatistics.token = character.token;

    character.textStatistics.token = character.token;

    initTextStatistics(character.textStatistics);
    initOtherStatistics(character.otherStatistics);

    const tools: toolsState = {
        list: {
            byId: {},
            allIds: character.tools.map(tool => tool.id)
        }
    };

    for(const tool of character.tools) {
        tools.list.byId[tool.id] = tool;
        tools.list.byId[tool.id].hidden = state.tools.list.byId[tool.id]?.hidden ?? true;
    }

    initTools(tools);

    const weapons: weaponsState = {
        list: {
            byId: {},
            allIds: character.weapons.map(weapon => weapon.id)
        }
    };

    for(const weapon of character.weapons) {
        weapons.list.byId[weapon.id] = weapon as weaponsState["list"]["byId"][0];
        weapons.list.byId[weapon.id].hidden = state.weapons.list.byId[weapon.id]?.hidden ?? true;
    }

    initWeapons(weapons);

    const armor: armorState = {
        list: {
            byId: {},
            allIds: character.armor.map(armor => armor.id)
        }
    };

    for(const armor_unit of character.armor) {
        armor.list.byId[armor_unit.id] = armor_unit as armorState["list"]["byId"][0];
        armor.list.byId[armor_unit.id].hidden = state.armor.list.byId[armor_unit.id]?.hidden ?? true;
    }

    initArmor(armor);

    const shields: shieldsState = {
        list: {
            byId: {},
            allIds: character.shields.map(armor => armor.id)
        }
    };

    for(const shield of character.shields) {
        shields.list.byId[shield.id] = shield as shieldsState["list"]["byId"][0];
        shields.list.byId[shield.id].hidden = state.armor.list.byId[shield.id]?.hidden ?? true;
    }

    initShield(shields);

    const edges: edgesState = {
        list: {
            byId: {},
            allIds: character.edges.map(edge => edge.id)
        }
    };

    for(const edge of character.edges) {
        edges.list.byId[edge.id] = edge as edgesState["list"]["byId"][0];
        edges.list.byId[edge.id].hidden = state.edges.list.byId[edge.id]?.hidden ?? true;
    }

    initEdges(edges);

    const hindrances: hindrancesState = {
        list: {
            byId: {},
            allIds: character.hindrances.map(hindrance => hindrance.id)
        }
    };

    for(const hindrance of character.hindrances) {
        hindrances.list.byId[hindrance.id] = hindrance as hindrancesState["list"]["byId"][0];
        hindrances.list.byId[hindrance.id].hidden = state.hindrances.list.byId[hindrance.id]?.hidden ?? true;
    }

    initHindrances(hindrances);

    const notes: notesState = {
        list: {
            byId: {},
            allIds: character.notes.map(note => note.id)
        }
    };

    for(const note of character.notes) {
        notes.list.byId[note.id] = note as hindrancesState["list"]["byId"][0];
        notes.list.byId[note.id].hidden = state.hindrances.list.byId[note.id]?.hidden ?? true;
    }

    initNotes(notes);

}

export function characterSave (state: RootState["sheet"]) {
    
    const { attributes, other: otherStatistics, text: textStatistics, sheet: { savedData } } = state;
    const { token } = textStatistics;

    const skills: skills = {} as skills;

    for(const id in state.skills)
        skills[id as keyof skills] = state.skills[id].level;

    const edges = state.edges.list.allIds.map(id => {
        return state.edges.list.byId[id];
    }) as edge[];

    const hindrances = state.hindrances.list.allIds.map(id => {
        return state.hindrances.list.byId[id];
    }) as hindrance[];

    const notes = state.notes.list.allIds.map(id => {
        return state.notes.list.byId[id];
    }) as note[];

    const tools = state.tools.list.allIds.map(id => {
        return state.tools.list.byId[id];
    }) as tool[];

    const armor = state.armor.list.allIds.map(id => {
        return state.armor.list.byId[id];
    }) as armor[];

    const shields = state.shields.list.allIds.map(id => {
        return state.shields.list.byId[id];
    }) as shield[];

    const weapons = state.weapons.list.allIds.map(id => {
        return state.weapons.list.byId[id];
    }) as weapon[];

    const character: character = {
        token,
        attributes,
        skills,
        otherStatistics,
        textStatistics,
        edges,
        hindrances,
        notes,
        tools,
        armor,
        shields,
        weapons,
    };
    
    const data = JSON.stringify(character);

    if(data !== savedData)
        socket.emit("character-save", character);

    return data;

}