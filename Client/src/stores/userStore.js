import {create} from "zustand"
import { persist } from 'zustand/middleware';


const useUserStore = create(
persist(
        (set, get) => ({
        user: null,
        token: null,
        userBalance: 0,
        setUser: (userData) => set({user: userData}),
        cancelUser: () => set({user: null}),
        clearStorage: () => {
        localStorage.removeItem("user-store");
        set({user: null});
       },
        syncBalance: async () => {
                try {
                    const { user } = get(); // Get current user from store
                    
                    if (!user || !user.id) {
                        console.error('No user found for balance sync');
                        return;
                    }
                    
                    // Fixed URL - removed extra 'balance' and fixed localhost
                    const res = await fetch(`http://localhost:5000/api/user/balance/${user.id}`);
                    
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    
                    const data = await res.json();
                    
                    if (data.success) {
                        set({ userBalance: data.balance }); // Use set instead of setBalance
                    } else {
                        console.error('Failed to sync balance:', data.message);
                    }
                } catch (error) {
                    console.error('Error syncing balance:', error);
                }
            }

    }),
    {
        name: "user-store", 
        partialize: (state) => ({
            user: state.user,
            token: state.token,
            balance: state.balance
        })
    }
))

export default useUserStore

