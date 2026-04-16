"use client";

import { useState } from "react";
import { getRandomSurprisePrompt } from "~~/lib/surpriseMePrompts";

type GenerateFormProps = {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  disabled?: boolean;
  disabledReason?: string;
};

const MAX_PROMPT_LENGTH = 280;

export const GenerateForm = ({ onGenerate, isGenerating, disabled, disabledReason }: GenerateFormProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating || disabled) return;
    await onGenerate(prompt.trim());
  };

  const handleSurpriseMe = () => {
    if (isGenerating || disabled) return;
    setPrompt(getRandomSurprisePrompt(MAX_PROMPT_LENGTH));
  };

  const charsRemaining = MAX_PROMPT_LENGTH - prompt.length;
  const isOverLimit = charsRemaining < 0;
  const controlsDisabled = isGenerating || !!disabled;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold text-lg">Describe your CLAWD</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full h-24 text-base"
          placeholder="wearing a cowboy hat with laser eyes..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          maxLength={MAX_PROMPT_LENGTH}
          disabled={isGenerating}
        />
        <label className="label flex items-center justify-between gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-xs normal-case gap-1"
            onClick={handleSurpriseMe}
            disabled={controlsDisabled}
            title="Fill the prompt with a random idea"
          >
            <span aria-hidden="true">🎲</span>
            Surprise Me
          </button>
          <span className={`label-text-alt ${isOverLimit ? "text-error" : "text-base-content/60"}`}>
            {charsRemaining} characters remaining
          </span>
        </label>
      </div>

      {disabledReason && <div className="text-sm text-warning mb-2 text-center">{disabledReason}</div>}

      <button
        type="submit"
        className="btn btn-primary w-full text-lg"
        disabled={!prompt.trim() || isGenerating || disabled || isOverLimit}
      >
        {isGenerating ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Generating your CLAWD...
          </>
        ) : (
          "Generate PFP (500,000 CV)"
        )}
      </button>

      {isGenerating && (
        <p className="text-sm text-base-content/60 text-center mt-2">This usually takes 10-30 seconds</p>
      )}
    </form>
  );
};
