export const budgetReformat = (budget: number): string => budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
