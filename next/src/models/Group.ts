import GroupOptions from "./GroupOptions";
import GroupUser from "./GroupUser";

type Group = {
  id: number;
  leaderId: number;
  users: Partial<GroupUser>[];
  options: GroupOptions;
}

export default Group;