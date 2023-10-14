import Skill, { allSkills, SkillType } from "@/models/Skill";
import Window from "./Window";
import ItemSlot from "./ItemSlot";
import { UISkillWindowState, useWindow } from "./contexts/UIContext";
import { useCallback, useState } from "react";
import { ItemAction } from "@/models/ItemAction";
import { UIWindow } from "@/models/UIWindow";

type SkillingWindowProps = {
  skillType: SkillType;
  window: UIWindow;
};

export default function SkillingWindow({ skillType, window }: SkillingWindowProps) {
  const skill = allSkills[skillType];
  let minSkillUpTier = skillType !== SkillType.Fishing ? 'Tier I' : '';//todo implement
  const { closeWindow, windowState, setWindowState } = useWindow<UISkillWindowState>(window);

  const [items, setItems] = useState([]);

  return <Window className="!w-96" isVisible={windowState!.isVisible} close={closeWindow} coords={windowState!.coords} type={windowState!.type}>
    <Window.Title>{skill.name}</Window.Title>
    <div className="flex flex-col gap-y-3 items-center">
      <div className="text-center">{skill.directions}</div>
      <div className="flex flex-row gap-x-3 items-center">
        {[...Array(windowState?.items?.length ?? 0)].map((_, idx) => <ItemSlot key={idx} item={windowState?.items[idx]} action={idx == 0 ? ItemAction.SetSkill : ItemAction.SetSkill2} skill={skillType} />)}
      </div>
      {minSkillUpTier !== '' && <span>Minimum To Skill Up: {minSkillUpTier}</span>}
      {(skill.inputsRequired?.length ?? 0) > 0 && skill.inputsRequired?.map(x => {
        return <label key={x} className="flex flex-row gap-x-2 items-center">
          <span>{x}:</span>
          <div className="w-20"><input name={x} placeholder={x} /></div>
        </label>
      })}
      <div>
        <button>{skill.startAction}</button>
      </div>
    </div>
  </Window>
};