// //AIzaSyDE6dk9Laoem0YUzOztnI1a8Tuw7dSdGVk
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: "AIzaSyDE6dk9Laoem0YUzOztnI1a8Tuw7dSdGVk",
// });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: "What is the name of India's Prime Minister?" }],
//       },
//       {
//         role: "model",
//         parts: [
//           { text: "The current Prime Minister of India is **Narendra Modi**." },
//         ],
//       },
//       {
//         role: "user",
//         parts: [{ text: "Who is the greatest MMA fighter of all time?" }],
//       },
//       {
//         role: "model",
//         parts: [
//           {
//             text: `That's a fantastic and endlessly debated question in the world of MMA! There isn't a single, universally agreed-upon answer because different people prioritize different criteria (undefeated record, longevity, strength of competition, title defenses, skillset, finishes, etc.).However, a few names consistently come up in the "greatest of all time" (GOAT) discussion: 1.  **Jon Jones:** Often considered by many to be the GOAT due to his incredible dominance as light heavyweight champion, long reign, diverse skillset, and a near-unblemished record against a who's who of contenders. He also became a heavyweight champion later in his career. 2.  **Khabib Nurmagomedov:** Known for his undefeated 29-0 record and absolute dominance in the lightweight division, rarely losing a round and submitting many top fighters. His perfect record and seemingly impenetrable grappling make a strong case. 3.  **Georges St-Pierre (GSP):** A two-division champion (welterweight and middleweight) known for his incredible well-roundedness, intelligence, and ability to adapt and neutralize opponents' strengths. He defended his welterweight title nine times. 4.  **Anderson Silva:** Held the UFC middleweight title for a record-breaking 2,457 days, defending it 10 times. His incredible striking, highlight-reel knockouts, and "matrix"-like ability to evade strikes made him a legend. 5.  **Demetrious "Mighty Mouse" Johnson:** Dominant flyweight champion with a record 11 consecutive title defenses. He's often praised for his incredible technique, speed, and well-roundedness in all aspects of MMA. Ultimately, who you consider the greatest often comes down to personal preference and what you value most in a fighter's career.`,
//           },
//         ],
//       },
//     ],
//   });
//   console.log(response.text);
// }

// await main();
