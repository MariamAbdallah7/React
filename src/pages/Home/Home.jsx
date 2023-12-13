import { Container } from 'react-bootstrap';
import styles from './Home.module.css'
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return (
        <Container className={styles.Home}>
       <div className="Home" >
         <h1>Welcome to the Home Page</h1>
         <button onClick={() => { navigate('/all')}}>Discover</button>
       </div>
       </Container>
    );
   }
   
   export default Home;