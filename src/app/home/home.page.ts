import { CommonModule } from '@angular/common';
import { Component, ViewChild, TemplateRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { IonModal } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
// nodemailer is a Node.js-only module and cannot be used in browser/Angular components.
// Move email-sending logic to a backend service (e.g. Node/Express) and call it via HTTP.
// import nodemailer from "nodemailer";

interface Category {
  id: string;
  name: string;
  icon: string; // image url
}

interface Product {
  id?: string;
  // core product fields
  name: string;
  Category?: string;
  QuantityOnHand?: number;
  UnitDesc?: string;
  RetailPrice?: number;
  SalePrice?: number;
  MRP?: number;
  UnitPrice?: number;
  EANCode?: string;
  weight?: string;
  price: number;
  image?: string;
  quantity?: number;
  isAdded: boolean;
  isLiked: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [HttpClient],
  imports: [
    CommonModule,
    FormsModule,       // <-- required for ngModel
    IonicModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    CdkDrag
  ]
})
export class HomePage {

  @ViewChild('loginSheet') loginSheet!: TemplateRef<any>;
  @ViewChild(IonModal) modal!: IonModal;




  searchText = '';
  latitude: number | null = null;
  longitude: number | null = null;
  city: string | null = null;
  fullAddress: string | null = null;
  errorMsg: string | null = null;
  categories: Category[] = [
    { id: 'snacks', name: 'Snacks', icon: 'https://via.placeholder.com/64?text=Sn' },
    { id: 'breakfast', name: 'Breakfast', icon: 'https://via.placeholder.com/64?text=Bf' },
    { id: 'canned', name: 'Canned', icon: 'https://via.placeholder.com/64?text=C' },
    { id: 'sauce', name: 'Sauce', icon: 'https://via.placeholder.com/64?text=Sa' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'fruits', name: 'Fruits', icon: 'https://via.placeholder.com/64?text=Fr' },
    { id: 'veg', name: 'Vegetables', icon: 'https://via.placeholder.com/64?text=Vg' },
  ];


  selectedProduct: Product[] = [];
  wishlist: Product[] = [];
  totalItemCount = 0;
  totalPrice = 0;
  isPanelOpen = false;
  isHome = true;
  isProfile = false;
  isCart = false;
  isWishlist = false;

  ngAfterViewInit() {
    this.modal.presentingElement = document.querySelector('ion-router-outlet') as HTMLElement;

  }

  resetStates() {
    this.isHome = false;
    this.isProfile = false;
    this.isCart = false;
    this.isWishlist = false;
  }
  products: Product[] = [];

  //Customer Addition Post  http://localhost:3000/api/nexus_supermart/customers -------> make get to fetc customers
  // //##################{
  //   "customerId": "CUST002",
  //   "name": "Kaviyarasan",
  //   "mobile": "9994305384",
  //   "password": "12345",
  //   "address": "Govt, school chekkanam",
  //   "points": 0
  // }#############


  //Login Post  http://localhost:3000/api/nexus_supermart/customers/login
  //##################{
  //   "mobile": "9994305384",
  //   "password": "12345"
  // }#############


  /******************
   * POST /api/<clientCode>/customers/forgot-password
    * Request body:
    * {
    "mobile": "9988776655",
    "newPassword": "54321"
  }




**********API for Order Placement**********  
  POST /api/nexus_supermart/orders
  Get Orders:  /api/nexus_supermart/orders

  ********** Request Body for Order Placement **********{
  "customer": "kaviyarasan",
  "mobile": "9988776655",
  "amount": 550,
  "status":"Order Initiated",
  "discount": 50,
  "savings": 60,
  "date": "2025-08-03T18:45:00",
  "amountPaid": 500,
  "paymentMode": "upi",
  "orderBy": "By Application",
  "deliveryAddress": "12, Gandhi Nagar, Chennai",
  "products": [
    {
      "productId": "P001",
      "name": "Chicken Biryani",
      "price": 200,
      "qty": 2,
      "total": 400
    },
    {
      "productId": "P002",
      "name": "Parotta",
      "price": 75,
      "qty": 2,
      "total": 150
    }
  ]
}

  *****************cancel Order******************
PUT /api/<clientCode>/orders/<orderId>
{
  "status": "Cancelled by Customer"
  }
    ******************/

