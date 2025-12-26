import { CommonModule } from '@angular/common';
import { Component, ViewChild, TemplateRef, NgZone, ChangeDetectorRef,HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StatusBar } from '@capacitor/status-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { IonModal } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { MatRadioModule } from '@angular/material/radio';
import { ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { SupermartService } from '../services/supermart.services';

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
  imageName:string;
  isImageUploaded:boolean;
}

interface filtteredProducs {
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
  imageName:string;
  isImageUploaded:boolean;
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
    CdkDrag,
    MatRadioModule
    ]})
export class HomePage {

  @ViewChild('loginSheet') loginSheet!: TemplateRef<any>;
  @ViewChild(IonModal) modal!: IonModal;

@HostListener('document:ionBackButton', ['$event'])
handleBackButton(event: any) {
  event.detail.register(1000, () => {
    this.goBack();
  });
}


paymentMode: string = 'upi';
  searchText = '';
  latitude: number | null = null;
  longitude: number | null = null;
  city: string | null = null;
  fullAddress: string | null = null;
  errorMsg: string | null = null;
  isOrderHistory = false;
  orders: any[] = [];
  isLoading = false;
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

  isModalOpen = false;
  isSignupMode = false;
  isForgotMode: boolean = false;
  isLoginMode: boolean = true;

      forgotData = {
      identifier: '',
      otp: '',
      password: ''
    };

    otpSent = false;

  loginData = {
    identifier: '',
    password: ''
  };


