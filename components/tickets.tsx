"use client"

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, ArrowUp, ArrowDown, X, Plane, Train, FileText, Database, UserPlus, UserMinus, Edit } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import PDFDocument from './ticketsdocument';

const TicketOrderPDFGenerator = () => {
  const [tickets, setTickets] = useState([]);
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isEditTicketDialogOpen, setIsEditTicketDialogOpen] = useState(false);
  const [currentInputIndex, setCurrentInputIndex] = useState(null);
  const [headerText, setHeaderText] = useState('');
  const [ticketHeader, setTicketHeader] = useState('');
  const [editingTicketIndex, setEditingTicketIndex] = useState(null);
  const [editingTicketHeader, setEditingTicketHeader] = useState('');
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [grades, setGrades] = useState([]);
  const [date, setDate] = useState('');
  const [ticketType, setTicketType] = useState('airplane');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [isDatabaseDialogOpen, setIsDatabaseDialogOpen] = useState(false);

  useEffect(() => {
    const savedPeople = localStorage.getItem('schoolDatabasePeople');
    if (savedPeople) {
      const parsedPeople = JSON.parse(savedPeople);
      setPeople(parsedPeople);
      
      const uniqueGrades = [...new Set(parsedPeople.map(person => person.grade))].filter(Boolean).sort();
      setGrades(uniqueGrades);
    }
  }, []);

  const handleDatabaseIconClick = () => {
    setIsDatabaseDialogOpen(true);
  };

  const addTicket = () => {
    const studentsOfGrades = people.filter(person => selectedGrades.includes(person.grade));
    const groupedStudents = studentsOfGrades.sort((a, b) => a.grade - b.grade);
    const newTicket = {
      id: Date.now(),
      header: ticketHeader,
      type: ticketType,
      departure,
      arrival,
      passengers: groupedStudents.map(student => ({
        name: student.name,
        grade: student.grade,
        passport: student.passport,
        birthdate: student.birthdate,
        contactnumber: student.contactnumber || ''
      })),
    };
    setTickets([...tickets, newTicket]);
  };

  const handlePersonSelect = (person) => {
    if (currentInputIndex !== null) {
      const updatedTickets = [...tickets];
      const newPassenger = { 
        name: person.name, 
        grade: person.grade,
        passport: person.passport,
        birthdate: person.birthdate,
        contactnumber: person.contactnumber || ''
      };
      if (currentInputIndex.passengerIndex === updatedTickets[currentInputIndex.ticketIndex].passengers.length) {
        updatedTickets[currentInputIndex.ticketIndex].passengers.push(newPassenger);
      } else {
        updatedTickets[currentInputIndex.ticketIndex].passengers[currentInputIndex.passengerIndex] = newPassenger;
      }
      updatedTickets[currentInputIndex.ticketIndex].passengers.sort((a, b) => a.grade - b.grade);
      setTickets(updatedTickets);
    }
    setIsSearchDialogOpen(false);
    setSearchTerm('');
  };

  const hashGrade = (grade) => {
    let hash = 0;
    for (let i = 0; i < grade.length; i++) {
      const char = grade.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const getGradeBadgeColor = (grade) => {
    const colors = [
      'bg-red-400', 'bg-blue-400', 'bg-green-400', 
      'bg-yellow-400', 'bg-purple-400', 'bg-pink-400',
      'bg-indigo-400', 'bg-teal-400', 'bg-orange-400'
    ];
    const hash = hashGrade(grade.toString());
    return colors[hash % colors.length];
  };

  const openSearchDialog = (ticketIndex, passengerIndex) => {
    setCurrentInputIndex({ ticketIndex, passengerIndex });
    setIsSearchDialogOpen(true);
  };

  const deleteTicket = (index) => {
    const updatedTickets = tickets.filter((_, i) => i !== index);
    setTickets(updatedTickets);
  };

  const moveTicket = (index, direction) => {
    const updatedTickets = [...tickets];
    const ticket = updatedTickets[index];
    updatedTickets.splice(index, 1);
    updatedTickets.splice(index + direction, 0, ticket);
    setTickets(updatedTickets);
  };

  const clearTicket = (index) => {
    const updatedTickets = [...tickets];
    updatedTickets[index].passengers = [];
    setTickets(updatedTickets);
  };

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTicket = () => {
    addTicket();
    setIsTicketDialogOpen(false);
    setTicketHeader('');
    setSelectedGrades([]);
    setTicketType('airplane');
    setDeparture('');
    setArrival('');
  };

  const deletePerson = (ticketIndex, passengerIndex) => {
    const updatedTickets = [...tickets];
    updatedTickets[ticketIndex].passengers.splice(passengerIndex, 1);
    setTickets(updatedTickets);
  };

  const handleGradeToggle = (grade) => {
    setSelectedGrades(prev => 
      prev.includes(grade)
        ? prev.filter(g => g !== grade)
        : [...prev, grade]
    );
  };

  const openEditTicketDialog = (index) => {
    setEditingTicketIndex(index);
    setEditingTicketHeader(tickets[index].header);
    setIsEditTicketDialogOpen(true);
  };

  const handleEditTicketHeader = () => {
    const updatedTickets = [...tickets];
    updatedTickets[editingTicketIndex].header = editingTicketHeader;
    setTickets(updatedTickets);
    setIsEditTicketDialogOpen(false);
  };

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsTicketDialogOpen(true)} 
          title="Add Ticket"
          className="hover:bg-blue-100 transition-colors duration-200"
        >
          <Plane className="h-6 w-6" />
        </Button>
        <div className="flex-grow" />
        <Link href="/">
          <Button 
            variant="ghost"
            size="icon"
            className="hover:bg-blue-100 transition-colors duration-200"
            title="Go to Database"
            onClick={handleDatabaseIconClick}
          >
            <Database className="h-6 w-6" />
          </Button>
        </Link>
        <>{isClient ? 
        <PDFDownloadLink
          document={
            <PDFDocument 
              header={headerText} 
              tickets={tickets.map(ticket => ({
                ...ticket,
                passengers: ticket.passengers.map((passenger, index) => ({
                  id: index + 1,
                  name: passenger.name,
                  birthdate: passenger.birthdate, 
                  passport: passenger.passport, 
                  contactNumber: passenger.contactnumber || '',
                }))
              }))} 
              date={date}
            />
          }
          fileName="school_tickets.pdf"
        >
          {({ blob, url, loading, error }) => (
            <Button 
              variant="ghost"
              size="icon"
              className="hover:bg-blue-100 transition-colors duration-200"
              disabled={loading}
              title={loading ? 'Generating PDF...' : 'Generate PDF'}
            >
              <FileText className="h-6 w-6" />
            </Button>
          )}
        </PDFDownloadLink>
        : null }
        </>
      </div>

      {/* Main content */}
      <div className="flex-grow ml-16 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">School Trip Ticket Planner</h1>
        
        <div className="mb-6 space-y-4">
          <div>
            <Label htmlFor="header-text" className="text-sm font-medium text-gray-700 mb-1 block">
              PDF Header Text
            </Label>
            <Input
              id="header-text"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="Enter header text for the PDF"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-1 block">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {tickets.map((ticket, ticketIndex) => (
          <div key={ticket.id} className="mb-6 p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {ticket.type === 'airplane' ? 'Flight' : 'Train'} {ticketIndex + 1} - {ticket.header}
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => openEditTicketDialog(ticketIndex)} title="Edit Ticket Header">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => openSearchDialog(ticketIndex, ticket.passengers.length)} 
                  title="Add Person"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => deleteTicket(ticketIndex)} title="Delete Ticket">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => moveTicket(ticketIndex, -1)} disabled={ticketIndex === 0} title="Move Ticket Up">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => moveTicket(ticketIndex, 1)} disabled={ticketIndex === tickets.length - 1} title="Move Ticket Down">
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => clearTicket(ticketIndex)} title="Clear Ticket">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <p><strong>Type:</strong> {ticket.type === 'airplane' ? 'Airplane' : 'Train'}</p>
              <p><strong>Departure:</strong> {ticket.departure}</p>
              <p><strong>Arrival:</strong> {ticket.arrival}</p>
            </div>
            {ticket.passengers.map((passenger, passengerIndex) => (
              <div key={passengerIndex} className="mb-4 flex items-center space-x-2">
                <Input
                  value={passenger.name}
                  onClick={() => openSearchDialog(ticketIndex, passengerIndex)}
                  readOnly
                  placeholder="Click to select a person"
                  className="mt-1 cursor-pointer hover:bg-gray-50 flex-grow"
                />
                <span className={`
                  ${getGradeBadgeColor(passenger.grade)} 
                  text-white text-xs font-semibold 
                  px-2 py-0.5 rounded-full min-w-10 text-center
                `}>
                  {passenger.grade}
                </span>
                <Button variant="outline" size="icon" onClick={() => deletePerson(ticketIndex, passengerIndex)} title="Delete Person">
                  <UserMinus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Person</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="mt-4 max-h-60 overflow-auto">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => handlePersonSelect(person)}
              >
                <span>{person.name}</span>
                <Badge className={`${getGradeBadgeColor(person.grade)} text-white min-w-10 text-center justify-center`}>
                  {person.grade}
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Ticket</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="ticket-header" className="text-sm font-medium text-gray-700 mb-1 block">
                Ticket Header
              </Label>
              <Input
                id="ticket-header"
                value={ticketHeader}
                onChange={(e) => setTicketHeader(e.target.value)}
                placeholder="Enter ticket header"
              />
            </div>
            <div>
              <Label htmlFor="ticket-type" className="text-sm font-medium text-gray-700 mb-1 block">
                Ticket Type
              </Label>
              <Select value={ticketType} onValueChange={setTicketType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="airplane">Airplane</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="departure" className="text-sm font-medium text-gray-700 mb-1 block">
                Departure
              </Label>
              <Input
                id="departure"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                placeholder="Enter departure location"
              />
            </div>
            <div>
              <Label htmlFor="arrival" className="text-sm font-medium text-gray-700 mb-1 block">
                Arrival
              </Label>
              <Input
                id="arrival"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                placeholder="Enter arrival location"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Select Grades
              </Label>
              <div className="space-y-2">
                {grades.map((grade) => (
                  <div key={grade} className="flex items-center">
                    <Checkbox
                      id={`grade-${grade}`}
                      checked={selectedGrades.includes(grade)}
                      onCheckedChange={() => handleGradeToggle(grade)}
                    />
                    <label
                      htmlFor={`grade-${grade}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Grade {grade}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTicket}>Add Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditTicketDialogOpen} onOpenChange={setIsEditTicketDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ticket Header</DialogTitle>
          </DialogHeader>
          <Input
            value={editingTicketHeader}
            onChange={(e) => setEditingTicketHeader(e.target.value)}
            placeholder="Enter new ticket header"
          />
          <DialogFooter>
            <Button onClick={handleEditTicketHeader}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketOrderPDFGenerator;