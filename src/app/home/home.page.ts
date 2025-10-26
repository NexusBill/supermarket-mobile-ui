import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { HttpClient,HttpClientModule } from '@angular/common/http';
// nodemailer is a Node.js-only module and cannot be used in browser/Angular components.
// Move email-sending logic to a backend service (e.g. Node/Express) and call it via HTTP.
// import nodemailer from "nodemailer";

interface Category {
  id: string;
  name: string;
  icon: string; // image url
}

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  weight: string;
  price: number;
  image: string;
  isAdded: boolean;
  isLiked: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
imports: [
    CommonModule,
    FormsModule,       // <-- required for ngModel
    IonicModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ]})
export class HomePage {
  searchText = '';

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

  products: Product[] = [
    { id: 'p1', name: 'Mushroom Sauce', category: 'sauce', weight: '24oz', price: 8.92, image: 'https://via.placeholder.com/240x200?text=Mushroom',isAdded:false  ,isLiked:false,quantity:0},
    { id: 'p2', name: 'Ghetto Gastro', category: 'canned', weight: '1 Kg', price: 20.72, image: 'https://via.placeholder.com/240x200?text=Ghetto',isAdded:false  ,isLiked:false,quantity:0},
    { id: 'p3', name: 'Seasoned Avocado', category: 'fruits', weight: '0.5 Kg', price: 4.29, image: 'https://via.placeholder.com/240x200?text=Avocado',isAdded:false  ,isLiked:false,quantity:0},
    { id: 'p4', name: 'Organic Bananas', category: 'fruits', weight: '1 Kg', price: 1.99, image: 'https://via.placeholder.com/240x200?text=Bananas',isAdded:false  ,isLiked:false,quantity:0},
    { id: 'p5', name: 'Bread', category: 'breakfast', weight: '500g', price: 2.49, image: 'https://via.placeholder.com/240x200?text=Bread',isAdded:false  ,isLiked:false,quantity:0},
    { id: 'p6', name: 'Eggs', category: 'breakfast', weight: '12 pcs', price: 3.19, image: 'https://via.placeholder.com/240x200?text=Eggs',isAdded:false  ,isLiked:false,quantity:0},
    { id: 'p7', name: 'Orange Juice', category: 'breakfast', weight: '1 L', price: 3.99, image: 'https://via.placeholder.com/240x200?text=Juice',isAdded:false  ,isLiked:false,quantity:0},
    { id: 'p8', name: 'Potato Chips', category: 'snacks', weight: '200g', price: 2.99, image: 'https://via.placeholder.com/240x200?text=Chips',isAdded:false  ,isLiked:false,quantity:0},
    { id: 'p9', name: 'Chocolate Bar', category: 'snacks', weight: '100g', price: 1.49, image: 'https://via.placeholder.com/240x200?text=Chocolate',isAdded:false  ,isLiked:false,quantity:0},
    { id: 'p10', name: 'Mixed Nuts', category: 'snacks', weight: '150g', price: 5.49, image: 'https://via.placeholder.com/240x200?text=Nuts',isAdded:false  ,isLiked:false,quantity:0},
  ];
selectedProduct: Product [] = [];
wishlist: Product [] = [];
totalItemCount = 0;
totalPrice = 0;
isPanelOpen = false;
isHome = true;
isProfile = false;
isCart = false;
isWishlist = false;
resetStates(){
  this.isHome = false;
  this.isProfile = false;
  this.isCart = false;
  this.isWishlist = false;
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
 this.isHome = true;
 this.userName=localStorage.getItem("userName")||'';
  this.email=localStorage.getItem("emai")||'';
  this.address=localStorage.getItem("address")||'';
  this.phoneNumber=localStorage.getItem("phoneNumber")||'';
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
saveUserData(){
  localStorage.setItem("userName",this.userName);
  localStorage.setItem("emai",this.email);
  localStorage.setItem("address",this.address);
  localStorage.setItem("phoneNumber",this.phoneNumber);
  this.userName=this.email=this.address=this.phoneNumber='';
  
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
        'itemcount':this.selectedProduct.length,
        'amount': Math.round(this.totalPrice).toFixed(2),
        "table": html,
        'message': JSON.stringify(this.selectedProduct),
    }
};
let products:any[]=[];

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
user:{
  name: string;
  email: string;
} = {
  name: 'Kaviyarasan',
  email: ' kahjhj@gail.com'
}
suggestions: string[] = [
  'Milk',
  'Mango',
  'Maggi',
  'Bread',
  'Butter',
  'Basmati Rice',
  'Banana',
  'Biscuits',
  'Blueberry',
  'Broccoli'
];

filteredSuggestions: string[] = [];

onSearchChange() {
  const value = this.searchText.toLowerCase().trim();
  if (value.length === 0) {
    this.filteredSuggestions = [];
  } else {
    this.filteredSuggestions = this.suggestions.filter(item =>
      item.toLowerCase().includes(value)
    );
  }
}
   showAlert = false;
   alertEnabler() {
     this.showAlert = this.showAlert ? false : true;
   }

selectSuggestion(suggestion: string) {
  this.searchText = suggestion;
  this.filteredSuggestions = [];
}
constructor(private http: HttpClient) {}
addWishlist(item: any){
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
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
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
}
