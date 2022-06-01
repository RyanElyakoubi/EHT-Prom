import React from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import {useState, useEffect} from 'react';

export default function Home() {
    const [studentInfo, setStudentInfo] = useState('');
    const [guestName, setGuestName] = useState('');
    const [studentResult, setStudentResult] = useState([]);
    const [guestResult, setGuestResult] = useState([]);
    const [emptyField, setEmptyField] = useState(false);
    const [errorField, setErrorField] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [success, setSuccess] = useState(false);

    const submitForm = async() => {
        setSuccess(false)
        console.log(guestName, studentInfo);
        setGuestResult([])
        setStudentResult([])
        if((studentInfo === "" && guestName !== "")){
            console.log("true")
            setEmptyField(false)
            const data = await fetch("http://localhost:5000/signin", {
                method:"POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                redirect: 'follow',
                credentials: 'include',
                body: JSON.stringify({type: "guest", info: guestName})
            });            
            
            const response = await data.json();
            setGuestResult(response)
        }
        else if ((studentInfo !== "" && guestName === "")){
            console.log("true")
            setEmptyField(false)
            
            const data = await fetch("http://localhost:5000/signin", {
                method:"POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                redirect: 'follow',
                credentials: 'include',
                body: JSON.stringify({type: "student", info: studentInfo})
            });            
            const response = await data.json();
            console.log(response)
            console.log(data.status)
            if(data.status === 200){
                setErrorField("")
                console.log(response)
                if(response.length === 0){
                    setNotFound(true)
                }
                else{
                    setStudentResult(response)
                    setNotFound(false)
                }
                
            }
            else{
                setErrorField(response)
            }
  
        }
        else{
            setEmptyField(true)
        }
        setStudentInfo("")
        setGuestName("")
    }


    const signin = async(id,type) => {
        const data = await fetch("http://localhost:5000/signinStudent", {
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            credentials: 'include',
            body: JSON.stringify({id: id,type:type})
        });        
        const response = await data.json();
        console.log(response)
        if(data.status === 200){
            setSuccess(true)
        }
        else{
            setSuccess(false)
        }
    }

    return (
        <div>

            <div class = "container text-center  mt-5">
                <h1>Egg Harbor Township High School Prom</h1>
                <p class = "fs-6">If you are signing in a student, please enter their id or name then click search. The program will show matching students click whoever is signing in. For guests type their name and click on search. From the list, make sure to verify that their verification code matches.</p>
            </div>

            <div class= {emptyField ? "container alert alert-danger": "visually-hidden"} role="alert">
                Please enter only 1 field at a time! Make sure one is empty and the other is filled.
            </div>
            <div class= {success ? "container alert alert-primary": "visually-hidden"} role="alert">
                successfully signed in! You can signin someone else now!
            </div>
            <div class= {errorField !== "" ? "container alert alert-danger": "visually-hidden"} role="alert">
                {errorField}
            </div>

            <div class = "container mt-5">
                <h3 class = "text-center">Students</h3>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name or student ID number, but not both</Form.Label>
                        
                        <Form.Control type="email" placeholder="Name or student ID number" value = {studentInfo} onChange = {(e) => setStudentInfo(e.target.value)}/>
                        <div class = "mt-2">
                            <Button onClick = {()=>submitForm()}>Get students</Button>
                        </div>
                    </Form.Group>
                </Form>
                <div class = "d-flex">
                    {studentResult.length > 0 && studentResult.map((result) => {
                        const bgColor = result.ischeckedin ? "bg-secondary card mx-1" : "card mx-1"
                        const buttonColor = result.ischeckedin ? "btn bg-primary" : "btn bg-primary"
                        return(
                                <div class= {bgColor} >                   
                                    <div class="card-body">
                                        {result.ischeckedin && <p class = "text-warning">Alreay signed in!</p>}
                                        <p>Name: {result.name}</p>
                                        <p>ID: {result.studentid}</p>
                                        <Button class = {buttonColor} onClick = {(e)=> signin(result.studentid, "students")}>Signin</Button>
                                    </div> 
                            </div>
                        )
                    })
                    }
                </div>
                {notFound && 
                <div class="container alert alert-danger" role="alert">
                    No students found!    
                </div>}
            </div>


            <div class = "container mt-5">
                <h3 class = "text-center">Guests</h3>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Guest name</Form.Label>
                        <Form.Control type="email" placeholder="Guest Name Or Phone Number. If you are entering phone number enter this format: 123456789. Without any space!" value = {guestName} onChange = {(e) => setGuestName(e.target.value)}/>
                        <div class = "mt-2">
                            <Button onClick = {()=>submitForm()}>Get guests</Button>
                        </div>
                    </Form.Group>
                    
                </Form>
                <div class = 'd-flex'>
                    {console.log(typeof guestResult)}
                    {(guestResult.length > 0 && typeof guestResult === "object") && guestResult.map((result) => {
                        const bgColor = result.ischeckedin ? "bg-secondary card mx-1" : "card mx-1"
                        const buttonColor = result.ischeckedin ? "btn bg-primary" : "btn bg-primary"
                        return(
                        <div class = {bgColor} key = {result.id}>
                            <div class="card-body">
                                <p>{result.name}</p>
                                <p>{result.verificationcode}</p>
                                <Button class = {buttonColor} onClick = {(e)=> signin(result.verificationcode, "guests")}>Signin</Button>
                            </div>
                        </div>
                        )
                    })}
                </div>

            </div>
        </div>

  )
}
