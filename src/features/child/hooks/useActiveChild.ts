import { useChildStore } from '../store/childStore';

export const useActiveChildId = () => useChildStore((s) => s.activeChildId);

export const useActiveChild = () =>
  useChildStore((s) => s.children.find((child) => child.id === s.activeChildId));
