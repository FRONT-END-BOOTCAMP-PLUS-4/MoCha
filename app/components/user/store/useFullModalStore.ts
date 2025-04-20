import { create } from 'zustand';
import { type ReactElement } from 'react';


type FullModalState = {
    content: ReactElement | null;
} & {};

type FullModalAction = {
    action: {
        open: ( children: ReactElement ) => void;
        close: () => void;
    }
} & {};

export const useFullModal = create<FullModalState & FullModalAction>((set) => ({
    content: null,

    action: {
        open: (children) => set({content: children}),
        close: () => set({content: null})
    }
}))

