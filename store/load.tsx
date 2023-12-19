import create from 'zustand'

interface LoadStore {
    load:boolean,
    setLoad : () => void
}


const loadStore = create<LoadStore>()((set)=>({
    load : true,
    setLoad: () => set({load:false})
}))


export default loadStore