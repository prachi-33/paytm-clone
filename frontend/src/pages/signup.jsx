import { useState } from "react";
import {BottomWarning} from "../components/BottomWarning"
import {Button} from "../components/Button"
import {Heading} from "../components/Heading"
import {SubHeading} from "../components/SubHeading"
import {InputBox} from "../components/InputBox"
import { useNavigate } from "react-router-dom";

export const Signup = () =>{
    const [firstName,setfirstName]=useState("");
    const [lastName,setlastName]=useState("");
    const [userName,setuserName]=useState("");
    const [password,setpassword]=useState("");
    const navigate=useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-centre">
        <div className="flex flex-col justify-centre">
            <div className=""></div>
        </div>
    </div>
}