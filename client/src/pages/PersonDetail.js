import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../utils/api";
import { dateStringFormatter } from "../utils/dateStringFormatter";

// return list of information about person with id
// id get form url param 
// return list of relatives based on their ids

const PersonDetail = () => {
    const { id } = useParams();
    const [person, setPerson] = useState('');
    const [people, setPeople] = useState([]);
    const [mother, setMother] = useState('');
    const [father, setFather] = useState('');
    const [siblings, setSiblings] = useState(null);

    useEffect(() => {
        apiGet("/people").then((data) => {
            setPeople(data);
        })
    }, [people])

    useEffect(() => {
        apiGet("/people/" + id)
            .then((data) => {
                setPerson({
                    name: data.name,
                    surname: data.surname,
                    dateBirth: dateStringFormatter(data.dateBirth, true),
                    motherID: data.motherID,
                    fatherID: data.fatherID,
                    _id: data._id,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    useEffect(() => {
        if (person.motherID) {
            apiGet("/people/" + person.motherID)
                .then((data) => {
                    setMother({
                        name: data.name,
                        surname: data.surname,
                        link: 'http://localhost:3000/people/show/' + person.motherID,
                    });
                });
        }
        if (person.fatherID) {
            apiGet("/people/" + person.fatherID)
                .then((data) => {
                    setFather({
                        name: data.name,
                        surname: data.surname,
                        link: 'http://localhost:3000/people/show/' + person.fatherID,
                    });
                });
        }
        // get all people who has the same mother or father (includes half-siblings)
        let siblingsArray = [];
        if (person.motherID) {
            siblingsArray = siblingsArray.concat(people.filter((item) => (item.motherID === person.motherID) && item._id !== person._id));
        }
        if (person.fatherID) {
            siblingsArray = siblingsArray.concat(people.filter((item) => (item.fatherID === person.fatherID) && item._id !== person._id));
        }
        setSiblings([...new Set(siblingsArray)]);
    }, [person.motherID, person.fatherID])

    if (!person && !mother) {
        return (
            <>
                <h1>Detail osoby</h1>
                <hr />
                <div className="spinner-border" role="status">
                </div>
                <p>Načítám...</p>
            </>
        )
    }

    return (
        <div>
            <h1>Detail osoby</h1>
            <hr />
            <h3>{person.name} {person.surname}</h3>
            <p>
                nar. {person.dateBirth} <br />
                matka: <a href={mother.link}>{mother.name} {mother.surname}</a> <br />
                otec: <a href={father.link}>{father.name} {father.surname}</a> <br />
                sourozenci: {siblings.map((item) => (<span><Link to={"/people/show/" + item._id}>{item.name} {item.surname}</Link> </span>))}
            </p>
            <Link to={"/people"} className="btn btn-success">
                Zpět na výpis osob
            </Link>
            <Link to={"/people/edit/" + id} className="btn btn-warning">
                Upravit
            </Link>
        </div>
    );
};

export default PersonDetail;