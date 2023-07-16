import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../store/reducers";
import { Weapon as WeaponClass } from "../../../store/slices/sheet/weapons";
import Weapon from "./Weapon";
import s from "./index.module.sass";
import Tab from "../Tab";

export interface props {

};

export default function WeaponList (props: props) {

    const dispatch = useDispatch();
    const { saveData, addWeapons, updateDerivedStatistics } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    const list = state.weapons.list.allIds.map((id, index) => {
        return (<Weapon id={id} key={index}/>);
    });

    useEffect(() => {
       
        updateDerivedStatistics(state);

    });


    function add () {
        addWeapons([
            new WeaponClass({
                hidden: false,
                name: "",
                price: 0,
                weight: 0,
                type: "range",
                range: "5/10/20",
                rof: 1,
                ap: 0,
                minStrength: 4,
                damage: "1d6",
                notes: "",
                worn: true
            })
        ]);
        saveData();
    }

    return (
        <div className={s.weapons_list}>
            {(list.length > 0 || !state.sheet.locked) && <Tab name="weapons" title="Зброя">
                {list}
                {!state.sheet.locked && <button className={s.add} onClick={add} disabled={state.sheet.locked}>+</button>}
            </Tab>}
        </div>
    );

}