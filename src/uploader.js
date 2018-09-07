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
            props.updateImage(data.imageUrl);
            console.log("imageurl", imageUrl);
        });
    }

    return (
        <div className="uploaderPopup">
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
    );
}
