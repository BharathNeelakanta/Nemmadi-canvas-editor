import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
// import ListingProjects from "../components/Completed_projects/listingProjects"
const Pagination = ({ showPerPage, onPaginationChange, total, pathName }) => {
    const [counter, setCounter] = useState(1);
    const [numberOfButtons, setNumberOfButtons] = useState(
        Math.ceil(total / showPerPage)
    );
    console.log(" total,counter,numberOfButtons",
        total, counter, numberOfButtons)

    useEffect(() => {
        const value = showPerPage * counter;
        onPaginationChange(value - showPerPage, value);
    }, [counter]);

    const onButtonClick = (type) => {
        if (type === "prev") {
            if (counter === 1) {
                setCounter(1);
            } else {
                setCounter(counter - 1);
            }
        } else if (type === "next") {
            console.log(" total,counter", total, counter)

            if (numberOfButtons === counter) {
                setCounter(counter);
            } else {
                setCounter(counter + 1);
            }
        }
    };
    return (
        <div className="d-flex justify-content-center">
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item">
                        <Link to={pathName ? pathName : ""}
                            className="page-link"
                            href="!#"
                            onClick={() => onButtonClick("prev")}
                        >
                            Previous
            </Link>
                    </li>

                    {new Array(numberOfButtons).fill("").map((el, index) => (
                        <li className={`page-item ${index + 1 === counter ? "active" : null}`}>
                            <Link to={pathName ? pathName : ""}

                                className="page-link"
                                href="!#"
                                onClick={() => setCounter(index + 1)}
                            >
                                {index + 1}
                            </Link>
                        </li>
                    ))}
                    <li className="page-item">
                        <Link to={pathName ? pathName : ""}

                            className="page-link"
                            onClick={() => onButtonClick("next")}
                        >
                            Next
            </Link>
                    </li>
                </ul>
            </nav>
        </div >
    );
};

export default Pagination;