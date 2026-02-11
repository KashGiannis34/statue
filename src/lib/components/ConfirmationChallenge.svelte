<script module lang="ts">
  // Re-export types for external use
  export type { ChallengeType, ChallengeDifficulty } from './ConfirmationChallenge/types';

  export interface ConfirmationChallengeProps {
    type?: ChallengeType;
    difficulty?: ChallengeDifficulty;
    title?: string;
    description?: string;
    confirmText?: string;
    typePhrase?: string;
    holdDuration?: number;
    patternSequence?: number[];
    onConfirm?: () => void;
    onFail?: () => void;
    showDifficulty?: boolean;
    class?: string;
    persist?: string;
  }
</script>

<script lang="ts">
  import SliderChallenge from './ConfirmationChallenge/SliderChallenge.svelte';
  import HoldChallenge from './ConfirmationChallenge/HoldChallenge.svelte';
  import TypeChallenge from './ConfirmationChallenge/TypeChallenge.svelte';
  import PatternChallenge from './ConfirmationChallenge/PatternChallenge.svelte';
  import MathChallenge from './ConfirmationChallenge/MathChallenge.svelte';
  import GravityChallenge from './ConfirmationChallenge/GravityChallenge.svelte';
  import {
    type ChallengeType,
    type ChallengeDifficulty,
    challengeDifficulty,
    getRandomChallengeByDifficulty
  } from './ConfirmationChallenge/types';

  // Browser check for SSR compatibility
  const isBrowser = typeof window !== 'undefined';

  let {
    type: typeProp = 'slider',
    difficulty,
    title = 'Confirm Action',
    description = 'Complete the challenge below to proceed.',
    confirmText = 'Confirm',
    typePhrase = 'CONFIRM',
    holdDuration = 2000,
    patternSequence = [1, 2, 3, 4],
    onConfirm,
    onFail,
    showDifficulty = false,
    class: className = '',
    persist
  }: ConfirmationChallengeProps = $props();

  // Use $derived for reactive type calculation
  let type: ChallengeType = $derived(
    difficulty ? getRandomChallengeByDifficulty(difficulty) : typeProp
  );

  // Get difficulty from type for display
  let displayDifficulty: ChallengeDifficulty = $derived(
    difficulty || challengeDifficulty[type]
  );

  // Check if already completed (from localStorage)
  function isPersisted(): boolean {
    if (!isBrowser || !persist) return false;
    try {
      return localStorage.getItem(`cc:${persist}`) === 'completed';
    } catch {
      return false;
    }
  }

  function setPersisted() {
    if (!isBrowser || !persist) return;
    try {
      localStorage.setItem(`cc:${persist}`, 'completed');
    } catch {
      // localStorage not available
    }
  }

  function clearPersisted() {
    if (!isBrowser || !persist) return;
    try {
      localStorage.removeItem(`cc:${persist}`);
    } catch {
      // localStorage not available
    }
  }

  // State - check persistence on init
  let confirmed = $state(false);
  let failed = $state(false);
  let challengeRef: { reset?: () => void } | null = $state(null);

  // Check persistence on mount
  $effect(() => {
    if (isPersisted()) {
      confirmed = true;
      onConfirm?.();
    }
  });

  function handleSuccess() {
    confirmed = true;
    failed = false;
    setPersisted();
    onConfirm?.();
  }

  function handleFail() {
    failed = true;
    onFail?.();
    setTimeout(() => {
      failed = false;
    }, 1500);
  }

  function reset() {
    confirmed = false;
    failed = false;
    clearPersisted();
    challengeRef?.reset?.();
  }
</script>

<div class="confirmation-challenge {className}" class:confirmed class:failed>
  <!-- Header -->
  <div class="challenge-header">
    <h3 class="challenge-title">{title}</h3>
    <p class="challenge-description">{description}</p>

    {#if showDifficulty}
      <span class="difficulty-badge difficulty-{displayDifficulty}">
        {displayDifficulty}
      </span>
    {/if}
  </div>

  <!-- Challenge Content -->
  <div class="challenge-content">
    {#if type === 'slider'}
      <SliderChallenge
        bind:this={challengeRef}
        onSuccess={handleSuccess}
        onFail={handleFail}
        {confirmText}
      />
    {:else if type === 'hold'}
      <HoldChallenge
        bind:this={challengeRef}
        onSuccess={handleSuccess}
        onFail={handleFail}
        {confirmText}
        {holdDuration}
      />
    {:else if type === 'type'}
      <TypeChallenge
        bind:this={challengeRef}
        onSuccess={handleSuccess}
        onFail={handleFail}
        {confirmText}
        {typePhrase}
      />
    {:else if type === 'pattern'}
      <PatternChallenge
        bind:this={challengeRef}
        onSuccess={handleSuccess}
        onFail={handleFail}
        {confirmText}
        {patternSequence}
      />
    {:else if type === 'math'}
      <MathChallenge
        bind:this={challengeRef}
        onSuccess={handleSuccess}
        onFail={handleFail}
        {confirmText}
      />
    {:else if type === 'gravity'}
      <GravityChallenge
        bind:this={challengeRef}
        onSuccess={handleSuccess}
        onFail={handleFail}
        {confirmText}
      />
    {/if}
  </div>

  <!-- Reset button when completed or failed -->
  {#if confirmed || failed}
    <button class="reset-button" onclick={reset}>
      {confirmed ? 'Reset Challenge' : 'Try Again'}
    </button>
  {/if}
</div>

<style>
  /* CSS Custom Properties for theming */
  .confirmation-challenge {
    --cc-bg: var(--color-surface, #1a1a2e);
    --cc-border: var(--color-border, #2d2d44);
    --cc-primary: var(--color-primary, #6366f1);
    --cc-primary-hover: var(--color-primary-hover, #818cf8);
    --cc-success: var(--color-success, #22c55e);
    --cc-fail: var(--color-error, #ef4444);
    --cc-text: var(--color-text, #e2e8f0);
    --cc-text-muted: var(--color-text-muted, #94a3b8);
    --cc-radius: var(--radius-lg, 16px);
  }

  /* Container */
  .confirmation-challenge {
    background: var(--cc-bg);
    border: 2px solid var(--cc-border);
    border-radius: var(--cc-radius);
    padding: 1.5rem;
    transition: all 0.3s ease;
    max-width: 400px;
  }

  .confirmation-challenge.confirmed {
    border-color: var(--cc-success);
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
  }

  .confirmation-challenge.failed {
    border-color: var(--cc-fail);
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  /* Header */
  .challenge-header {
    text-align: center;
    margin-bottom: 1rem;
  }

  .challenge-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--cc-text);
    margin: 0 0 0.5rem 0;
  }

  .confirmed .challenge-title {
    color: var(--cc-success);
  }

  .failed .challenge-title {
    color: var(--cc-fail);
  }

  .challenge-description {
    font-size: 0.875rem;
    color: var(--cc-text-muted);
    margin: 0;
  }

  /* Difficulty Badge */
  .difficulty-badge {
    display: inline-block;
    margin-top: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .difficulty-easy {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .difficulty-medium {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.3);
  }

  .difficulty-hard {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  /* Challenge Content */
  .challenge-content {
    margin-top: 1.5rem;
  }

  /* Reset Button */
  .reset-button {
    width: 100%;
    padding: 0.75rem 1.5rem;
    margin-top: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    background: transparent;
    color: var(--cc-text-muted);
    border: 1px solid var(--cc-border);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .reset-button:hover {
    border-color: var(--cc-primary);
    color: var(--cc-text);
  }
</style>
