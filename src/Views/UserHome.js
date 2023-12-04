import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/login.css';

const UserHome = () => {
  const location = useLocation();
  const mealTimes = {
    breakfast: 7,
    lunch: 12,
    dinner: 19,
  };
  //const showErrorMsg : Boolean =  false;
  const [isNoData, setIsNoData] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState('');
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [balance, setBalance] = useState(null);
  const [userId, setUserId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const currentHour = new Date().getHours();
  const currentDate = new Date();
  const formattedDate = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + String(currentDate.getDate()).padStart(2, '0');

  useEffect(() => {
    setIsNoData(false);
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('userId')) {
      setUserId(searchParams.get('userId') || '');
    }

  }, [location.search]);

  const fetchMealPlans = async (date) => {
    setIsNoData(false);
    setSelectedMealPlan(null);
    setNumberOfPersons(1);
    try {
      const response = await fetch('http://localhost:3001/api/get/MealPlansById?date=' + date);//+'&isFilter= true');
      const data = await response.json();
      data.forEach((item) => {
        if (item.date > formattedDate || (formattedDate == item.date && currentHour < mealTimes[item.TimeSlot])) {
          item.canMealPlanExpired = false
        } else {
          item.canMealPlanExpired = true
        }
      })
      // data = data.filter(c=> c.isAvaliable != false);
      setIsNoData(data.length == 0 ? true : false) //setIsShowErrorMsg(data.length == 0 ? true: false);
      setMealPlans(data.filter(c => c.isAvaliable != false));
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const fetchAllMealPlans = async () => {
    setSelectedDate('');
    setSelectedMealPlan(null);
    setNumberOfPersons(1);
    setIsNoData(false);//setIsShowErrorMsg(false);
    try {
      const response = await fetch('http://localhost:3001/api/get/MealPlans');
      const data = await response.json();
      data.forEach((item) => {
        if (item.date > formattedDate || (formattedDate == item.date && currentHour < mealTimes[item.TimeSlot])) {
          item.canMealPlanExpired = false
        } else {
          item.canMealPlanExpired = true
        }
      })
      // data = data.filter(c=> c.isAvaliable != false);
      setIsNoData(data.length == 0 ? true : false) //setIsShowErrorMsg(data.length ==0 ? true: false);
      setMealPlans(data.filter(c => c.isAvaliable != false));

    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  }

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    fetchMealPlans(event.target.value);
  };

  const handleMealPlanSelect = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
  };

  const handleBookMealPlan = async () => {
    try {
      const mealPlan = JSON.stringify(selectedMealPlan);
      const searchParams = new URLSearchParams(location.search);
      const queryString = `?userId=${searchParams.get('userId')}&numberOfPersons=${numberOfPersons}&selectedMeal=${mealPlan}`;
      window.location.href = '/payment' + queryString;
    }
    catch (error) {
      console.error('Error Booking:', error);
    }
  };



  return (
    <section>
      <div class="">
        <Link to="/login">
          <button class="butoon-logout-color button-header mr-l-15">LogOut</button>
        </Link>
        <Link to={`/orders?userId=${userId}&isAdmin=false`}>
          <button class="button-header-color button-header mr-l-15">View My Orders</button>
        </Link>
        <Link to={`/profile?userId=${userId}`}>
          <button class="button-header-color button-header mr-l-15">Profile Details</button>
        </Link>
      </div>

      <div class="container">
        <div class="mr-l-400">
          <div class="c-g  mr-l-180">
            <div class="margins">Breakfast starts at 7:00AM</div>
            <div class="margins">Lunch starts at 12:00PM</div>
            <div class="margins">Dinner starts at 7:00PM</div>
          </div>
          <h2 class="c-w">
            Select Date to search for the meal plans
          </h2>
          <label class="label-style-register c-w">Select Date:</label>
          <input type="date" class="select-style" min={today} value={selectedDate} onChange={handleDateChange} />
          <h2 class="c-w">Or</h2>
          <h2 class="c-w">Search All Meal plans</h2>
          <label class="label-style-register c-w"> Search All Plans</label>
          <button onClick={fetchAllMealPlans} class="login-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

         

        </div>
        {mealPlans && mealPlans.length > 0 && (
          <div>
            <h3 class="c-w">Available Meal Plans</h3>
            <table>
              {/* Table headers */}
              <thead>
                <tr>
                  <th>Price (In $)</th>
                  <th>Date</th>
                  <th>Menu List</th>
                  <th>Time Slot</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {mealPlans && mealPlans.length > 0 && mealPlans.map((mealPlan) => (
                  <tr key={mealPlan.id} style={selectedMealPlan === mealPlan ? { backgroundColor: '#a7a2a2' } : {}}>
                    <td>{mealPlan.price}</td>
                    <td>{mealPlan.date}</td>
                    <td>{mealPlan.MenuList.map(item => item.name).join(',')}</td>
                    <td>{mealPlan.TimeSlot}</td>
                    <td>
                      <button onClick={() => handleMealPlanSelect(mealPlan)} disabled={mealPlan.canMealPlanExpired} class="login-btn">
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isNoData && (
          <div class="warning-style">
            <label class="warning-style  bold">
              No Meal plans to show for the date selected
            </label>
          </div>
        )

        }

        {/* Booking form */}
        {selectedMealPlan && (
          <div>
            <h3 class="c-w">Book Meal Plan</h3>
            <label class="c-w">Number of Persons:</label>
            <input class="mr-r-15 mr-l-23 select-style"
              type="number"
              value={numberOfPersons}
              onChange={(e) => setNumberOfPersons(e.target.value)}
            />
            <button onClick={handleBookMealPlan} class="login-btn">Book Now</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserHome;
