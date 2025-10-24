import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import UpdateExpense from "./UpdateExpense";
import axios from "axios";
import { toast } from "sonner";
import {EXPENSE_API_END_POINT } from '@/utils/endpoints'

const ExpenseTable = () => {
  const { expenses } = useSelector((store) => store.expense);
  const [localExpense, setLocalExpense] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    setLocalExpense(expenses);
  }, [expenses]);

  const removeExpenseHandler = async (expenseId) => {
    try {
      const res = await axios.delete(
        // `http://localhost:8000/api/v1/expense/remove/${expenseId}`
        `${EXPENSE_API_END_POINT}/remove/${expenseId}`
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // update local state
        const filteredExpenses = localExpense.filter(
          (expense) => expense._id !== expenseId
        );
        setLocalExpense(filteredExpenses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = async (expenseId) => {
    const newStatus = !checkedItems[expenseId];
    try {
      const res = await axios.put(
        // `http://localhost:8000/api/v1/expense/${expenseId}/done`,
        `${EXPENSE_API_END_POINT}/${expenseId}/done`,
        { done: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setCheckedItems((prevData) => ({
          ...prevData,
          [expenseId]: newStatus,
        }));
        // optionally update the local state for expense id the entire object needs update
        setLocalExpense(
          localExpense.map((exp) =>
            exp._id === expenseId ? { ...exp, done: newStatus } : exp
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const totalAmount = localExpense.reduce((sum, expense) => {
    if (!expense.done) return sum + expense.amount;
    return sum;
  }, 0);

  return (
    <Table>
      <TableCaption>A list of your expenses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px] text-center">Mark As Done</TableHead>
          <TableHead className="text-center">Description</TableHead>
          <TableHead className="text-center">Category</TableHead>
          <TableHead className="text-center">Date</TableHead>
          <TableHead className="text-center">Amount</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {localExpense.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              <span>Add your first expense here</span>
            </TableCell>
          </TableRow>
        ) : (
          localExpense?.map((expense) => (
            <TableRow key={expense._id}>
              <TableCell className="font-medium text-center">
                <Checkbox
                  checked={expense.done}
                  onCheckedChange={() => handleCheckboxChange(expense._id)}
                />
              </TableCell>
              <TableCell
                className={`text-center ${expense.done ? "line-through" : ""}`}
              >
                {expense.description}
              </TableCell>
              <TableCell
                className={`text-center ${expense.done ? "line-through" : ""}`}
              >
                {expense.category}
              </TableCell>
              <TableCell
                className={`text-center ${expense.done ? "line-through" : ""}`}
              >
                {expense.createdAt?.split("T")[0]}
              </TableCell>
              <TableCell
                className={`text-center ${expense.done ? "line-through" : ""}`}
              >
                {expense.amount}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="icon"
                    className="rounded-full text-white bg-red-600 hover:bg-transparent hover:text-black"
                    variant="danger"
                    onClick={() => removeExpenseHandler(expense._id)}
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                  <UpdateExpense expense={expense} />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow className="bg-white">
          <TableCell colSpan={4} className="font-bold text-l text-end">
            Total
          </TableCell>
          <TableCell className="text-center font-bold text-l">
            {totalAmount.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ExpenseTable;
