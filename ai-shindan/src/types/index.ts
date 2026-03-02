export interface Question {
  id: number;
  text: string;
  options: { label: string; value: string }[];
}

export interface DiagnosisResult {
  id: string;
  personalityType: string;
  emoji: string;
  description: string;
  traits: string[];
  colorScheme: "red" | "blue" | "green" | "purple" | "yellow" | "pink";
  advice: string;
  createdAt: number;
}

export interface DiagnoseRequest {
  answers: Record<number, string>;
}
