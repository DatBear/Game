import Character from "@/models/Character";
import { BasePacket } from "./BasePacket";

type CreateCharacterRequest = BasePacket<Character>;
type CreateCharacterResponse = BasePacket<Character>;

export type { CreateCharacterRequest, CreateCharacterResponse };