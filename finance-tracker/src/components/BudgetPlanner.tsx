'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Budget {
  id: number;
  income: number;
  needs: number;
  wants: number;
  start_date?: string;
  end_date?: string;
}

interface BudgetCategory {
  id: number;
  budget_id: number;
  type: 'need' | 'want';
  category: string;
  amount: number;
}

const NEEDS_CATEGORIES = [
  'Laptop bill',
  'klarna',
  'food',
  'parental',
  'transport',
  'groceries',
];
const WANTS_CATEGORIES = [
  'coding - subcription',
  'clothing/fashion',
  'eat-out/takeaway',
  'entertatinment subcription(streaming,music)',
  'gym',
  'Lessons',
  'dispoable',
];

const BudgetPlanner: React.FC = () => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [income, setIncome] = useState<number>(0);
  const [needsCategories, setNeedsCategories] = useState<BudgetCategory[]>([]);
  const [wantsCategories, setWantsCategories] = useState<BudgetCategory[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch budget and categories on mount
  useEffect(() => {
    const fetchBudgetAndCategories = async () => {
      setLoading(true);
      setError(null);
      // Fetch budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('budget')
        .select('*')
        .limit(1)
        .single();
      if (budgetError || !budgetData) {
        setError('Failed to load budget.');
        setLoading(false);
        return;
      }
      setBudget(budgetData);
      setIncome(Number(budgetData.income));
      setStartDate(budgetData.start_date || '');
      setEndDate(budgetData.end_date || '');
      // Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('budget_id', budgetData.id);
      if (catError) {
        setError('Failed to load budget categories.');
        setLoading(false);
        return;
      }
      // Ensure all default categories exist
      const needs = NEEDS_CATEGORIES.map(cat => {
        let found = catData?.find((c: any) => c.type === 'need' && c.category === cat);
        return found || {
          id: 0,
          budget_id: budgetData.id,
          type: 'need',
          category: cat,
          amount: 0,
        };
      });
      const wants = WANTS_CATEGORIES.map(cat => {
        let found = catData?.find((c: any) => c.type === 'want' && c.category === cat);
        return found || {
          id: 0,
          budget_id: budgetData.id,
          type: 'want',
          category: cat,
          amount: 0,
        };
      });
      setNeedsCategories(needs);
      setWantsCategories(wants);
      setLoading(false);
    };
    fetchBudgetAndCategories();
  }, []);

  // Calculate totals
  const needsTotal = needsCategories.reduce((sum, c) => sum + Number(c.amount), 0);
  const wantsTotal = wantsCategories.reduce((sum, c) => sum + Number(c.amount), 0);
  const savings = income * 0.2;
  const totalAllocated = needsTotal + wantsTotal + savings;
  const isValid = income === 0 || Math.abs(totalAllocated - income) < 0.01;

  // Handle input change for subcategories
  const handleCategoryChange = (type: 'need' | 'want', idx: number, value: number) => {
    if (type === 'need') {
      const updated = [...needsCategories];
      updated[idx] = { ...updated[idx], amount: value };
      setNeedsCategories(updated);
    } else {
      const updated = [...wantsCategories];
      updated[idx] = { ...updated[idx], amount: value };
      setWantsCategories(updated);
    }
  };

  // Hide success message on edit
  const handleEdit = () => {
    setSuccess(false);
  };

  // Save all changes
  const handleSave = async () => {
    if (!budget) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    // Save main budget
    const { error: updateError } = await supabase
      .from('budget')
      .update({ income, needs: needsTotal, wants: wantsTotal, start_date: startDate, end_date: endDate, updated_at: new Date().toISOString() })
      .eq('id', budget.id);
    if (updateError) {
      setError('Failed to save budget.');
      setSaving(false);
      return;
    }
    // Save categories
    for (const cat of [...needsCategories, ...wantsCategories]) {
      if (cat.id === 0) {
        // Insert new
        await supabase.from('budget_categories').insert({
          budget_id: budget.id,
          type: cat.type,
          category: cat.category,
          amount: cat.amount,
          updated_at: new Date().toISOString(),
        });
      } else {
        // Update existing
        await supabase.from('budget_categories').update({
          amount: cat.amount,
          updated_at: new Date().toISOString(),
        }).eq('id', cat.id);
      }
    }
    setBudget({ ...budget, income, needs: needsTotal, wants: wantsTotal, start_date: startDate, end_date: endDate });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading) {
    return <div className="text-black">Loading budget...</div>;
  }
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded shadow p-6 space-y-4">
      {/* Success message */}
      {success && (
        <div className="bg-green-100 text-green-800 rounded px-3 py-2 mb-2">Budget saved successfully!</div>
      )}
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-800 rounded px-3 py-2 mb-2">{error}</div>
      )}
      <div className="flex gap-4">
        <div>
          <label className="block text-black font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="border text-black rounded px-2 py-1 w-full"
            value={startDate}
            onChange={e => { setStartDate(e.target.value); handleEdit(); }}
          />
        </div>
        <div>
          <label className="block text-black font-medium mb-1">End Date</label>
          <input
            type="date"
            className="border text-black rounded px-2 py-1 w-full"
            value={endDate}
            onChange={e => { setEndDate(e.target.value); handleEdit(); }}
          />
        </div>
      </div>
      <div>
        <label className="block text-black font-medium mb-1">Total Income</label>
        <input
          type="number"
          min="0"
          className="border text-black rounded px-2 py-1 w-full"
          value={income}
          onChange={e => { setIncome(Number(e.target.value)); handleEdit(); }}
        />
      </div>
      <div>
        <h3 className="font-semibold text-black mt-4 mb-2">Needs</h3>
        {needsCategories.map((cat, idx) => (
          <div key={cat.category} className="mb-2">
            <label className="block text-black mb-1">{cat.category}</label>
            <input
              type="number"
              min="0"
              className="border text-black rounded px-2 py-1 w-full"
              value={cat.amount}
              onChange={e => { handleCategoryChange('need', idx, Number(e.target.value)); handleEdit(); }}
            />
          </div>
        ))}
        <div className="font-mono text-black">Total Needs: £{needsTotal.toFixed(2)}</div>
      </div>
      <div>
        <h3 className="font-semibold text-black mt-4 mb-2">Wants</h3>
        {wantsCategories.map((cat, idx) => (
          <div key={cat.category} className="mb-2">
            <label className="block text-black mb-1">{cat.category}</label>
            <input
              type="number"
              min="0"
              className="border text-black rounded px-2 py-1 w-full"
              value={cat.amount}
              onChange={e => { handleCategoryChange('want', idx, Number(e.target.value)); handleEdit(); }}
            />
          </div>
        ))}
        <div className="font-mono text-black">Total Wants: £{wantsTotal.toFixed(2)}</div>
      </div>
      <div>
        <label className="block text-black font-medium mb-1 mt-4">Savings (20%)</label>
        <input
          type="number"
          className="border text-black rounded px-2 py-1 w-full bg-gray-100"
          value={savings.toFixed(2)}
          readOnly
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSave}
          disabled={!isValid || saving}
        >
          {saving ? 'Saving...' : 'Save Budget'}
        </button>
        {!isValid && (
          <span className="text-red-600 text-black self-center">Needs + Wants + Savings must equal Income.</span>
        )}
      </div>
      <div className="mt-4">
        <h2 className="font-semibold text-black mb-2">Summary</h2>
        <ul className="space-y-1 text-black">
          <li>Period: <span className="font-mono text-black">{startDate || 'N/A'} to {endDate || 'N/A'}</span></li>
          <li>Income: <span className="font-mono text-black">£{income.toFixed(2)}</span></li>
          <li>Needs: <span className="font-mono text-black">£{needsTotal.toFixed(2)}</span></li>
          <li>Wants: <span className="font-mono text-black">£{wantsTotal.toFixed(2)}</span></li>
          <li>Savings: <span className="font-mono text-black">£{savings.toFixed(2)}</span></li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetPlanner; 