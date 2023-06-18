import { prisma } from '@/lib/prisma'
import { compare, hash } from 'bcrypt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// import { hkdf } from "@panva/hkdf"
// import { EncryptJWT, jwtDecrypt } from "jose"
// import { JWT } from "next-auth/jwt"


// const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60 // 30 days
// async function getDerivedEncryptionKey(secret: string) {
//   return await hkdf(
//     "sha256",
//     secret,
//     "",
//     "NextAuth.js Generated Encryption Key",
//     32
//   )
// }
// const now = () => (Date.now() / 1000) | 0

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },

  // jwt: {
  //   encode: async params => {
  //     const { token = {}, secret, maxAge = DEFAULT_MAX_AGE } = params
  //     const encryptionSecret = await getDerivedEncryptionKey(secret + '')
  //     console.log('encryption secret', encryptionSecret);
  //     let jwt = await new EncryptJWT(token)
  //       .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
  //       .setIssuedAt()
  //       .setExpirationTime(now() + maxAge)
  //       .setJti(crypto.randomUUID())
  //       .encrypt(encryptionSecret);
  //     console.log('jwt', jwt);
  //     return jwt;
  //   },
  //   decode: async params => {
  //     const { token, secret } = params
  //     if (!token) return null
  //     const encryptionSecret = await getDerivedEncryptionKey(secret + '')
  //     const { payload } = await jwtDecrypt(token, encryptionSecret, {
  //       clockTolerance: 15,
  //     });
  //     console.log('payload', payload);
  //     return payload as JWT
  //   }
  // },
  providers: [
    CredentialsProvider({
      name: 'account',
      credentials: {
        username: { label: 'Username', type: 'input', placeholder: 'username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            Username: credentials.username
          }
        });

        if (!user) {
          return null
        }

        console.log('hash', await hash('test', 12));

        const isPasswordValid = await compare(
          credentials.password,
          user.Password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.Id + '',
          email: user.Email,
          name: user.Username
        }
      }
    })
  ],
  callbacks: {
    session: ({ session, token }) => {
      //console.log('Session Callback', { session, token })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id
        }
      }
    },
    jwt: ({ token, user }) => {
      //console.log('JWT Callback', { token, user })
      if (user) {
        return {
          ...token,
          id: user.id
        }
      }
      return token
    }
  }
}

const handler = NextAuth(authOptions)
export default handler