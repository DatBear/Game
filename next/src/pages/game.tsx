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
import { prisma } from "@/lib/prisma";

type GameProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Game({ user }: GameProps) {
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
  const user = await prisma.user.findFirst({
    where: {
      email: 'test@test.com'
    }
  });
  return {
    props: {
      user
    }
  };
}