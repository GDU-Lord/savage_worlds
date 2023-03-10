import { AnyAction, bindActionCreators } from "@reduxjs/toolkit";
import { SERVER_URL } from "./config";
import { actions, RootState } from "./store/reducers";
import { state as toolsState } from "./store/slices/sheet/tools";
import { state as weaponsState } from "./store/slices/sheet/weapons";
import { state as armorState } from "./store/slices/sheet/armor";
import { state as edgesState } from "./store/slices/sheet/edges";
import { state as hindrancesState } from "./store/slices/sheet/hindrances";
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
    boating: _level;
    driving: _level;
    fighting: _level;
    lockpicking: _level;
    piloting: _level;
    riding: _level;
    shooting: _level;
    swimming: _level;
    throwing: _level;
    gambling: _level;
    healing: _level;
    investigation: _level;
    repair: _level;
    streetwise: _level;
    survival: _level;
    taunt: _level;
    tracking: _level;
    guts: _level;
    intimidation: _level;
    climbing: _level;
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
    weightAmplifier: number;
    money: number;
    wounds: number;
    fatigue: number;
    bennies: number;
};

export interface edge {
    id: string;
    name: string;
    notes: string;
};

export interface hindrance {
    id: string;
    name: string;
    notes: string;
};

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

export interface weapon {
    id: string;
    name: string;
    price: number;
    weight: number;
    type: string;
    range: string;
    rof: number;
    ap: number;
    minStrength: number;
    damage: string;
    notes: string;
    worn: boolean;
};

export interface character {
    token: string;
    attributes: attributes;
    skills: skills;
    otherStatistics: otherStatistics;
    textStatistics: textStatistics;
    edges: edge[];
    hindrances: hindrance[];
    tools: tool[];
    armor: armor[];
    weapons: weapon[];
}

export function updateCharacter (dispatch: any, state: RootState["sheet"], character: character) {
    const {
        initAttributes,
        initSkills,
        initOtherStatistics,
        initTextStatistics,
        initTools,
        initArmor,
        initEdges,
        initHindrances,
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

}

export function characterSave (state: RootState["sheet"]) {

    const { attributes, other: otherStatistics, text: textStatistics, sheet: { savedData } } = state;
    const { token } = textStatistics;

    console.log("TOKEN", token);

    const skills: skills = {} as skills;

    for(const id in state.skills)
        skills[id as keyof skills] = state.skills[id].level;

    const edges = state.edges.list.allIds.map(id => {
        return state.edges.list.byId[id];
    }) as edge[];

    const hindrances = state.hindrances.list.allIds.map(id => {
        return state.hindrances.list.byId[id];
    }) as hindrance[];

    const tools = state.tools.list.allIds.map(id => {
        return state.tools.list.byId[id];
    }) as tool[];

    const armor = state.armor.list.allIds.map(id => {
        return state.armor.list.byId[id];
    }) as armor[];

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
        tools,
        armor,
        weapons,
    };

    
    const data = JSON.stringify(character);

    console.log(character.token);

    if(data !== savedData)
        socket.emit("character-save", character);

    return data;

}