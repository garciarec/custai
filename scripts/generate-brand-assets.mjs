import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/icons", { recursive: true });

const mark = "public/brand/custai-mark.svg";

await sharp(mark).resize(32, 32).png().toFile("public/favicon-32.png");
await sharp(mark).resize(180, 180).png().toFile("public/apple-touch-icon.png");
await sharp(mark).resize(192, 192).png().toFile("public/icons/icon-192.png");
await sharp(mark).resize(512, 512).png().toFile("public/icons/icon-512.png");
await sharp(mark).resize(512, 512).png().toFile("public/icons/icon-512-maskable.png");

const share = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#F7F8F5"/>

  <rect x="70" y="70" width="110" height="110" rx="30" fill="#0D6B52"/>

  <path
    d="M145 108
       C134 99 121 94 106 94
       C82 94 63 113 63 137
       C63 161 82 180 106 180
       C121 180 134 175 145 166"
    fill="none"
    stroke="#F7F8F5"
    stroke-width="18"
    stroke-linecap="round"
  />

  <circle cx="158" cy="137" r="9" fill="#F7F8F5"/>

  <text
    x="215"
    y="151"
    font-family="Inter, Arial, sans-serif"
    font-size="68"
    font-weight="700"
    letter-spacing="-3"
    fill="#101814"
  >Custaí</text>

  <text
    x="75"
    y="335"
    font-family="Inter, Arial, sans-serif"
    font-size="58"
    font-weight="650"
    fill="#101814"
  >Quanto cobrar pelo seu produto?</text>

  <text
    x="75"
    y="405"
    font-family="Inter, Arial, sans-serif"
    font-size="30"
    fill="#66716B"
  >Calcule seus custos e encontre um preço de venda.</text>

  <rect x="75" y="490" width="1050" height="1" fill="#D8DED9"/>

  <text
    x="75"
    y="545"
    font-family="Inter, Arial, sans-serif"
    font-size="23"
    fill="#7A847E"
  >Custaí · Calculadora de preços</text>
</svg>
`;

await sharp(Buffer.from(share))
  .png()
  .toFile("public/og-image.png");

console.log("✓ Branding Custaí criado");
console.log("✓ Favicon criado");
console.log("✓ Ícones PWA criados");
console.log("✓ Apple Touch Icon criado");
console.log("✓ Ícone maskable criado");
console.log("✓ Imagem de compartilhamento criada");
