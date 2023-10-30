import { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");

useEffect(() => {
  async function fetchUserName() {
    try {
      const userData = await JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        setUserName(userData.username);
      }
    } catch (error) {
      console.error(error);
    }
  }

  fetchUserName();
}, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Seja Bem-Vindo, <span>{userName}!</span>
      </h1>
      <h3>Por favor, escolha um chat para inciar a conversa</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
