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
import { listen, socket } from '@/network/Socket';
import { useEffect } from "react";
import ResponsePacketType from "@/network/ResponsePacketType";
import ListCharacters from "@/network/models/ListCharacters";

type GameProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Game({ }: GameProps) {
  useEffect(() => {
    socket().onopen = (evt) => {
      (async () => await new Promise(r => setTimeout(r, 2000)))()
      socket().send('test');
    }

    return listen(ResponsePacketType.ListCharacters, (data: ListCharacters) => {
      console.log('listCharacters', data);
    });
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