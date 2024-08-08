"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, ArrowUp, ArrowDown, X, User, Users, Home, Star, FileText, Database } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PDFDocument from './hoteldocument';
import Link from 'next/link';

const PDFGenerator = () => {
  const [rooms, setRooms] = useState([]);
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isLuxRoomDialogOpen, setIsLuxRoomDialogOpen] = useState(false);
  const [luxRoomOccupants, setLuxRoomOccupants] = useState(2);
  const [currentInputIndex, setCurrentInputIndex] = useState(null);
  const [headerText, setHeaderText] = useState('');

  useEffect(() => {
    const savedPeople = localStorage.getItem('schoolDatabasePeople');
    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
    }
  }, []);
// @ts-expect-error
  const addRoom = (type, occupants = null) => {
    const newRoom = {
      id: Date.now(),
      type,
      occupants: Array(occupants || getRoomCapacity(type)).fill(''),
    };
    // @ts-expect-error
    setRooms([...rooms, newRoom]);
  };
// @ts-expect-error
  const getRoomCapacity = (type) => {
    switch (type) {
      case 'single': return 1;
      case 'double': return 2;
      case 'triple': return 3;
      case 'lux': return luxRoomOccupants;
      default: return 0;
    }
  };
// @ts-expect-error
  const handlePersonSelect = (person) => {
    if (currentInputIndex !== null) {
      const updatedRooms = [...rooms];
      // @ts-expect-error
      updatedRooms[currentInputIndex.roomIndex].occupants[currentInputIndex.occupantIndex] = person.name;
      setRooms(updatedRooms);
    }
    setIsSearchDialogOpen(false);
    setSearchTerm('');
  };
// @ts-expect-error
  const openSearchDialog = (roomIndex, occupantIndex) => {
    // @ts-expect-error
    setCurrentInputIndex({ roomIndex, occupantIndex });
    setIsSearchDialogOpen(true);
  };
// @ts-expect-error
  const deleteRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };
// @ts-expect-error
  const moveRoom = (index, direction) => {
    const updatedRooms = [...rooms];
    const room = updatedRooms[index];
    updatedRooms.splice(index, 1);
    updatedRooms.splice(index + direction, 0, room);
    setRooms(updatedRooms);
  };
// @ts-expect-error
  const clearRoom = (index) => {
    const updatedRooms = [...rooms];
    // @ts-expect-error
    updatedRooms[index].occupants = updatedRooms[index].occupants.map(() => '');
    setRooms(updatedRooms);
  };

  const filteredPeople = people.filter(person =>
// @ts-expect-error
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLuxRoom = () => {
// @ts-expect-error
    addRoom('lux', luxRoomOccupants);
    setIsLuxRoomDialogOpen(false);
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
          onClick={() => addRoom('single')} 
          title="Add Single Room"
          className="hover:bg-blue-100 transition-colors duration-200"
        >
          <User className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => addRoom('double')} 
          title="Add Double Room"
          className="hover:bg-blue-100 transition-colors duration-200"
        >
          <Users className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => addRoom('triple')} 
          title="Add Triple Room"
          className="hover:bg-blue-100 transition-colors duration-200"
        >
          <Home className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsLuxRoomDialogOpen(true)} 
          title="Add Luxury Room"
          className="hover:bg-blue-100 transition-colors duration-200"
        >
          <Star className="h-6 w-6" />
        </Button>
        <div className="flex-grow" />
        <Link href="/">
          <Button 
            variant="ghost"
            size="icon"
            className="hover:bg-blue-100 transition-colors duration-200"
            title="Go to Database"
          >
            <Database className="h-6 w-6" />
          </Button>
        </Link>
          <>{isClient ?  
            <PDFDownloadLink
              document={<PDFDocument header={headerText} rooms={rooms} people={people} />}
              fileName="hotel_reservation.pdf"
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
            </PDFDownloadLink> : null
            }
          </>
      </div>

      {/* Main content */}
      <div className="flex-grow ml-16 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Hotel Room Reservation</h1>
        
        <div className="mb-6">
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

        {rooms.map((room, roomIndex) => (
          // @ts-expect-error
          <div key={room.id} className="mb-6 p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{
              // @ts-expect-error
              room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room ({room.occupants.length} person{room.occupants.length > 1 ? 's' : ''})</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => deleteRoom(roomIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => moveRoom(roomIndex, -1)} disabled={roomIndex === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => moveRoom(roomIndex, 1)} disabled={roomIndex === rooms.length - 1}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => clearRoom(roomIndex)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {// @ts-expect-error
            room.occupants.map((occupant, occupantIndex) => (
              <div key={occupantIndex} className="mb-4">
                
                <Label htmlFor={`occupant-${
                  // @ts-expect-error
                  room.id}-${occupantIndex}`} className="text-sm font-medium text-gray-700">
                  Person {occupantIndex + 1}
                </Label>
                <Input
                  id={`occupant-${
                    // @ts-expect-error
                    room.id}-${occupantIndex}`}
                  value={occupant}
                  onClick={() => openSearchDialog(roomIndex, occupantIndex)}
                  readOnly
                  placeholder="Click to select a person"
                  className="mt-1 cursor-pointer hover:bg-gray-50"
                />
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
                key={
                  // @ts-expect-error
                  person.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handlePersonSelect(person)}
              >
                {// @ts-expect-error
                person.name}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isLuxRoomDialogOpen} onOpenChange={setIsLuxRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Luxury Room</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="lux-room-occupants" className="text-sm font-medium text-gray-700 mb-1 block">
              Number of Occupants
            </Label>
            <Select value={luxRoomOccupants.toString()} onValueChange={(value) => setLuxRoomOccupants(parseInt(value))}>
              <SelectTrigger id="lux-room-occupants">
                <SelectValue placeholder="Select number of occupants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 People</SelectItem>
                <SelectItem value="3">3 People</SelectItem>
                <SelectItem value="4">4 People</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleAddLuxRoom}>Add Luxury Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDFGenerator;