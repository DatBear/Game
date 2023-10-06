import Character from "@/models/Character";

type ListCharactersRequest = BasePacket<void>;
type ListCharactersResponse = BasePacket<Character[]>;

export type { ListCharactersRequest, ListCharactersResponse };