/**
 * Basic mathematical operations for demonstration.
 */

/**
 * Adds two numbers together.
 * @param {number} a 
 * @param {number} b 
 * @returns {number} Sum of a and b
 */
export function add(a, b) {
  return a + b;
}

/**
 * Subtracts b from a.
 * @param {number} a 
 * @param {number} b 
 * @returns {number} Difference of a and b
 */
export function subtract(a, b) {
  return a - b;
}

// Undocumented function to trigger a warning
export function multiply(a, b) {
  return a * b;
}

/**
 * Calculator class managing an internal running total.
 */
export class Calculator {
  constructor() {
    this.value = 0;
  }

  /**
   * Adds value to the running total.
   */
  add(val) {
    this.value += val;
    return this;
  }

  // Undocumented method to trigger method warning
  getValue() {
    return this.value;
  }
}

/**
 * Extremely verbose function to test the line length warning checker.
 * This function artificially spans more than 30 lines.
 */
export function processComplexStatistics(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return null;
  }

  let sum = 0;
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    sum += num;
    if (num < min) {
      min = num;
    }
    if (num > max) {
      max = num;
    }
  }

  const mean = sum / numbers.length;
  let varianceSum = 0;

  for (let i = 0; i < numbers.length; i++) {
    const diff = numbers[i] - mean;
    varianceSum += diff * diff;
  }

  const variance = varianceSum / numbers.length;
  const stdDev = Math.sqrt(variance);

  // Artificially extending to verify the 30-line warning threshold
  console.log("Starting calculation trace...");
  console.log(`Input size: ${numbers.length}`);
  console.log(`Computed sum: ${sum}`);
  console.log(`Computed mean: ${mean}`);
  console.log(`Computed min: ${min}`);
  console.log(`Computed max: ${max}`);
  console.log(`Computed stdDev: ${stdDev}`);
  console.log("Completed calculation trace.");

  return {
    sum,
    mean,
    min,
    max,
    stdDev
  };
}
