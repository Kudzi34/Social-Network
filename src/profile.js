import React from "react";

export default function Profile(props) {
    console.log("props inside of bio", props);

    return (
        <div className="profilediv-main">
            <img
                src={props.imageurl}
                className="propic"
                onClick={props.clickHandler}
            />
            <div className="profileInfo">
                <h3>First:{props.firstName}</h3>
                <h3>Last:{props.lastName}</h3>
                <div className="bio-div">
                    {props.bio ? <p>Bio:{props.bio}</p> : <p>update Bio</p>}

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
        </div>
    );
}
