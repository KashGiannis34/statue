<script lang="ts">
  import type { BaseChallengeProps } from './types';

  interface MathChallengeProps extends BaseChallengeProps {}

  let {
    onSuccess,
    onFail,
    confirmText = 'Confirm',
  }: MathChallengeProps = $props();

  let mathProblem = $state({ a: 0, b: 0, operator: '+', answer: 0 });
  let mathInput = $state('');

  function generateMathProblem() {
    const operators = ['+', '-', '×'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let a: number, b: number, answer: number;

    if (op === '+') {
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      answer = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a - b;
    } else {
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
    }

    mathProblem = { a, b, operator: op, answer };
  }

  // Initialize on mount
  $effect(() => {
    generateMathProblem();
  });

  function handleMathSubmit() {
    const userAnswer = parseInt(mathInput, 10);
    if (userAnswer === mathProblem.answer) {
      onSuccess();
    } else {
      onFail('Incorrect answer. Try again.');
    }
  }

  function handleMathKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleMathSubmit();
    }
  }

  export function reset() {
    mathInput = '';
    generateMathProblem();
  }
</script>

<div class="math-challenge">
  <p class="math-instruction">Solve to prove you're human:</p>
  <div class="math-problem">
    <span class="math-operand">{mathProblem.a}</span>
    <span class="math-operator">{mathProblem.operator}</span>
    <span class="math-operand">{mathProblem.b}</span>
    <span class="math-equals">=</span>
    <input
      type="number"
      class="math-input"
      bind:value={mathInput}
      onkeydown={handleMathKeydown}
      placeholder="?"
      autocomplete="off"
    />
  </div>
  <button class="math-submit" onclick={handleMathSubmit}>
    {confirmText}
  </button>
</div>

<style>
  .math-challenge {
    text-align: center;
  }

  .math-instruction {
    font-size: 0.875rem;
    color: var(--cc-text-muted, #888);
    margin-bottom: 1rem;
  }

  .math-problem {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--cc-text, #fff);
  }

  .math-operand {
    min-width: 40px;
  }

  .math-operator {
    color: var(--cc-primary, #6366f1);
  }

  .math-equals {
    color: var(--cc-text-muted, #888);
  }

  .math-input {
    width: 60px;
    padding: 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    background: transparent;
    border: 2px solid var(--cc-border, #333);
    border-radius: 8px;
    color: var(--cc-text, #fff);
    outline: none;
    transition: border-color 0.2s ease;
    appearance: textfield;
    -moz-appearance: textfield;
  }

  .math-input::-webkit-outer-spin-button,
  .math-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .math-input:focus {
    border-color: var(--cc-primary, #6366f1);
  }

  .math-submit {
    width: 100%;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    background: var(--cc-primary, #6366f1);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .math-submit:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .math-submit:active {
    transform: translateY(0);
  }
</style>
