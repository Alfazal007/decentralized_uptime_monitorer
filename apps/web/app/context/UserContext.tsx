"use client";
import { createContext, useState } from "react"

export interface User {
    accessToken: string;
    id: number;
}

export const UserContext = createContext<{
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
    user: null,
    setUser: () => { }
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider >
    );
};

export default UserProvider;
