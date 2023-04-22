import React from "react";
import "./ImageLinkForm.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const ImageLinkForm = ({ Url, onUrlChange, onDetectClick }) => {
  return (
    <div className="imageLinkForm">
      <p className="headline">
        you can use single face images to get more details about the person. Give it
        a try
      </p>
      <form
        className="LinkForm shadow-5"
        noValidate
        autoComplete="off"
        action="#"
        onSubmit={() => false}
      >
        <TextField
          id="standard-basic"
          label="Image url"
          fullWidth
          margin="normal"
          variant="outlined"
          className="input-group input-url"
          defaultValue={Url}
          onChange={onUrlChange}
        />
        <Button
          onClick={onDetectClick}
          variant="contained"
          color="primary"
          className="btn-detect"
        >
          detect
        </Button>
      </form>
    </div>
  );
};

export default ImageLinkForm;
