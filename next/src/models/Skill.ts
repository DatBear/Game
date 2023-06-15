type Skill = {
  name: string;
  directions: string;
  startAction: string;
  itemsRequired: number;
  inputsRequired?: string[];
}

let Cooking: Skill = {
  name: 'Cooking',
  directions: 'Drop an item you wish to cook onto the box below.',
  startAction: 'Cook',
  itemsRequired: 1
}

let Suffusencing: Skill = {
  name: 'Suffusencing',
  directions: 'Drop an item + essence you wish to suffusence onto the boxes below.',
  startAction: 'Suffusence',
  itemsRequired: 2
}

let Glyphing: Skill = {
  name: 'Glyphing',
  directions: 'Drop an item or two glyphs you wish to glyph onto the box(es) below.',
  startAction: 'Glyph',
  itemsRequired: 2
}

let Transmuting: Skill = {
  name: 'Transmuting',
  directions: 'Drop an item or item + essence you wish to transmute onto the box(es) below.',
  startAction: 'Transmute',
  itemsRequired: 2
}

let Fishing: Skill = {
  name: 'Fishing',
  directions: 'Drop a fishing rod onto the box below to use it, or leave it blank to use a free loaner fishing rod.',
  startAction: 'Fish',
  itemsRequired: 1,
  inputsRequired: ['Level']
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