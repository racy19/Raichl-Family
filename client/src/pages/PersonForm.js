import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from '../utils/api';
import { getDateFull, getDateYear } from '../utils/dateStringFormatter';

import FlashMessage from '../components/form/FlashMessage';
import InputField from '../components/form/InputField';

const PersonForm = () => {
    const { id } = useParams();

    const [personNameState, setPersonName] = useState("");
    const [personSurnameState, setPersonSurname] = useState("");
    const [dateBirthState, setDateBirth] = useState("0001-01-01");
    const [people, setPeople] = useState([]);
    const [motherState, setMother] = useState("");
    const [fatherState, setFather] = useState("");

    const [genderState, setGender] = useState("");

    const [motherOptions, setMotherOptions] = useState("");
    const [fatherOptions, setFatherOptions] = useState("");

    const [sentState, setSent] = useState(false);
    const [successState, setSuccess] = useState(false);
    const [errorState, setError] = useState(null);

    const navigate = useNavigate();

    const gender = [
        { value: 'muž', label: 'muž' },
        { value: 'žena', label: 'žena' },
    ]

    const sent = sentState;
    const success = successState;

    useEffect(() => {
        apiGet("/people").then((data) => {
            setPeople(data);
            setMotherOptions(people.filter((person) => person.gender === 'žena').map((value, i) => (
                { value: value._id, label: `${value.name} ${value.surname} *${getDateYear(value.dateBirth)}`, key: i }
            )));
            setFatherOptions(people.filter((person) => person.gender === 'muž').map((value, i) => (
                { value: value._id, label: `${value.name} ${value.surname} *${getDateYear(value.dateBirth)}`, key: i }
            )));
    })

    }, [people,id]);

    useEffect(() => {
        if (id) {
            apiGet("/people/" + id).then((data) => {
                setPersonName(data.name);
                setPersonSurname(data.surname);
                setDateBirth(getDateFull(data.dateBirth));
                setGender(data.gender === 'muž' ? gender[0] : data.gender === 'žena' ? gender[1] : "");
                if(motherOptions) setMother(motherOptions.filter((person) => person.value === data.motherID));
                if(fatherOptions) setFather(fatherOptions.filter((person) => person.value === data.fatherID));
            });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = {
            name: personNameState,
            surname: personSurnameState,
            dateBirth: dateBirthState,
            gender: genderState.value,
            motherID: motherState.value,
            fatherID: fatherState.value,
        };

        console.log(body);

        (id
            ? apiPut('/people/' + id, body)
            : apiPost('/people/', body)
        )
            .then((data) => {
                setSent(true);
                setSuccess(true);
                navigate('/people');
                console.log('succcess', data)
            })
            .catch((error) => {
                console.log(error.message)
                setError(error.message)
                setSent(true);
                setSuccess(false);
            });
    }


    return (
        <div>
            <h1>{id ? 'Upravit' : 'Vytvořit'} osobu</h1>
            <hr />
            {errorState ? <div className='alert alert-danger'>{errorState}</div> : null}
            {sent && success ? (
                <FlashMessage
                    theme={'success'}
                    text={'Uložení osoby proběhlo úspěšně.'}
                />
            ) : null}

            <form onSubmit={handleSubmit}>
                <InputField
                    required={true}
                    type="text"
                    name="personName"
                    min="2"
                    label="Jméno"
                    prompt="Zadejte jméno"
                    value={personNameState}
                    handleChange={(e) => {
                        setPersonName(e.target.value);
                    }}
                />

                <InputField
                    required={true}
                    type="text"
                    name="personSurname"
                    min="2"
                    label="Příjmení"
                    prompt="Zadejte příjmení"
                    value={personSurnameState}
                    handleChange={(e) => {
                        setPersonSurname(e.target.value);
                    }}
                />

                <InputField
                    required={false}
                    type="date"
                    name="dateBirth"
                    label="Datum narození"
                    prompt="Zadejte datum narození"
                    min="0000-01-01"
                    value={dateBirthState}
                    handleChange={(e) => {
                        setDateBirth(e.target.value);
                    }}
                />

                <label htmlFor="gender">Pohlaví:</label>
                <Select
                    required="true"
                    options={gender}
                    id="gender"
                    value={genderState}
                    onChange={(option) => {
                        setGender(option);
                    }}
                />

                <label htmlFor="motherID">Vyber matku:</label>
                <Select
                    options={motherOptions}
                    id="motherID"
                    onChange={(option) => {
                        setMother(option);
                    }}
                />

                <label htmlFor="fatherID">Vyber otce:</label>
                <Select
                    options={fatherOptions}
                    id="fatherID"
                    onChange={(option) => {
                        setFather(option);
                    }}
                />
                <br />
                <input type="submit" className="btn btn-primary" value="Uložit" />
                {id ? 
                <>
                <Link to={"/people/show/" + id} className="btn btn-warning">Zpět na detail</Link> 
                <Link to={"/people/"} className="btn btn-success">Zpět výpis osob</Link>
                </>
                : <Link to={"/people"} className="btn btn-danger">Zrušit</Link>}
            </form>
        </div>
    );
}

export default PersonForm;