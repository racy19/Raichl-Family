import React from "react";
import { Link } from 'react-router-dom';
import { dateStringFormatter } from "../utils/dateStringFormatter";

const PersonTable = ({ label, items, deletePerson }) => {
    return (
        <div>
            <p>
                {label} {items.length}
            </p>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Jméno</th>
                        <th>Datum narození</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item._id}>
                            <td><Link to ={"/people/show/" + item._id}>{item.name} {item.surname}</Link></td>
                            <td>{dateStringFormatter(item.dateBirth, false)}</td>
                            <td>
                                <div className="btn-group">
                                    <Link to={"/people/show/" + item._id} className="btn btn-sm btn-outline-info text-black">
                                        Zobrazit
                                    </Link>
                                    <Link to={"/people/edit/" + item._id} className="btn btn-sm btn-outline-warning text-black">
                                        Upravit
                                    </Link>
                                    <button onClick={() => deletePerson(item._id)} className="btn btn-sm btn-outline-danger text-black"> Odstranit </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PersonTable;