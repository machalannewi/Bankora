import {create} from "zustand"
import { persist } from 'zustand/middleware';


const useUserStore = create(
persist(
        (set) => ({
        user: null,
        setUser: (userData) => set({user: userData}),
        cancelUser: () => set({user: null}),
        clearStorage: () => {
        localStorage.removeItem("user-store");
        set({user: null});
       }
    }),
    {
        name: "user-store", 
    }
))

export default useUserStore

