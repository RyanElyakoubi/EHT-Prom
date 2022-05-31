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

    const submitForm = async() => {
        setGuestResult([])
        setStudentResult([])
        if((studentInfo === "" && guestName !== "")){
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
            if(data.status === 200){
                setStudentResult(response.filter((obj) => obj.ischeckedin === false));
                if(studentResult.length === 0){
                    setNotFound(true)
                }
                else{
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


    const signin = async(id) => {
        const data = await fetch("http://localhost:5000/signinStudent", {
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            credentials: 'include',
            body: JSON.stringify({id: id})
        });        
        const response = await data.json();
        console.log(response)
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
            <div class= {errorField !== "" ? "container alert alert-danger": "visually-hidden"} role="alert">
                {errorField}
            </div>

            <div class = "container mt-5">
                <h3 class = "text-center">Students</h3>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name or student ID number, but not both</Form.Label>
                        
                        <Form.Control type="email" placeholder="Name or student ID number" onChange = {(e) => setStudentInfo(e.target.value)}/>
                        <div class = "mt-2">
                            <Button onClick = {()=>submitForm()}>Get students</Button>
                        </div>
                    </Form.Group>
                </Form>

                {studentResult.length > 0 && studentResult.map((result) => {
                    return(
                        

                            <div class="w-25 border">                   
                                <div class="card-body">
                                    <p>Name: {result.name}</p>
                                    <p>ID: {result.studentid}</p>
                                    <Button class = "btn btn-dark" onClick = {(e)=> signin(result.studentid)}>Signin</Button>
                                </div> 
                        </div>
                    )
                })
                }
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
                        <Form.Control type="email" placeholder="Guest Name" onChange = {(e) => setGuestName(e.target.value)}/>
                        <div class = "mt-2">
                            <Button onClick = {()=>submitForm()}>Get guests</Button>
                        </div>
                    </Form.Group>
                    
                </Form>

                {guestResult.length > 0 && guestResult.map((result) => {
                    return(
                    <div class="card">
                        <div class="card-body d-flex">
                            <p>{result.name}</p>
                            <p class = "ms-2">{result.verificationcode}</p>
                        </div>
                    </div>
                    )
                })}

            </div>
        </div>

  )
}
