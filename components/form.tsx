"use client"

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast"

const Form = ({ cart, onOrderComplete }) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(cart);
    try {
      const response = await axios.post('http://127.0.0.1:61759/buy', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        order: cart
      });
      console.log(response.data);
      
      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed and sent.",
        duration: 5000,
        variant: "default",
      });
      
      // Reset form after successful submission
      setFormData({ name: '', phone: '', address: '' });
      
      
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while placing your order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="Your phone number" type="tel" required />
        </div>
        <div className="grid gap-2 col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input className='w-full' id="address" value={formData.address} onChange={handleChange} placeholder="Delivery address" required />
        </div>
      </div>
      <Button type="submit" variant="default" className='w-full text-lg py-6 bg-purple-600 hover:bg-purple-700'>
        Place Order
      </Button>
    </form>
  );
};

export default Form;