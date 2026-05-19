import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Python } from "@/components/ui/svgs/python";
import { ReactLight } from "@/components/ui/svgs/reactLight";

export const DATA = {
  name: "Daksh Adhikari",
  initials: "DA",
  url: "https://adhicurry.github.io",
  location: "Atlanta, GA",
  locationLink: "https://www.google.com/maps/place/Atlanta,+GA",
  description:
    "PhD candidate at Georgia Tech. I build ML systems for physical problems and ship AI-native applications on the side.",
  summary:
    "I'm a Mechanical Engineering PhD student at Georgia Tech's [MiNDS Lab](https://sites.gatech.edu/minds/people/), building ML-based control frameworks for two-phase cooling systems — electronics, EVs, high-energy lasers, nuclear. Before grad school, I spent two years as an R&D engineer at [Advanced Cooling Technologies](https://www.1-act.com/) working on DOE SBIR, ARPA-E projects, and patent filings at TRL 8. On the side, I build LLM vision pipelines and AI-native apps.",
  avatarUrl: "https://ui-avatars.com/api/?name=Daksh+Adhikari&background=1a1a2e&color=00e5ff&size=256",
  skills: [
    { name: "Python", icon: Python },
    { name: "TypeScript", icon: Typescript },
    { name: "React Native", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "PyTorch", icon: undefined },
    { name: "Graph Neural Networks", icon: undefined },
    { name: "LoRA / Fine-tuning", icon: undefined },
    { name: "RAG", icon: undefined },
    { name: "Supabase", icon: undefined },
    { name: "Expo", icon: undefined },
    { name: "Flask", icon: undefined },
    { name: "MATLAB", icon: undefined },
    { name: "CFD (ANSYS Fluent)", icon: undefined },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
  ],
  contact: {
    email: "daksh.kari@gmail.com",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/adhicurry",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/daksh-adhikari",
        icon: Icons.linkedin,
        navbar: true,
      },
      Scholar: {
        name: "Google Scholar",
        url: "https://scholar.google.com/citations?user=YjXGAhQAAAAJ&hl=en",
        icon: Icons.globe,
        navbar: true,
      },
      X: {
        name: "X",
        url: "#",
        icon: Icons.x,
        navbar: false,
      },
      Youtube: {
        name: "Youtube",
        url: "#",
        icon: Icons.youtube,
        navbar: false,
      },
      email: {
        name: "Send Email",
        url: "mailto:daksh.kari@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "MiNDS Lab, Georgia Tech",
      href: "https://sites.gatech.edu/minds/people/",
      badges: ["Research"],
      location: "Atlanta, GA",
      title: "Graduate Research Assistant",
      logoUrl: "",
      start: "Aug 2024",
      end: "Present",
      description:
        "Building a novel ML-based control system framework for two-phase cooling systems under Dr. Satish Kumar (Frank H. Neely Professor, Woodruff School of ME). Targeting electronics thermal management, EV battery cooling, high-energy laser systems, and nuclear applications.",
    },
    {
      company: "Advanced Cooling Technologies, Inc.",
      href: "https://www.1-act.com/",
      badges: [],
      location: "Lancaster, PA",
      title: "Research & Development Engineer",
      logoUrl: "",
      start: "May 2022",
      end: "Jul 2024",
      description:
        "DOE SBIR Phase II-A: Led rapid cooling technology development for neutron vacuum furnaces — patent filing, achieved TRL 8. ARPA-E REMEDY: Developed open-source CFD toolchain for flare gas incinerators, presented at ARPA-E Summit. Lehigh/Dominion collaboration: ML-accelerated thermal energy storage simulation for flexible coal plants, reducing simulation time from weeks to hours.",
    },
  ],

  education: [
    {
      school: "Georgia Institute of Technology",
      href: "https://www.gatech.edu",
      degree: "Ph.D. Mechanical Engineering",
      logoUrl: "",
      start: "Aug 2024",
      end: "Present",
    },
    {
      school: "Penn State University",
      href: "https://www.psu.edu",
      degree: "B.S. Chemical Engineering",
      logoUrl: "",
      start: "Aug 2018",
      end: "May 2022",
    },
  ],

  projects: [
    {
      title: "SatChat — Vision LLM for Satellite Imagery",
      href: "#",
      dates: "2026",
      active: true,
      description:
        "Point at any location on the globe, pull live Sentinel-2 imagery, and get instant AI analysis — all in ~5 seconds. Built a full-stack pipeline: interactive web globe → Sentinel-2 STAC API → false-color spectral composites (NDRE/NDVI/NDMI encoded as RGB) → fine-tuned LFM2.5-VL that produces structured triage JSON (stressor type, severity, ANOMALOUS/NORMAL). LoRA fine-tuned at 1.69% trainable params on 443 Iowa corn belt tiles with USDA yield cross-validation (r=−0.505, p<0.0001). 50,000:1 compression vs. raw imagery downlink. Built for the Liquid AI × DPhi \"AI in Space\" Hackathon.",
      technologies: [
        "Next.js",
        "Python",
        "LFM2.5-VL",
        "LoRA / MLX",
        "Sentinel-2 STAC",
        "odc-stac",
        "Tailwind CSS",
      ],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Drug-Target Affinity Prediction",
      href: "#",
      dates: "2026",
      active: true,
      description:
        "GIN ensemble pipeline for robust drug-target binding prediction across KIBA (CI=0.882), Davis (CI=0.735), and BindingDB (CI=0.625, AUROC=0.760) — with uncertainty quantification for abstention on low-confidence predictions. Multi-agent RAG architecture for biomedical reasoning and decision support. Full reproducibility package: code, experiments, LaTeX paper, poster, training logs. Built for the GT STAR-AI Makerspace Hackathon (May 2026, Petit Institute for Bioengineering). Trained on Apple Silicon M4.",
      technologies: [
        "Python",
        "PyTorch",
        "Graph Neural Networks",
        "BERT-Large",
        "RAG",
        "Multi-agent",
        "Apple Silicon MPS",
      ],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Recipe Generator — AI-Native iOS App",
      href: "#",
      dates: "2026",
      active: true,
      description:
        "Tell it what's in your pantry. Get a recipe. Smart pantry ranker uses nomic-embed-text embeddings + section dampening + usage frequency to surface the best ingredients first. Local LLM (llama3.2:3b via Ollama over Tailscale) for generation. 3-tier cache (memory → AsyncStorage → Supabase) for instant re-generation. Built a custom dut-recipe-generator Python service (560M BLOOM model, ~8s inference, 100% JSON reliability) as an alternative backend. Includes an AI adaptation loop, dietary preferences, skill level settings, and a community explore page with 44+ seeded recipes.",
      technologies: [
        "React Native",
        "Expo",
        "TypeScript",
        "Supabase",
        "Ollama",
        "Python",
        "Flask",
        "Transformers",
      ],
      links: [],
      image: "",
      video: "",
    },
  ],

  hackathons: [
    {
      title: "Liquid AI × DPhi \"AI in Space\" Hackathon",
      dates: "2026",
      location: "Remote",
      description:
        "Built SatChat: a vision LLM triage pipeline for satellite imagery. Fine-tuned LFM2.5-VL-450M with LoRA on Sentinel-2 agricultural stress data. 50,000:1 compression ratio over raw imagery downlink.",
      image: "",
      links: [] as { href: string; icon: React.ReactNode; title: string }[],
    },
    {
      title: "GT STAR-AI Makerspace Hackathon",
      dates: "May 12, 2026",
      location: "Atlanta, GA — Parker H. Petit Institute for Bioengineering",
      description:
        "Drug-target affinity prediction with GIN ensembles and uncertainty quantification. KIBA CI=0.882. Full paper, poster, and reproducibility package.",
      image: "",
      links: [] as { href: string; icon: React.ReactNode; title: string }[],
    },
  ],
};
