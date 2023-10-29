import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as R from "./Register.styles";
import Logo from "../../assets/logo.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("A senha não são iguais", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error(
        "O nome de usuário precisa ter mais de 3 caracteres",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error("A senha precisa ter mais de 8 caracteres", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("E-mail é obrigatório", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <R.FormContainer>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="brand">
            <img src={Logo} alt="" />
          </div>
          <input
            type="text"
            placeholder="Usuário"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="E-mail"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Senha"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirme a Senha"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Registra-se</button>
          <span>
            Já tem Conta? <Link to="/login">Login</Link>{" "}
          </span>
        </form>
      </R.FormContainer>
      <ToastContainer />
    </>
  );
}
