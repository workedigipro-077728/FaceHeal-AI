import axios, { AxiosError } from "axios";

import { env } from "@/src/config/env";

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent`;



const DEFAULT_PROMPT = `You are a professional dermatologist AI. Analyze the provided face image for:
1. Skin health score (0–100)
2. Detected issues (acne, wrinkles, dark spots, redness, dryness, pores, texture)
3. Skin type (dry, oily, combination, sensitive)
4. Estimated age and facial symmetry score
5. Personalized recommendations:
   - Morning and night skincare routine
   - Suggested skincare products or ingredients
   - Lifestyle improvements (sleep, water, diet)
   - Short daily facial exercises

Respond strictly in JSON format like this:
{
  "healthScore": number,
  "skinType": string,
  "detectedIssues": string[],
  "ageEstimate": number,
  "symmetryScore": number,
  "recommendations": {
    "morningRoutine": string[],
    "nightRoutine": string[],
    "products": string[],
    "lifestyle": string[],
    "exercises": string[]
  }
}`;

const DEFAULT_IMAGE_MIME_TYPE = "image/jpeg";

export interface FaceHealthRecommendations {
  morningRoutine: string[];
  nightRoutine: string[];
  products: string[];
  lifestyle: string[];
  exercises: string[];
}

export interface FaceHealthAnalysis {
  healthScore: number;
  skinType: string;
  detectedIssues: string[];
  ageEstimate: number;
  symmetryScore: number;
  recommendations: FaceHealthRecommendations;
  [key: string]: unknown;
}

export type AnalyzeFaceHealthParams = {
  /**
   * Base64 encoded image data WITHOUT the data URI prefix (e.g. omit `data:image/jpeg;base64,`).
   */
  imageBase64: string;
  /**
   * Mime type of the provided image. Defaults to `image/jpeg`.
   */
  mimeType?: string;
  /**
   * Optional override prompt. When omitted, a dermatologist-focused prompt is used.
   */
  prompt?: string;
};

export async function analyzeFaceHealth({
  imageBase64,
  mimeType = DEFAULT_IMAGE_MIME_TYPE,
  prompt = DEFAULT_PROMPT,
}: AnalyzeFaceHealthParams): Promise<FaceHealthAnalysis> {
  if (!imageBase64) {
    throw new Error(
      "analyzeFaceHealth requires a base64 encoded image (without data URI prefix)."
    );
  }

  if (!env.geminiApiKey) {
    throw new Error(
      "Gemini API key is missing. Set EXPO_PUBLIC_GEMINI_API_KEY in your environment."
    );
  }

  try {
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${env.geminiApiKey}`,
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );

    const rawText = extractCandidateText(response.data);
    const sanitized = sanitizeJsonResponse(rawText);

    return JSON.parse(sanitized) as FaceHealthAnalysis;
  } catch (error) {
    const normalizedError = normalizeGeminiError(error);
    console.error("❌ API Error:", normalizedError);
    throw normalizedError;
  }
}

function extractCandidateText(responseData: any): string {
  const candidates = responseData?.candidates;

  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error("Gemini response did not contain any candidates.");
  }

  const firstWithText = candidates.find((candidate: any) =>
    candidate?.content?.parts?.some((part: any) => typeof part?.text === "string")
  );

  const parts = firstWithText?.content?.parts ?? [];
  const textParts = parts
    .map((part: any) => part?.text)
    .filter((text: unknown): text is string => typeof text === "string");

  if (textParts.length === 0) {
    throw new Error("Gemini response did not include text content.");
  }

  return textParts.join("\n");
}

function sanitizeJsonResponse(rawText: string): string {
  return rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/\u0000/g, "")
    .trim();
}

function normalizeGeminiError(error: unknown): Error {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as
      | { error?: { message?: string } }
      | undefined;
    const message =
      responseData?.error?.message ?? error.message ?? "Unknown API error";

    return new Error(
      status ? ` API error (${status}): ${message}` : ` API error: ${message}`
    );
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Failed to analyze face health. Please try again.");
}

function isAxiosError(error: unknown): error is AxiosError {
  return Boolean((error as AxiosError)?.isAxiosError);
}