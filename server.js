const express = require('express');
const path = require('path');
const hbs = require('hbs');
const collection = require('./mongodb');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;



const storage = multer.memoryStorage();
const upload = multer({ storage });

const templatePath = path.join(__dirname, '../a');

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'a')));
app.use(express.static(path.join(__dirname, 'a/sproducts')));

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/signup", upload.single('profilePicture'), async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const confirmPassword = req.body.compassword;
  const phone = req.body.phone;
  const profilePicture = req.file ? req.file.buffer : null;

  if (!name || !password || !confirmPassword || !phone) {
    return res.status(400).send("All fields are required");
  }

  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  const data = {
    name: name,
    password: password,
    phone: phone,
    profilePicture: profilePicture
  };

  try {
    const existingUser = await collection.findOne({ phone: phone });
    if (existingUser) {
      return res.status(400).send("User with this phone number already exists");
    }
    await collection.insertMany([data]);
    res.redirect("login.html");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/signupcart", upload.single('profilePicture'), async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const confirmPassword = req.body.compassword;
  const phone = req.body.phone;
  const profilePicture = req.file ? req.file.buffer : null;

  if (!name || !password || !confirmPassword || !phone) {
    return res.status(400).send("All fields are required");
  }

  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  const data = {
    name: name,
    password: password,
    phone: phone,
    profilePicture: profilePicture
  };

  try {
    const existingUser = await collection.findOne({ phone: phone });
    if (existingUser) {
      return res.status(400).send("User with this phone number already exists");
    }
    await collection.insertMany([data]);
    res.redirect("logincart.html");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await collection.findOne({ name: req.body.name });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.password === req.body.password) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Wrong password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    } else {
      res.sendStatus(200);
    }
  });
});

app.get('/getProfilePicture', async (req, res) => {
  try {
    const username = req.query.username;
    const user = await collection.findOne({ name: username });

    if (user && user.profilePicture) {
      res.send({ profilePicture: user.profilePicture.toString('base64') });
    } else {
      res.status(404).send({ error: 'Profile picture not found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error getting profile picture' });
  }
});

app.get("/pay", (req, res) => {
  res.render("pay");
});

app.post("/checkPhoneNumber", async (req, res) => {
  try {
    const existingUser = await collection.findOne({ phone: req.body.phone });

    if (existingUser) {
      res.status(400).json({ message: "User with this phone number already exists" });
    } else {
      res.status(200).json({ message: "Phone number is available" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
