
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from '../images/images.jpg';
import { Link, useLocation } from 'react-router-dom';

const Orders = () => {

  const mealTimes = {
    breakfast: 7,
    lunch: 12,
    dinner: 19,
  };
  const [mealTime, setMealTime] = useState('lunch');
  const [showEditOrder, setEditOrder] = useState(false);
  const location = useLocation();
  const [Orders, setOrderData] = useState([]);
  const [userId, setUserId] = useState([]);
  const [walletId, setWalletId] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();
  const currentHour = new Date().getHours();
  const currentDate = new Date();
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [isRejectBtnClicked, setisRejectBtnClicked] = useState(false);
  const [reason, setReason] = useState(null);
  const formattedDate = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + String(currentDate.getDate()).padStart(2, '0');

  useEffect(() => {

    const searchParams = new URLSearchParams(location.search);
    setIsAdmin(searchParams.get('isAdmin'));
    getWalletBalance(searchParams.get('userId'));

    const fetchOrders = async () => {
      try {
        setSelectedOrders([]);
        const url = searchParams.get('isAdmin') == "false" ? 'http://localhost:3001/api/get/OrderByUserId?id=' + searchParams.get('userId') : 'http://localhost:3001/api/get/Orders';
        setUserId(searchParams.get('userId') || '');
        const response = await fetch(url);
        const data = await response.json();
        data.forEach((item) => {
          if ((item.date > formattedDate || (formattedDate == item.date && currentHour + 1 <= mealTimes[item.TimeSlot])) && item.status == 'Order Placed') {
            item.isCancellable = true
          } else {
            item.isCancellable = false
          }
        })

        setOrderData(data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleRejectSelectedOrder = async(order) =>{
    setSelectedOrder(order);
    setisRejectBtnClicked(true);
  }

  const addSelectedOrder = async (data, event) => {
    if (event.target.checked) {
      const updatedOrders = [...selectedOrders, data._id];
      setSelectedOrders(updatedOrders);

    }
    else {
      setSelectedOrders(selectedOrders.filter(c => c !== data._id));
    }
  }

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


  const fetchOrders = async () => {
    try {
      setSelectedOrders([]);
      const searchParams = new URLSearchParams(location.search);
      const url = !searchParams.get('isAdmin') ? 'http://localhost:3001/api/get/OrderByUserId?id=' + searchParams.get('userId') : 'http://localhost:3001/api/get/Orders';
      setUserId(searchParams.get('userId') || '');
      const response = await fetch(url);
      const data = await response.json();
      setOrderData(data);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  }

  const checkdisable = () => {
    return selectedOrders.length == 0 ? true : false
  }

  const handleEditOrder = () =>{
    setEditOrder(true);
    setNumberOfPersons(selectedOrder.numberOfPersons);
  }

  const handleCancelMealPlan = async () => {
    const searchParams = new URLSearchParams(location.search);
    const req = { data: selectedOrders };
    const response = await fetch('http://localhost:3001/api/update/orderStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
    if (response.ok) {
      const data = await response.json();
      const req = { userId: userId, Balance: balance + selectedOrders.reduce((acc, item) => acc + item.balance, 0)}
          const responsewa = await fetch('http://localhost:3001/api/update/WalletByUserId', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
          });
          setReason(null);
  setSelectedOrder(null);
  setSelectedOrders([]);
      window.location.href = '/orders?userId=' + searchParams.get('userId') + '&isAdmin=false';

    }
  };

  const handleApproveOrder = async (order) => {
    const searchParams = new URLSearchParams(location.search);
    const req = { data: [order._id], status: "Approved" };
    const response = await fetch('http://localhost:3001/api/update/orderStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
    if (response.ok) {
      const data = await response.json();    
      setReason(null);
  setSelectedOrder(null);
  setSelectedOrders([]);
      window.location.href = '/orders?userId=' + searchParams.get('userId') + '&isAdmin=true';

    }
  };

  const cancelReject = async ()=>{
    setisRejectBtnClicked(false);
    setSelectedOrder(null);
    setReason(null);
  }


  const handleRejectOrder = async () => {
    const searchParams = new URLSearchParams(location.search);
    const req = { data: [selectedOrder._id], status: "Rejected", reason : reason };
    const response = await fetch('http://localhost:3001/api/update/orderStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
    if (response.ok) {
      const data = await response.json();  
      const req = { userId: userId, Balance: balance + selectedOrder.total}
      const responseWal = await fetch('http://localhost:3001/api/update/WalletByUserId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
  });  

  setReason(null);
  setSelectedOrder(null);
  setSelectedOrders([]);
      window.location.href = '/orders?userId=' + searchParams.get('userId') + '&isAdmin=true';

    }
  };

  


  return (
    <section>
      <div class=" bg-w">
        <Link to="/login">
          <button class="butoon-logout-color button-header mr-l-15">Log Out</button>
        </Link>
        <Link to={`/profile?userId=${userId}&isAdmin=${isAdmin}`}>
          <button class="button-header-color button-header mr-l-15">Profile Details</button>
        </Link>
        {isAdmin == "false" &&
          <Link to={`/userHome?userId=${userId}`}>
            <button class="button-header-color button-header mr-l-15">Go to Search Page</button>
          </Link>
        }
        {isAdmin == "true" &&
          <Link to={`/mealPlans?userId=${userId}`}>
            <button class="button-header-color button-header mr-l-15">Meal Plans</button>
          </Link>

        }
        {isAdmin == "true" &&
          <Link to={`/adminHome?userId=${userId}`}>
            <button class="button-header-color button-header mr-l-15">Add New Meal Plan</button>
          </Link>
        }
      </div>


      <section class="container">

        <table>
          <thead>
            <tr >
              <th>Date</th>
              <th>Time Slot</th>
              <th>Amount (In $)</th>
              <th>
                Number of Persons
              </th>
              <th>
                Order status
              </th>
              <th>
                Reason for reject
              </th>
              {isAdmin == "true" && <th>
                Action
              </th>}
             
              {isAdmin == "false" && <th>
                Cancel Order
              </th>}
              
            </tr>
          </thead>
          <tbody>
            {Orders.map((order) => (
              <tr key={order._id} >
                <td>{order.date}</td>
                <td>{order.TimeSlot}</td>
                <td>{order.total}</td>
               <td>{order.numberOfPersons}</td>
               <td>{order.status}</td>
               <td>{order.reason}</td>
                {isAdmin == "false" && <td>
                  <input id={order._id}
                    value={order._id}
                    class="checkbox-style"
                    type="checkbox"
                    name="order"
                    disabled={!order.isCancellable}
                    //checked={selectedOrders.includes(order._id)}
                    onChange={(event) => addSelectedOrder(order, event)}
                  />

                </td>}

                {isAdmin == "true" && <div>
          <td><button type="submit" class="cancel-order-btn mr-l-15 margins" disabled={order.status !== 'Order Placed'} onClick={(event)=> handleApproveOrder(order,event)} >
            Approve Order
          </button>
          <button type="submit" class="cancel-order-btn mr-l-15 margins" disabled={order.status !== 'Order Placed'} onClick={(event)=> handleRejectSelectedOrder(order,event)} >
           Reject Order
          </button></td>
        </div>}
              </tr>
            ))}
          </tbody>
        </table>

        
        {isAdmin == "true" &&  isRejectBtnClicked && <div class="margins mr-l-450">
        <label class="mr-r-15  margins label-style-register">
                                   Reason for Refusing the order:
                                    <input class="mr-r-15  mr-l-61 select-style"
                                        type="text"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </label>
          </div>}

        {isAdmin == "true" && isRejectBtnClicked && <div>
          <button type="submit" class="cancel-order-btn margins mr-l-15"  onClick={handleRejectOrder} >
            Confirm Reject Order
          </button>
          <button type="submit" class="cancel-order-btn margins mr-l-15"  onClick={cancelReject} >
            Back
          </button>
        </div>}
        

        {isAdmin == "false" && <div>
          <button type="submit" class="cancel-order-btn margins mr-l-15" disabled={selectedOrders && selectedOrders.length <= 0} onClick={handleCancelMealPlan} >
            Cancel Selected Order(s)
          </button>
        </div>}


      </section>
    </section>

  );
}

export default Orders;
