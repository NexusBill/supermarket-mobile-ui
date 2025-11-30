import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupermartService {

  private baseUrl = "https://supermartspring.vercel.app/api/nexus_supermart";

  constructor(private http: HttpClient) {}

  // ------------------- CUSTOMERS -------------------


  // Create New Account
  addCustomer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers`, data);
  }

  // Login
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers/login`, data);
  }

  // Forgot Password
  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers/forgot-password`, data);
  }

  // Fetch all customers (optional)
  getCustomers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers`);
  }

  // ------------------- ORDERS -------------------

  // Place Order
  placeOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, order);
  }

  // Get Orders
  getOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders`);
  }

  // Cancel Order
  cancelOrder(orderId: string, body: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}`, body);
  }

}
