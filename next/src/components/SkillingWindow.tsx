import Skill, { allSkills, SkillType } from "@/models/Skill";
import Window from "./Window";
import ItemSlot from "./ItemSlot";
import { UISkillWindowState, useWindow } from "./contexts/UIContext";
import { useCallback, useEffect, useState } from "react";
import { ItemAction } from "@/models/ItemAction";
import { UIWindow } from "@/models/UIWindow";
import ProgressBar from "./ProgressBar";
import clsx from "clsx";
import Item from "@/models/Item";
import RequestPacketType from "@/network/RequestPacketType";
import { listen, send } from "@/network/Socket";
import ResponsePacketType from "@/network/ResponsePacketType";

type SkillingWindowProps = {
  skillType: SkillType;
  window: UIWindow;
};

type SkillAction = {
  counter?: number;
  expires: number;
}

type SkillState = {
  type: SkillType;
  isCompleted: boolean;
  completedItem?: Item;
  progress: number[];
  nextAction?: SkillAction;
}

const skillActionInterval = 1500;

export default function SkillingWindow({ skillType, window }: SkillingWindowProps) {
  const skill = allSkills[skillType];
  let minSkillUpTier = skillType !== SkillType.Fishing ? 'Tier I' : '';//todo implement
  const { closeWindow, windowState } = useWindow<UISkillWindowState>(window);
  const [started, setStarted] = useState(false);//false
  const [inputValue, setInputValue] = useState('');
  const [actionIndicatorOpacity, setActionIndicatorOpacity] = useState(0);
  const [skillState, setSkillState] = useState<SkillState>({} as SkillState);

  const startSkill = () => {
    console.log(skill.startAction);
    send(RequestPacketType.StartSkill, {
      type: skillType,
      level: skill.levelInput ? inputValue : null,
      itemIds: []//todo get itemids from windowState
    }, true);
  }

  const sendAction = (action: number) => {
    send(RequestPacketType.DoSkillAction, action < skill.counters.length ? action : null);
  }

  const stopSkill = () => {
    send(RequestPacketType.StopSkill, null);
  }

  useEffect(() => {
    return listen(ResponsePacketType.StartSkill, (e: SkillState) => {
      if (e.type !== skillType) return;
      setStarted(true);
      setSkillState(e);
    }, true);
  }, []);

  useEffect(() => {
    return listen(ResponsePacketType.UpdateSkill, (e: SkillState) => {
      if (e.type !== skillType) return;
      setSkillState(e);
    });
  }, []);

  useEffect(() => {
    if (!skillState.nextAction) return;
    var timer = setTimeout(() => {
      if (!started) return;
      setSkillState({ ...skillState!, nextAction: undefined });
    }, skillState.nextAction.expires - new Date().getTime());
    return () => clearTimeout(timer);
  }, [started, skillState, setSkillState]);

  useEffect(() => {
    if (!skillState.nextAction || !started) return;
    var interval = setInterval(() => {
      if (!skillState.nextAction) return;
      var opacity = (skillState.nextAction!.expires - new Date().getTime()) / skillActionInterval * 2;
      setActionIndicatorOpacity(opacity);
    }, 50);
    return () => clearInterval(interval);
  }, [skillState]);

  return <Window className="!w-96" isVisible={windowState!.isVisible} close={closeWindow} coords={windowState!.coords} type={windowState!.type}>
    <Window.Title>{skill.name}</Window.Title>
    {!started && <div className="flex flex-col gap-3 items-center">
      <div className="text-center">{skill.directions}</div>
      <div className="flex flex-row gap-x-3 items-center">
        {[...Array(windowState?.items?.length ?? 0)].map((_, idx) => <ItemSlot key={idx} item={windowState?.items[idx]} action={idx == 0 ? ItemAction.SetSkill : ItemAction.SetSkill2} skill={skillType} />)}
      </div>
      {minSkillUpTier !== '' && <span>Minimum To Skill Up: {minSkillUpTier}</span>}
      {skill.levelInput && <label className="flex flex-row gap-x-2 items-center">
        <span>Level:</span>
        <div className="w-14"><input placeholder="Level" value={inputValue} onChange={(e) => setInputValue(e.target.value)} /></div>
      </label>}
      <div>
        <button className="ignore-reorder" onClick={startSkill}>{skill.startAction}</button>
      </div>
    </div>}

    {started && <div className="flex flex-col gap-5 items-center">
      {skill.bars.map((x, idx) => <div key={idx} className="w-full flex flex-col gap-1 items-center">
        <div>{skill.labels[idx]}</div>
        <div className="flex flex-row w-full">
          <ProgressBar text={x} current={skillState.progress[idx]} max={100} color="red" />
          {idx == 1 && <div style={{ opacity: actionIndicatorOpacity }} className="pl-1">!</div>}
        </div>
      </div>)}
      <div className={clsx("grid gap-3", skill.buttons.length == 2 ? "grid-cols-2" : "grid-cols-3")}>{skill.buttons.map((x, idx) => <button key={x} onClick={() => sendAction(idx)} className="!px-2">{x}</button>)}</div>
      {skillState.progress[0] === 0 || skillState.isCompleted ? <button onClick={startSkill}>{skill.again}</button> : <button onClick={stopSkill}>{skill.stop}</button>}
    </div>}
    {skillState?.isCompleted && skillState?.completedItem && <div className="w-full flex flex-col items-center pt-2 gap-2">
      Congratulations! You received:
      <ItemSlot item={skillState.completedItem} noDrag />
    </div>}
    {started && skillState.nextAction && <div className="absolute inset-0 pointer-events-none">
      {skillState.nextAction.counter !== undefined && <div className="relative left-[40%] top-[40%] text-shadow text-2xl counter-anim">{skill.counters[skillState.nextAction.counter]}</div>}
    </div>}
  </Window>
};