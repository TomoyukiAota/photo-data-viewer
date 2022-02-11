import { useWindowWidth } from '@react-hook/window-size/throttled';

export const useAppLayout = () => {
  const windowWidth = useWindowWidth();
  return { isWideLayout: windowWidth > 1200, windowWidth };
}
