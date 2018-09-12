import React from "react";
import axios from "./axios";

export default function Uploader(props) {
    function submit(e) {
        let file;
        e.preventDefault();
        file = e.target.files[0];
        const fd = new FormData();

        fd.append("file", file);

        axios.post("/upload", fd).then(({ data }) => {
            props.updateImage(data.imageurl);
            console.log("imageurl", imageurl);
        });
    }

    return (
        <div className="uploaderPopup">
            <div className="loader-innerdiv">
                <input
                    id="myInput"
                    type="file"
                    accept="image/*"
                    onChange={submit}
                />

                <label className="uploadLabel" htmlFor="myInput">
                    Update
                </label>
            </div>
        </div>
    );
}
