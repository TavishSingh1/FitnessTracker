import './login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log(email, password);
        navigate('/'); 
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="loginContainer">
            <div className="loginCard">
                <div className="loginHeader">Login</div>
                <form
                    onSubmit={handleLogin}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <div className="registerLink">
                    <p>
                        New user? 
                        <span onClick={handleRegisterClick} className="registerButton">
                            Register here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}