import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../store/reducers";
import { Armor as ArmorClass } from "../../../store/slices/sheet/armor";
import Tab from "../Tab";
import Armor from "./Armor";
import s from "./index.module.sass";

export interface props {

};

export default function ArmorList (props: props) {

    const dispatch = useDispatch();
    const { saveData, addArmors, updateDerivedStatistics } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    const list = state.armor.list.allIds.map((id, index) => {
        return (<Armor id={id} key={index}/>);
    });

    useEffect(() => {

        updateDerivedStatistics(state);

    });


    function add () {
        addArmors([
            new ArmorClass({
                armor: 1,
                price: 0,
                weight: 0,
                minStrength: 6,
                head: false,
                torso: false,
                arms: false,
                legs: false,
                worn: true,
                hidden: false,
                name: ""
            })
        ]);
        saveData();
    }

    return (
        <div className={s.armor_list}>
            <Tab name="armor" title="Броня">
                {list}
                {!state.sheet.locked && <button className={s.add} onClick={add} disabled={state.sheet.locked}>+</button>}
            </Tab>
        </div>
    );

}