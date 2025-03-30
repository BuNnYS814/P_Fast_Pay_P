import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure you have axios installed for API calls
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import './Transaction.css';
import './transation.css';  // Make sure this import exists

export default function Transaction() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [receiverUpi, setReceiverUpi] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [balance, setBalance] = useState(0);
    const [transactionType, setTransactionType] = useState('Deposit');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user data and transactions on component mount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log('Retrieved user data:', userData); // Debug log
        if (userData) {
            setUser(userData);
            setBalance(Number(userData.balance) || 0);
            fetchBalance(userData.upi_id);
            fetchTransactions(userData.upi_id);
        }
    }, []);

    // Fetch transactions for a given UPI ID
    const fetchTransactions = async (upi_id) => {
        try {
            const response = await axios.get(`/api/transactions/${upi_id}`);
            setTransactions(response.data || []);
            setBalance(response.data.balance || 0);
            setLoading(false);

            // Prepare data for chart
            const chartData = response.data.map(transaction => ({
                date: new Date(transaction.timestamp).toLocaleDateString(),
                amount: transaction.type === 'deposit' ? transaction.amount : -transaction.amount
            }));
            setChartData(chartData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to fetch transactions');
            setTransactions([]);
            setLoading(false);
        }
    };

    const fetchBalance = async (upi_id) => {
        try {
            const response = await axios.get(`/api/balance/${upi_id}`);
            if (response.data && typeof response.data.balance === 'number') {
                const newBalance = response.data.balance;
                setBalance(newBalance);
                
                // Update localStorage with new balance
                const userData = JSON.parse(localStorage.getItem('user'));
                localStorage.setItem('user', JSON.stringify({
                    ...userData,
                    balance: newBalance
                }));
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    // Handle transaction
    const handleTransaction = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/transaction', {
                sender_upi_id: user.upi_id,
                amount: parseFloat(amount),
                type: transactionType,
                description
            });

            if (response.data.success) {
                const newBalance = response.data.balance;
                setBalance(newBalance);
                
                // Update localStorage with new balance
                const userData = JSON.parse(localStorage.getItem('user'));
                localStorage.setItem('user', JSON.stringify({
                    ...userData,
                    balance: newBalance
                }));

                fetchTransactions(user.upi_id);
                setAmount('');
                setDescription('');
                setSuccess('Transaction successful!');
            }
        } catch (error) {
            setError('Transaction failed');
        }
    };

    // Display balance with proper formatting
    const displayBalance = () => {
        return `₹${(balance || 0).toFixed(2)} INR`;
    };

    // Update the transaction display
    const renderTransactions = () => {
        return transactions.map((transaction, index) => (
            <tr key={index}>
                <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                <td>{transaction.type}</td>
                <td>₹{transaction.amount.toFixed(2)}</td>
                <td>{transaction.description}</td>
            </tr>
        ));
    };

    // Prepare data for graph
    const graphData = transactions.map(t => ({
        date: new Date(t.date).toLocaleDateString(),
        amount: t.type === 'Deposit' ? t.amount : -t.amount
    }));

    return (
        <div>
            <div className="user-header">
                <div className="user-info">
                    <span>Welcome, {user?.name}</span>
                    <span>{user?.email}</span>
                </div>
            </div>

            <div className="current-balance">
                <h2>Current Balance</h2>
                <h3>₹{balance.toFixed(2)} INR</h3>
            </div>

            <div className="dashboard-container">
                <div className="left-panel">
                    <div className="current-balance">
                        <h2>Current Balance</h2>
                        <h3>₹{balance.toFixed(2)} INR</h3>
                    </div>

                    <div className="new-transaction">
                        <h3>New Transaction</h3>
                        {success && <div className="success-message">{success}</div>}
                        {error && <div className="error-message">{error}</div>}
                        
                        <div>
                            <label>Transaction Type</label>
                            <select 
                                        value={transactionType}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                    >
                                <option value="Deposit">Deposit</option>
                                <option value="Withdrawal">Withdrawal</option>
                            </select>
                        </div>

                        <div>
                            <label>Amount</label>
                            <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                    />
                        </div>

                        <div>
                            <label>Description</label>
                            <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter description"
                                    />
                        </div>

                        <button onClick={handleTransaction}>Submit Transaction</button>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="transaction-history">
                        <h2>Transaction History</h2>
                        <LineChart width={600} height={300} data={graphData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${Math.abs(value)}`} />
                                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                                </LineChart>
            </div>
                </div>
            </div>

            <div className="recent-transactions">
                <h3>Recent Transactions</h3>
                <table>
                    <thead>
                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                            <th>Amount</th>
                                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                                <td>{transaction.type}</td>
                                                <td>₹{transaction.amount.toFixed(2)}</td>
                                                <td>{transaction.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
    );
}
