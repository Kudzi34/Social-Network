import React from "react";

export default function Profilepicture(props) {
    return (
        <div className="imagediv">
            <img
                src={props.imageUrl}
                className="propic"
                onClick={props.clickHandler}
            />
        </div>
    );
}
