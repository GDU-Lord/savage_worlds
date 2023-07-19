import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";
import { state as otherState } from "../../../store/slices/sheet/other";
import Level from "../../Level";
import Tab from "../Tab";
import s from "./index.module.sass";
import words from "../../../words";
import { word } from "../../Language/language";

export interface props {

};

export default function OtherStats (props: props) {

    const state = useSelector((state: RootState) => state.sheet);

    const stats: (keyof otherState)[] = ["attributePoints", "skillPoints", "bonusPoints", "extraSpend", "size", "speed", "weightAmplifier", "money", "wounds", "fatigue", "bennies"];
    const names: (keyof typeof words)[] = ["attribute_points", "skill_points", "bonus_points", "additional_spendings", "size", "speed", "weight_multiplier", "money", "wounds", "fatigue", "bennies"];
    const always_visible = [false, false, false, false, true, true, false, true, true, true, true];
    const always_active = [false, false, false, false, false, false, false, false, true, true, true];

    const list = stats.map((stat, index) => {

        if(always_visible[index] || !state.sheet.locked)
            return (
                <div className={s.stat} key={index}>
                    <div className={s.stat_title}>{word(names[index])}</div>
                    <Level type="other" name={stat} always_active={always_active[index]}/>
                </div>
            );

    });

    return (
        <div className={s.other}>
            <Tab name="other" title={word("other_parameters")}>{list}</Tab>
        </div>
    );

}