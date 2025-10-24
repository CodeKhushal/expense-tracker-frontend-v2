import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import { Edit2, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses, setSingleExpense } from "@/redux/expenseSlice";
import {EXPENSE_API_END_POINT } from '@/utils/endpoints'

const UpdateExpense = ({ expense }) => {
  const { expenses, singleExpense } = useSelector((store) => store.expense);
  const [formData, setFormData] = useState({
    description: singleExpense?.description,
    amount: singleExpense?.amount,
    category: singleExpense?.category,
  });

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormData({
      description: singleExpense?.description,
      amount: singleExpense?.amount,
      category: singleExpense?.category,
    });
  }, [singleExpense]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const changeCategoryHandler = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      category: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      setLoading(true);
      const res = await axios.put(
        `${EXPENSE_API_END_POINT}/update/${expense._id}`,
        // const res = await axios.put(
        //   `http://localhost:8000/api/v1/expense/update/${expense._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedExpenses = expenses.map((exp) =>
          exp._id === expense._id ? res.data.expense : exp
        );
        dispatch(setExpenses(updatedExpenses));
        toast.success(res.data.message);
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data?.message || "Failed to update expense");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            dispatch(setSingleExpense(expense));
            setIsOpen(false);
          }}
          size="icon"
          className="rounded-full text-white bg-black hover:bg-transparent hover:text-black"
          variant="danger"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Expense</DialogTitle>
          <DialogDescription>
            Update your expense here. Click update when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4 ">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Enter description"
                className="col-span-3"
                name="description"
                value={formData.description}
                onChange={changeEventHandler}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                className="col-span-3"
                name="amount"
                value={formData.amount}
                onChange={changeEventHandler}
                required
              />
            </div>
            <div className="flex justify-center">
              <Select
                value={formData.category}
                onValueChange={changeCategoryHandler}
                required
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="bills">Bills</SelectItem>
                    <SelectItem value="emi">EMI</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4">
                Updating...
                <Loader2 className="mr-2 h-4 animate-spin" />
              </Button>
            ) : (
              <Button type="submit">Update</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateExpense;
