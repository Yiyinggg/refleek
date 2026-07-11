import apronImg from "../../../home images/已生成图像 6 (1).png";
import cushionImg from "../../../home images/已生成图像 3.png";
import heroBgImg from "../../../home images/已生成图像 1 (16)_副本.png";
import scarfImg from "../../../home images/已生成图像 4.png";
import tableclothImg from "../../../home images/已生成图像 2 (2).png";
import toteImg from "../../../home images/已生成图像 1 (16).png";
import wallHangingImg from "../../../home images/已生成图像 5.png";

export const ACCENT = "#E8452A";

export const HERO_BG = heroBgImg;

export const NAV_LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "Solution" },
  { href: "#features", label: "Features" },
  { href: "#ecosystem", label: "Ecosystem" },
  { href: "#products", label: "Products" },
] as const;

export const SWATCH_STRIP = [
  {
    name: "Deadstock linen",
    bg: "#D7CBB2",
    img: "repeating-linear-gradient(0deg,rgba(255,255,255,.4) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(120,105,80,.28) 0 1px,transparent 1px 3px)",
    size: "auto",
    label: "rgba(15,15,14,.6)",
  },
  {
    name: "Reclaimed denim",
    bg: "#3C4E67",
    img: "repeating-linear-gradient(45deg,rgba(255,255,255,.09) 0 1px,transparent 1px 4px),repeating-linear-gradient(-45deg,rgba(0,0,0,.18) 0 1px,transparent 1px 4px)",
    size: "auto",
    label: "rgba(244,241,234,.85)",
  },
  {
    name: "Cotton twill",
    bg: "#3B3B39",
    img: "repeating-linear-gradient(45deg,rgba(255,255,255,.08) 0 2px,transparent 2px 5px)",
    size: "auto",
    label: "rgba(244,241,234,.85)",
  },
  {
    name: "Shirt cotton",
    bg: "#E8EDF2",
    img: "repeating-linear-gradient(90deg,#4E6E9E 0 6px,#E8EDF2 6px 14px)",
    size: "auto",
    label: "rgba(15,15,14,.7)",
  },
  {
    name: "Reclaimed knit",
    bg: "#B9B2A6",
    img: "radial-gradient(rgba(0,0,0,.14) 1px,transparent 1.6px)",
    size: "6px 6px",
    label: "rgba(15,15,14,.6)",
  },
] as const;

export const PROBLEM_STATS = [
  {
    v: "Not all",
    k: "secondhand garments can be resold — damaged, low-value or inconsistent stock has no route to market.",
  },
  {
    v: "Tonnes",
    k: "of overordered and cancelled fabric sit as deadstock in factories and mills.",
  },
  {
    v: "Zero",
    k: "structured path today connects that material to designers, makers and small-batch production.",
  },
] as const;

export const SOLUTION_FLOW = [
  {
    n: "01",
    name: "Start with material",
    desc: "Design from real circular stock — deadstock rolls or reclaimed panels — not a blank canvas.",
  },
  {
    n: "02",
    name: "Design the surface",
    desc: "AI recommends techniques, patterns and layouts that respect the material and its condition.",
  },
  {
    n: "03",
    name: "Render to confirm",
    desc: "Preview material, pattern and placement on the product before anything is cut.",
  },
  {
    n: "04",
    name: "Hand off to make",
    desc: "Auto-generate a tech pack and match a Fleek-linked India / Pakistan production partner.",
  },
] as const;

export const FEATURES = [
  {
    n: "F—01",
    name: "Node workflow",
    desc: "Eight guided nodes take you from a plain-language brief to a factory-ready tech pack — no blank canvas, no guesswork.",
  },
  {
    n: "F—02",
    name: "Material-first design",
    desc: "Every project begins from real circular stock, tagged with quantity, dimensions, colour and best use.",
  },
  {
    n: "F—03",
    name: "Two circular sources",
    desc: "New deadstock fabric and reclaimed secondhand fabric live in one pool — mix them, or let AI recommend.",
  },
  {
    n: "F—04",
    name: "AI brief builder",
    desc: "A few focused questions convert your intent into structured product, material and technique decisions.",
  },
  {
    n: "F—05",
    name: "Render preview",
    desc: "See material, pattern and layout rendered on the product before a single thread is cut.",
  },
  {
    n: "F—06",
    name: "Tech pack + producer",
    desc: "A production-ready brief, matched to an India / Pakistan partner with MOQ, lead time and cost.",
  },
] as const;

export const WORKFLOW_CHAIN = [
  "Product",
  "Material",
  "Technique",
  "Pattern",
  "Layout",
  "Render",
  "Tech pack",
  "Producer",
] as const;

export const PRODUCTS = [
  {
    slotId: "rf-prod-tote",
    ph: "Drop tote render",
    image: toteImg,
    name: "Patchwork Tote",
    material: "Reclaimed denim panels",
    technique: "Patchwork + reinforced stitch",
    source: "Reclaimed",
    tagBg: "#3C4E67",
    tagFg: "#F4F1EA",
  },
  {
    slotId: "rf-prod-cloth",
    ph: "Drop tablecloth render",
    image: tableclothImg,
    name: "Minimal Tablecloth",
    material: "New deadstock linen blend",
    technique: "Cut & sew + tonal embroidery",
    source: "Deadstock",
    tagBg: "#0F0F0E",
    tagFg: "#F4F1EA",
  },
  {
    slotId: "rf-prod-cushion",
    ph: "Drop cushion render",
    image: cushionImg,
    name: "Quilted Cushion Cover",
    material: "Reclaimed shirt cotton",
    technique: "Quilting + appliqué",
    source: "Reclaimed",
    tagBg: "#3C4E67",
    tagFg: "#F4F1EA",
  },
  {
    slotId: "rf-prod-scarf",
    ph: "Drop scarf render",
    image: scarfImg,
    name: "Silk Scarf",
    material: "Deadstock silk",
    technique: "Placement + border print",
    source: "Deadstock",
    tagBg: "#0F0F0E",
    tagFg: "#F4F1EA",
  },
  {
    slotId: "rf-prod-wall",
    ph: "Drop wall hanging render",
    image: wallHangingImg,
    name: "Wall Hanging",
    material: "Mixed reclaimed panels",
    technique: "Patchwork + appliqué",
    source: "Reclaimed",
    tagBg: "#3C4E67",
    tagFg: "#F4F1EA",
  },
  {
    slotId: "rf-prod-apron",
    ph: "Drop apron render",
    image: apronImg,
    name: "Canvas Apron",
    material: "Deadstock canvas",
    technique: "Cut & sew + edge finish",
    source: "Deadstock",
    tagBg: "#0F0F0E",
    tagFg: "#F4F1EA",
  },
] as const;

export const IMPACT = [
  { v: "2", k: "Circular sources — deadstock + reclaimed — feeding one pool" },
  { v: "8", k: "Guided nodes from brief to production tech pack" },
  { v: "7–10d", k: "Typical lead time from matched India / Pakistan partners" },
  { v: "0m", k: "New virgin fabric ordered — circular by default" },
] as const;
