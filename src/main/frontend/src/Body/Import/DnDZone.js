import React, {useCallback} from 'react';
import {useDropzone} from "react-dropzone";

function DnDZone(props) {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                props.onChange(reader.result);
            };
            reader.readAsText(file);
        })
    }, []);

    const {getRootProps, getInputProps} = useDropzone({onDrop});

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()}/>
            <p>{props.children}</p>
        </div>
    )
}

export default DnDZone;