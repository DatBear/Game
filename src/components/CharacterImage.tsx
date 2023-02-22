import Character, { Gender } from "@/models/Character";
import { EquippedItemSlot } from "@/models/EquippedItem";
import { itemIcons } from "@/models/Item";
import { forwardRef } from "react";

let svgs: Record<string, string[]> = {
  cGod: ["0 0 284.2 479.7"],
  cBody1: ["0 0 210 500"],
  cBody2: ["0 0 200 500"],
  cAlchemist1: ["-2.5 -15.4 214.3 503.8"],
  cAlchemist2: ["3.8 21.9 176.1 316.4"],
  cBarbarian1: ["0.1 -6.8 207 322"],
  cBarbarian2: ["41.0 29.3 106.1 273.8"],
  cFighter1: ["34.6 -24.1 174.8 505.6"],
  cFighter2: ["24.6 3.1 179.3 499.8"],
  cGuardian1: ["-1.4 -3.3 222.5 493.5"],
  cGuardian2: ["2.7 28.9 201.3 478.6"],
  cHeadhunter1: ["-9.7 -11.8 230.0 496.4"],
  cHeadhunter2: ["-6.0 19.6 205.6 484.4"],
  cMagician1: ["-18.6 -4.7 233.4 496.3"],
  cMagician2: ["-28.8 26.9 229.3 323.1"],
  cMonk1: ["-0.7 0 208.8 452.6"],
  cMonk2: ["4.2 32.5 175.6 383.8"],
  cNinja1: ["34.8 -1.4 173.1 489.4"],
  cNinja2: ["11.4 29.4 189.8 472.3"],
  cPaladin1: ["-4.3 -2.8 220.1 497.6"],
  cPaladin2: ["2.0 28.9 205.3 482.6"],
  cRogue1: ["-6.6 -4.2 215.8 487.6"],
  cRogue2: ["17.2 28.6 184.7 473.1"],
  cSamurai1: ["29.7 -46.0 176.2 530.3"],
  cSamurai2: ["39.6 -4.8 162.4 509.6"],
  cWarlock1: ["-24.9 2.7 261.1 493.2"],
  cWarlock2: ["-55.6 19.8 255.4 479.7"],
  cChainmail1: ["0 0 190.7 303"],
  cChainmail2: ["0 0 154.7 269.7"],
  cLeather1: ["0 0 156.1 202.8"],
  cLeather2: ["0 0 141.7 219.3"],
  cPaddedrobe1: ["0 0 208.8 258.5"],
  cPaddedrobe2: ["0 0 151.9 206.1"],
  cPlatemail1: ["0 0 188 235.8"],
  cPlatemail2: ["0 0 145.5 226.9"],
  cRobe1: ["0 0 189.1 338.8"],
  cRobe2: ["0 0 155.9 291.8"],
  cScale1: ["0 0 190.6 233.3"],
  cScale2: ["0 0 160.2 227.5"],
  wm0: ["-16.2 124.8 195.0 193.2"],
  wm1: ["-13.8 148.2 174.3 166.2"],
  wm10: ["-46.1 27.8 476.9 313.6"],
  wm2: ["-27.6 135.4 244.3 194.3"],
  wm3: ["-59.9 262.9 105.5 99.1"],
  wm4: ["-72.5 57 346.9 306.9"],
  wm5: ["-25.4 27.3 310.1 305.9"],
  wm6: ["-37 100.8 231.8 242.5"],
  wm7: ["-47 61.3 334.3 287.4"],
  wm8: ["-115.8 -12.4 485.4 418.9"],
  wm9: ["-116.9 9.4 463.4 397.1"],
};

function getStyles(key: string, sc: number) {
  let svgData = svgs[key][0].split(" ").map(x => parseFloat(x));
  return {
    left: (svgData[0] * sc * 200).toFixed(3) + "%",
    top: (svgData[1] * sc * 100).toFixed(3) + "%",
    width: (svgData[2] * sc * 200).toFixed(3) + "%",
    height: (svgData[3] * sc * 100).toFixed(3) + "%",
  }
}

type CharacterImageProps = {
  character: Partial<Character>;
  className?: string;
}

const CharacterImage = forwardRef<HTMLDivElement, CharacterImageProps>(function ({ character, className }, ref) {
  const sc = 1 / (character.gender === Gender.Male ? 415.4 + 64.2 : 499.8);
  const sex = character.gender === Gender.Male ? 1 : 2;
  const bodySvgKey = `cBody${sex}`;
  const bodySvgData = svgs[bodySvgKey][0].split(" ").map(x => parseFloat(x))
  const classSvgKey = `c${character.class}${sex}`;
  const weapon = character.equippedItems?.find(x => x.slot == EquippedItemSlot.Weapon);
  const weaponKey = weapon ? `wm${weapon?.item.subType}` : '';
  const armor = character.equippedItems?.find(x => x.slot == EquippedItemSlot.Armor);
  const armorKey = armor ? `${itemIcons[armor.item.subType].replace("icon", "c")}${sex}` : '';

  const Svg = (key: string, position?: "static" | "absolute") => {
    if (key === '') return;
    position = position ?? 'absolute';
    let style = getStyles(key, sc);
    return <img style={{ ...style, position: position }} src={`svg/${key}.svg`} alt="character" className="max-w-none" />;
  }

  return (
    <div className="relative w-full h-full" ref={ref}>
      {Svg(bodySvgKey, 'static')}
      {Svg(classSvgKey)}
      {Svg(armorKey)}
      {Svg(weaponKey)}
    </div>);
});

export default CharacterImage;