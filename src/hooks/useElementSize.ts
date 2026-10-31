import useSize, { UseSizeOptions } from '@react-hook/size';
import type { RefObject } from 'react';

// The hook supports a null ref.current at runtime. React 19 made that nullability
// explicit in RefObject's type parameter; the upstream declaration predates it.
export const useElementSize = useSize as (
  target: HTMLElement | RefObject<HTMLElement | null> | null,
  options?: UseSizeOptions,
) => [number, number];
