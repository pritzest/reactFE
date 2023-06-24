import React, { useState, useCallback } from "react";
import jwt_decode from "jwt-decode";
import classes from "./EditProfileComponent.module.css";
import moment from "moment";
import { Buffer } from "buffer";

function EditProfile() {
  const decodedUser = jwt_decode(localStorage.getItem("token"));
  const profilePicture =
    decodedUser.profilePicture ?? "https://i.stack.imgur.com/l60Hf.png";
  const [userImage, setUserImage] = useState(profilePicture);

  const [formState, setFormState] = useState({
    firstName: decodedUser.firstName,
    lastName: decodedUser.lastName,
    birthday: moment(new Date(decodedUser.birthday)).format("YYYY-MM-DD"),
    bio: decodedUser.bio,
  });

  const getBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const img = reader.result;

      const fileSize = new Buffer(img, "base64").length;
      console.log(fileSize);
      return cb(img);
    });
    reader.readAsDataURL(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    getBase64(file, (url) => {
      setUserImage(url);
    });
  };

  const onChangeProfile = (e) => {
    setFormState((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };

  const saveProfilePicture = useCallback(async () => {
    try {
      console.log(userImage);
      const res = await fetch(`${process.env.REACT_APP_URLBACKEND}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ profile_picture_url: userImage }),
      });

      const data = await res.json();

      localStorage.setItem("token", data.token);
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  }, [userImage]);

  const onSaveProfile = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_URLBACKEND}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formState),
      });

      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div className={classes.Profile_Container}>
        <div className={classes.Profile_NameContainer}>
          <div className={classes.firstName}>
            <p>First Name</p>
            <input
              type="text"
              name="firstName"
              value={formState.firstName}
              onChange={onChangeProfile}
            />
          </div>
        </div>
        <div>
          <p>Last Name</p>
          <input
            type="text"
            name="lastName"
            value={formState.lastName}
            onChange={onChangeProfile}
          />
        </div>
      </div>
      <div className={classes.Profile_Container}>
        <p>Birthday</p>
        <input
          type="date"
          name="birthday"
          value={formState.birthday}
          onChange={onChangeProfile}
        />
      </div>
      <div className={classes.Profile_Container}>
        <p>Bio</p>
        <textarea
          rows="4"
          cols="50"
          onChange={onChangeProfile}
          name="bio"
          value={formState.bio}
        >
          {formState.bio}
        </textarea>
      </div>
      <button onClick={onSaveProfile}>Save</button>
      <hr />
      <div className={classes.Profile_Container}>
        <div>
          <img src={userImage} className={classes.Profile_Container_Avatar} />
        </div>
        <input type="file" onChange={onFileChange} />
        <button onClick={saveProfilePicture}>Save File</button>
      </div>
      <hr />
      <div className={classes.Profile_Container}>
        <p>First Name</p>
        <input
          type="text"
          name="firstName"
          value={formState.firstName}
          onChange={onChangeProfile}
        />
        <p>Last Name</p>
        <input
          type="text"
          name="lastName"
          value={formState.lastName}
          onChange={onChangeProfile}
        />
      </div>
      <button onClick={""}>Save Password</button>
    </div>
  );
}

export default EditProfile;
