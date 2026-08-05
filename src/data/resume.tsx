import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Python } from "@/components/ui/svgs/python";
import { ReactLight } from "@/components/ui/svgs/reactLight";

export const DATA = {
  name: "Daksh Adhikari",
  initials: "DA",
  url: "https://portfolio.dakshhomelab.com",
  location: "Atlanta, GA",
  locationLink: "https://www.google.com/maps/place/Atlanta,+GA",
  description:
    "PhD candidate at Georgia Tech. I build ML systems for physical problems and ship AI-native applications on the side.",
  summary:
    "I'm a Mechanical Engineering PhD student at Georgia Tech's [MiNDS Lab](https://sites.gatech.edu/minds/people/). My research uses ML to control two-phase cooling systems for electronics, EVs, high-energy lasers, and nuclear applications. Before grad school, I spent two years as an R&D engineer at [Advanced Cooling Technologies](https://www.1-act.com/) on DOE SBIR and ARPA-E projects, including patent filings at TRL 8. I also build LLM vision pipelines and AI-native apps. Recent work includes the ITherm 2026 Best On-Site Poster Award and a submitted IEEE BHI 2026 paper.",
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
  navbar: [{ href: "/", icon: HomeIcon, label: "Home" }],
  contact: {
    email: "daksh.kari@gmail.com",
    tel: "",
    social: {
      GitHub: { name: "GitHub", url: "https://github.com/adhicurry", icon: Icons.github, navbar: true },
      LinkedIn: { name: "LinkedIn", url: "https://www.linkedin.com/in/daksh-adhikari", icon: Icons.linkedin, navbar: true },
      Scholar: { name: "Google Scholar", url: "https://scholar.google.com/citations?user=YjXGAhQAAAAJ&hl=en", icon: Icons.globe, navbar: true },
      X: { name: "X", url: "#", icon: Icons.x, navbar: false },
      Youtube: { name: "Youtube", url: "#", icon: Icons.youtube, navbar: false },
      email: { name: "Send Email", url: "mailto:daksh.kari@gmail.com", icon: Icons.email, navbar: false },
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
        "Under Dr. Satish Kumar (Frank H. Neely Professor, Woodruff School of ME), I am building an ML-based control system framework for two-phase cooling systems. The work targets electronics thermal management, EV battery cooling, high-energy laser systems, and nuclear applications.",
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
        "DOE SBIR Phase II-A: Led rapid cooling technology development for neutron vacuum furnaces, filed a patent, and achieved TRL 8. ARPA-E REMEDY: Developed an open-source CFD toolchain for flare gas incinerators and presented it at ARPA-E Summit. Lehigh/Dominion collaboration: Built an ML-accelerated thermal energy storage simulation for flexible coal plants, cutting simulation time from weeks to hours.",
    },
  ],
  education: [
    { school: "Georgia Institute of Technology", href: "https://www.gatech.edu", degree: "Ph.D. Mechanical Engineering", logoUrl: "", start: "Aug 2024", end: "Present" },
    { school: "Penn State University", href: "https://www.psu.edu", degree: "B.S. Chemical Engineering", logoUrl: "", start: "Aug 2018", end: "May 2022" },
  ],
  academicProjects: [
    {
      title: "Drug-Target Affinity Prediction",
      slug: "drug-target-affinity-prediction",
      href: "#",
      dates: "2026",
      active: true,
      description:
        "A GIN ensemble pipeline for drug-target binding prediction across KIBA (CI=0.882), Davis (CI=0.735), and BindingDB (CI=0.625, AUROC=0.760). It estimates uncertainty so the system can abstain on low-confidence predictions. I also built a multi-agent RAG architecture for biomedical reasoning and decision support. The reproducibility package includes code, experiments, a LaTeX paper, a poster, and training logs. Built for the GT STAR-AI Makerspace Hackathon (May 2026, Petit Institute for Bioengineering). Trained on Apple Silicon M4.",
      technologies: ["Python", "PyTorch", "Graph Neural Networks", "BERT-Large", "RAG", "Multi-agent", "Apple Silicon MPS"],
      links: [], image: "", video: "",
    },
  ],
  personalProjects: [
    {
      title: "SatChat — Vision LLM for Satellite Imagery",
      slug: "satchat-vision-llm-for-satellite-imagery",
      href: "#",
      dates: "2026",
      active: true,
      description:
        "Choose any location on the globe, pull live Sentinel-2 imagery, and get AI analysis in ~5 seconds. The full-stack pipeline runs from an interactive web globe through the Sentinel-2 STAC API and false-color spectral composites (NDRE/NDVI/NDMI encoded as RGB) to a fine-tuned LFM2.5-VL model that returns structured triage JSON (stressor type, severity, ANOMALOUS/NORMAL). LoRA was fine-tuned at 1.69% trainable params on 443 Iowa corn belt tiles with USDA yield cross-validation (r=−0.505, p<0.0001). The result is a 50,000:1 compression vs. raw imagery downlink. Built for the Liquid AI × DPhi \"AI in Space\" Hackathon.",
      technologies: ["Next.js", "Python", "LFM2.5-VL", "LoRA / MLX", "Sentinel-2 STAC", "odc-stac", "Tailwind CSS"],
      links: [], image: "", video: "",
    },
    {
      title: "Recipe Generator — AI-Native iOS App",
      slug: "recipe-generator-ai-native-ios-app",
      href: "#",
      dates: "2026",
      active: true,
      description:
        "Enter what is in your pantry and get a recipe. A smart pantry ranker uses nomic-embed-text embeddings, section dampening, and usage frequency to put the most useful ingredients first. A local LLM (llama3.2:3b via Ollama over Tailscale) handles generation. A 3-tier cache (memory → AsyncStorage → Supabase) makes re-generation instant. I also built a custom dut-recipe-generator Python service (560M BLOOM model, ~8s inference, 100% JSON reliability) as an alternative backend. The app includes an AI adaptation loop, dietary preferences, skill level settings, and a community explore page with 44+ seeded recipes.",
      technologies: ["React Native", "Expo", "TypeScript", "Supabase", "Ollama", "Python", "Flask", "Transformers"],
      links: [], image: "", video: "",
    },
    {
      title: "Guitar: Partscaster Build & Onboard Effects",
      slug: "guitar-partscaster-build-and-onboard-effects",
      href: "#",
      dates: "2026 — ongoing (inferred)",
      active: true,
      description:
        "Assembled a partscaster from individual components, then added onboard fuzz and treble-booster circuits selected by a toggle. Placing the effects before the wireless system fixes the impedance problem that makes traditional low-impedance fuzz unhappy after a wireless buffer. I also designed and built amp-switcher wiring boxes as a smaller hardware project.",
      longDescription:
        "I assembled this guitar as a partscaster: I sourced the components and put them together, then kept modifying the instrument instead of treating the build as finished. The electronics project started with a practical constraint. Fuzz and treble boosters are the effects I gravitate toward, but traditional versions, especially fuzz, are low-impedance devices and do not work well after a wireless system or another buffer.\n\nI built both effects into the guitar body and added a selector toggle. The pickup signal can go into fuzz, the treble booster, or bypass before it reaches the wireless system. That keeps the rig's required effect order without another cable run. I had to learn guitar-effects wiring and electronics, assemble and test the circuits, and rework the guitar wiring around the new controls.\n\nI also designed and built amp-switcher wiring boxes. The documented design uses a break-before-make 4PDT switch to route the hot and ground paths of two amps between a cabinet and Captor X. It swaps both assignments together while keeping every amp connected to a load.",
      technologies: ["Guitar electronics", "Effects wiring", "Fuzz", "Treble booster", "Wireless signal chains", "4PDT switching"],
      links: [], image: "/guitar-build.jpg", video: "",
    },
    {
      title: "Pixel Sentinel — Repurposed Android Security Camera",
      slug: "pixel-sentinel-repurposed-android-security-camera",
      href: "#",
      dates: "2026 (inferred)",
      active: true,
      description:
        "Repurposed an old Google Pixel 3a XL as a guard camera node and built the infrastructure to expose its IP Webcam stream through a public HTTPS endpoint. A Python auth proxy handles HTTP/1.0 framing, WebSocket audio tunneling, and server-side Basic Auth. A custom Web Audio UI replaces the stock interface for low-latency listening and push-to-talk.",
      longDescription:
        "Pixel Sentinel turns an old Google Pixel 3a XL into a guard/sentinel camera node. The phone runs the IP Webcam Android app locally. A Python authentication proxy runs as a launchd service on the Mac behind Tailscale Serve, injecting Basic Auth server-side so the end user can open the HTTPS link without seeing the app's login screen.\n\nThe hard part was making the pieces work reliably instead of just forwarding a page. Single APK downloads crashed because they omitted native libraries or density resources, so I installed the app as a complete multi-split bundle with adb. The proxy uses HTTP/1.0 close-per-request framing because HTTP/1.1 keep-alive made browsers hang. It also detects WebSocket upgrades and relays the two-way audio endpoint as a raw TCP tunnel, adding authentication to the handshake.\n\nThe stock audio controls did not work well either. Live HTML5 audio buffered roughly ten seconds, so the custom UI fetches raw PCM, parses the WAV header, feeds Int16-to-Float32 chunks into Web Audio with a jitter buffer, and drops backlog when playback falls behind. Push-to-talk uses getUserMedia, a ScriptProcessor, and a custom WebSocket sender because the app's legacy navigator.getUserMedia path is absent on iOS Safari. The system also includes guard/TTS announcement mode and a watchdog that revives the stream when it dies.",
      technologies: ["Python", "adb", "Tailscale", "Web Audio API", "WebSockets", "launchd", "Android"],
      links: [], image: "", video: "",
    },
    {
      title: "AI Website Builder — Local Business Demo Pipeline",
      slug: "ai-website-builder-local-business-demo-pipeline",
      href: "#",
      dates: "2026 — ongoing (inferred)",
      active: true,
      description:
        "Starts with a conversation and real public information about a local business, then produces a live demo site. The pipeline covers industry research, prospect discovery, and content gathering, followed by an LLM-assisted HTML template editor. A business can review the site before any outreach goes further, while a person makes the research and content decisions.",
      longDescription:
        "The pipeline starts before a page is built. I research an industry, study strong competitors, and turn the useful patterns into a reusable template. Then I find local businesses with a weak or missing web presence and collect the material a credible demo needs: Google Maps listing details, reviews, photos, existing website content, and social posts. That gives the process a consistent starting point while keeping the business's real services, contact information, and customer voice in the page.\\n\\nOnce the business is understood, I customize an HTML template with its actual content and refine it through an LLM-assisted editor. The result is a self-contained, responsive demo. Before sharing it, I check the sections, phone and CTA details, review attribution, and mobile behavior. Maya and Daksh make the research, content, customization, and quality decisions throughout the build.\\n\\nThe demo gives a small business something concrete to review before discussing delivery. If the prospect is interested, the same pipeline supports the handoff into implementation, hosting, forms, analytics, and owner training.",
      technologies: ["HTML/CSS", "LLM-assisted content editing", "Google Maps research", "Google Reviews", "Vercel"],
      links: [], image: "", video: "",
    },
  ],
  publications: [
    { citation: 'Adhikari, D.; Quirinale, D.; Radyjowski, P.; Carlson, D.; Thurman, Z.; Yu, D.; Chen, C.; An, K.; & Mills, R. "Automated Rapid Cooling of High Temperature Vacuum Furnaces for High Throughput Neutron Experimentation." Rev. Sci. Instrum., 2026.', note: "Featured Article" },
    { citation: 'Adhikari, D.; & Kumar, S. "Mitigation of Flow Boiling Instabilities via Active Flow Control." IEEE Intersociety Conference on Thermal and Thermomechanical Phenomena in Electronic Systems (ITherm), 2026.' },
    { citation: 'Adhikari, D.; et al. "Uncertainty-Aware Drug-Target Affinity Prediction with Budget-Constrained Compound Ranking." IEEE International Conference on Biomedical and Health Informatics (BHI), 2026.', note: "Submitted" },
    { citation: 'Page, A.; Davis, R.; Adhikari, D.; Radyjowski, P.; Shaeri, M. R.; & Chen, C. "Correlation for Heat Transfer Coefficient for Rapid Cooling of Neutron Vacuum Furnaces." ASME Heat Transfer Summer Conference, 2025.' },
    { citation: 'Jaberi, A.; et al.; Adhikari, D.; et al. "Engineering Microgel Packing to Tailor the Physical and Biological Properties of Gelatin Methacryloyl Granular Hydrogel Scaffolds." Advanced Healthcare Materials, 2024.' },
  ],
  additionalPublications: [
    'Radyjowski, P.; Lieberknecht, E.; Adhikari, D.; Rao, P.; Chen, C.; Bhuripanyo, P.; & Ronney, P. "Swiss-roll Combustor: A Compact Portable Solution for Addressing the Methane Emissions from Low-production Oil and Gas Sites." American Flame Research Committee Industrial Combustion Symposium, 2024.',
    'Adhikari, D.; Radyjowski, P.; Carlson, D.; Davis, R.; Zou, A.; Rao, P.; & Chen, C. "Rapid Cooling Technology for Extreme Sample Environment Neutron Vacuum Furnaces." ASME 2024 Heat Transfer Summer Conference, 2024.',
    'Adhikari, D.; Bhuripanyo, P.; Rao, P.; Radyjowski, P.; Chen, C.; & Ronney, P. "Swiss-roll Combustor: An Innovative Enclosed Combustor for high Methane Destruction Efficiency and Ultra-low NOX Emissions." American Flame Research Committee Industrial Combustion Symposium, 2023.',
    'Shaeri, M. R.; Randriambololona, A. M.; & Adhikari, D. "Machine Learning Algorithm for Predicting Heat Transfer Coefficient and Pressure Drop in Dimpled Ducts." ASME Heat Transfer Summer Conference, 2024.',
    'Zou, A.; Davis, R.; Winters, D.; Carlson D.; Adhikari, D.; Radyjowski, P.; & Chen, C. "Fast Cooling Technology for Sample Stick in Top Loading Cryostats." ASME Heat Transfer Summer Conference, 2024.',
    'Radyjowski, P.; Davis, R.; Adhikari, D.; Chen, C.-H.; & Mills, R. "Rapid Cooling Technology for Neutron Vacuum Furnaces", 12th International Workshop on Sample Environments at Scattering Facilities, Bastad, Sweden, September 2024.',
  ],
  patents: [
    "Cooling Systems and Methods for a Vacuum Furnace. US Patent Application No. 18/318,289 (Filed 2023)",
    "Dry Methane Reforming by Stacked Wire Dielectric Barrier Discharge Plasma and Efficient Decoking Process in Plasma-assisted Bi-Reforming. US Patent Application No. 19/008,240 (Filed 2024-12)",
    "Braided Wire Reactor for Plasma Decontamination. US Patent Application No. 19/008,982 (Filed 2024-12)",
  ],
  awards: [
    "ITherm 2026 Best On-Site Poster Award, IEEE (2026)",
    "Georgia Tech Presidential Fellowship",
    "George W. Woodruff School of ME Chair's Fellowship",
    "CRIDC Poster Competition Award, College of Engineering — $1,000 (2026)",
    "Georgia Tech Spark Award — $1,000 (2025)",
    "SEEC Student Symposium 2nd Place, GT Energy Club — $350 (2026)",
    "Rev. Sci. Instrum. Featured Article, AIP (2026)",
    "Dean's List (8/8 semesters)",
  ],
  hackathons: [
    { title: 'Liquid AI × DPhi "AI in Space" Hackathon', dates: "2026", location: "Remote", description: "Built SatChat, a vision LLM pipeline that triages satellite imagery. Fine-tuned LFM2.5-VL-450M with LoRA on Sentinel-2 agricultural stress data. It achieves a 50,000:1 compression ratio over raw imagery downlink.", image: "", links: [] as { href: string; icon: React.ReactNode; title: string }[] },
    { title: "GT STAR-AI Makerspace Hackathon", dates: "May 12, 2026", location: "Atlanta, GA — Parker H. Petit Institute for Bioengineering", description: "Built a drug-target affinity prediction system with GIN ensembles and uncertainty quantification. KIBA CI=0.882. The package includes the full paper, poster, and reproducibility materials.", image: "", links: [] as { href: string; icon: React.ReactNode; title: string }[] },
  ],
};
