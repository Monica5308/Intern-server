const app = require("express")();
const cors = require("cors");
const Razorpay = require("razorpay");
var SHA256 = require("crypto-js/hmac-sha256");
const https = require("https");

const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/create-order-id", (req, res) => {
    let auth = req.query;
    auth.amount = parseInt(auth.amount*100);
    console.log(auth);

    var instance = new Razorpay({
        key_id: "rzp_test_AwcPc39fStegOy",
        key_secret: "FxrWo7LaEexUIAalAvSYrkzb"
    });
      instance.orders.create(auth, function(err, order) {
          if(err) {
              res.send("ERROR: " + err);
              console.log(err, order);
              return;
          }
        res.send(order);
      });
});

app.get("/verify-payment", (req, res) => {
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.query;
    let generated_signature = SHA256(razorpay_order_id + "|" + razorpay_payment_id, "RAZORPAYKEY").toString();
    if(generated_signature === razorpay_signature) res.send("PAYMENT_VERIFIED_SUCCESS");
    else res.send("PAYMENT_VERIFIED_FAILED");
})

app.listen(PORT, () => {
    console.log("server is running on PORT " + PORT);
});

