
import BudgetPlanner from '../../components/BudgetPlanner';
import Link from 'next/link'
export default function BudgetPlannerPage() {
  return (
    <main className="max-w-xl mx-auto p-4">
      <Link href="/" className='text-black mb-6 border'>
        - Back home
      </Link>
      <h1 className="text-2xl font-bold mt-6 mb-4 text-black">Budget Planner</h1>
      <BudgetPlanner />
    </main>
  );
} 