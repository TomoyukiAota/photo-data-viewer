// This file is introduce to handle SVG file's static typing.
// The original type declaration for images (including SVG) by Next.js is disabled by https://nextjs.org/docs/api-reference/next/image#disable-static-imports
// The original type declaration by Next.js is here: https://github.com/vercel/next.js/blob/canary/packages/next/image-types/global.d.ts

type StaticImageData = {
  src: string;
  height: number;
  width: number;
  placeholder?: string;
};

declare module '*.png' {
  const content: StaticImageData;
  export default content;
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>; // Based on https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration/68129058#68129058
  export default content;
}

declare module '*.jpg' {
  const content: StaticImageData;
  export default content;
}

declare module '*.jpeg' {
  const content: StaticImageData;
  export default content;
}

declare module '*.gif' {
  const content: StaticImageData;
  export default content;
}

declare module '*.webp' {
  const content: StaticImageData;
  export default content;
}

declare module '*.avif' {
  const content: StaticImageData

  export default content
}

declare module '*.ico' {
  const content: StaticImageData;
  export default content;
}

declare module '*.bmp' {
  const content: StaticImageData;
  export default content;
}