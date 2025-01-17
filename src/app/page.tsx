"use client";

import { useCallback, useEffect, useState } from "react";
import { Table, TextInput, Label, Button } from "flowbite-react";

type Advocate = {
  firstName: string,
  lastName: string,
  city: string, 
  degree: string, 
  specialties: string[],
  yearsOfExperience: number,
  phoneNumber: number
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]> ([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  useEffect(() => {
    if(!searchTerm?.length) return;

    const searchTermLower = searchTerm.toLowerCase();

    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTermLower) ||
        advocate.lastName.toLowerCase().includes(searchTermLower) ||
        advocate.city.toLowerCase().includes(searchTermLower) ||
        advocate.degree.toLowerCase().includes(searchTermLower) ||
        advocate.specialties.join().toLowerCase().includes(searchTermLower) ||
        `${advocate.yearsOfExperience}`.includes(searchTermLower)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  }, [searchTerm]);

  const handleResetSearch = useCallback(() => {
    setFilteredAdvocates(advocates);
    setSearchTerm('');
  }, [setFilteredAdvocates, setSearchTerm]);

  return (
    <main style={{ margin: "24px" }}>
      <h1 className='text-2xl'>Solace Advocates</h1>
      <div className="flex gap-2 my-6 w-[500px]">
        <div className="flex-1">
          <Label htmlFor="search" value="Search" />
          <TextInput id="search" type="text" sizing="sm" placeholder="Enter search term" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Button size="xs" onClick={handleResetSearch} className="items-center self-end h-[34px] bg-green-900">Reset</Button>
      </div>
      <Table>
        <Table.Head className="text-white" theme={{cell: {base: 'bg-green-900 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg'}}}>
          <Table.HeadCell>First Name</Table.HeadCell>
          <Table.HeadCell>Last Name</Table.HeadCell>
          <Table.HeadCell>City</Table.HeadCell>
          <Table.HeadCell>Degree</Table.HeadCell>
          <Table.HeadCell>Specialties</Table.HeadCell>
          <Table.HeadCell>Years of Experience</Table.HeadCell>
          <Table.HeadCell>Phone Number</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {filteredAdvocates.map((advocate) => {
            return (
              <Table.Row key={`adv_${advocate.phoneNumber}`} className="bg-white text-gray-900">
              <Table.Cell>{advocate.firstName}</Table.Cell>
              <Table.Cell>{advocate.lastName}</Table.Cell>
              <Table.Cell>{advocate.city}</Table.Cell>
              <Table.Cell>{advocate.degree}</Table.Cell>
              <Table.Cell>{advocate.specialties.map((s, i) => (
                    <div key={`adv_${advocate.phoneNumber}_spec_${i}`}>{s}</div>
                  ))}
              </Table.Cell>
              <Table.Cell>{advocate.yearsOfExperience}</Table.Cell>
              <Table.Cell>{advocate.phoneNumber}</Table.Cell>
            </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </main>
  );
}
