export const incomeCategories = [
  { id: 'salary', name: 'Salary', icon: '💰' },
  { id: 'freelance', name: 'Freelance', icon: '💼' },
  { id: 'investments', name: 'Investments', icon: '📈' },
  { id: 'gifts', name: 'Gifts', icon: '🎁' },
  { id: 'other_income', name: 'Other', icon: '➕' },
];

export const expenseCategories = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'bills', name: 'Bills & Utilities', icon: '📝' },
  { id: 'health', name: 'Health & Medical', icon: '⚕️' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'other_expense', name: 'Other', icon: '➕' },
];

export type Category = {
  id: string;
  name: string;
  icon: string;
}; 