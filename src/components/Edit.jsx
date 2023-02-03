import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CreateIcon from "@mui/icons-material/Create";
import { useEffect, useState, useReducer } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function Edit(data) {
  const [open, setOpen] = useState(false);
  const [{ loading, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const [name, setName] = useState(data["data"].name);
  const [vjudgeHandle, setVjudgeHandle] = useState(data["data"].vjudge_handle);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.post(
        "http://localhost:5000/profile",
        JSON.stringify({
          email: data["data"].email,
          name,
          vjudgeHandle,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Profile updated");
      displayProfile();
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(error);
    }
  };

  return (
    <div>
      <CreateIcon onClick={handleClickOpen} />
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="flex flex-col lg:items-center p-4">
            <p className="text-3xl font-semibold lg:mb-10 mb-4">Profile</p>
            {loading ? (
              <div className="flex justify-center py-32">
                <CircularProgress size={50} thickness={4} color="inherit" />
              </div>
            ) : (
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label className="inputlabel">Name</label>
                  <div className="inputCont">
                    <input
                      value={name}
                      className="input"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="inputlabel">VjudgeHandle</label>
                  <div className="inputCont">
                    <input
                      value={vjudgeHandle}
                      className="input"
                      onChange={(e) => setVjudgeHandle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col mt-4">
                  {loadingUpdate ? (
                    <button
                      className="bg-slate-300 text-white py-2 px-6 rounded flex justify-center items-center"
                      type="submit"
                    >
                      <CircularProgress
                        size={23}
                        thickness={4}
                        color="inherit"
                      />
                    </button>
                  ) : (
                    <button
                      className="bg-violet-800 hover:bg-violet-500 text-white py-2 px-6 rounded"
                      type="submit"
                    >
                      Update
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
