import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure you have axios installed for API calls
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import './Transaction.css';

export default function Transaction() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [receiverUpi, setReceiverUpi] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [balance, setBalance] = useState(0);
    const [transactionType, setTransactionType] = useState('deposit');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user data and transactions on component mount
    useEffect(() => {
        const fetchUserAndTransactions = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    setUser(storedUser);
                    fetchTransactions(storedUser.upi_id);
                    fetchBalance(storedUser.upi_id);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserAndTransactions();
    }, []);

    // Fetch transactions for a given UPI ID
    const fetchTransactions = async (upi_id) => {
        try {
            const response = await axios.get(`/api/transactions/${upi_id}`);
            setTransactions(response.data);
            setBalance(response.data.balance);
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
            setLoading(false);
        }
    };

    const fetchBalance = async (upi_id) => {
        try {
            const response = await axios.get(`/api/user/${upi_id}`);
            setUser(response.data);
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    // Handle transaction
    const handleTransaction = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        try {
            const response = await axios.post('/api/transaction', {
                sender_upi_id: user.upi_id,
                receiver_upi_id: receiverUpi,
                amount: parseFloat(amount),
                type: transactionType,
                description
            });
            setMessage(response.data.message);
            if (response.status === 200) {
                // Refresh transactions and user balance
                fetchTransactions(user.upi_id);
                fetchBalance(user.upi_id);
                setAmount('');
                setReceiverUpi('');
                setDescription('');
            }
        } catch (error) {
            console.error('Error making transaction:', error);
            setError('Transaction failed.');
        }
    };

    return (
        <Container className="transaction-page">
            <Row>
                <Col md={4}>
                    <Card className="balance-card">
                        <Card.Body>
                            <Card.Title>Current Balance</Card.Title>
                            <Card.Text className="balance-amount">
                                ${balance.toFixed(2)}
                                <span className="currency">USD</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="transaction-form-card">
                        <Card.Body>
                            <Card.Title>New Transaction</Card.Title>
                            {error && <div className="alert alert-danger fade-in">{error}</div>}
                            {success && <div className="alert alert-success fade-in">{success}</div>}
                            <Form onSubmit={handleTransaction} className="modern-form">
                                <Form.Group className="mb-3">
                                    <Form.Label>Transaction Type</Form.Label>
                                    <Form.Select
                                        value={transactionType}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                    >
                                        <option value="deposit">Deposit</option>
                                        <option value="withdraw">Withdraw</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter description"
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="submit-button">
                                    Submit Transaction
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="chart-card">
                        <Card.Body>
                            <Card.Title>Transaction History</Card.Title>
                            <div className="chart-container">
                                <LineChart width={600} height={300} data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                                </LineChart>
            </div>
                        </Card.Body>
                    </Card>

                    <Card className="transactions-table-card">
                        <Card.Body>
                            <Card.Title>Recent Transactions</Card.Title>
                            <div className="table-responsive">
                                <Table className="modern-table">
                    <thead>
                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                            <th>Amount</th>
                                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                                <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                                                <td>{transaction.type}</td>
                                                <td>${transaction.amount.toFixed(2)}</td>
                                                <td>{transaction.description}</td>
                            </tr>
                        ))}
                    </tbody>
                                </Table>
            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
