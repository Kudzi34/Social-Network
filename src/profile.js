import React from "react";

export default function Profile(props) {
    return (
        <div className="profilediv-main">
            <img
                src={props.imageUrl}
                className="propic"
                onClick={props.clickHandler}
            />
            <div className="profileInfo">
                <h1>
                    {props.firstName} {props.lastName}
                </h1>

                {props.showBio ? (
                    <textarea
                        onKeyDown={props.setBio}
                        defaultValue={props.bio}
                    />
                ) : (
                    <p onClick={props.toggleBio}>Update your bio.</p>
                )}
            </div>
        </div>
    );
}
