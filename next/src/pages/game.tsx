import gs from '@/styles/game.module.css'
import UIContextProvider from "@/components/contexts/UIContext";
import UserContextProvider, { useCharacter } from "@/components/contexts/UserContext";
import CharacterSelect from "@/components/scenes/CharacterSelect";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Town from "@/components/scenes/Town";
import { Zone } from "@/models/Zone";
import { Catacombs } from "@/components/scenes/Catacombs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { listen, send, socket } from '@/network/Socket';
import { useEffect } from "react";
import RequestPacketType from "@/network/RequestPacketType";

type GameProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Game({ }: GameProps) {
  useEffect(() => {
    socket().onopen = async (evt) => {
      //await (async () => await new Promise(r => setTimeout(r, 2000)))()
      send(RequestPacketType.ListCharacters, null);
    }
  }, []);

  return (<DndProvider backend={HTML5Backend}>
    <div className={gs.gameContainer}>
      <UserContextProvider>
        <CharacterSelect />
        <UIContextProvider>
          <CurrentZone />
        </UIContextProvider>
      </UserContextProvider>
    </div>
  </DndProvider>);
};

function CurrentZone() {
  const { character } = useCharacter();

  if (!character) return <></>;

  return <>
    {character.zone === Zone.Town && <Town />}
    {character.zone === Zone.Catacombs && <Catacombs />}
  </>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
    }
  };
}