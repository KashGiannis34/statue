<script lang="ts">
  import type { BaseChallengeProps } from './types';

  interface TypeChallengeProps extends BaseChallengeProps {
    typePhrase?: string;
  }

  let {
    onSuccess,
    onFail,
    confirmText = 'Confirm',
    typePhrase = 'CONFIRM',
  }: TypeChallengeProps = $props();

  let typedValue = $state('');

  function handleTypeInput() {
    if (typedValue.toUpperCase() === typePhrase.toUpperCase()) {
      onSuccess();
    }
  }

  function handleTypeKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if (typedValue.toUpperCase() === typePhrase.toUpperCase()) {
        onSuccess();
      } else {
        onFail('Incorrect input. Try again.');
      }
    }
  }

  export function reset() {
    typedValue = '';
  }
</script>

<div class="type-challenge">
  <p class="type-instruction">
    Type <code>{typePhrase}</code> to confirm
  </p>
  <input
    type="text"
    class="type-input"
    bind:value={typedValue}
    oninput={handleTypeInput}
    onkeydown={handleTypeKeydown}
    placeholder="Type here..."
    autocomplete="off"
    spellcheck="false"
  />
  <div class="type-progress">
    {#each typePhrase.split('') as char, i}
      <span
        class="type-char"
        class:correct={typedValue[i]?.toUpperCase() === char.toUpperCase()}
        class:incorrect={typedValue[i] && typedValue[i]?.toUpperCase() !== char.toUpperCase()}
      >
        {char}
      </span>
    {/each}
  </div>
</div>

<style>
  .type-challenge {
    text-align: center;
  }

  .type-instruction {
    font-size: 0.875rem;
    color: var(--cc-text-muted, #888);
    margin-bottom: 1rem;
  }

  .type-instruction code {
    background: var(--cc-primary, #6366f1);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
    font-weight: 600;
  }

  .type-input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1.25rem;
    text-align: center;
    background: transparent;
    border: 2px solid var(--cc-border, #333);
    border-radius: 12px;
    color: var(--cc-text, #fff);
    outline: none;
    transition: border-color 0.2s ease;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .type-input:focus {
    border-color: var(--cc-primary, #6366f1);
  }

  .type-progress {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-top: 1rem;
  }

  .type-char {
    width: 24px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: monospace;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 4px;
    background: var(--cc-border, #333);
    color: var(--cc-text-muted, #888);
    transition: all 0.2s ease;
  }

  .type-char.correct {
    background: var(--cc-success, #22c55e);
    color: white;
  }

  .type-char.incorrect {
    background: var(--cc-fail, #ef4444);
    color: white;
  }
</style>
