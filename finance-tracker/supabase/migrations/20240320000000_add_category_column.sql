-- Add category column to transactions table
ALTER TABLE transactions
ADD COLUMN category TEXT NOT NULL DEFAULT 'other_income' CHECK (
  (type = 'income' AND category IN ('salary', 'freelance', 'investments', 'gifts', 'other_income')) OR
  (type = 'expense' AND category IN ('food', 'transport', 'shopping', 'entertainment', 'bills', 'health', 'education', 'travel', 'other_expense'))
);

-- Update existing records to have a default category
UPDATE transactions
SET category = CASE
  WHEN type = 'income' THEN 'other_income'
  WHEN type = 'expense' THEN 'other_expense'
END; 