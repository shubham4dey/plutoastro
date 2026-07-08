import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCall } from "../store/AstroSlice";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const useCall = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const data = await fetch("http://plutoastro-api.onrender.com/api/astrologers");
            const json = await data.json();
            
            console.log("API Response:", json); // Debug
            
            // Fix: Sirf astrologers array dispatch karo
            if (json.success && json.astrologers) {
                dispatch(addCall(json.astrologers));
            } else if (Array.isArray(json)) {
                dispatch(addCall(json));
            } else {
                dispatch(addCall([]));
            }
        } catch (error) {
            console.error("Error fetching data:", error);

            if (error.message === 'Failed to fetch') {
                toast.error("Failed to fetch", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                navigate("/error");
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
};

export default useCall;