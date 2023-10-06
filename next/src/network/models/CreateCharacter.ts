import Character from "@/models/Character";

type CreateCharacterRequest = BasePacket<Character>;
type CreateCharacterResponse = BasePacket<Character>;

export type { CreateCharacterRequest, CreateCharacterResponse };