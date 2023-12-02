import { ReactNode, createContext, useState } from "react";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => void
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({
    id: '1',
    name: 'Zenky',
    email: 'bzenky@gmail.com',
    avatar: 'https://www.github.com/bzenky.png'
  })

  function signIn(email: string, password: string) {
    setUser({
      id: '',
      name: '',
      email,
      avatar: '',
    })
  }

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}