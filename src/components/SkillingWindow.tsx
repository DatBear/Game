import gs from "@/styles/game.module.css";
import Skill from "@/models/Skill";
import Window from "./Window";
import ItemSlot from "./ItemSlot";

type SkillingWindowProps = {
  skill: Skill;
};

export default function SkillingWindow({ skill }: SkillingWindowProps) {
  let minSkillUpTier = skill.name !== 'Fishing' ? 'Tier I' : '';//todo implement
  return <Window className="!w-96">
    <Window.Title>{skill.name}</Window.Title>
    <div className="flex flex-col gap-y-3 items-center">
      <div className="text-center">{skill.directions}</div>
      <div className="flex flex-row gap-x-3 items-center">
        {[...Array(skill.itemsRequired)].map((_, idx) => <ItemSlot key={idx} />)}
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
  </Window >
};