"use client";

import { useCallback, useEffect, useState } from "react";
import { Table, TextInput, Label, Button } from "flowbite-react";
import { debounce } from "lodash";

type Advocate = {
  id: number,
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
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetches data from server with optional search param
  const fetchData = useCallback((search?: string) => {
    const url = search ? `/api/advocates?search=${search}` : "/api/advocates";
    fetch(url).then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
      });
    });
  }, []);

  // Debounce fetch function so it won't get called on every keystroke
  const debouncedFetch = useCallback(debounce(fetchData, 500), []);

  // Initial fetch of all unfiltered advocates
  useEffect(() => {
    fetchData();
  }, []);

  // When search input changes, call debounced fetch data function to fetch filtered advocates list
  const handleInputChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    debouncedFetch(newSearchTerm.toLowerCase());
  }, [setSearchTerm, debouncedFetch]);

  // Reset search - clear search term and refetch unfiltered advocates
  const handleResetSearch = useCallback(() => {
    setSearchTerm('');
    fetchData();
  }, [setSearchTerm, fetchData]);

  return (
    <main style={{ margin: "24px" }}>
      <h1 className='text-2xl'>Solace Advocates</h1>
      <div className="flex gap-2 my-6 w-[500px]">
        <div className="flex-1">
          <Label htmlFor="search" value="Search" />
          <TextInput id="search" type="text" sizing="sm" placeholder="Enter search term" value={searchTerm} onChange={(e) => handleInputChange(e.target.value)} />
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
          {advocates.map((advocate) => {
            return (
              <Table.Row key={`adv_${advocate.id}`} className="bg-white text-gray-900">
              <Table.Cell>{advocate.firstName}</Table.Cell>
              <Table.Cell>{advocate.lastName}</Table.Cell>
              <Table.Cell>{advocate.city}</Table.Cell>
              <Table.Cell>{advocate.degree}</Table.Cell>
              <Table.Cell>{advocate.specialties.map((s, i) => (
                    <div key={`adv_${advocate.id}_spec_${i}`}>{s}</div>
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
