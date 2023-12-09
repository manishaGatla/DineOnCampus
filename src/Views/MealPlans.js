import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/mealPlans.css';


const MealPlans = () => {
  const mealTimes = {
    breakfast: 7,
    lunch: 12,
    dinner: 19,
  };
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [userId, setUserId] = useState('');
  const currentHour = new Date().getHours();
  const currentDate = new Date();
  const formattedDate = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + String(currentDate.getDate()).padStart(2, '0');

  const location = useLocation();

  const [MealPlans, setMealData] = useState([]);

  const handleCopyToNewMealPlan = () => {
    const queryString = `?date=${selectedMealPlan.date}&timeSlot=${selectedMealPlan.TimeSlot.trim()}
        &menu=${encodeURIComponent(JSON.stringify(selectedMealPlan.MenuList))}&price=${selectedMealPlan.price}&startTime=${selectedMealPlan.startTime}`;

    window.location.href = `/adminHome${queryString}`;
  };

  const changeAvaliability = async () => {
    const req = { data: selectedMealPlan._id };
    const response = await fetch('http://localhost:3001/api/update/orderAvaliability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
    if (response.ok) {
      const data = await response.json();
      window.location.href = '/mealPlans';

    }
  }

  
    const convertTo12hrFormat = (time) => {
      const [hours, minutes] = time.split(':');
      const formattedTime = new Date();
      formattedTime.setHours(hours, minutes);
  
      return formattedTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    }

  const handleEditMealPlan = async ()=>{
    const queryString = `?date=${selectedMealPlan.date}&timeSlot=${selectedMealPlan.TimeSlot.trim()}
        &menu=${encodeURIComponent(JSON.stringify(selectedMealPlan.MenuList))}&price=${selectedMealPlan.price}&id=${selectedMealPlan._id}&startTime=${selectedMealPlan.startTime}`;

    window.location.href = `/adminHome${queryString}`;
  }

  const checkDate =(mealPlan)=>{
    if (mealPlan.date > formattedDate || (formattedDate == mealPlan.date && currentHour < mealTimes[mealPlan.TimeSlot])) {
      return false
    } else {
      return true
    }
  }

  const sortedMealPlans = MealPlans.slice().sort((a, b) => {
    // First, sort by date
    const dateComparison = new Date(a.date) - new Date(b.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }

    // If dates are the same, sort by timeslot (breakfast, lunch, dinner)
    const timeSlotOrder = { breakfast: 1, lunch: 2, dinner: 3 };
    return timeSlotOrder[a.TimeSlot] - timeSlotOrder[b.TimeSlot];
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('userId')) {
      setUserId(searchParams.get('userId') || '');
    }
    const fetchMealPlans = async () => {
      try {

        const response = await fetch('http://localhost:3001/api/get/MealPlans');
        const data = await response.json();
        setMealData(data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMealPlans();
  }, []);
  return (
    <section>
      <div>
        <div class="bg-w">
          <Link to="/login">
            <button class="butoon-logout-color button-header mr-l-15">LogOut</button>
          </Link>
          <Link to={`/orders?userId=${userId}&isAdmin=true`}>
            <button class="button-header-color button-header mr-l-15">View All Orders</button>
          </Link>
          <Link to={`/adminHome?userId=${userId}&isAdmin=true`}>
            <button class="button-header-color button-header mr-l-15">Add New Meal Plan</button>
          </Link>
          <Link to={`/profile?userId=${userId}&isAdmin=true`}>
            <button class="button-header-color button-header mr-l-15">Profile Details</button>
          </Link>
        </div>
      </div>
      <section class="container">

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Start Time</th>
              <th>Menu</th>
              <th>Price (In $)</th>
              <th>Create New Plan With Existing</th>
            </tr>
          </thead>
          <tbody>
            {sortedMealPlans.map((mealPlan) => (
              <tr key={mealPlan._id}>
                <td>{mealPlan.date}</td>
                <td>{mealPlan.TimeSlot}</td>
                <td>{convertTo12hrFormat(mealPlan.startTime)}</td>
                <td>{mealPlan.MenuList.map(item => item.itemName).join(',')}</td>
                <td>{mealPlan.price}</td>
                <td> <input id={mealPlan._id}
                  type="radio"
                  name="selectMealPlan"
                  onChange={() => setSelectedMealPlan(mealPlan)}
                />
                  <button disabled={selectedMealPlan !== mealPlan}
                    onClick={handleCopyToNewMealPlan}
                    class="submit-meal-btn margins mr-r-15">
                    Copy to New Plan
                  </button>

                  <button disabled={selectedMealPlan !== mealPlan}
                    onClick={handleEditMealPlan}
                    class="submit-meal-btn margins mr-r-15">
                    Edit Meal Plan
                  </button>
                 
                  <button disabled={selectedMealPlan !== mealPlan || mealPlan.isAvaliable == false || checkDate(mealPlan) }
                    onClick={changeAvaliability}
                    class="submit-meal-btn margins mr-r-15">
                    Disable Avaliability
                  </button></td>
              </tr>
            ))}
          </tbody>
        </table>



      </section>
    </section>


  );
}

export default MealPlans;
