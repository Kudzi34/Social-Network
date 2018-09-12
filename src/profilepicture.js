import React from "react";

export default function Profilepicture(props) {
    return (
        <div className="imagediv2">
            <img
                src={props.imageurl}
                className="propic2"
                onClick={props.clickHandler}
            />
        </div>
    );
}
