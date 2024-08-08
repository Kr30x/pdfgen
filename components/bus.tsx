"use client"

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, ArrowUp, ArrowDown, X, Bus, FileText, Database, UserPlus, UserMinus, Edit } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import PDFDocument from './bustripdocument';
import Link from 'next/link';
import { Badge } from './ui/badge';

const BusTripPDFGenerator = () => {
  const [buses, setBuses] = useState([]);
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isBusDialogOpen, setIsBusDialogOpen] = useState(false);
  const [isManualAddDialogOpen, setIsManualAddDialogOpen] = useState(false);
  const [isEditHeaderDialogOpen, setIsEditHeaderDialogOpen] = useState(false);
  const [currentInputIndex, setCurrentInputIndex] = useState(null);
  const [headerText, setHeaderText] = useState('');
  const [busHeader, setBusHeader] = useState('');
  const [editingBusIndex, setEditingBusIndex] = useState(null);
  const [editingBusHeader, setEditingBusHeader] = useState('');
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [grades, setGrades] = useState([]);
  const [manualPersonName, setManualPersonName] = useState('');
  const [date, setDate] = useState('');
  const [roadTrack, setRoadTrack] = useState('');
  const [isDatabaseDialogOpen, setIsDatabaseDialogOpen] = useState(false);

  useEffect(() => {
    const savedPeople = localStorage.getItem('schoolDatabasePeople');
    if (savedPeople) {
      const parsedPeople = JSON.parse(savedPeople);
      setPeople(parsedPeople);
      
      // Extract unique grades
      const uniqueGrades = [...new Set(parsedPeople.map(person => person.grade))].filter(Boolean).sort();
      setGrades(uniqueGrades);
    }
  }, []);

  const handleDatabaseIconClick = () => {
    setIsDatabaseDialogOpen(true);
  };

  const addBus = () => {
    const studentsOfGrades = people.filter(person => selectedGrades.includes(person.grade));
    const groupedStudents = studentsOfGrades.sort((a, b) => a.grade - b.grade);
    const newBus = {
      id: Date.now(),
      header: busHeader,
      passengers: groupedStudents.map(student => ({
        name: student.name,
        grade: student.grade,
        passport: student.passport,
        birthdate: student.birthdate,
        contactnumber: student.contactnumber || '' // Include contact number
      })),
    };
    setBuses([...buses, newBus]);
  };

  const handlePersonSelect = (person) => {
    if (currentInputIndex !== null) {
      const updatedBuses = [...buses];
      const newPassenger = { 
        name: person.name, 
        grade: person.grade,
        passport: person.passport,
        birthdate: person.birthdate,
        contactnumber: person.contactnumber || '' // Include contact number
      };
      if (currentInputIndex.passengerIndex === updatedBuses[currentInputIndex.busIndex].passengers.length) {
        updatedBuses[currentInputIndex.busIndex].passengers.push(newPassenger);
      } else {
        updatedBuses[currentInputIndex.busIndex].passengers[currentInputIndex.passengerIndex] = newPassenger;
      }
      updatedBuses[currentInputIndex.busIndex].passengers.sort((a, b) => a.grade - b.grade);
      setBuses(updatedBuses);
    }
    setIsSearchDialogOpen(false);
    setSearchTerm('');
  };

  const hashGrade = (grade) => {
    let hash = 0;
    for (let i = 0; i < grade.length; i++) {
      const char = grade.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
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

  const openSearchDialog = (busIndex, passengerIndex) => {
    setCurrentInputIndex({ busIndex, passengerIndex });
    setIsSearchDialogOpen(true);
  };

  const deleteBus = (index) => {
    const updatedBuses = buses.filter((_, i) => i !== index);
    setBuses(updatedBuses);
  };

  const moveBus = (index, direction) => {
    const updatedBuses = [...buses];
    const bus = updatedBuses[index];
    updatedBuses.splice(index, 1);
    updatedBuses.splice(index + direction, 0, bus);
    setBuses(updatedBuses);
  };

  const clearBus = (index) => {
    const updatedBuses = [...buses];
    updatedBuses[index].passengers = [];
    setBuses(updatedBuses);
  };

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBus = () => {
    addBus();
    setIsBusDialogOpen(false);
    setBusHeader('');
    setSelectedGrades([]);
  };

  const handleManualAddPerson = (busIndex) => {
    if (manualPersonName.trim()) {
      const updatedBuses = [...buses];
      updatedBuses[busIndex].passengers.push(manualPersonName.trim());
      setBuses(updatedBuses);
      setManualPersonName('');
      setIsManualAddDialogOpen(false);
    }
  };

  const deletePerson = (busIndex, passengerIndex) => {
    const updatedBuses = [...buses];
    updatedBuses[busIndex].passengers.splice(passengerIndex, 1);
    setBuses(updatedBuses);
  };

  const handleGradeToggle = (grade) => {
    setSelectedGrades(prev => 
      prev.includes(grade)
        ? prev.filter(g => g !== grade)
        : [...prev, grade]
    );
  };

  const openEditHeaderDialog = (index) => {
    setEditingBusIndex(index);
    setEditingBusHeader(buses[index].header);
    setIsEditHeaderDialogOpen(true);
  };

  const handleEditBusHeader = () => {
    const updatedBuses = [...buses];
    updatedBuses[editingBusIndex].header = editingBusHeader;
    setBuses(updatedBuses);
    setIsEditHeaderDialogOpen(false);
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
          onClick={() => setIsBusDialogOpen(true)} 
          title="Add Bus"
          className="hover:bg-blue-100 transition-colors duration-200"
        >
          <Bus className="h-6 w-6" />
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
              buses={buses.map(bus => ({
                ...bus,
                passengers: bus.passengers.map((passenger, index) => ({
                  id: index + 1,
                  name: passenger.name,
                  birthdate: passenger.birthdate, 
                  passport: passenger.passport, 
                  contactNumber: passenger.contactnumber || '',
                }))
              }))} 
              date={date} 
              roadTrack={roadTrack} 
            />
          }
          fileName="school_bus_trip.pdf"
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
        :null}</>
      </div>

      {/* Main content */}
      <div className="flex-grow ml-16 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">School Bus Trip Planner</h1>
        
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
          <div>
            <Label htmlFor="road-track" className="text-sm font-medium text-gray-700 mb-1 block">
              Road Track
            </Label>
            <Input
              id="road-track"
              value={roadTrack}
              onChange={(e) => setRoadTrack(e.target.value)}
              placeholder="Enter road track information"
              className="w-full"
            />
          </div>
        </div>

        {buses.map((bus, busIndex) => (
          <div key={bus.id} className="mb-6 p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
                Bus {busIndex + 1} - {bus.header}
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => openEditHeaderDialog(busIndex)} title="Edit Bus Header">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => openSearchDialog(busIndex, bus.passengers.length)} 
                  title="Add Person"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => deleteBus(busIndex)} title="Delete Bus">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => moveBus(busIndex, -1)} disabled={busIndex === 0} title="Move Bus Up">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => moveBus(busIndex, 1)} disabled={busIndex === buses.length - 1} title="Move Bus Down">
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => clearBus(busIndex)} title="Clear Bus">
                  <X className="h-4 w-4" />
                </Button>
                
              </div>
            </div>
            {bus.passengers.map((passenger, passengerIndex) => (
              <div key={passengerIndex} className="mb-4 flex items-center space-x-2">
                <Input
                  value={passenger.name}
                  onClick={() => openSearchDialog(busIndex, passengerIndex)}
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
                <Button variant="outline" size="icon" onClick={() => deletePerson(busIndex, passengerIndex)} title="Delete Person">
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

      <Dialog open={isBusDialogOpen} onOpenChange={setIsBusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bus</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="bus-header" className="text-sm font-medium text-gray-700 mb-1 block">
                Bus Header
              </Label>
              <Input
                id="bus-header"
                value={busHeader}
                onChange={(e) => setBusHeader(e.target.value)}
                placeholder="Enter bus header"
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
            <Button onClick={handleAddBus}>Add Bus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isManualAddDialogOpen} onOpenChange={setIsManualAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manually Add Person</DialogTitle>
          </DialogHeader>
          <Input
            value={manualPersonName}
            onChange={(e) => setManualPersonName(e.target.value)}
            placeholder="Enter person's name"
          />
          <DialogFooter>
            <Button onClick={() => handleManualAddPerson(currentInputIndex.busIndex)}>Add Person</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditHeaderDialogOpen} onOpenChange={setIsEditHeaderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bus Header</DialogTitle>
          </DialogHeader>
          <Input
            value={editingBusHeader}
            onChange={(e) => setEditingBusHeader(e.target.value)}
            placeholder="Enter new bus header"
          />
          <DialogFooter>
            <Button onClick={handleEditBusHeader}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
    </div>
  );
};

export default BusTripPDFGenerator;