import { prisma } from "@/lib/prisma";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Link from "next/link";
import { getToken } from "next-auth/jwt";
import { useEffect, useRef } from "react";

type HomeProps = Omit<InferGetServerSidePropsType<typeof getServerSideProps>, 'user.image'>;

export default function Home({ authenticated, token }: HomeProps) {
  return (
    <div className="w-full h-full min-h-screen flex flex-col justify-center items-center">
      <Link href="game" className="py-2 px-3 bg-stone-800 border border-white">{authenticated ? "Play!" : "Log in"}</Link>

      {/* {authenticated && <>{token}</>} */}
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = await getToken({ req: context.req });
  console.log('req', context.req.cookies['next-auth.session-token']);
  console.log('token', token);
  let session = await getServerSession(context.req, context.res, authOptions);
  return {
    props: {
      authenticated: !!session,
      token: context.req.cookies['next-auth.session-token'] ?? ''
    }
  };
}