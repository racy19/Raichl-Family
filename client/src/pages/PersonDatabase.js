import React, { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../utils/api";
import PersonTable from "../components/PersonTable";

const PersonDatabase = () => {
  const [people, setPeople] = useState([]);

  // list of people to show
  useEffect(() => {
    apiGet("/people").then((data) => setPeople(data));
  }, []);

  // handler for delete button
  const deletePerson = async (id) => {
    if (window.confirm('Skutečně smazat osobu?')) {
      try {
        await apiDelete("/people/" + id);
        setPeople(people.filter((person) => person._id !== id));
      }
      catch (error) {
        alert(error.message);
      };
    }
  }

  return (
    <div>
      <h1>Osoby</h1>
      <PersonTable deletePerson={deletePerson} items={people} label="Aktuální počet osob v databázi:" />
    </div>
  );
};

export default PersonDatabase;