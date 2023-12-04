import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/login.css';

const AdminHome = () => {
  const [selectedMenu, setSelectedMenu] = useState([]);
  const location = useLocation();
  const [isAddPlanClicked, setisAddPlanClicked] = useState(true);
  const [Menu, setMenuData] = useState([]);
  const [price, setPrice] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [userId, setUserId] = useState('');
  const [date, setdate] = useState(Date);
  const [previousMealPlanId, setMealPlanId] = useState(null);
  useEffect(() => {

    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('date')) {
      setisAddPlanClicked(true);
    }
    setUserId(searchParams.get('userId'));
    setdate(searchParams.get('date') || '');
    setTimeSlot(searchParams.get('timeSlot') || '');
    if (searchParams.get('id')) {
      setMealPlanId(searchParams.get('id'));
    }
    const menuListString = searchParams.get('menu');

    if (menuListString) {
      const decodedMenuListString = decodeURIComponent(menuListString);
      const list = JSON.parse(decodedMenuListString);
      list.map((item) => {
        setSelectedMenu((prevMenu) => [...prevMenu, item]);
      })
    }
    setPrice(searchParams.get('price') || '');
  }, [location.search]);


  useEffect(() => {
    const fetchMenuData = async () => {
      try {

        const response = await fetch('http://localhost:3001/api/get/Menu');
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMenuData();
  }, []);



  const handleOnAddPlan = () => {
    setdate('');
    setTimeSlot('');
    setSelectedMenu([]);
    setPrice('');
    setisAddPlanClicked(true);
  }

  const handleDropdownChange = (event) => {
    setTimeSlot(event.target.value);
  };

  const handleSubmit = async (event) => {
    if(previousMealPlanId != null){
      const searchParams = new URLSearchParams(location.search);
      event.preventDefault();
      const data = {
        planName: "Buffet",
        TimeSlot: timeSlot,
        date: date,
        MenuList: selectedMenu,
        price: price,
        isAvaliable: true
      }

      const req = { details: data }
      const response = await fetch('http://localhost:3001/api/Update/MealPlan?id='+ previousMealPlanId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });
      if (response.ok) {
        const data = await response.json();
        window.location.href = "./adminHome?userId=" + searchParams.get('userId');
      }
    }
    else{
    const searchParams = new URLSearchParams(location.search);
    event.preventDefault();
    const data = {
      planName: "Buffet",
      TimeSlot: timeSlot,
      date: date,
      MenuList: selectedMenu,
      price: price,
      isAvaliable: true
    }
    const req = { details: data }
    const response = await fetch('http://localhost:3001/api/Add/MealPlan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
    if (response.ok) {
      const data = await response.json();
      window.location.href = "./adminHome?userId=" + searchParams.get('userId');
    }
  }
  };

  const cancelAddMealPlan = () => {
    setisAddPlanClicked(false);
    window.location.href = './adminHome';
  }
  return (
    <section>
      <div class="">
        <Link to="/login">
          <button class="butoon-logout-color button-header mr-l-15">LogOut</button>
        </Link>
        <Link to={`/orders?userId=${userId}&isAdmin=true`}>
          <button class="button-header-color button-header mr-l-15">View All Orders</button>
        </Link>
        <Link to={`/mealPlans?userId=${userId}&isAdmin=true`}>
          <button class="button-header-color button-header mr-l-15">Meal Plans</button>
        </Link>
        <Link to={`/profile?userId=${userId}&isAdmin=true`}>
          <button class="button-header-color button-header mr-l-15">Profile Details</button>
        </Link>
      </div>
      <section class="container pd-l-300">

        {isAddPlanClicked && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="date" class="mr-r-15 c-w"> Date:</label>
            <input type="date" class="mr-r-15 select-style" id="date" value={date}
              onChange={(e) => setdate(e.target.value)} required />

            <label htmlFor="timeSlot" class="mr-r-15 c-w">Time Slot:</label>
            <select id="timeSlot" class="mr-r-15 select-style" value={timeSlot}
              onChange={handleDropdownChange} required>
              <option value="" disabled class="c-b">Select Time Slot</option>
              <option value="lunch" class="c-b">Lunch</option>
              <option value="dinner" class="c-b">Dinner</option>
              <option value="breakfast" class="c-b">BreakFast</option>
            </select>
            <div class="margins">
              <label class="mr-r-15  c-w">Price Per Person:</label>
              <input type="text" class="input-text-box-login" placeholder="Price Per Person" value={price}
                onChange={(e) => setPrice(e.target.value)} />
            </div>

            <h3 class="c-w">Select Menu Items that are included</h3>

            {Menu.map((item) => (
              <div class="mr-l-300" key={item._id}>
                <input class="mr-r-15 checkbox-style h-21"
                  type="checkbox"
                  checked={selectedMenu.some((selectedItem) => selectedItem._id === item._id)}
                  id={`menu-${item._id}`}
                  value={item._id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMenu((prevMenu) => [...prevMenu, item]);
                    } else {
                      setSelectedMenu((prevMenu) =>
                        prevMenu.filter((menuItem) => menuItem._id !== item._id)
                      );
                    }
                  }}
                />
                <label htmlFor={`menu-${item._id}`} class="mr-r-15 label-style-register">
                  {item.name}
                </label>

              </div>
            ))}



            <button type="submit" class="mr-t-20 submit-meal-btn mr-l-15">Submit Meal Plan</button>
            <button class="mr-t-20 login-btn mr-l-15" type="submit" onClick={cancelAddMealPlan}>Cancel</button>

          </form>

        )}


      </section>
    </section>
  );
};

export default AdminHome;
