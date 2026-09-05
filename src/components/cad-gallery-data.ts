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
  {
    id: "boa-atlanta",
    name: "Bank of America Plaza · Atlanta",
    shortName: "Bank of America Plaza · Atlanta",
    description: "1:1000 exterior study. Documented height: 311.8 m; dimensions and details are estimated. Not as-built.",
    modelUrl: "/demos/agent-cad/assets/building-web.glb",
    posterUrl: "/demos/agent-cad/assets/building-poster.webp",
    revision: "d2ea07f00c04ecbcdd32b617a75a2f821d7c624b5133832e5cabf1b67906aa77",
  },
];
