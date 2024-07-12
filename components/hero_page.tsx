"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import * as XLSX from 'xlsx';
import { Hotel, Car, Ticket } from 'lucide-react';
import Link from 'next/link';

const SchoolDatabase = () => {
  const [people, setPeople] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    passport: "",
    birthdate: "",
    type: "student",
    grade: "",
    contactnumber: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedPeople = localStorage.getItem('schoolDatabasePeople');
    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
    } else {
      setPeople([
        { id: 1, name: "John Doe", passport: "AB123456", birthdate: "1990-01-01", type: "student", grade: "10", contactnumber: "+1234567890" },
        { id: 2, name: "Jane Smith", passport: "CD789012", birthdate: "1985-05-15", type: "employee", contactnumber: "+9876543210" },
      ]);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('schoolDatabasePeople', JSON.stringify(people));
    }
  }, [people, isClient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setPeople(people.map(person => person.id === editingId ? { ...formData, id: editingId } : person));
    } else {
      setPeople([...people, { ...formData, id: Date.now() }]);
    }
    setFormData({ name: "", passport: "", birthdate: "", type: "student", grade: "", contactnumber: "" });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (person) => {
    setFormData({
      name: person.name || "",
      passport: person.passport || "",
      birthdate: person.birthdate || "",
      type: person.type || "student",
      grade: person.grade || "",
      contactnumber: person.contactnumber || "",
    });
    setEditingId(person.id);
    setIsDialogOpen(true);
  };

  const handleTypeChange = (value) => {
    setFormData(prevData => ({
      ...prevData,
      type: value,
      grade: value === "employee" ? "" : prevData.grade
    }));
  };

  const handleDelete = (id) => {
    setPeople(people.filter(person => person.id !== id));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });
      
      const headers = data[0];
      const newPeople = data.slice(1).map((row, index) => {
        const person = {};
        headers.forEach((header, i) => {
          let value = row[i];
          if (header.toLowerCase() === 'birthdate') {
            const excelDate = XLSX.SSF.parse_date_code(value);
            value = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
          }
          person[header.toLowerCase()] = value;
        });
        person.id = Date.now() + index;
        person.type = person.type || "student";
        return person;
      });

      setPeople([...people, ...newPeople]);
      setIsImportDialogOpen(false);
    };
    reader.readAsBinaryString(file);
  };

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({ name: "", passport: "", birthdate: "", type: "student", grade: "", contactnumber: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="fixed left-0 top-0 bottom-0 w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-4">
        <Link href="/hotelgen">
          <Button 
            variant="ghost" 
            size="icon" 
            title="Hotel Generator"
            className="hover:bg-blue-100 transition-colors duration-200"
          >
            <Hotel className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/transfer">
          <Button 
            variant="ghost" 
            size="icon" 
            title="Transfer"
            className="hover:bg-blue-100 transition-colors duration-200"
          >
            <Car className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/tickets">
          <Button 
            variant="ghost" 
            size="icon" 
            title="Tickets"
            className="hover:bg-blue-100 transition-colors duration-200"
          >
            <Ticket className="h-6 w-6" />
          </Button>
        </Link>
      </div>
      {isClient && (
        <div className="flex-grow flex flex-col ml-16 p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">School Database</h1>
          
          <div className="mb-6 flex justify-between items-center">
            <div className="space-x-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openAddDialog}>
                Add Person
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsImportDialogOpen(true)}>
                Import from Excel
              </Button>
            </div>
            <div className="w-1/3">
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
  
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Person" : "Add New Person"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="passport">Passport ID</Label>
                  <Input id="passport" name="passport" value={formData.passport} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="birthdate">Birth Date</Label>
                  <Input id="birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="contactnumber">Contact Number</Label>
                  <Input id="contactnumber" name="contactnumber" value={formData.contactnumber} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.type === "student" && (
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Input id="grade" name="grade" value={formData.grade} onChange={handleInputChange} />
                  </div>
                )}
                <Button type="submit" className="w-full">{editingId ? "Update" : "Add"}</Button>
              </form>
            </DialogContent>
          </Dialog>
  
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import from Excel</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
              </div>
            </DialogContent>
          </Dialog>
  
          <div className="flex-grow overflow-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPeople.map((person) => (
                  <tr key={person.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.passport}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.birthdate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.contactnumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.type === "student" ? person.grade : "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(person)} className="mr-2">Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(person.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolDatabase;