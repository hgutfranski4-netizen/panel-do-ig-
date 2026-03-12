import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateAndSave(prompt: string, filename: string, aspectRatio: string = "16:9") {
  console.log(`Generating ${filename}...`);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64 = part.inlineData.data;
        const buffer = Buffer.from(base64, 'base64');
        fs.writeFileSync(path.join(process.cwd(), 'public', filename), buffer);
        console.log(`Saved ${filename}`);
        break;
      }
    }
  } catch (e) {
    console.error(`Failed ${filename}:`, e);
  }
}

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  const imgDir = path.join(publicDir, 'images');
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir);
  }
  
  await Promise.all([
    generateAndSave("A highly professional, sleek, dark mode SaaS dashboard interface for a social media automation tool. High-tech, data-driven, futuristic but clean. Glowing orange accents. No text.", "images/hero-dashboard.jpg", "16:9"),
    generateAndSave("Server racks and physical smartphones connected by cables in a dark, high-tech data center. Professional, serious, dark mode, orange and blue glowing lights.", "images/feature-hardware.jpg", "3:4"),
    generateAndSave("Abstract 3D data visualization, upward trending graphs, glowing nodes, dark background, professional finance or tech vibe.", "images/feature-growth.jpg", "3:4"),
    generateAndSave("Cybersecurity concept, glowing digital shield, padlock, dark tech background, green and orange accents, highly professional.", "images/feature-security.jpg", "3:4"),
    generateAndSave("Artificial intelligence concept, glowing neural network brain, abstract digital nodes, dark background, purple and orange accents.", "images/feature-ai.jpg", "3:4"),
    generateAndSave("Abstract professional tech background, dark mode, glowing purple and pink nodes, instagram vibe but highly technical and serious.", "images/platform-instagram.jpg", "1:1"),
    generateAndSave("Abstract professional tech background, dark mode, glowing cyan and red nodes, tiktok vibe but highly technical and serious.", "images/platform-tiktok.jpg", "1:1"),
    generateAndSave("Abstract professional tech background, dark mode, glowing orange and yellow nodes, tinder bumble vibe but highly technical and serious.", "images/platform-dating.jpg", "1:1"),
    generateAndSave("Abstract professional tech background, dark mode, glowing white and grey nodes, threads vibe but highly technical and serious.", "images/platform-threads.jpg", "1:1")
  ]);
}
main();
