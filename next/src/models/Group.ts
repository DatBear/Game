import GroupOptions from "./GroupOptions";
import GroupUser from "./GroupUser";
import { Maze } from "./Maze";

type Group = {
  id: number;
  leaderId: number;
  users: Partial<GroupUser>[];
  options: GroupOptions;
  maze?: Maze | null;
}

export default Group;