import { create } from "zustand";

const useCompressedFile = create((set) => ({
  compressedFile: null,
  setCompressedFile: (compressedFile) => set({ compressedFile }),
  loading: null,
  setLoading: (loading) => set({ loading }),
}));

export default useCompressedFile;
