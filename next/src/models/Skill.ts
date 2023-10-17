import { ProgressBarProps } from '@/components/ProgressBar';

type Skill = {
  name: string;
  directions: string;
  startAction: string;
  itemsRequired: number;
  levelInput?: boolean;
  buttons: string[];
  counters: string[];
  labels: string[];
  bars: string[];
  stop: string;
  again: string;
  inverseBar?: boolean[];
}

let Cooking: Skill = {
  name: 'Cooking',
  directions: 'Drop an item you wish to cook onto the box below.',
  startAction: 'Cook',
  itemsRequired: 1,
  buttons: ['Flame Counter', 'Cook'],
  counters: ['Flame!'],
  bars: ['Temperature', 'ITEM0'],
  labels: ['If the temperature gets too hot, your item will burn.', 'Click cook to season and cook your fish.'],
  stop: 'Stop Cooking',
  again: 'Cook More',
  inverseBar: [true, false],
}

let Suffusencing: Skill = {
  name: 'Suffusencing',
  directions: 'Drop an item + essence you wish to suffusence onto the boxes below.',
  startAction: 'Suffusence',
  itemsRequired: 2,
  buttons: ['Suffuse', 'Extract'],
  counters: ['Suffuse!', 'Extract!'],
  bars: ['Permanence', 'Suffusencion'],
  labels: ['Don\'t let the Permanance run out.', 'Click the correct technique as necessary.'],
  stop: 'Abort',
  again: 'Suffusence more',
}

let Glyphing: Skill = {
  name: 'Glyphing',
  directions: 'Drop an item or two glyphs you wish to glyph onto the box(es) below.',
  startAction: 'Glyph',
  itemsRequired: 2,
  buttons: ['Inscribe', 'Purge', 'Transfuse'],
  counters: ['Inscribe!', 'Purge!', 'Transfuse!'],
  bars: ['Magic Stability', 'Glyph Progress'],
  labels: ['Maintain the magic stability!', 'Click the appropriate techniques below.'],
  stop: 'Abort',
  again: 'Glyph more',
}

let Transmuting: Skill = {
  name: 'Transmuting',
  directions: 'Drop an item or item + essence you wish to transmute onto the box(es) below.',
  startAction: 'Transmute',
  itemsRequired: 1,
  buttons: ['Stabilize', 'Transmute'],
  counters: ['Volatile!'],
  bars: ['Volatility', 'Transmutation'],
  labels: ['Click Stabilize to lower the Volatility.', 'Click Transmute to transmute your item.'],
  stop: 'Abort',
  again: 'Transmute More',
  inverseBar: [true, false],
}

let Fishing: Skill = {
  name: 'Fishing',
  directions: 'Drop a fishing rod onto the box below to use it, or leave it blank to use a free loaner fishing rod.',
  startAction: 'Fish',
  itemsRequired: 0,
  levelInput: true,
  buttons: ['Snag Counter', 'Reel'],
  counters: ['Snag!'],
  bars: ['Fishing Rod', '? ? ?'],
  labels: ['Keep your rod\'s bar up or it will break.', 'Click Reel to reel in your catch.'],
  stop: 'Release Line',
  again: 'Recast Line',
}

export enum SkillType {
  Fishing,
  Cooking,
  Suffusencing,
  Glyphing,
  Transmuting
};

let allSkills: Record<SkillType, Skill> = {
  [SkillType.Fishing]: Fishing,
  [SkillType.Cooking]: Cooking,
  [SkillType.Suffusencing]: Suffusencing,
  [SkillType.Glyphing]: Glyphing,
  [SkillType.Transmuting]: Transmuting
}

export { allSkills, Cooking, Suffusencing, Glyphing, Transmuting, Fishing };
export default Skill;