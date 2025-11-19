import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { IonButton } from "@ionic/angular/standalone";

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  imports: [IonicModule],
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent  implements OnInit {


  ngOnInit() {}


  backendUrl = "http://localhost:5000";

  constructor(private http: HttpClient) {}

  pay(amount: number) {
    // 1️⃣ Create Order from backend
    this.http.post(`${this.backendUrl}/create-order`, { amount })
      .subscribe((order: any) => {

        const options = {
          key: "YOUR_KEY_ID",
          amount: order.amount,
          currency: order.currency,
          name: "My E-Commerce Shop",
          description: "Purchase Payment",
          order_id: order.id,

          handler: (response: any) => {
            const body = {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature
            };

            // 2️⃣ Verify signature backend
            this.http.post(`${this.backendUrl}/verify-payment`, body)
              .subscribe((verifyRes: any) => {
                if (verifyRes.success) {
                  alert("🎉 Payment Successful!");
                } else {
                  alert("❌ Payment Verification Failed!");
                }
              });
          },

          theme: {
            color: "#3399cc"
          },

          method: {
            upi: true,
            card: true,
            wallet: true,
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();

        rzp.on('payment.failed', (err: any) => {
          alert("❌ Payment Failed!");
          console.log(err);
        });
      });
  }
}

