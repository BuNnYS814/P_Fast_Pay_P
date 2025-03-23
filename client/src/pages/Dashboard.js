import React from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';

const Dashboard = () => {
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Transactions',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: '#4CAF50'
      }
    ]
  };
  
  return (
    <div className="dashboard">
      <div className="grid">
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="overview-box">
            <h5>Total Balance</h5>
            <h2>$1,234.56</h2>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="overview-box">
            <h5>Monthly Transactions</h5>
            <h2>24</h2>
          </Card>
        </div>
      </div>
      
      <div className="mt-4">
        <Card>
          <h5>Transaction History</h5>
          <Chart type="line" data={chartData} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 