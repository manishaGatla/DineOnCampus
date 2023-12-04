const Users = require('../src/models/user.js');
const Admins = require('../src/models/admin.js');
const Menu = require('./models/Menu.js');
const MealPlans = require('./models/mealPlans.js');
const Wallets = require('./models/wallet.js');
const Orders = require('./models/Orders.js');

const { MongoClient, ObjectId, Binary } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/DineOnCampus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Mongoose connected');
    console.log('Connected to MongoDB');

  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Mongo client connected');
  console.log('Connected to MongoDB');
  client.close();
});

app.get('/api/get/MealPlansById', (req, res) => {
  const queryParam = req.query.date;
  MealPlans.find({ date: queryParam })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
});

app.get('/api/get/MealPlans', (req, res) => {
  MealPlans.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
});

app.post('/api/Add/MealPlan', (req, res) => {
  const collection = client.db('DineOnCampus').collection('MealPlans');
  collection.insertOne(req.body.details)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.get('/api/Wallet', (req, res) => {
  Bookings.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
});


app.post('/api/register', (req, res) => {
  const collection = client.db('DineOnCampus').collection(req.body.schema == "Admins" ? 'Administrators' : 'Users');
  collection.insertOne(req.body.data)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.get('/api/get/Menu', async (req, res) => {
  Menu.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.post('/api/add/Wallet', (req, res) => {
  const collection = client.db('DineOnCampus').collection('Wallets');
  collection.insertOne(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.get('/api/get/WalletById', (req, res) => {
  const Id = req.query.id;
  Wallets.find({ userId: Id })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.post('/api/update/WalletById', (req, res) => {
  const collection = client.db('DineOnCampus').collection('Wallets');
  const filter = { _id: new ObjectId(req.body.id) };
  let update;
  update = {
    $set: {
      Balance: req.body.balance
    }
  };

  collection.updateOne(filter, update).then((data) => {
    res.json(data);
  })
})

app.post('/api/update/WalletByUserId', (req, res) => {
  const collection = client.db('DineOnCampus').collection('Wallets');
  const filter = {userId: req.body.userId };
  let update;
  update = {
    $set: {
      Balance: req.body.balance
    }
  };

  collection.updateOne(filter, update).then((data) => {
    res.json(data);
  })
})

app.post('/api/update/AdminAccount', (req, res) => {
  const collection = client.db('DineOnCampus').collection('Administrators');
  let update;
  update = {
    $set: {
      balance: req.body.balance
    }
  };

  collection.updateOne({}, update).then((data) => {
    res.json(data);
  })
})

app.post('/api/Add/Orders', (req, res) => {
  const collection = client.db('DineOnCampus').collection('Orders');
  collection.insertOne(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.get('/api/get/Orders', async (req, res) => {
  Orders.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.get('/api/get/AministratorBal', async (req, res) => {
  Admins.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.get('/api/get/OrderByUserId', async (req, res) => {
  const id = req.query.id;
  Orders.find({ userId: id, status: { $ne: 'Cancelled' } })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})


app.post('/api/update/userDetails', (req, res) => {
  const collection = client.db('DineOnCampus').collection('Users');
  const userDetails = req.body.data;
  const filter = { email: req.body.email };
  let update;
  update = {
    $set: {
      name: userDetails.name,
      password: userDetails.password,
      email: userDetails.email,
      contact: userDetails.contact
    }
  };
  collection.updateOne(filter, update).then((data) => {
    res.json(data);
  })
})

app.post('/api/update/adminDetails', (req, res) => {
  const collection = client.db('DineOnCampus').collection('Administrators');
  const userDetails = req.body.data;
  const filter = { email: req.body.email };
  let update;
  update = {
    $set: {
      name: userDetails.name,
      password: userDetails.password,
      email: userDetails.email,
      contact: userDetails.contact
    }
  };

  collection.updateOne(filter, update).then((data) => {
    res.json(data);
  })
})

app.post('/api/update/orderAvaliability', (req, res) => {
  const collection = client.db('DineOnCampus').collection('MealPlans');
  const id = req.body.data;
  const filter = { _id: new ObjectId(id) };
  let update;
  update = {
    $set: {
      isAvaliable: false
    }
  };

  collection.updateOne(filter, update).then((data) => {
    res.json(data);
  })
})

app.post('/api/update/MealPlan', (req, res) => {
  const collection = client.db('DineOnCampus').collection('MealPlans');
  const id = req.query.id;
  const details = req.body.details;
  const filter = { _id: new ObjectId(id) };
  let update;
  update = {
    $set: {
      isAvaliable: true,
      planName: "Buffet",
      TimeSlot: details.TimeSlot,
      date: details.date,
      MenuList: details.MenuList,
      price: details.price,
    }
  };

  collection.updateOne(filter, update).then((data) => {
    res.json(data);
  })
})

app.post('/api/update/orderStatus', async (req, res) => {
  const collection = client.db('DineOnCampus').collection('Orders');
  const selectedIds = req.body.data;
  const selectedObjectIds = selectedIds.map((id) => new ObjectId(id));
  collection.updateMany({ _id: { $in: selectedObjectIds } },
    { $set: { status: req.body.status , reason : req.body.reason} }).then((data) => {
      res.json(data);
    });


})





app.get('/api/login', async (req, res) => {
  const queryParam = req.query.email;
  const promises = [Admins.find({ email: queryParam }), Users.find({ email: queryParam })]
  const [result1, result2] = await Promise.all(promises);
  if (result1.length > 0) {
    let data = {
      details: result1,
      role: "Admin"
    }
    return res.json(data);
  }
  else if (result2.length > 0) {
    let data = {
      details: result2,
      role: "User"
    }
    return res.json(data);
  }

  else {
    return res.json([]);
  }
})


app.get('/api/get/userdetails', async (req, res) => {
  const queryParam = req.query.userId;
  const promises = [Admins.find({ _id: new ObjectId(queryParam) }), Users.find({ _id: new ObjectId(queryParam) })]
  const [result1, result2] = await Promise.all(promises);
  if (result1.length > 0) {
    let data = {
      details: result1,
      role: "Admin"
    }
    return res.json(data);
  }
  else if (result2.length > 0) {
    let data = {
      details: result2,
      role: "User"
    }
    return res.json(data);
  }

  else {
    return res.json([]);
  }
})

app.post('/api/paymentDetails', (req, res) => {
  const collection = client.db('DineOnCampus').collection('Payments');
  collection.insertOne(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});