  getProducts() {
    this.http.get<Product[]>("https://supermartspring.vercel.app/api/nexus_supermart/products?page=1&limit=10").subscribe((data: any) => {
      debugger
      this.products = data;
      this.productsBackup = [...this.products];
    });
  }
  togglePanel() {
    debugger
    this.isPanelOpen = !this.isPanelOpen;
    if (this.isPanelOpen) {
      this.calculateTotals();
    }
  }
  isDragging = false;
  offsetX = 0;
  offsetY = 0;

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    const footer = (event.target as HTMLElement).closest('.footer') as HTMLElement;
    const rect = footer.getBoundingClientRect();
    this.offsetX = event.clientX - rect.left; // top-left offset
    this.offsetY = event.clientY - rect.top;
  }


  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;
    const footer = document.querySelector('.footer') as HTMLElement;
    footer.style.left = event.clientX - this.offsetX + 'px';
    footer.style.top = event.clientY - this.offsetY + 'px';
    footer.style.transform = 'none'; // disable transform while dragging
    footer.style.bottom = 'auto';
  }

  // add near other methods in the HomePage class

  // helper: ensure Razorpay script loaded (you already have this but keep it)
  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // avoid adding multiple scripts
      if ((<any>window).Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Razorpay script load error'));
      document.body.appendChild(script);
    });
  }

  /**
   * Initiate payment.
   * Tries to call backend (/api/create-order) if present. Fallbacks to client-only checkout.
   * - this.totalPrice should be in INR (number). We convert to paise.
   */
  async pay() {
    const amountInPaise = Math.round(this.totalPrice * 100);

    if (amountInPaise <= 0) {
      alert("Cart is empty!");
      return;
    }

    // 1️⃣ CREATE ORDER FROM BACKEND
    this.http.post("https://supermartspring.vercel.app/create-order", {
      amount: amountInPaise
    }).subscribe((order: any) => {

      const options: any = {
        key: "rzp_test_Rhe1D8p5Mgfh6G",
        amount: order.amount,
        currency: order.currency,
        name: "Kaamatchi SuperMart",
        description: "Order Payment",
        order_id: order.id,
        upi: {
          flow: "intent"
        },
        handler: (response: any) => {
          console.log("Payment Success:", response);

          // 2️⃣ VERIFY PAYMENT AFTER SUCCESS
          this.verifyPayment(response);
        },

        prefill: {
          name: this.userName,
          email: this.email,
          contact: this.phoneNumber
        },

        theme: { color: "#3399cc" }
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", (err: any) => {
        alert("Payment Failed!");
        console.error(err);
      });

      rzp.open();
    });
  }
  verifyPayment(response: any) {
    this.http.post("https://supermartspring.vercel.app/verify-payment", {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    }).subscribe((res: any) => {

      if (res.success) {
        alert("Payment Verified Successfully!");

        // your custom logic
        this.sendmail();
        this.clearCart();
        this.isPanelOpen = false;
      } else {
        alert("Payment verification failed");
      }
    });
  }



  //  private loadRazorpayScript(): Promise<void> {
  //          return new Promise((resolve, reject) => {
  //            const script = document.createElement('script');
  //            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //            script.onload = () => resolve();
  //            script.onerror = () => reject();
  //            document.body.appendChild(script);
  //          });
  //        }


  call() {
    this.loadRazorpayScript().then((response: any) => {

      console.log('Razorpay script loaded successfully.' + response);
    }).catch((error: any) => {
      console.error('Failed to load Razorpay script.', error);
    });
  }
  // stopDrag() {
  //   this.isDragging = false;
  //   const footer = document.querySelector('.footer') as HTMLElement;
  //   localStorage.setItem('footerPosition', JSON.stringify({
  //     left: footer.style.left,
  //     top: footer.style.top
  //   }));
  // }

  ngOnInit() {
    this.resetStates();
    this.getProducts();
    this.getLocation();
    this.isHome = true;
    this.userName = localStorage.getItem("userName") || '';
    this.email = localStorage.getItem("emai") || '';
    this.address = localStorage.getItem("address") || '';
    this.phoneNumber = localStorage.getItem("phoneNumber") || '';

    setTimeout(() => this.openLoginSheet(), 300);

  }





  stopDrag() {
    this.isDragging = false;
  }
  removeFromWishlist(item: any) {
    item.isLiked = false;
    this.wishlist = [...this.wishlist.filter(p => p.isLiked === true)];
  }
  removeFromCart(item: any) {

    item.isAdded = false; // Hide + - and show Add again
    item.quantity = 0;
    this.selectedProduct = [...this.selectedProduct.filter(p => p.id !== item.id)];

    this.calculateTotals();
  }
  setActive(btn: any) {
    this.resetStates();
    if (btn === 'Home') {
      this.isHome = true;
    } else if (btn === 'Profile') {
      this.isProfile = true;
    } else if (btn === 'Cart') {
      this.isCart = true;
    } else if (btn === 'Wishlist') {
      this.isWishlist = true;
    }

  }
  saveUserData() {
    localStorage.setItem("userName", this.userName);
    localStorage.setItem("emai", this.email);
    localStorage.setItem("address", this.address);
    localStorage.setItem("phoneNumber", this.phoneNumber);
    this.userName = this.email = this.address = this.phoneNumber = '';

  }
  userName!: string;
  email!: string;
  address!: string;
  phoneNumber!: string;
  sendmail() {
    debugger;
    let html = `
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width:100%;">
    <tr style="background:#eee;">
      <th>Item</th>
      <th>Qty</th>
      <th>Price</th>
    </tr>
  `;

    this.selectedProduct.forEach(item => {
      html += `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price}</td>
    </tr>`;
    });

    html += `</table>`;
    var data = {
      service_id: 'service_xexe4hd',
      template_id: 'template_2c4042n',
      user_id: 'd4AgtE-h8xm4Ebve7',

      template_params: {
        'name': this.userName,
        'adderss': this.address,
        'email': this.email,
        'phone': this.phoneNumber,
        'itemcount': this.selectedProduct.length,
        'amount': Math.round(this.totalPrice).toFixed(2),
        "table": html,
        'message': JSON.stringify(this.selectedProduct),
      }
    };
    let products: any[] = [];

    this.selectedProduct.forEach(item => {
      products.push({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      });
    });
    data.template_params['message'] = JSON.stringify(products);
    this.http.post(
      'https://api.emailjs.com/api/v1.0/email/send',
      data,
      { responseType: 'text' }
    ).subscribe({
      next: (res: string) => {
        console.log('EmailJS Response:', res);
        alert('Order Placed ✅');
        this.selectSuggestion('');
        this.clearCart();
        this.isPanelOpen = false;
        this.selectedProduct = [];
      },
      error: (err) => {
        console.error('EmailJS Error:', err);
        alert('Failed to send email ❌');
      }
    });

  }
  clearCart() {
    this.selectedProduct.forEach(item => {
      item.isAdded = false;
      item.quantity = 0;
    });
    this.selectedProduct = [];
    this.totalItemCount = 0;
    this.totalPrice = 0;
  }
  calculateTotals() {
    this.totalItemCount = this.selectedProduct.reduce((sum, item) => sum + (item.quantity || 0), 0);
    this.totalPrice = this.selectedProduct.reduce((sum, item) => sum + ((item.quantity || 0) * item.price), 0);
  }
  user: {
    name: string;
    email: string;
  } = {
      name: 'Kaviyarasan',
      email: ' kahjhj@gail.com'
    }
  suggestions: string[] = [
    'Dairy', 'Fruits', 'Instant Food', 'Bakery', 'Grains', 'Snacks', 'Vegetables', 'Meat', 'Daily Needs', 'Pulses', 'Beverages', 'Condiments', 'Breakfast', 'General'
  ];

  filteredSuggestions: Product[] = [];
  async getLocation() {
    const pos = await Geolocation.getCurrentPosition();
    this.latitude = pos.coords.latitude;
    this.longitude = pos.coords.longitude;

    this.getCityByAPI(this.latitude, this.longitude);
  }
  postalCode: string | null = null;
  getCityByAPI(lat: number, lng: number) {
    //`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    const url = `https://us1.locationiq.com/v1/reverse?key=pk.c7e493dd7d985c4d9562498de05c0711&lat=${lat}&lon=${lng}&format=json&zoom=18`;
    //https://us1.locationiq.com/v1/reverse?key=pk.c7e493dd7d985c4d9562498de05c0711&lat=9.941420658997988&lon=77.96932102307461&format=json
    //const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

    this.http.get(url).subscribe((data: any) => {
      debugger

      let address = data.address || {};
      this.city = address.town || address.city || address.village || address.locality || address.county || address.state_district;
      this.fullAddress = data.display_name || '';
      this.postalCode = address.postcode || null;

      console.log("City:", this.city);
      console.log("Address:", this.fullAddress);
    });
  }


  onSearchChange() {
    debugger;
    const value = this.searchText.toLowerCase().trim();


    if (value === '') {
      this.filteredSuggestions = [];
      this.products = [...this.productsBackup];
    } else {
      this.filteredSuggestions = this.products.filter(p =>
        p.Category?.toLowerCase().includes(value.toLowerCase()) || p.name?.toLowerCase().includes(value.toLowerCase())
      );
      this.filteredSuggestions = this.filteredSuggestions.slice(0, 5);
    }
  }
  showAlert = false;
  alertEnabler() {
    this.showAlert = this.showAlert ? false : true;
  }
  productsBackup: Product[] = [];
  selectSuggestion(suggestion: string) {
    debugger;
    this.filteredSuggestions = [];
    if (this.productsBackup.length === 0) {
      this.productsBackup = [...this.products];
    } else {
      this.products = [...this.productsBackup];
    }
    this.products = this.products.filter(p =>
      p.Category?.toLowerCase().includes(suggestion.toLowerCase()) ||
      p.name?.toLowerCase().includes(suggestion.toLowerCase())
    );
  }
  constructor(private http: HttpClient, private modalCtrl: ModalController, private zone: NgZone,
    private cdr: ChangeDetectorRef) { }
  // async getLocation() {
  //   this.errorMsg = null;

  //   try {
  //     // Request permission
  //     const perm = await Geolocation.requestPermissions();
  //     console.log("Permission:", perm);

  //     // Get actual device GPS
  //     const pos = await Geolocation.getCurrentPosition({
  //       enableHighAccuracy: true,
  //       timeout: 15000
  //     });

  //     this.latitude = pos.coords.latitude;
  //     this.longitude = pos.coords.longitude;

  //     console.log("Device GPS:", this.latitude, this.longitude);

  //     await this.getCityFromCoords(this.latitude, this.longitude);

  //   } catch (error) {
  //     console.error("GPS ERROR:", error);
  //     this.errorMsg = "Failed to get location";
  //   }
  // }


  // getWebAddress(lat: number, lng: number) {
  //   this.http.get(
  //     `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  //   ).subscribe((data: any) => {
  //     this.city = data.address.city || data.address.town || data.address.village;
  //     this.fullAddress = data.display_name;

  //     console.log("Web Address:", this.fullAddress);
  //     console.log("Web City:", this.city);
  //   });
  // }

  //  async getCityFromCoords(lat: number, lng: number) {
  //   try {
  //     const options: NativeGeocoderOptions = {
  //       useLocale: true,
  //       maxResults: 1
  //     };

  //     const results = await this.nativeGeocoder.reverseGeocode(lat, lng, options);

  //     if (results.length > 0) {
  //       const r = results[0];

  //       this.city =
  //         r.locality ||
  //         r.subAdministrativeArea ||
  //         r.administrativeArea ||
  //         'Unknown';

  //       this.fullAddress = Object.values({
  //         thoroughfare: r.thoroughfare,
  //         subLocality: r.subLocality,
  //         locality: r.locality,
  //         adminArea: r.administrativeArea,
  //         postalCode: r.postalCode,
  //         country: r.countryName
  //       })
  //         .filter(x => !!x)
  //         .join(', ');

  //       console.log("Address:", this.fullAddress);
  //       console.log("City:", this.city);
  //     }
  //   } catch (e) {
  //     console.error("Reverse geocode failed:", e);
  //     this.errorMsg = "Failed to reverse geocode";
  //   }
  // }

  addWishlist(item: any) {
    debugger
    if (!item.isLiked) {
      item.isLiked = true;
      this.wishlist.push(item);
      console.log(this.wishlist);
    } else {
      item.isLiked = false;
      this.wishlist = this.wishlist.filter(p => p.id !== item.id);
    }
  }
  // getter used by template to avoid repeated function calls
  get filteredProducts(): Product[] {
    const q = (this.searchText || '').trim().toLowerCase();
    if (!q) {
      return this.products;
    }
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) || p.Category?.toLowerCase().includes(q)
    );
  }
  onAdd(item: any) {
    debugger
    if (!item.isAdded) {
      item.isAdded = true;
      item.quantity = 1;
      this.selectedProduct.push(item);
    } else {
      item.quantity++;
      let temp = this.selectedProduct.filter(p => p.id !== item.id);
      this.selectedProduct = [...temp, item];
    }

    console.log(this.selectedProduct);
  }

  onRemove(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      item.isAdded = false; // Hide + - and show Add again
      item.quantity = 0;
      this.selectedProduct = this.selectedProduct.filter(p => p.id !== item.id);
    }
  }

  getQuantity(item: any): number {
    return item.quantity || 0;
  }

  onSelectCategory(cat: Category) {
    // You could set searchText or filter state
    this.searchText = cat.name;
  }

  authMode: 'login' | 'signup' = 'login';
  isLoginOpen = false;

  openLoginSheet() {
    this.authMode = 'login';
    this.isLoginOpen = true;
  }

  skip() {
    this.isLoginOpen = false;
  }



}
