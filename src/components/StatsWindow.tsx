import { CharacterStats } from "@/models/Stats";
import clsx from "clsx";
import { UIWindow, useWindow } from "./contexts/UIContext";
import { useCharacter } from "./contexts/UserContext";
import Window from "./Window";

function StatsWindow() {
  const { closeWindow } = useWindow(UIWindow.Stats);
  const { character, useStatPoint } = useCharacter();

  const labelClasses = clsx("text-right");

  const addStatPoint = (stat: CharacterStats) => {
    useStatPoint(stat);
  }

  const canAddStat = character.statPoints > 0;

  return <Window className="w-max" close={() => closeWindow()}>
    <Window.Title>Player Stats</Window.Title>
    <div className="flex flex-col gap-y-3">
      <div className="">{character.name}</div>
      <div className="flex flex-row gap-x-3 text-sm">
        <div className="grid grid-cols-2 gap-x-2">
          <label className={labelClasses}>Class:</label>
          <span>{character.class}</span>
          <label className={labelClasses}>Experience:</label>
          <span>{character.experience}</span>
          <label className={labelClasses}>Strength:</label>
          <span className="flex flex-row items-center justify-between">
            {character.stats[CharacterStats.Strength]}
            {canAddStat && <div onClick={_ => addStatPoint(CharacterStats.Strength)}><img src="svg/iconPlus.svg" className="w-4 h-4 mr-4" /></div>}
          </span>
          <label className={labelClasses}>Dexterity:</label>
          <span className="flex flex-row items-center justify-between">
            {character.stats[CharacterStats.Dexterity]}
            {canAddStat && <div onClick={_ => addStatPoint(CharacterStats.Dexterity)}><img src="svg/iconPlus.svg" className="w-4 h-4 mr-4" /></div>}
          </span>
          <label className={labelClasses}>Intelligence:</label>
          <span className="flex flex-row items-center justify-between">
            {character.stats[CharacterStats.Intelligence]}
            {canAddStat && <div onClick={_ => addStatPoint(CharacterStats.Intelligence)}><img src="svg/iconPlus.svg" className="w-4 h-4 mr-4" /></div>}
          </span>
          <label className={labelClasses}>Vitality:</label>
          <span className="flex flex-row items-center justify-between">
            {character.stats[CharacterStats.Vitality]}
            {canAddStat && <div onClick={_ => addStatPoint(CharacterStats.Vitality)}><img src="svg/iconPlus.svg" className="w-4 h-4 mr-4" /></div>}
          </span>
          <label className={labelClasses}>Stat Points:</label>
          <span>{character.statPoints}</span>
          <label className={labelClasses}>Ability Points:</label>
          <span>{character.abilityPoints}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <label className={labelClasses}>Level:</label>
          <span>{character.level}</span>
          <label className={labelClasses}>Next:</label>
          <span>{character.level * 1000000}</span>
          <label className={labelClasses}>MQ Pass/Total:</label>
          <span>0 / 0</span>
          <label className={labelClasses}>Kills:</label>
          <span>{character.kills}</span>
          <label className={labelClasses}>Deaths:</label>
          <span>{character.deaths}</span>
          <label className={labelClasses}>Damage:</label>
          <span>0 to 0</span>
          <label className={labelClasses}>Physical Def:</label>
          <span>0 to 0</span>
          <label className={labelClasses}>Magical Def:</label>
          <span>0 to 0</span>
        </div>
      </div>
      <hr />
      <div className="flex flex-row">
        <div className="flex flex-col w-full gap-y-3">
          <div className="flex flex-row items-center">
            <div className="basis-4/12">Weapon Abilities</div>
            <div className="w-full h-full grid grid-cols-6 gap-2">
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M6 14l4 4 4-4H6m12-3.1V5.6H2v5.3h16M0 0h20v20H0V0"></path>
                <path fill="rgb(237,144,143)" d="M18 10.9H2V5.6h16v5.3M6 14h8l-4 4-4-4"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M18 10.9H2V5.6h16v5.3M6 14h8l-4 4-4-4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M14 14v4h4v-4h-4M2 14v4h4v-4H2m6 0v4h4v-4H8m2-12L6 6h8l-4-4m10-2v20H0V0h20"></path>
                <path fill="rgb(237,144,143)" d="M10 2l4 4H6l4-4M8 14h4v4H8v-4m-6 0h4v4H2v-4m12 0h4v4h-4v-4"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M10 2l4 4H6l4-4M8 14h4v4H8v-4m-6 0h4v4H2v-4m12 0h4v4h-4v-4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M18 6V2h-4v4h4m-6 0V2H8v4h4M6 6V2H2v4h4m8.5 5h-3V8h-3v3h-3v3h3v3h3v-3h3v-3M0 20V0h20v20H0"></path>
                <path fill="rgb(237,144,143)" d="M18 6h-4V2h4v4m-3.5 5v3h-3v3h-3v-3h-3v-3h3V8h3v3h3M6 6H2V2h4v4M8 6V2h4v4H8"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M18 6h-4V2h4v4m-3.5 5v3h-3v3h-3v-3h-3v-3h3V8h3v3h3M6 6H2V2h4v4M8 6V2h4v4H8"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(146,144,234)" d="M12 12H8V8h4v4m2-4h4v4h-4V8M2 8h4v4H2V8m8 10l-4-4h8l-4 4"></path>
                <path fill="rgb(202,202,255)" d="M10 18l4-4H6l4 4M2 8v4h4V8H2m12 0v4h4V8h-4m-2 4V8H8v4h4m8-12v20H0V0h20"></path>
                <path fill="none" stroke="rgb(146,144,234)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M12 12H8V8h4v4m2-4h4v4h-4V8M2 8h4v4H2V8M14 14H6l4 4 4-4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(202,202,255)" d="M2 2v16h16V2H2M0 20V0h20v20H0"></path>
                <path fill="rgb(146,144,234)" d="M10 12L6 8h8l-4 4"></path>
                <path fill="rgb(179,179,255)" d="M10 12l4-4H6l4 4M2 2h16v16H2V2"></path>
                <path fill="none" stroke="rgb(179,179,255)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M2 2h16v16H2V2"></path>
                <path fill="none" stroke="rgb(146,144,234)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M14 8H6l4 4 4-4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(202,202,255)" d="M12.65 4.65V2H7.3v5.3H2l.05.05L2 7.3h5.3v.05H2v5.35h5.3V18h5.35v-5.3H18V7.35h-.05L18 7.3h-5.3H18l-.05.05h-5.3V4.65l.05 2.65v.05-.05l-.05-2.65m0 2.65h.05-.05M20 20H0V0h20v20"></path>
                <path fill="rgb(146,144,234)" d="M12.7 12.7H7.4l-.1-.1.1.1h-.1V7.3h5.35v.05h.05v5.35m0-.1l-.1.1.1-.1"></path>
                <path fill="rgb(179,179,255)" d="M12.7 12.6l5.25-5.25-5.25 5.25V7.35H18v5.35h-5.3v-.1M7.3 7.3V2h5.35v5.3H7.3m5.35 5.4V18H7.3v-5.3H2V7.35h5.3v5.35h5.3L10 15.3l-2.6-2.6 2.6 2.6 2.6-2.6h.05M2.05 7.35L7.3 12.6 2.05 7.35"></path>
                <path fill="none" stroke="rgb(146,144,234)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M12.7 7.3H18l-.05.05-5.25 5.25v.1h-.05M2.05 7.35L2 7.3H12.65m0 .05h.05m0-.05h-.05m-5.35.05V7.3m0 .05v5.25l.1.1h5.2l.1-.1V7.35M7.4 12.7l2.6 2.6 2.6-2.6h.05m-5.35 0v-.1L2.05 7.35M7.4 12.7h-.1"></path>
                <path fill="none" stroke="rgb(179,179,255)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M7.3 12.7H2V7.35h2.65M7.3 7.3V2h5.35v2.65l.05 2.65m5.25.05H18v5.35h-5.3m-.05 0V18H7.3v-5.3m5.4-5.35V7.3m0 .05h5.25"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M8 6v8l4-4-4-4m6 12h4v-4h-4v4m0-6h4V8h-4v4m0-6h4V2h-4v4M0 0h20v20H0V0"></path>
                <path fill="rgb(237,144,143)" d="M14 6V2h4v4h-4m0 6V8h4v4h-4m0 6v-4h4v4h-4M8 6l4 4-4 4V6"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M14 6V2h4v4h-4m0 6V8h4v4h-4m0 6v-4h4v4h-4M8 6l4 4-4 4V6"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(237,144,143)" d="M12.7 17.6l-2.55.4H9.8l-2.4-.4V2.4L9.8 2h.35l2.55.45V17.6"></path>
                <path fill="rgb(255,179,179)" d="M12.7 17.6V2.45q1.65.55 3 1.85 2.25 2.35 2.3 5.5v.4q-.05 3.2-2.3 5.45-1.35 1.35-3 1.95"></path>
                <path fill="rgb(255,202,202)" d="M12.7 17.6q1.65-.6 3-1.95 2.25-2.25 2.3-5.45v-.4q-.05-3.15-2.3-5.5-1.35-1.3-3-1.85L10.15 2H9.8l-2.4.4v15.2l2.4.4h.35l2.55-.4M7.4 2.4q-1.7.55-3.05 1.9Q2.05 6.65 2 9.8v.4q.05 3.2 2.35 5.45Q5.7 17 7.4 17.6q-1.7-.6-3.05-1.95Q2.05 13.4 2 10.2v-.4q.05-3.15 2.35-5.5Q5.7 2.95 7.4 2.4M0 0h20v20H0V0"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M7.4 2.4v15.2"></path>
                <path fill="none" stroke="rgb(255,179,179)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M7.4 17.6q-1.7-.6-3.05-1.95Q2.05 13.4 2 10.2v-.4q.05-3.15 2.35-5.5Q5.7 2.95 7.4 2.4L9.8 2h.35l2.55.45V17.6l-2.55.4H9.8l-2.4-.4m5.3-15.15q1.65.55 3 1.85 2.25 2.35 2.3 5.5v.4q-.05 3.2-2.3 5.45-1.35 1.35-3 1.95"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M14 11v1h4V8h-1l1-1H2l1 1H2v4h4v-1l3 3H8v4h4v-4h-1l3-3m-2-5V2H8v4h4m6 0V2h-4v4h4M6 6V2H2v4h4m8 8v4h4v-4h-4M2 14v4h4v-4H2M20 0v20H0V0h20"></path>
                <path fill="rgb(237,69,68)" d="M18 6h-4V2h4v4m-6 0H8V2h4v4m5 2h1v4h-4V8h3m-6 6h1v4H8v-4h3m-5-3v1H2V8h4v3m6 1H8V8h4v4M2 14h4v4H2v-4m12 0h4v4h-4v-4"></path>
                <path fill="rgb(255,104,104)" d="M14 11l-3 3H9l-3-3V8H3L2 7h16l-1 1h-3v3m-2 1V8H8v4h4"></path>
                <path fill="rgb(237,69,68)" d="M6 2v4H2V2h4"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M18 6h-4V2h4v4m-6 0H8V2h4v4m5 2h1v4h-4v-1m-3 3h1v4H8v-4h3m-5-3v1H2V8h4v3m11-3h-3v3m-2 1H8V8h4v4M2 14h4v4H2v-4m12 0h4v4h-4v-4"></path>
                <path fill="none" stroke="rgb(255,104,104)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M14 11l-3 3m-2 0l-3-3M3 8L2 7h16l-1 1"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M6 2v4H2V2h4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M20 0v20H0V0h20m-2 18V2H2v16h16"></path>
                <path fill="rgb(237,69,68)" d="M15 11v4h-4v-4h4M5 5h4v4H5V5"></path>
                <path fill="rgb(255,104,104)" d="M5 5v4h4V5H5m10 6h-4v4h4v-4m3 7H2V2h16v16"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M15 11v4h-4v-4h4M5 5h4v4H5V5"></path>
                <path fill="none" stroke="rgb(255,104,104)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M18 18H2V2h16v16"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M12.6 18H18V2h-5.4H18v16h-5.4V2H2v16h10.6M0 0h20v20H0V0"></path>
                <path fill="rgb(255,104,104)" d="M7.3 18H2V2h5.3v16"></path>
                <path fill="rgb(237,69,68)" d="M7.3 18V2h5.3v16H7.3"></path>
                <path fill="none" stroke="rgb(255,104,104)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M12.6 2H18v16H2V2h10.6v16M7.3 2v16"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M9 10L5 6v8l4-4m7 0l-4-4v8l4-4m4-10v20H0V0h20"></path>
                <path fill="rgb(237,69,68)" d="M16 10l-4 4V6l4 4m-7 0l-4 4V6l4 4"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M16 10l-4 4V6l4 4m-7 0l-4 4V6l4 4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M11 6h1V2H8v4h1L6 9l3-3h2l3 3-3-3m6 6h1V8h-4v4h3l1 1H2l1-1-1 1h16l-1-1M6 9V8H2v4h4V9m6 3V8H8v4h4m-4 2v4h4v-4H8M20 0v20H0V0h20"></path>
                <path fill="rgb(237,69,68)" d="M9 6H8V2h4v4h-1l-1-1-1 1 1-1 1 1H9m5 3V8h4v4h-4V9l3 3-3-3M3 12H2V8h4v4H3l3-3-3 3m9 0H8V8h4v4m-4 2h4v4H8v-4"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M9 6H8V2h4v4h-1l3 3V8h4v4h-1l1 1H2l1-1H2V8h4v1l3-3 1-1 1 1H9m3 6H8V8h4v4m5 0h-3V9l3 3M6 9v3H3l3-3m2 5h4v4H8v-4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(237,69,68)" d="M8 10l4-4v8l-4-4m-2 4v4H2v-4h4m0-6v4H2V8h4m0-6v4H2V2h4"></path>
                <path fill="rgb(255,127,127)" d="M6 2H2v4h4V2m0 6H2v4h4V8m0 6H2v4h4v-4m2-4l4 4V6l-4 4M0 0h20v20H0V0"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M6 2H2v4h4V2m0 6H2v4h4V8m0 6H2v4h4v-4m2-4l4 4V6l-4 4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M18 6l-4 4 4 4V6m-6 2H8v4h4V8m0-6H8v4h4V2M2 6v8l4-4-4-4m6 12h4v-4H8v4M20 0v20H0V0h20"></path>
                <path fill="rgb(237,69,68)" d="M18 6v8l-4-4 4-4M8 18v-4h4v4H8M2 6l4 4-4 4V6m10-4v4H8V2h4m0 6v4H8V8h4"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M18 6v8l-4-4 4-4m-6 2H8v4h4V8m0-6H8v4h4V2M2 6v8l4-4-4-4m6 12h4v-4H8v4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M11 16.7h5.7l-.05-5.7L11 16.7m-8 0l5.7-.05L3 11v5.7m.05-8L8.7 3H3l.05 5.7m13.65 0V3l-5.7.05 5.7 5.65M20 0v20H0V0h20"></path>
                <path fill="rgb(237,69,68)" d="M16.7 8.7L11 3.05 16.7 3v5.7m-13.65 0L3 3h5.7L3.05 8.7m-.05 8V11l5.7 5.65-5.7.05m8 0l5.65-5.7.05 5.7H11"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M16.7 8.7L11 3.05 16.7 3v5.7m-13.65 0L3 3h5.7L3.05 8.7m-.05 8V11l5.7 5.65-5.7.05m8 0l5.65-5.7.05 5.7H11"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M13 10l4 4V6l-4 4M6 3l4 4 4-4H6m1 7L3 6v8l4-4m-1 7h8l-4-4-4 4M20 0v20H0V0h20"></path>
                <path fill="rgb(237,69,68)" d="M13 10l4-4v8l-4-4m-6 0l-4 4V6l4 4M6 3h8l-4 4-4-4m0 14l4-4 4 4H6"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M13 10l4 4V6l-4 4m-6 0l-4 4V6l4 4M6 3h8l-4 4-4-4m0 14h8l-4-4-4 4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M12.65 7.35V2H7.3v5.35H2v5.35h5.3V18h5.35v-5.3H18V7.35h-5.35M18 18v-4h-4v4h4M6 18v-4H2v4h4M6 6V2H2v4h4m12 0V2h-4v4h4M0 20V0h20v20H0"></path>
                <path fill="rgb(237,69,68)" d="M12 12H8V8h4v4m6-6h-4V2h4v4M6 6H2V2h4v4m0 12H2v-4h4v4m12 0h-4v-4h4v4"></path>
                <path fill="rgb(255,104,104)" d="M12.65 7.35H18v5.35h-5.35V18H7.3v-5.3H2V7.35h5.3V2h5.35v5.35M12 12V8H8v4h4"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M12 12H8V8h4v4m6-6h-4V2h4v4M6 6H2V2h4v4m0 12H2v-4h4v4m12 0h-4v-4h4v4"></path>
                <path fill="none" stroke="rgb(255,104,104)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M12.65 7.35H18v5.35h-5.35V18H7.3v-5.3H2V7.35h5.3V2h5.35v5.35"></path>
              </svg>
            </div>
          </div>
          <hr />
          <div className="flex flex-row items-center">
            <div className="basis-4/12">Cast Abilities</div>
            <div className="w-full h-full grid grid-cols-6 gap-2">
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M6 4q0-.85-.6-1.45Q4.85 2 4 2q-.8 0-1.4.55Q2 3.15 2 4t.6 1.4Q3.2 6 4 6q.85 0 1.4-.6Q6 4.85 6 4m5.4 1.4q.6-.55.6-1.4 0-.85-.6-1.45Q10.85 2 10 2q-.8 0-1.4.55Q8 3.15 8 4t.6 1.4q.6.6 1.4.6.85 0 1.4-.6m6 0q.6-.55.6-1.4 0-.85-.6-1.45Q16.85 2 16 2q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4q.6.6 1.4.6.85 0 1.4-.6M20 0v20H0V0h20"></path>
                <path fill="rgb(237,144,143)" d="M17.4 5.4q-.55.6-1.4.6-.8 0-1.4-.6Q14 4.85 14 4q0-.85.6-1.45Q15.2 2 16 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4m-6 0q-.55.6-1.4.6-.8 0-1.4-.6Q8 4.85 8 4q0-.85.6-1.45Q9.2 2 10 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4M6 4q0 .85-.6 1.4Q4.85 6 4 6q-.8 0-1.4-.6Q2 4.85 2 4q0-.85.6-1.45Q3.2 2 4 2q.85 0 1.4.55.6.6.6 1.45"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M17.4 5.4q-.55.6-1.4.6-.8 0-1.4-.6Q14 4.85 14 4q0-.85.6-1.45Q15.2 2 16 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4m-6 0q-.55.6-1.4.6-.8 0-1.4-.6Q8 4.85 8 4q0-.85.6-1.45Q9.2 2 10 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4M6 4q0 .85-.6 1.4Q4.85 6 4 6q-.8 0-1.4-.6Q2 4.85 2 4q0-.85.6-1.45Q3.2 2 4 2q.85 0 1.4.55.6.6.6 1.45M10.7 9l-1.2.75Q9 10.25 9 11q0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M6 5.05q-.05-.85.55-1.45.6-.7 1.45-.6.95.1 1.4.7l.55 1 .55.5q.6.4 1.3.4.75 0 1.25-.5l.75-1.2-.75 1.2q-.5.5-1.25.5-.7 0-1.3-.4l-.55-.5-.55-1Q8.95 3.1 8 3q-.85-.1-1.45.6-.6.6-.55 1.45M4 8q-.8 0-1.4.55Q2 9.15 2 10t.6 1.4q.6.6 1.4.6.85 0 1.4-.6.6-.55.6-1.4 0-.85-.6-1.45Q4.85 8 4 8m8 2q0-.85-.6-1.45Q10.85 8 10 8q-.8 0-1.4.55Q8 9.15 8 10t.6 1.4q.6.6 1.4.6.85 0 1.4-.6.6-.55.6-1.4m2 0q0 .85.6 1.4.6.6 1.4.6.85 0 1.4-.6.6-.55.6-1.4 0-.85-.6-1.45Q16.85 8 16 8q-.8 0-1.4.55-.6.6-.6 1.45M0 0h20v20H0V0"></path>
                <path fill="rgb(237,144,143)" d="M14 10q0-.85.6-1.45Q15.2 8 16 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6-.8 0-1.4-.6-.6-.55-.6-1.4m-2 0q0 .85-.6 1.4-.55.6-1.4.6-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45M4 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6-.8 0-1.4-.6Q2 10.85 2 10q0-.85.6-1.45Q3.2 8 4 8"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M13.8 3.9l-.75 1.2q-.5.5-1.25.5-.7 0-1.3-.4l-.55-.5-.55-1Q8.95 3.1 8 3q-.85-.1-1.45.6-.6.6-.55 1.45M14 10q0-.85.6-1.45Q15.2 8 16 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6-.8 0-1.4-.6-.6-.55-.6-1.4m-2 0q0 .85-.6 1.4-.55.6-1.4.6-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45M4 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6-.8 0-1.4-.6Q2 10.85 2 10q0-.85.6-1.45Q3.2 8 4 8"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M20 0v20H0V0h20m-4.4 4.2l-1.4-1.1Q12.45 2 10.1 2h-.15q-2.3 0-4.1 1.15L4.4 4.2q-.75.75-1.25 1.6Q2 7.65 2 10q0 3.4 2.4 5.6Q6.8 18 10 18q3.4 0 5.6-2.4Q18 13.4 18 10q0-2.35-1.1-4.2l-1.3-1.6"></path>
                <path fill="rgb(255,179,179)" d="M15.6 4.2l1.3 1.6Q18 7.65 18 10q0 3.4-2.4 5.6Q13.4 18 10 18q-3.2 0-5.6-2.4Q2 13.4 2 10q0-2.35 1.15-4.2.5-.85 1.25-1.6l1.45-1.05Q7.65 2 9.95 2h.15q2.35 0 4.1 1.1l1.4 1.1m-6.05 9.6q.85.05 1.45-.55.7-.6.6-1.45-.1-.95-.7-1.4l-1-.55-.5-.55Q9 8.7 9 8q0-.75.5-1.25l1.2-.85-1.2.85Q9 7.25 9 8q0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55"></path>
                <path fill="none" stroke="rgb(255,179,179)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M15.6 4.2l1.3 1.6Q18 7.65 18 10q0 3.4-2.4 5.6Q13.4 18 10 18q-3.2 0-5.6-2.4Q2 13.4 2 10q0-2.35 1.15-4.2.5-.85 1.25-1.6l1.45-1.05Q7.65 2 9.95 2h.15q2.35 0 4.1 1.1l1.4 1.1"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M10.7 5.9l-1.2.85Q9 7.25 9 8q0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M11.4 11.4q.6-.55.6-1.4 0-.85-.6-1.45Q10.85 8 10 8q-.8 0-1.4.55Q8 9.15 8 10t.6 1.4q.6.6 1.4.6l.7-.1.7-.5M12 4q0-.85-.6-1.45Q10.85 2 10 2q-.8 0-1.4.55Q8 3.15 8 4t.6 1.4q.6.6 1.4.6.85 0 1.4-.6.6-.55.6-1.4M3.55 14q.85.05 1.45-.55.7-.6.6-1.45-.1-.95-.7-1.4l-1-.55-.5-.55Q3 8.9 3 8.2q0-.75.5-1.25L4.7 5.9 3.5 6.95Q3 7.45 3 8.2q0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55m11 0q.85.05 1.45-.55.7-.6.6-1.45-.1-.95-.7-1.4l-1-.55-.5-.55q-.4-.6-.4-1.3 0-.75.5-1.25L15.75 6l-1.25.95q-.5.5-.5 1.25 0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55M8.6 17.4q.6.6 1.4.6.85 0 1.4-.6.6-.55.6-1.4 0-.85-.6-1.45Q10.85 14 10 14q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4M0 0h20v20H0V0"></path>
                <path fill="rgb(237,144,143)" d="M12 4q0 .85-.6 1.4-.55.6-1.4.6-.8 0-1.4-.6Q8 4.85 8 4q0-.85.6-1.45Q9.2 2 10 2q.85 0 1.4.55.6.6.6 1.45m-.6 7.4l-.7.5-.7.1q-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4m-2.8 6Q8 16.85 8 16q0-.85.6-1.45Q9.2 14 10 14q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6-.8 0-1.4-.6"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M12 4q0 .85-.6 1.4-.55.6-1.4.6-.8 0-1.4-.6Q8 4.85 8 4q0-.85.6-1.45Q9.2 2 10 2q.85 0 1.4.55.6.6.6 1.45m-.6 7.4l-.7.5-.7.1q-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4M15.75 6l-1.25.95q-.5.5-.5 1.25 0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55M4.7 5.9L3.5 6.95Q3 7.45 3 8.2q0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55m5.05 3.4Q8 16.85 8 16q0-.85.6-1.45Q9.2 14 10 14q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6-.8 0-1.4-.6"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M11 4.05V2H9v2.05H7V6h2v3.05H6V7H4v2.05H2V11h2v2h2v-2h3v3.05H7V16h2v2h2v-2h2v-1.95h-2V11h3v2h2v-2h2V9.05h-2V7h-2v2.05h-3V6h2V4.05h-2M20 20H0V0h20v20"></path>
                <path fill="rgb(237,144,143)" d="M11 4.05h2V6h-2v3.05h3V7h2v2.05h2V11h-2v2h-2v-2h-3v3.05h2V16h-2v2H9v-2H7v-1.95h2V11H6v2H4v-2H2V9.05h2V7h2v2.05h3V6H7V4.05h2V2h2v2.05"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M11 4.05V2H9v2.05H7V6h2v3.05H6V7H4v2.05H2V11h2v2h2v-2h3v3.05H7V16h2v2h2v-2h2v-1.95h-2V11h3v2h2v-2h2V9.05h-2V7h-2v2.05h-3V6h2V4.05h-2"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M20 0v20H0V0h20M2 2v16h16V2H2"></path>
                <path fill="rgb(255,179,179)" d="M2 2h16v16H2V2m13 9.65v-3.3h-3.3V5H8.35v3.35H5v3.3h3.35V15h3.35v-3.35H15"></path>
                <path fill="rgb(237,144,143)" d="M15 11.65h-3.3V15H8.35v-3.35H5v-3.3h3.35V5h3.35v3.35H15v3.3"></path>
                <path fill="none" stroke="rgb(255,179,179)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M2 2h16v16H2V2"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M11.7 8.35H15v3.3h-3.3V15H8.35v-3.35H5v-3.3h3.35V5h3.35v3.35"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,202,202)" d="M18 2h-4v16h4V2m-6 9.65V8.3H8.7V5H5.35v3.3H2v3.35h3.35V15H8.7v-3.35H12M0 0h20v20H0V0"></path>
                <path fill="rgb(237,144,143)" d="M12 11.65H8.7V15H5.35v-3.35H2V8.3h3.35V5H8.7v3.3H12v3.35M18 2v16h-4V2h4"></path>
                <path fill="none" stroke="rgb(237,144,143)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M12 11.65H8.7V15H5.35v-3.35H2V8.3h3.35V5H8.7v3.3H12v3.35M18 2v16h-4V2h4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M9 11.05q-.05-.85.55-1.45.6-.7 1.45-.6.5.05.9.25l.5.45.55 1 .55.5q.6.4 1.3.4.75 0 1.25-.5l.75-1.2-.75 1.2q-.5.5-1.25.5-.7 0-1.3-.4l-.55-.5-.55-1-.5-.45q-.4-.2-.9-.25-.85-.1-1.45.6-.6.6-.55 1.45M4 18q.85 0 1.4-.6.6-.55.6-1.4 0-.85-.6-1.45Q4.85 14 4 14q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4q.6.6 1.4.6m-1.4-6.6q.6.6 1.4.6l.7-.1.7-.5q.6-.55.6-1.4 0-.85-.6-1.45Q4.85 8 4 8q-.8 0-1.4.55Q2 9.15 2 10t.6 1.4m2.8-6Q6 4.85 6 4q0-.85-.6-1.45Q4.85 2 4 2q-.8 0-1.4.55Q2 3.15 2 4t.6 1.4Q3.2 6 4 6q.85 0 1.4-.6M0 0h20v20H0V0"></path>
                <path fill="rgb(237,69,68)" d="M5.4 5.4Q4.85 6 4 6q-.8 0-1.4-.6Q2 4.85 2 4q0-.85.6-1.45Q3.2 2 4 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4m-2.8 6Q2 10.85 2 10q0-.85.6-1.45Q3.2 8 4 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5-.7.1q-.8 0-1.4-.6M4 18q-.8 0-1.4-.6Q2 16.85 2 16q0-.85.6-1.45Q3.2 14 4 14q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M16.8 9.9l-.75 1.2q-.5.5-1.25.5-.7 0-1.3-.4l-.55-.5-.55-1-.5-.45q-.4-.2-.9-.25-.85-.1-1.45.6-.6.6-.55 1.45M5.4 5.4Q4.85 6 4 6q-.8 0-1.4-.6Q2 4.85 2 4q0-.85.6-1.45Q3.2 2 4 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4m-2.8 6Q2 10.85 2 10q0-.85.6-1.45Q3.2 8 4 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5-.7.1q-.8 0-1.4-.6M4 18q-.8 0-1.4-.6Q2 16.85 2 16q0-.85.6-1.45Q3.2 14 4 14q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M14.2 10.85l.4.55q.6.6 1.4.6.85 0 1.4-.6.6-.55.6-1.4 0-.85-.6-1.45l-.55-.35L16 8q-.8 0-1.4.55-.6.6-.6 1.45l.2.85-3.35 3.35 3.35-3.35M12 10q0-.85-.6-1.45Q10.85 8 10 8q-.8 0-1.4.55Q8 9.15 8 10t.6 1.4q.6.6 1.4.6.85 0 1.4-.6.6-.55.6-1.4m-.6-4.6q.6-.55.6-1.4 0-.85-.6-1.45Q10.85 2 10 2q-.8 0-1.4.55Q8 3.15 8 4t.6 1.4q.6.6 1.4.6.85 0 1.4-.6m-.15 12.15l.15-.15q.6-.55.6-1.4 0-.85-.6-1.45-.25-.25-.55-.35L10 14l-.8.2q-.35.1-.6.35l-.35.5Q8 15.45 8 16q0 .85.6 1.4.6.6 1.4.6l1.25-.45.55.05q.75 0 1.25-.5l.75-1.2-.75 1.2q-.5.5-1.25.5l-.55-.05M3.2 8.2L2 7h16l-1.15 1.2L18 7H2l1.2 1.2-.6.35Q2 9.15 2 10t.6 1.4q.6.6 1.4.6.85 0 1.4-.6l.45-.55L6 10q0-.85-.6-1.45Q4.85 8 4 8l-.8.2m6 6l-3.35-3.35L9.2 14.2M6 17.05q-.05-.85.55-1.45.6-.7 1.45-.6l.25.05L8 15q-.85-.1-1.45.6-.6.6-.55 1.45M20 0v20H0V0h20"></path>
                <path fill="rgb(237,69,68)" d="M11.4 5.4q-.55.6-1.4.6-.8 0-1.4-.6Q8 4.85 8 4q0-.85.6-1.45Q9.2 2 10 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4M12 10q0 .85-.6 1.4-.55.6-1.4.6-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45m4.85-1.8l.55.35q.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6-.8 0-1.4-.6l-.4-.55L14 10q0-.85.6-1.45Q15.2 8 16 8l.85.2-2.65 2.65 2.65-2.65m-6 6q.3.1.55.35.6.6.6 1.45t-.6 1.4l-.15.15-.75-.35-.55-.5-.55-1q-.4-.5-1.15-.65.75.15 1.15.65l.55 1 .55.5.75.35L10 18q-.8 0-1.4-.6Q8 16.85 8 16q0-.55.25-.95l.35-.5q.25-.25.6-.35l.8-.2.85.2-.85.8-.8-.8.8.8.85-.8m-7.65-6L4 8q.85 0 1.4.55.6.6.6 1.45l-.15.85-.45.55q-.55.6-1.4.6-.8 0-1.4-.6Q2 10.85 2 10q0-.85.6-1.45l.6-.35 2.65 2.65L3.2 8.2"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M11.4 5.4q-.55.6-1.4.6-.8 0-1.4-.6Q8 4.85 8 4q0-.85.6-1.45Q9.2 2 10 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4M12 10q0 .85-.6 1.4-.55.6-1.4.6-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45m4.85-1.8l.55.35q.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6-.8 0-1.4-.6l-.4-.55-3.35 3.35q.3.1.55.35.6.6.6 1.45t-.6 1.4l-.15.15.55.05q.75 0 1.25-.5l.75-1.2m.4-5.05L14 10q0-.85.6-1.45Q15.2 8 16 8l.85.2L18 7H2l1.2 1.2L4 8q.85 0 1.4.55.6.6.6 1.45l-.15.85L9.2 14.2l.8-.2.85.2-.85.8-.8-.8q-.35.1-.6.35l-.35.5q.75.15 1.15.65l.55 1 .55.5.75.35L10 18q-.8 0-1.4-.6Q8 16.85 8 16q0-.55.25-.95L8 15q-.85-.1-1.45.6-.6.6-.55 1.45m8.2-6.2l2.65-2.65m-11 2.65l-.45.55q-.55.6-1.4.6-.8 0-1.4-.6Q2 10.85 2 10q0-.85.6-1.45l.6-.35 2.65 2.65"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(237,69,68)" d="M2 2h4v16H2V2m16 9.65h-3.35V15H11.3v-3.35H8V8.3h3.3V5h3.35v3.3H18v3.35"></path>
                <path fill="rgb(255,127,127)" d="M18 11.65V8.3h-3.35V5H11.3v3.3H8v3.35h3.3V15h3.35v-3.35H18M2 2v16h4V2H2M0 0h20v20H0V0"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M18 11.65V8.3h-3.35V5H11.3v3.3H8v3.35h3.3V15h3.35v-3.35H18M2 2v16h4V2H2"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M17.4 17.4q.6-.55.6-1.4 0-.85-.6-1.45Q16.85 14 16 14q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4q.6.6 1.4.6l.7-.1.7-.5M4 18q.85 0 1.4-.6.6-.55.6-1.4 0-.85-.6-1.45Q4.85 14 4 14q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4q.6.6 1.4.6M5.4 5.4Q6 4.85 6 4q0-.85-.6-1.45Q4.85 2 4 2q-.8 0-1.4.55Q2 3.15 2 4t.6 1.4Q3.2 6 4 6q.85 0 1.4-.6m5.3 6.5l.7-.5q.6-.55.6-1.4 0-.85-.6-1.45Q10.85 8 10 8q-.8 0-1.4.55Q8 9.15 8 10t.6 1.4q.6.6 1.4.6l.7-.1m6.7-6.5q.6-.55.6-1.4 0-.85-.6-1.45Q16.85 2 16 2q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4q.6.6 1.4.6l.7-.1.7-.5M10 15l8-8H2l8 8-8-8h16l-8 8M0 0h20v20H0V0"></path>
                <path fill="rgb(237,69,68)" d="M17.4 5.4l-.7.5-.7.1q-.8 0-1.4-.6Q14 4.85 14 4q0-.85.6-1.45Q15.2 2 16 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4m-6.7 6.5l-.7.1q-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5M5.4 5.4Q4.85 6 4 6q-.8 0-1.4-.6Q2 4.85 2 4q0-.85.6-1.45Q3.2 2 4 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4M4 18q-.8 0-1.4-.6Q2 16.85 2 16q0-.85.6-1.45Q3.2 14 4 14q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6m13.4-.6l-.7.5-.7.1q-.8 0-1.4-.6-.6-.55-.6-1.4 0-.85.6-1.45.6-.55 1.4-.55.85 0 1.4.55.6.6.6 1.45t-.6 1.4"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M17.4 5.4l-.7.5-.7.1q-.8 0-1.4-.6Q14 4.85 14 4q0-.85.6-1.45Q15.2 2 16 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4m-6.7 6.5l-.7.1q-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5M5.4 5.4Q4.85 6 4 6q-.8 0-1.4-.6Q2 4.85 2 4q0-.85.6-1.45Q3.2 2 4 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4M4 18q-.8 0-1.4-.6Q2 16.85 2 16q0-.85.6-1.45Q3.2 14 4 14q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6m13.4-.6l-.7.5-.7.1q-.8 0-1.4-.6-.6-.55-.6-1.4 0-.85.6-1.45.6-.55 1.4-.55.85 0 1.4.55.6.6.6 1.45t-.6 1.4M10 15L2 7h16l-8 8"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M14.6 8.55q-.6.6-.6 1.45t.6 1.4q.6.6 1.4.6l.7-.1.7-.5q.6-.55.6-1.4 0-.85-.6-1.45Q16.85 8 16 8q-.8 0-1.4.55M18 4q0-.85-.6-1.45Q16.85 2 16 2q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4q.6.6 1.4.6.85 0 1.4-.6.6-.55.6-1.4m-8 8L6 8l-4 4h8m7.4 2.55Q16.85 14 16 14q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4q.6.6 1.4.6.85 0 1.4-.6.6-.55.6-1.4 0-.85-.6-1.45M20 0v20H0V0h20"></path>
                <path fill="rgb(237,69,68)" d="M18 4q0 .85-.6 1.4-.55.6-1.4.6-.8 0-1.4-.6Q14 4.85 14 4q0-.85.6-1.45Q15.2 2 16 2q.85 0 1.4.55.6.6.6 1.45m-3.4 4.55Q15.2 8 16 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5-.7.1q-.8 0-1.4-.6-.6-.55-.6-1.4 0-.85.6-1.45m2.8 6q.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6-.8 0-1.4-.6-.6-.55-.6-1.4 0-.85.6-1.45.6-.55 1.4-.55.85 0 1.4.55M6 8l4 4H2l4-4"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M18 4q0 .85-.6 1.4-.55.6-1.4.6-.8 0-1.4-.6Q14 4.85 14 4q0-.85.6-1.45Q15.2 2 16 2q.85 0 1.4.55.6.6.6 1.45m-3.4 4.55Q15.2 8 16 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5-.7.1q-.8 0-1.4-.6-.6-.55-.6-1.4 0-.85.6-1.45m2.8 6q.6.6.6 1.45t-.6 1.4q-.55.6-1.4.6-.8 0-1.4-.6-.6-.55-.6-1.4 0-.85.6-1.45.6-.55 1.4-.55.85 0 1.4.55M6 8l4 4H2l4-4"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M16.9 5.85l.5-.45q.6-.55.6-1.4 0-.85-.6-1.45Q16.85 2 16 2q-.8 0-1.4.55l-.4.55Q12.45 2 10.1 2q2.35 0 4.1 1.1L14 4q0 .85.6 1.4.6.6 1.4.6l.7-.1.2-.05q1.1 1.8 1.1 4.1 0-2.3-1.1-4.1M18 10.1v-.15q-.05-.85-.6-1.4Q16.85 8 16 8q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4q.6.6 1.4.6l.7-.1.7-.5q.55-.5.6-1.3 0 2.3-1.15 4.05Q18 12.4 18 10.1m-3.8 6.75l.4.55q.6.6 1.4.6l.7-.1.7-.5q.6-.55.6-1.4 0-.85-.6-1.45l-.55-.4L16 14q-.8 0-1.4.55-.6.6-.6 1.45l.2.85Q12.4 18 10.1 18q2.3 0 4.1-1.15M9.95 18h.15l.6-.1.7-.5q.6-.55.6-1.4 0-.85-.6-1.45Q10.85 14 10 14q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4q.6.6 1.35.6-2.25 0-4.1-1.2Q7.7 18 9.95 18M3.2 14.2l-.6.35Q2 15.15 2 16t.6 1.4q.6.6 1.4.6.85 0 1.4-.6l.45-.6L6 16q0-.85-.6-1.45Q4.85 14 4 14l-.8.2Q2 12.4 2 10.1q0 2.3 1.2 4.1M2 9.95v.15q.05.8.6 1.3.6.6 1.4.6l.7-.1.7-.5q.6-.55.6-1.4 0-.85-.6-1.45Q4.85 8 4 8q-.8 0-1.4.55-.55.55-.6 1.4 0-2.3 1.15-4.15Q2 7.65 2 9.95m3.85-6.8l-.45-.6Q4.85 2 4 2q-.8 0-1.4.55Q2 3.15 2 4t.6 1.4l.55.4L4 6q.85 0 1.4-.6Q6 4.85 6 4l-.15-.85Q7.65 2 9.95 2q-2.3 0-4.1 1.15M10.1 2h-.15q-.8.05-1.35.55Q8 3.15 8 4t.6 1.4q.6.6 1.4.6l.7-.1.7-.5q.6-.55.6-1.4 0-.85-.6-1.45-.5-.5-1.3-.55m.6 9.9l.7-.5q.6-.55.6-1.4 0-.85-.6-1.45Q10.85 8 10 8q-.8 0-1.4.55Q8 9.15 8 10t.6 1.4q.6.6 1.4.6l.7-.1M20 20H0V0h20v20"></path>
                <path fill="rgb(237,69,68)" d="M14.2 3.1l.4-.55Q15.2 2 16 2q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.5.45-1.3-1.65-1.4-1.1 1.4 1.1 1.3 1.65-.2.05-.7.1q-.8 0-1.4-.6Q14 4.85 14 4l.2-.9M18 9.95v.15q-.05.8-.6 1.3l-.7.5-.7.1q-.8 0-1.4-.6-.6-.55-.6-1.4 0-.85.6-1.45Q15.2 8 16 8q.85 0 1.4.55.55.55.6 1.4m-1.15 4.2l.55.4q.6.6.6 1.45t-.6 1.4l-.7.5-.7.1q-.8 0-1.4-.6l-.4-.55L14 16q0-.85.6-1.45.6-.55 1.4-.55l.85.15-1.25 1.45-1.4 1.25 1.4-1.25 1.25-1.45M10.1 18h-.15q-.75 0-1.35-.6Q8 16.85 8 16q0-.85.6-1.45Q9.2 14 10 14q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5-.6.1m-4.25-1.2l-.45.6q-.55.6-1.4.6-.8 0-1.4-.6Q2 16.85 2 16q0-.85.6-1.45l.6-.35.8-.2q.85 0 1.4.55.6.6.6 1.45l-.15.8-1.45-1.2-1.2-1.4 1.2 1.4 1.45 1.2M2 10.1v-.15q.05-.85.6-1.4Q3.2 8 4 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5-.7.1q-.8 0-1.4-.6-.55-.5-.6-1.3m1.15-4.3l-.55-.4Q2 4.85 2 4q0-.85.6-1.45Q3.2 2 4 2q.85 0 1.4.55l.45.6L6 4q0 .85-.6 1.4Q4.85 6 4 6l-.85-.2q.5-.85 1.25-1.6l1.45-1.05L4.4 4.2q-.75.75-1.25 1.6M9.95 2h.15q.8.05 1.3.55.6.6.6 1.45t-.6 1.4l-.7.5-.7.1q-.8 0-1.4-.6Q8 4.85 8 4q0-.85.6-1.45.55-.5 1.35-.55m.75 9.9l-.7.1q-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M16.9 5.85l.5-.45q.6-.55.6-1.4 0-.85-.6-1.45Q16.85 2 16 2q-.8 0-1.4.55l-.4.55 1.4 1.1 1.3 1.65q1.1 1.8 1.1 4.1v.15q0 2.3-1.15 4.05l.55.4q.6.6.6 1.45t-.6 1.4l-.7.5-.7.1q-.8 0-1.4-.6l-.4-.55Q12.4 18 10.1 18h-.15q-2.25 0-4.1-1.2l-.45.6q-.55.6-1.4.6-.8 0-1.4-.6Q2 16.85 2 16q0-.85.6-1.45l.6-.35Q2 12.4 2 10.1v-.15q0-2.3 1.15-4.15l-.55-.4Q2 4.85 2 4q0-.85.6-1.45Q3.2 2 4 2q.85 0 1.4.55l.45.6Q7.65 2 9.95 2h.15q2.35 0 4.1 1.1L14 4q0 .85.6 1.4.6.6 1.4.6l.7-.1.2-.05M10.1 2q.8.05 1.3.55.6.6.6 1.45t-.6 1.4l-.7.5-.7.1q-.8 0-1.4-.6Q8 4.85 8 4q0-.85.6-1.45.55-.5 1.35-.55m.75 9.9l-.7.1q-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5m7.3-1.8q-.05.8-.6 1.3l-.7.5-.7.1q-.8 0-1.4-.6-.6-.55-.6-1.4 0-.85.6-1.45Q15.2 8 16 8q.85 0 1.4.55.55.55.6 1.4M5.85 3.15L6 4q0 .85-.6 1.4Q4.85 6 4 6l-.85-.2q.5-.85 1.25-1.6l1.45-1.05M2 9.95q.05-.85.6-1.4Q3.2 8 4 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5-.7.1q-.8 0-1.4-.6-.55-.5-.6-1.3M9.95 18q-.75 0-1.35-.6Q8 16.85 8 16q0-.85.6-1.45Q9.2 14 10 14q.85 0 1.4.55.6.6.6 1.45t-.6 1.4l-.7.5-.6.1m-6.9-3.8L4 14q.85 0 1.4.55.6.6.6 1.45l-.15.8-1.45-1.2-1.2-1.4m11 2.65L14 16q0-.85.6-1.45.6-.55 1.4-.55l.85.15-1.25 1.45-1.4 1.25"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M4 10q0 .85.6 1.4.6.6 1.35.6h.1q.8 0 1.35-.6.6-.55.6-1.4 0-.85-.6-1.45Q6.85 8 6 8q-.8 0-1.4.55Q4 9.15 4 10m11-1.75L14 8q-.8 0-1.4.55-.6.6-.6 1.45t.6 1.4q.6.6 1.4.6l.7-.1.35-.15.35-.35q.6-.55.6-1.4 0-.85-.6-1.45l-.4-.3M20 0v20H0V0h20"></path>
                <path fill="rgb(237,69,68)" d="M15 8.25l.4.3q.6.6.6 1.45t-.6 1.4l-.35.35-.35.15-.7.1q-.8 0-1.4-.6-.6-.55-.6-1.4 0-.85.6-1.45Q13.2 8 14 8l1 .25M4 10q0-.85.6-1.45Q5.2 8 6 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.35.6h-.1q-.75 0-1.35-.6Q4 10.85 4 10"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M15 8.25l.4.3q.6.6.6 1.45t-.6 1.4l-.35.35-.35.15-.7.1q-.8 0-1.4-.6-.6-.55-.6-1.4 0-.85.6-1.45Q13.2 8 14 8l1 .25M4 10q0-.85.6-1.45Q5.2 8 6 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4q-.55.6-1.35.6h-.1q-.75 0-1.35-.6Q4 10.85 4 10"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M12.65 7.35V2H7.3v5.35H2v5.35h5.3V18h5.35v-5.3H18V7.35h-5.35M0 20V0h20v20H0"></path>
                <path fill="rgb(237,69,68)" d="M11.4 11.4q-.55.6-1.4.6-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4"></path>
                <path fill="rgb(255,104,104)" d="M11.4 11.4q.6-.55.6-1.4 0-.85-.6-1.45Q10.85 8 10 8q-.8 0-1.4.55Q8 9.15 8 10t.6 1.4q.6.6 1.4.6.85 0 1.4-.6m1.25-4.05H18v5.35h-5.35V18H7.3v-5.3H2V7.35h5.3V2h5.35v5.35"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M11.4 11.4q-.55.6-1.4.6-.8 0-1.4-.6Q8 10.85 8 10q0-.85.6-1.45Q9.2 8 10 8q.85 0 1.4.55.6.6.6 1.45t-.6 1.4"></path>
                <path fill="none" stroke="rgb(255,104,104)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M12.65 7.35H18v5.35h-5.35V18H7.3v-5.3H2V7.35h5.3V2h5.35v5.35"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,104,104)" d="M12 10.6q-.05-.65.45-1.1.45-.55 1.1-.5.75.1 1.1.55l.35.7-.35-.7q-.35-.45-1.1-.55-.65-.05-1.1.5-.5.45-.45 1.1M9.45 8q.65.05 1.1-.4.55-.45.45-1.1l-.1-.5-.4-.6-.55-.3L9.7 5l.25.1.55.3.4.6.1.5q.1.65-.45 1.1-.45.45-1.1.4M15 10.25V15H9.85l-.15-.05-.35-.4q-.35-.45-.35-1 0-.6.4-.95.4-.4.95-.6-.55.2-.95.6-.4.35-.4.95 0 .55.35 1l.35.4.15.05H5V5h10v5.25M8 9.7l-.55.95q-.4.35-.95.35l-.5-.05-.5-.25-.4-.35h-.05l-.05-.1.05.1h.05l.4.35.5.25.5.05q.55 0 .95-.35L8 9.7"></path>
                <path fill="rgb(255,127,127)" d="M15 10.25l.05.1h.05l.35.35.55.25.45.05q.6 0 1-.35L18 9.7l-.55.95q-.4.35-1 .35l-.45-.05-.55-.25-.35-.35h-.05l-.05-.1V5H9.7l-.35-.45Q9 4.1 9 3.55t.4-.95q.4-.4.95-.6-.55.2-.95.6-.4.4-.4.95 0 .55.35 1L9.7 5H5v5.25l-.35-.7Q4.3 9.1 3.55 9q-.65-.05-1.1.5Q2 9.95 2 10.6q0-.65.45-1.1.45-.55 1.1-.5.75.1 1.1.55l.35.7V15h10v-4.75M9.45 18q.65.05 1.1-.4.55-.45.45-1.15l-.05-.45-.45-.6-.55-.3-.1-.1.1.1.55.3.45.6.05.45q.1.7-.45 1.15-.45.45-1.1.4M0 0h20v20H0V0"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M9.7 5l.25.1.55.3.4.6.1.5q.1.65-.45 1.1-.45.45-1.1.4M15 10.25l-.35-.7q-.35-.45-1.1-.55-.65-.05-1.1.5-.5.45-.45 1.1m6-.9l-.55.95q-.4.35-1 .35l-.45-.05-.55-.25-.35-.35h-.05l-.05-.1M9.85 15l.1.1.55.3.45.6.05.45q.1.7-.45 1.15-.45.45-1.1.4m.9-16q-.55.2-.95.6-.4.4-.4.95 0 .55.35 1L9.7 5M5 10.25l.05.1h.05l.4.35.5.25.5.05q.55 0 .95-.35L8 9.7m-3 .55l-.35-.7Q4.3 9.1 3.55 9q-.65-.05-1.1.5Q2 9.95 2 10.6M9.85 15l-.15-.05-.35-.4q-.35-.45-.35-1 0-.6.4-.95.4-.4.95-.6"></path>
                <path fill="none" stroke="rgb(255,104,104)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M15 10.25V15H9.85M9.7 5H15v5.25M9.7 5H5v10h4.85"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,127,127)" d="M6 17.05q-.05-.85.55-1.45.6-.7 1.45-.6.95.1 1.4.7l.55 1 .55.5q.6.4 1.3.4.75 0 1.25-.5l.75-1.2-.75 1.2q-.5.5-1.25.5-.7 0-1.3-.4l-.55-.5-.55-1q-.45-.6-1.4-.7-.85-.1-1.45.6-.6.6-.55 1.45M3.55 13.8q.85.05 1.45-.55.7-.6.6-1.45-.1-.95-.7-1.4l-1-.55-.5-.55Q3 8.7 3 8q0-.75.5-1.25L4.7 6l-1.2.75Q3 7.25 3 8q0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55m12 0q.85.05 1.45-.55.7-.6.6-1.45-.1-.95-.7-1.4l-1-.55-.5-.55Q15 8.7 15 8q0-.75.5-1.25L16.7 6l-1.2.75Q15 7.25 15 8q0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55M6 4.05q-.05-.85.55-1.45.6-.7 1.45-.6.95.1 1.4.7l.55 1 .55.5q.6.4 1.3.4.75 0 1.25-.5l.75-1.2-.75 1.2q-.5.5-1.25.5-.7 0-1.3-.4l-.55-.5-.55-1Q8.95 2.1 8 2q-.85-.1-1.45.6-.6.6-.55 1.45M0 0h20v20H0V0"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M13.8 2.9l-.75 1.2q-.5.5-1.25.5-.7 0-1.3-.4l-.55-.5-.55-1Q8.95 2.1 8 2q-.85-.1-1.45.6-.6.6-.55 1.45M16.7 6l-1.2.75Q15 7.25 15 8q0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55M4.7 6l-1.2.75Q3 7.25 3 8q0 .7.4 1.3l.5.55 1 .55q.6.45.7 1.4.1.85-.6 1.45-.6.6-1.45.55m10.25 2.1l-.75 1.2q-.5.5-1.25.5-.7 0-1.3-.4l-.55-.5-.55-1q-.45-.6-1.4-.7-.85-.1-1.45.6-.6.6-.55 1.45"></path>
              </svg>
              <svg viewBox="0 0 20.0 20.0">
                <path fill="rgb(255,104,104)" d="M9.45 18h-2.1v-5.35H2V7.35h5.35V2h5.35v5.35H18V12.65h-5.3V18H9.45m.25 0q.5-.05.85-.4.55-.45.45-1.15l-.05-.45-.45-.6-.55-.3-.1-.1-.15-.05-.35-.4q-.35-.45-.35-1 0-.6.4-.95.4-.4.95-.6-.55.2-.95.6-.4.35-.4.95 0 .55.35 1l.35.4.15.05.1.1.55.3.45.6.05.45q.1.7-.45 1.15-.35.35-.85.4M2 10.55q0-.6.45-1.05.45-.55 1.1-.5.75.1 1.1.55l.35.7.05.1h.05l.4.35.5.25.5.05q.55 0 .95-.35L8 9.7l-.55.95q-.4.35-.95.35l-.5-.05-.5-.25-.4-.35h-.05l-.05-.1-.35-.7Q4.3 9.1 3.55 9q-.65-.05-1.1.5Q2 9.95 2 10.55m10 .05q-.05-.65.45-1.1.45-.55 1.1-.5.75.1 1.1.55l.35.7.05.1.4.35.55.25.45.05q.6 0 1-.35L18 9.7l-.55.95q-.4.35-1 .35l-.45-.05-.55-.25-.4-.35-.05-.1-.35-.7q-.35-.45-1.1-.55-.65-.05-1.1.5-.5.45-.45 1.1M9.45 8q.65.05 1.1-.4.55-.45.45-1.1l-.1-.5-.4-.6-.55-.3L9.7 5l-.35-.45Q9 4.1 9 3.55t.4-.95q.4-.4.95-.6-.55.2-.95.6-.4.4-.4.95 0 .55.35 1L9.7 5l.25.1.55.3.4.6.1.5q.1.65-.45 1.1-.45.45-1.1.4"></path>
                <path fill="rgb(255,127,127)" d="M9.7 18h3v-5.35H18V7.35h-5.3V2H7.35v5.35H2V12.65h5.35V18H9.7M20 0v20H0V0h20"></path>
                <path fill="none" stroke="rgb(237,69,68)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M9.7 18h-.25m.9-16q-.55.2-.95.6-.4.4-.4.95 0 .55.35 1L9.7 5l.25.1.55.3.4.6.1.5q.1.65-.45 1.1-.45.45-1.1.4M18 9.7l-.55.95q-.4.35-1 .35l-.45-.05-.55-.25-.4-.35-.05-.1-.35-.7q-.35-.45-1.1-.55-.65-.05-1.1.5-.5.45-.45 1.1m-4-.9l-.55.95q-.4.35-.95.35l-.5-.05-.5-.25-.4-.35h-.05l-.05-.1-.35-.7Q4.3 9.1 3.55 9q-.65-.05-1.1.5Q2 9.95 2 10.55M10.35 12q-.55.2-.95.6-.4.35-.4.95 0 .55.35 1l.35.4.15.05.1.1.55.3.45.6.05.45q.1.7-.45 1.15-.35.35-.85.4"></path>
                <path fill="none" stroke="rgb(255,104,104)" strokeWidth="0.05" strokeLinecap="round" strokeLinejoin="round" d="M9.45 18h-2.1v-5.35H2V7.35h5.35V2h5.35v5.35H18V12.65h-5.3V18h-3"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col place-items-center text-center gap-y-3">
          Ability Hotkeys
          <div className="w-6 h-6 border"></div>
          <div className="w-6 h-6 border"></div>
          <div className="w-6 h-6 border"></div>
        </div>

      </div>
    </div>
  </Window>
}

export default StatsWindow;