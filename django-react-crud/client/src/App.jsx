import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { TaskFormPage } from "./pages/TaskFormPage";
import { TasksPage } from "./pages/TasksPage";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});




function App() {
  
  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    client.get("/api/user")
    .then(function(res) {
      setCurrentUser(true);
    })
    .catch(function(error) {
      setCurrentUser(false);
    });
  }, []);

  function update_form_btn() {
    if (registrationToggle) {
      document.getElementById("form_btn").innerHTML = "Register";
      setRegistrationToggle(false);
    } else {
      document.getElementById("form_btn").innerHTML = "Log in";
      setRegistrationToggle(true);
    }
  }

  async function submitRegistration(e) {
    e.preventDefault();
  
    try {
      // Realizar el registro del usuario
      const registrationResponse = await client.post("/api/register", {
        email: email,
        username: username,
        password: password
      });
  
      if (registrationResponse.status === 201) {
        // Registro exitoso, ahora intentamos iniciar sesión
        const loginResponse = await client.post("/api/login", {
          email: email,
          password: password
        });
  
        if (loginResponse.status === 200) {
          // Usuario autenticado con éxito
          setCurrentUser(true);
        } else {
          console.error("Error en la solicitud de inicio de sesión:", loginResponse);
          displayError("Se produjo un error en el servidor al iniciar sesión.");
        }
      } else {
        console.error("Error en la solicitud de registro:", registrationResponse);
        displayError("Se produjo un error en el servidor al registrar al usuario.");
      }
    } catch (error) {
      // Manejar errores de red u otros errores
      console.error("Error al enviar la solicitud de registro o inicio de sesión:", error);
      displayError("Se produjo un error al registrar. Por favor, inténtalo de nuevo más tarde. o  verifique los datos ingresados");
    }
  }
  
  // Resto del código, incluyendo la función displayError y la función submitLogin
  

  async function submitLogin(e) {
    e.preventDefault();
  
    try {
      const response = await client.post("/api/login", {
        email: email,
        password: password
      });
  
      if (response.status === 200) {
        // Usuario autenticado con éxito
        setCurrentUser(true);
      } else {
        // Mostrar un mensaje de error si el servidor devuelve otro código de estado
        console.error("Error en la solicitud de inicio de sesión:", response);
        displayError("Se produjo un error en el servidor al iniciar sesión.");
      }
    } catch (error) {
      // Manejar errores de red u otros errores
      console.error("Error al enviar la solicitud de inicio de sesión:", error);
      displayError("Se produjo un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde, o verifique sus datos..");
    }
  }
  
  function displayError(message) {
    // Mostrar un mensaje emergente al usuario
    window.alert(message);
  }
  
  
  

  function submitLogout(e) {
    e.preventDefault();
    client.post(
      "/api/logout",
      {withCredentials: true}
    ).then(function(res) {
      setCurrentUser(false);
    });
  }

  if (currentUser) {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>Usuario {email}</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <form onSubmit={e => submitLogout(e)}>
                  <Button type="submit" variant="light">Cerrar sesión</Button>
                </form>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
          <div className="center">
          <BrowserRouter>
            <div className="container mx-auto">
              <Navigation />
               <Routes>
                {/* redirect to tasks */}
                <Route path="/" element={<Navigate to="/tasks" />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/:id" element={<TaskFormPage />} />
                <Route path="/tasks-create" element={<TaskFormPage />} />
              </Routes>
              <Toaster />
            </div>
            
  </BrowserRouter>
          </div>
        </div>
    );
  }
  return (
    <div>
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Aplicación de autenticación</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <Button id="form_btn" onClick={update_form_btn} variant="light">Registro</Button>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    {
      registrationToggle ? (
        <div className="center">
          <Form onSubmit={e => submitRegistration(e)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Dirección de correo electrónico</Form.Label>
              <Form.Control type="email" placeholder="Direcion de  email" value={email} onChange={e => setEmail(e.target.value)} />
              <Form.Text className="text-muted">
              Nunca compartiremos su correo electrónico con nadie más.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control type="text" placeholder="Introduzca su nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
        </div>        
      ) : (
        <div className="center">
          <Form onSubmit={e => submitLogin(e)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Dirección de correo electrónico</Form.Label>
              <Form.Control type="email" placeholder="direccion de email" value={email} onChange={e => setEmail(e.target.value)} />
              <Form.Text className="text-muted">
              Nunca compartiremos su correo electrónico con nadie más.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
        </div>
      )
    }
    </div>
  );
}

export default App;

