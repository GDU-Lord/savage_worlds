import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";
import { state as otherState } from "../../../store/slices/sheet/other";
import Level from "../../Level";
import Tab from "../Tab";
import s from "./index.module.sass";

export interface props {

};

export default function OtherStats (props: props) {

    const state = useSelector((state: RootState) => state.sheet);

    const stats: (keyof otherState)[] = ["attributePoints", "skillPoints", "bonusPoints", "speed", "weightAmplifier", "money", "wounds", "fatigue", "bennies"];
    const names = ["Бали атрибутів", "Бали вмінь", "Бонусні бали", "Швидкість", "Множник ваги", "Гроші", "Рани", "Втома", "Бені"];
    const always_visible = [false, false, false, true, false, true, true, true, true];
    const always_active = [false, false, false, false, false, false, true, true, true];

    const list = stats.map((stat, index) => {

        if(always_visible[index] || !state.sheet.locked)
            return (
                <div className={s.stat} key={index}>
                    <div className={s.stat_title}>{names[index]}</div>
                    <Level type="other" name={stat} always_active={always_active[index]}/>
                </div>
            );

    });

    return (
        <div className={s.other}>
            <Tab name="other" title="Інші параметри">{list}</Tab>
        </div>
    );

}