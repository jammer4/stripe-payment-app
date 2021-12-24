const express = require('express');
require('dotenv').config();
const stripe = require('stripe')('SECRET_KEY');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.post("/charge", (req, res) => {
    try {
      stripe.customers
        .create({
          name: req.body.name,
          email: req.body.email,
          source: req.body.stripeToken
        })
        .then(customer =>
          stripe.charges.create({
            amount: 2500,
            currency: "usd",
            customer: customer.id
          })
        )
        .then(() => res.render("completed.html"))
        .catch(err => console.log(err));
    } catch (err) {
      res.send(err);
    }
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});