import { setExpenses } from "@/redux/expenseSlice";
import { EXPENSE_API_END_POINT } from "@/utils/endpoints";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetExpenses = () => {
  const dispatch = useDispatch();
  const { category, markAsDone } = useSelector((store) => store.expense);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(
          `${EXPENSE_API_END_POINT}/getall?category=${category}&done=${markAsDone}`,
          { withCredentials: true },
        );
        // const res = await axios.get(`http://localhost:8000/api/v1/expense/getall?category=${category}&done=${markAsDone}`);
        if (res.data.success) {
          dispatch(setExpenses(res.data.expenses));
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (user) fetchExpenses();
  }, [dispatch, category, markAsDone, user]);
};
export default useGetExpenses;
