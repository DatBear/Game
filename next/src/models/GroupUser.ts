import FightingPosition from "./FightingPosition";
import User from "./User";

type GroupUser = {
  user: Partial<User>;
  fightingPosition: FightingPosition;
}

export default GroupUser;