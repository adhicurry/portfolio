export type CadGalleryModel = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  modelUrl: string;
  posterUrl: string;
  revision: string;
};

/** Approved visual-only web derivatives. CAD masters stay outside the website. */
export const CAD_GALLERY_MODELS: CadGalleryModel[] = [
  {
    id: "gt-partscaster",
    name: "GT Partscaster",
    shortName: "GT Partscaster",
    description: "My navy-and-gold GT partscaster, with its custom artwork, HSS pickups, and individual hardware components.",
    modelUrl: "/demos/gt-guitar/assets/guitar-web.glb",
    posterUrl: "/demos/gt-guitar/assets/poster.webp",
    revision: "cfa61e55cd617fde1d99d54f15b11f005fe99a72fe60ddc5bdcb759a98cc2a2b",
  },
  {
    id: "les-paul",
    name: "Les Paul · Dual humbuckers",
    shortName: "Les Paul",
    description: "A reference-informed Epiphone Les Paul visual approximation; not manufacturing-certified geometry.",
    modelUrl: "/demos/agent-cad/assets/les-paul-web.glb",
    posterUrl: "/demos/agent-cad/assets/les-paul-poster.webp",
    revision: "d22e017e6267d020a2017ac535ede5e4ee9a16559d8b3ae775ffa9554bbd6198",
  },
];