  signupData = {
  name: '',
  mobile: '',
  password: '',
  confirm: '',
  address: ''
  };

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

resetStates(){
  this.isHome = false;
  this.isProfile = false;
  this.isCart = false;
  this.isWishlist = false;
  this.paymentModeUI= false;
}
products: Product[] = [];
page = 1;
limit = 100;
loadingMore = false;
allLoaded = false;

onProductScroll(event: any) {
  const target = event.target;

  const scrollPosition = target.scrollTop + target.clientHeight;
  const scrollHeight = target.scrollHeight;
  if (scrollHeight - scrollPosition < 200) {
    this.getProducts();
  }
}

filteredProductsList: filtteredProducs[] = [];
getSearchedProducts(query: string) {
  debugger
  if(query.trim()===''){
    this.showCustomToast('Please enter a search term','warning');
  }else{
  this.isLoading=true;
  this.searchText = query;
  this.http
    .get<any>(
      `https://supermartspring.vercel.app/api/nexus_supermart/products/search?query=${query}`
    )
    .subscribe(res => {
      this.filteredSuggestions = res.data || [];
      this.filteredProductsList = res;
       this.isLoading=false;
    });
    }
}

clearSearch(){
  this.searchText='';
  this.filteredSuggestions=[];
  this.filteredProductsList=[];
}

getProducts() {
  if (this.loadingMore || this.allLoaded) return;

  // Show loader only for FIRST load
  if (this.page === 1) {
    this.isLoading = true;
  }

  this.isLoading = true;

  this.http
    .get<any>(
      `https://supermartspring.vercel.app/api/nexus_supermart/products?page=${this.page}&limit=${this.limit}`
    )
    .subscribe({
      next: (res: any) => {
        if (!res?.data?.length) {
          this.allLoaded = true;
        } else {
          this.products = [...this.products, ...res.data];
          this.page++;
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        console.error('Product API error', err);
        this.showCustomToast('Failed to load products', 'danger');
      },
      complete: () => {
        this.loadingMore = false;
        this.isLoading = false;
      }
    });
}



paymentModeUI:boolean=false;

onPlaceOrder() {
this.isCart=false;
this.isWishlist=false;
this.isProfile=true;
this.paymentModeUI= true;
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

goBack() {

  if (this.isOrderHistory) {
    this.isOrderHistory = false;
    this.isProfile = true;
    return;
  }

  if (this.paymentModeUI) {
    this.paymentModeUI = false;
    return;
  }

  if (this.isPanelOpen) {
    this.isPanelOpen = false;
    this.isCart = false;
    this.isWishlist = false;
    this.isProfile = false;
    return;
  }

}



  openOrderHistory() {
  this.isOrderHistory = true;
  this.isCart = false;
  this.isWishlist = false;
  this.isProfile = false;

  this.loadOrders();
}

closeOrderHistory() {
  this.isOrderHistory = false;
  this.isProfile = true;
}

loadOrders() {
debugger
  this.supermartService.getOrders(1234).subscribe({
    next: (res: any) => {
      this.orders = res;
    },
    error: () => {
      this.showCustomToast("Failed to load orders", 'danger');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}


cancelOrder(id: string) {

  this.supermartService.cancelOrder(id).subscribe({
    next: () => {
      this.showCustomToast("Order cancelled",'success');
      this.loadOrders();
    },
    error: () => {
      this.showCustomToast("Unable to cancel",'danger');
    }
  });
}

logout() {
  localStorage.clear();
  this.showCustomToast("Logged out",'success');
  this.isProfile = false;
  this.togglePanel();
  setTimeout(() => this.openLogin(), 100);
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
    debugger
    this.isLoading = true;
    const amountInPaise = Math.round(this.totalPrice * 100);

  if (amountInPaise <= 0) {
     this.isLoading = false;
     this.showCustomToast('Cart is empty!','danger');
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
           this.isLoading = false;
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
      this.isLoading = false;
      this.showCustomToast('Payment Failed! Please try again.','danger');
      console.error(err);
    });

      rzp.open();
    });
  }
verifyPayment(response: any) {
debugger
 this.isLoading = true;
  // STEP 1: Verify Razorpay payment
  this.http.post("https://supermartspring.vercel.app/verify-payment", {
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature
  }).subscribe({
    next: (res: any) => {

      if (res.success) {

        this.showCustomToast('Payment Verified Successfully! ✅', 'success');
        this.isPanelOpen=false;
        // STEP 2: Get customerId from logged-in user
        const user = JSON.parse(localStorage.getItem('supermart_user') || '{}');
        const customerId = user.customerId || user.id || "";

        // STEP 3: Build order payload
        const payload = {
          customerId: customerId,
          customer: this.userName,
          mobile: this.phoneNumber,
          amount: this.totalPrice,
          discount: 0,
          savings: 0,
          date: new Date().toISOString(),
          amountPaid: this.totalPrice,
          paymentMode: "upi",
          orderBy: "in-person",
          deliveryAddress: this.address,
          products: this.selectedProduct.map((p: any) => ({
            productId: p.id || p.productId,
            name: p.name,
            price: p.price,
            qty: p.quantity || 1,
            total: (p.quantity || 1) * p.price
          }))
        };

        // STEP 4: Place order
        this.supermartService.placeOrder(payload).subscribe({
          next: () => {
            this.showCustomToast("Order placed successfully! 🛒", "success");
            this.isLoading = false;
            this.clearCart();
            this.isPanelOpen = false;
            this.loadOrders();
          },
          error: () => {
             this.isLoading = false;
            this.showCustomToast('Failed to place order ❌', 'danger');
          }
        });

      } else {
         this.isLoading = false;
        this.showCustomToast('Payment verification failed ❌', 'danger');
      }
    },

    error: (err) => {
      console.error(err);
       this.isLoading = false;
      this.showCustomToast('Payment verification failed ❌', 'danger');
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

// const paymodeCards: NodeListOf<HTMLElement> = document.querySelectorAll('.paymode-card');

 selectMode(mode: 'upi' | 'cash') {
    this.paymentMode = mode;
  }

userDetails: any = {};
  ngOnInit() {
    StatusBar.setOverlaysWebView({ overlay: false });
    setTimeout(() => this.openLogin(), 300);
    this.resetStates();
    this.getLocation();
    this.isHome = true;
    this.userName = localStorage.getItem("userName") || '';
    this.email = localStorage.getItem("emai") || '';
    this.address = localStorage.getItem("address") || '';
    this.phoneNumber = localStorage.getItem("phoneNumber") || '';
   this.userDetails= JSON.parse(localStorage.getItem("supermart_user") || '');

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

orderForUPI: any = null;  

saveUserData() {
  debugger
  const requiredFields: { key: string; value: any; label: string }[] = [
    { key: 'userName', value: this.userName, label: 'User Name' },
    { key: 'email', value: this.email, label: 'Email' },
    { key: 'address', value: this.address, label: 'Address' },
    { key: 'phoneNumber', value: this.phoneNumber, label: 'Phone Number' },
    { key: 'paymentMode', value: this.paymentMode, label: 'Payment Mode' }
  ];

  const missingFields = requiredFields
    .filter(field => field.value === null || field.value === undefined || field.value === '')
    .map(field => field.label);

  if (missingFields.length > 0) {
    this.showCustomToast(
      `Please fill the following fields: ${missingFields.join(', ')}`,
      'danger'
    );
    return;
  }

  this.isLoading = true;

  localStorage.setItem("userName", this.userName);
  localStorage.setItem("email", this.email);
  localStorage.setItem("address", this.address);
  localStorage.setItem("phoneNumber", this.phoneNumber);

  const user = JSON.parse(localStorage.getItem('supermart_user') || '{}');
  const customerId = user?.customerId || user?.id || '';

  const payload = {
    customerId,
    customer: this.userName,
    mobile: this.phoneNumber,
    amount: this.totalPrice,
    discount: 0,
    savings: 0,
    date: new Date().toISOString(),
    amountPaid: this.paymentMode === 'cash' ? this.totalPrice : 0,
    paymentMode: this.paymentMode,
    orderBy: "in-person",
    deliveryAddress: this.address,
    products: this.selectedProduct.map((p: any) => ({
      productId: p.id,
      name: p.name,
      price: p.price,
      qty: p.quantity || 1,
      total: (p.quantity || 1) * p.price
    }))
  };

  if (this.paymentMode === 'cash') {
    this.submitOrderToBackend(payload);
    this.isLoading = false;
    return;
  }

  if (this.paymentMode === 'upi') {
    this.orderForUPI = payload;
    this.pay();
    this.isLoading = false;
    return;
  }
}


submitOrderToBackend(payload: any) {
  debugger
  this.isLoading = true;

  this.supermartService.placeOrder(payload).subscribe({
    next: () => {
      this.isLoading = false;
      this.showCustomToast('Order placed successfully! ✅', 'success');
      this.clearCart();
      this.isPanelOpen = false;
      this.loadOrders();
    },
    error: () => {
      this.isLoading = false;
      this.showCustomToast('Failed to place order ❌', 'danger');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}



userName!:string;
email!:string;
address!:string;
phoneNumber!:string;
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

this.selectedProduct.forEach(item=>{
  products.push({
    name:item.name,
    quantity:item.quantity,
    price:item.price
  });
});
data.template_params['message']=JSON.stringify(products);
this.http.post(
  'https://api.emailjs.com/api/v1.0/email/send',
  data,
  { responseType: 'text' }  
).subscribe({
  next: (res: string) => {
    console.log('EmailJS Response:', res);
    this.showCustomToast('Order placed successfully ✅','success');
    this.selectSuggestion('');
    this.clearCart();
    this.isPanelOpen = false;
    this.selectedProduct = [];
  },
  error: (err) => {
    console.error('EmailJS Error:', err);
    this.showCustomToast('Failed to send email ❌','danger');
  }
});

  }
  clearCart() {
    debugger
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
  suggestions: any[] = [
    'Dairy', 'Fruits', 'Instant Food', 'Bakery', 'Grains', 'Snacks', 'Vegetables', 'Meat', 'Daily Needs', 'Pulses', 'Beverages', 'Condiments', 'Breakfast', 'General'
  ];

filteredSuggestions: Product[] = [];
async getLocation() {
  try {
    if (Capacitor.getPlatform() === 'web') {
      // Web fallback
      if (!navigator.geolocation) {
        console.error('Geolocation not supported in this browser');
        this.errorMsg = 'Geolocation not supported';
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude;
          console.log('Web Lat:', this.latitude, 'Lng:', this.longitude);

          this.getCityByAPI(this.latitude, this.longitude);
        },
        (err) => {
          console.error('Web geolocation error:', err);
          this.errorMsg = 'Failed to get location';
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );

    } else {
      // Mobile (iOS/Android)
      const perm = await Geolocation.requestPermissions();
      if (perm.location === 'denied') {
        console.error('Location permission denied');
        this.errorMsg = 'Permission denied';
        return;
      }

      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
      console.log('Mobile Lat:', this.latitude, 'Lng:', this.longitude);

      this.getCityByAPI(this.latitude, this.longitude);
    }
  } catch (error) {
    console.error('Error getting location', error);
    this.errorMsg = 'Failed to get location';
  }
}
postalCode: string | null = null;
getCityByAPI(lat: number, lng: number) {
 //`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
  const url =  `https://us1.locationiq.com/v1/reverse?key=pk.c7e493dd7d985c4d9562498de05c0711&lat=${lat}&lon=${lng}&format=json&zoom=18`;
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

getCategories() {
  this.http.get<any>('https://supermartspring.vercel.app/api/nexus_supermart/categories').subscribe(res => {
    this.suggestions = res.data || [];
  });
}
  onSearchChange() {
    debugger;
    const value = this.searchText.toLowerCase().trim();


    if (value === '') {
      this.filteredSuggestions = [];
      this.filteredProductsList = [];
      this.products = [...this.products];
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
  this.searchText = suggestion;
  this.filteredSuggestions = [];
  if(this.productsBackup.length===0){
    this.productsBackup = [...this.products];
  }else{
    this.products = [...this.productsBackup];
  }
  this.products = this.products.filter(p =>
    p.Category?.toLowerCase().includes(suggestion.toLowerCase()) ||
    p.name?.toLowerCase().includes(suggestion.toLowerCase())
  );
}

constructor(private http: HttpClient,private supermartService: SupermartService,private modalCtrl: ModalController, private zone: NgZone,private toastCtrl: ToastController,    private cdr: ChangeDetectorRef) {}
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

// async showCustomToast(message: string, color: string = 'danger') {
//   const toast = await this.toastCtrl.create({
//     message,
//     duration: 2000,
//     position: 'top',
//     cssClass: "forceToast",
//     color
//   });
//   await toast.present();
// }

showDetails = true;

toggleDetails() {
  this.showDetails = !this.showDetails;
}


showCustomToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') {

  const toast = document.getElementById('custom-toast');
  const msg = document.getElementById('toast-message');

  if (!toast || !msg) return;

  msg.textContent = message;

  // Remove old type classes
  toast.classList.remove('toast-success', 'toast-danger', 'toast-warning', 'toast-info');

  // Add the new type
  toast.classList.add(`toast-${type}`);

  // Show toast
  toast.classList.add('toast-show');
  toast.classList.remove('toast-hidden');

  // Hide after 2.5 sec
  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hidden');
  }, 2500);
}


openLogin() {
  this.isModalOpen = true;
  this.isSignupMode = false;
  this.isLoginMode = true;
}

switchToSignup() {
  this.isSignupMode = true;
  this.isForgotMode = false;
  this.isLoginMode = false;
}

switchToLogin() {
 this.isSignupMode = false;
 this.isLoginMode = true;
  this.isForgotMode = false;
}

skipLogin() {
  this.closeModal();
  this.showCustomToast('Login skipped','warning');
}

login() {
  if (!this.loginData.identifier || !this.loginData.password) {
    this.showCustomToast("Enter all fields", 'danger');
    return;
  }

  this.isLoading = true;

  this.supermartService.login({
    mobile: this.loginData.identifier,
    password: this.loginData.password
  }).subscribe({
    next: (res: any) => {
       this.isLoading = false;
      this.showCustomToast("Login success", 'success');
      localStorage.setItem("supermart_user", JSON.stringify(res));
      this.closeModal();
    },
    error: () => {
       this.isLoading = false;
      this.showCustomToast("Invalid login", 'danger');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}


closeModal() {
  this.isModalOpen = false;
  this.getCategories();
  this.getProducts();
}



signup() {
  if (!this.signupData.name || !this.signupData.mobile || !this.signupData.password) {
    this.showCustomToast("Please fill all details", 'danger');
    return;
  }

  if (this.signupData.password !== this.signupData.confirm) {
    this.showCustomToast("Passwords do not match", 'danger');
    return;
  }

  this.isLoading = true;

  const payload = {
    customerId: "CUST" + Math.floor(Math.random() * 9000 + 1000),
    name: this.signupData.name,
    mobile: this.signupData.mobile,
    password: this.signupData.password,
    address: this.signupData.address,
    points: 0
  };

  this.supermartService.addCustomer(payload).subscribe({
    next: () => {
      this.showCustomToast("Account created successfully", 'success');
      this.switchToLogin();
      this.closeModal();
    },
    error: () => {
      this.showCustomToast("Signup failed", 'danger');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}



openForgotPassword() {
  this.isSignupMode = false;
  this.isForgotMode = true;
  this.isLoginMode = false;
}

sendResetOTP() {
  if (!this.forgotData.identifier) {
    this.showCustomToast("Enter your registered email or phone",'danger');
    return;
  }

  // TODO: call API → send OTP
  console.log("Sending OTP to", this.forgotData.identifier);

  this.otpSent = true;
}

resetPassword() {
   if (!this.forgotData.password) {
    this.showCustomToast("Enter new password",'danger');
    return;
  } 

  const body = {
    mobile: this.forgotData.identifier,   // mobile number
    newPassword: this.forgotData.password
  };

  this.supermartService.forgotPassword(body).subscribe({
    next: (res) => {
      this.showCustomToast("Password updated successfully!",'success');
      this.switchToLogin();
      this.isForgotMode = false;
    },
    error: (err) => {
      console.log(err);
      this.showCustomToast("Failed to update password",'danger');
    }
  });
}


}
