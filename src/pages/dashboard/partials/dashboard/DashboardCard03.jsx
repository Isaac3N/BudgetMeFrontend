import React, {useEffect, useState} from 'react';

import axiosInstance from '../../../../helpers/axios';
import Chart from "chart.js/auto";
import moment from 'moment'
import { Line } from "react-chartjs-2";

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard01() {
  const [totalIncome, setTotalIncome] = useState([])
  const [totalExpenses, setTotalExpenses] = useState([])
  const [income, setIncome] = useState([])
  const [expense, setExpense] = useState([])

  useEffect(()=> {
    axiosInstance.get("/income/")
    .then((res)=> {
        setIncome(res.data)
    }).catch(()=> {
        console.log("Something Went Wrong")
    })
  }, [])
  
  useEffect(()=> {
    axiosInstance.get("/stats/total-income/")
    .then((res)=> {
        setTotalIncome(res.data)
    }).catch(()=> {
        console.log("Something Went Wrong")
    })
  }, [])

  useEffect(()=> {
    axiosInstance.get("/stats/total-expense/")
    .then((res)=> {
        setTotalExpenses(res.data)
    }).catch(()=> {
        console.log("Something Went Wrong")
    })
  }, [])

  useEffect(()=> {
    axiosInstance.get("/expense/")
    .then((res)=> {
        setExpense(res.data)
    }).catch(()=> {
        console.log("Something Went Wrong")
    })
  }, [])

  const expense_date = expense.map(a=> 
    moment(a.date).format('DD-MM-YYYY')
  )
  const income_date = income.map(a=> 
    moment(a.date).format('DD-MM-YYYY')
  )

  const expense_amount = expense.map(a=> a.amount)
  const income_amount = income.map(a=> a.amount)

  const x = Math.round(((totalIncome.amount__sum) - (totalExpenses.amount__sum))/(totalIncome.amount__sum))
  console.log("x", x)

 

  const chartData = {
    labels: [income_date, expense_date],
    datasets: [
      {
        label: 'income',
        data: income_amount,
        fill: true,
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.green[400])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.green[400],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.green[500],
        clip: 20,
      },
      // Expense Line
      {
        label:'expenses',
        data: expense_amount,
        borderColor: tailwindConfig().theme.colors.red[300],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.red[300],
        clip: 20,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
      <div className="px-5 pt-5">

        <h2 className="text-lg font-semibold text-slate-800 mb-2">My Net Worth</h2>

        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 mr-2">#{(totalIncome.amount__sum)- (totalExpenses.amount__sum)}</div>
          <div className="text-sm font-semibold text-white px-1.5 bg-gray-600 rounded-full">%{x}</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        <Line data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default DashboardCard01;
