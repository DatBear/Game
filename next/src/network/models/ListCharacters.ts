import Character from "@/models/Character";
import { BasePacket } from "./BasePacket";

type ListCharactersRequest = BasePacket<void>;
type ListCharactersResponse = BasePacket<Character[]>;

export type { ListCharactersRequest, ListCharactersResponse };