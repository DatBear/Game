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

type SkillingWindowProps = {
  skillType: SkillType;
  window: UIWindow;
};

type SkillAction = {
  counter?: number;
  expires: number;
}

type SkillState = {
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
  const [inputValues, setInputValues] = useState(skill.inputsRequired?.map(x => ''));
  const [progressBars, setProgressBars] = useState(skill.bars.map(_ => 50));
  const [nextAction, setNextAction] = useState<SkillAction>();
  const [actionIndicatorOpacity, setActionIndicatorOpacity] = useState(0);

  const startSkill = () => {
    console.log(skill.startAction);
    setStarted(true);
  }

  const sendAction = (action: number) => {
    console.log('action', action);
  }

  const stopSkill = () => {
    setStarted(false);
  }

  useEffect(() => {
    var timer = setInterval(() => {
      if (!started) return;
      setNextAction(undefined);
      console.log('next action set');
    }, 1500);
    return () => clearInterval(timer);
  }, [started, setNextAction]);

  useEffect(() => {
    if (nextAction) return;
    var timeout = setTimeout(() => {
      setNextAction({
        counter: Math.random() > .5 ? 0 : undefined,//
        expires: new Date().getTime() + skillActionInterval
      });
      return () => clearTimeout(timeout);
    }, 1500);
  }, [nextAction]);

  useEffect(() => {
    if (!nextAction || !started) return;
    var interval = setInterval(() => {

      var opacity = (nextAction.expires - new Date().getTime()) / skillActionInterval * 2;
      setActionIndicatorOpacity(opacity);
      //console.log('opacity', opacity);
    }, 50);

    return () => clearInterval(interval);
  }, [nextAction]);



  return <Window className="!w-96" isVisible={windowState!.isVisible} close={closeWindow} coords={windowState!.coords} type={windowState!.type}>
    <Window.Title>{skill.name}</Window.Title>
    {!started && <div className="flex flex-col gap-3 items-center">
      <div className="text-center">{skill.directions}</div>
      <div className="flex flex-row gap-x-3 items-center">
        {[...Array(windowState?.items?.length ?? 0)].map((_, idx) => <ItemSlot key={idx} item={windowState?.items[idx]} action={idx == 0 ? ItemAction.SetSkill : ItemAction.SetSkill2} skill={skillType} />)}
      </div>
      {minSkillUpTier !== '' && <span>Minimum To Skill Up: {minSkillUpTier}</span>}
      {(skill.inputsRequired?.length ?? 0) > 0 && skill.inputsRequired?.map((x, idx) => {
        return <label key={x} className="flex flex-row gap-x-2 items-center">
          <span>{x}:</span>
          <div className="w-14"><input name={x} placeholder={x} value={inputValues![idx]} onChange={(e) => { inputValues!.splice(idx, 1, e.target.value); setInputValues([...inputValues!]) }} /></div>
        </label>
      })}
      <div>
        <button className="ignore-reorder" onClick={startSkill}>{skill.startAction}</button>
      </div>
    </div>}

    {started && <div className="flex flex-col gap-5 items-center">
      {skill.bars.map((x, idx) => <div key={idx} className="w-full flex flex-col gap-1 items-center">
        <div>{skill.labels[idx]}</div>
        <div className="flex flex-row w-full">
          <ProgressBar text={x} current={progressBars[idx]} max={100} color="red" />
          {idx == 1 && <div style={{ opacity: actionIndicatorOpacity }} className="pl-1">!</div>}
        </div>
      </div>)}
      <div className={clsx("grid gap-3", skill.buttons.length == 2 ? "grid-cols-2" : "grid-cols-3")}>{skill.buttons.map((x, idx) => <button key={x} onClick={() => sendAction(idx)} className="!px-2">{x}</button>)}</div>
      {progressBars[0] === 0 ? <button onClick={startSkill}>{skill.again}</button> : <button onClick={stopSkill}>{skill.stop}</button>}
    </div>}
    {started && nextAction && <div className="absolute inset-0 pointer-events-none">
      {nextAction.counter !== undefined && <div className="relative left-[40%] top-[40%] text-shadow text-2xl counter-anim">{skill.counters[nextAction.counter]}</div>}
    </div>}
  </Window>
};