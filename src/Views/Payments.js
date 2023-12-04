import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Payments = () => {
    const [cardType, setCardType] = useState('');
    const [userId, setUserId] = useState('');
    const [useWalletBalance, setUseWalletBalance] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [balance, setBalance] = useState(0);
    const [adminAccBalance, setAdminAccBalance] = useState(0);
    const [walletId, setWalletId] = useState(0);
    const [mealPlanSelected, setSelectedMealPlan] = useState(null);
    const [numberOfPersons, setNumberOfPersons] = useState(1);
    const location = useLocation();

    useEffect(() => {

        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('userId')) {
            getWalletBalance(searchParams.get('userId'));
            getAdminBalance();
            setUserId(searchParams.get('userId') || '');
            const selectedPlan = searchParams.get('selectedMeal');
            const decodedMenuListString = decodeURIComponent(selectedPlan);
            const list = JSON.parse(decodedMenuListString);
            setNumberOfPersons(searchParams.get('numberOfPersons') || 1);
            setSelectedMealPlan(list);
        }

    }, [location.search]);


    const handlePayment = async () => {
        try {
            const searchParams = new URLSearchParams(location.search);
            if (mealPlanSelected && numberOfPersons) {
                const req = {
                    mealPlanId: mealPlanSelected._id,
                    numberOfPersons: numberOfPersons,
                    pricePerPerson: mealPlanSelected.price,
                    total: mealPlanSelected.price * numberOfPersons,
                    userId: searchParams.get('userId'),
                    TimeSlot: mealPlanSelected.TimeSlot,
                    date: mealPlanSelected.date,
                    status: "Order Placed"
                }
                const response = await fetch('http://localhost:3001/api/Add/Orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                });

                if (response.ok) {
                    const result = await response.json();
                    const reqPayments = {
                        orderId: result.insertedId,
                        amount: mealPlanSelected.price * numberOfPersons,
                        userId: searchParams.get('userId'),
                        paymentMethod: cardType,
                        cardHolderName: cardHolderName,
                        cardNumber: cardNumber,
                        securityCode: securityCode,
                        IsPaidByWallet: useWalletBalance,
                        WalletId: walletId,
                        date: mealPlanSelected.date
                    }
                    const payresponse = await fetch('http://localhost:3001/api/paymentDetails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(reqPayments),
                    });
                    if (payresponse.ok) {
                        const payresult = await payresponse.json();
                        if (useWalletBalance) {
                            const reqb = { balance: parseInt(balance - (parseInt(mealPlanSelected.price) * parseInt(numberOfPersons))), id: walletId }
                            const walletresponse = await fetch('http://localhost:3001/api/update/WalletById', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(reqb),
                            });
                            if (walletresponse.ok) {
                                const resWall = await walletresponse.json();
                                window.location.href = '/orders?userId=' + searchParams.get('userId');
                            }
                            window.location.href = '/orders?userId=' + searchParams.get('userId') + '&isAdmin=false';
                        }

                        const reqForAcc = { balance: parseInt(adminAccBalance + (parseInt(mealPlanSelected.price) * parseInt(numberOfPersons))) }
                            const accresponse = await fetch('http://localhost:3001/api/update/AdminAccount', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(reqForAcc),
                            });
                            if (accresponse.ok) {
                                const resAccBal = await accresponse.json();
                                window.location.href = '/orders?userId=' + searchParams.get('userId');
                            }
                        window.location.href = '/orders?userId=' + searchParams.get('userId') + '&isAdmin=false';

                    }


                }
            }
        }
        catch (error) {
            console.error('Error Booking:', error);
        }
    };


    const getWalletBalance = async (id) => {
        try {
            const response = await fetch('http://localhost:3001/api/get/WalletById?id=' + id);
            const data = await response.json();
            setBalance(parseInt(data[0].Balance));
            setWalletId(data[0]._id);
        }
        catch (error) {
            console.error('Error fetching Balance:', error);
        }
    }

    const getAdminBalance = async (id) => {
        try {
            const response = await fetch('http://localhost:3001/api/get/AministratorBal');
            const data = await response.json();
            setAdminAccBalance(parseInt(data[0].balance));
        }
        catch (error) {
            console.error('Error fetching Balance:', error);
        }
    }


    return (
        <section>
            <div class="bg-w">
                <Link to="/login">
                    <button class="butoon-logout-color button-header mr-l-15">LogOut</button>
                </Link>
                <Link to={`/orders?userId=${userId}&isAdmin=false`}>
                    <button class="button-header-color button-header mr-l-15">View My Orders</button>
                </Link>

            </div>
            <section class="container">
                <div class="mr-l-429">
                    <h2 class="c-w">Enter Payment Details</h2>

                    <label class="mr-r-15 margins label-style-register">
                        <input class="mr-r-15 checkbox-style"
                            type="checkbox"
                            checked={useWalletBalance}
                            onChange={() => setUseWalletBalance(!useWalletBalance)}
                        />
                        Use Wallet Balance
                    </label>





                    {!useWalletBalance && (
                        <div class="margins">
                            <div class="mr-r-15  margins ">
                                <label class="mr-r-15 margins label-style-register">
                                    Card Type:
                                    <select value={cardType} class=" mr-l-90 mr-r-15 select-style" onChange={(e) => setCardType(e.target.value)}>
                                        <option value="">Select Card Type</option>
                                        <option value="visa">Visa</option>
                                        <option value="mastercard">MasterCard</option>
                                        {/* Add other card types as needed */}
                                    </select>
                                </label>
                            </div>

                            <div class="mr-r-15  margins ">

                                <label class="mr-r-15  margins label-style-register">
                                    Card Number:
                                    <input class="mr-r-15  mr-l-61 select-style"
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div class="mr-r-15  margins ">
                                <label class="mr-r-15 margins label-style-register">
                                    Card Holder Name:
                                    <input class="mr-r-15  mr-l-15 select-style"
                                        type="text"
                                        value={cardHolderName}
                                        onChange={(e) => setCardHolderName(e.target.value)}
                                    />
                                </label>

                            </div>
                            <div class="mr-r-15  margins ">
                                <label class="mr-r-15 margins label-style-register">
                                    Security Code:
                                    <input class="mr-r-15 mr-l-53 select-style"
                                        type="text"
                                        value={securityCode}
                                        onChange={(e) => setSecurityCode(e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>
                    )}

                    <br />

                    <button class="mr-t-20 submit-meal-btn mr-l-15" onClick={handlePayment}>Submit Payment</button>
                </div>


            </section>
        </section>
    );
};

export default Payments;
