import React, { useContext } from 'react';
import { initializeApp } from 'firebase/app'; 
import { GoogleAuthProvider,signInWithPopup,getAuth } from "firebase/auth";
import firebaseConfig from './Firebase/Firebase.config';
import { UserContext } from '../../../App';


const Login = () => {

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);

    const app = initializeApp(firebaseConfig)
    const handleGoogleSignIn =()=>{
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const {displayName, email, photoURL} = user;
            const signedInUser =  {
                name: displayName,
                email: email,
                photo: photoURL
            }
            setLoggedInUser(signedInUser)
            
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, email, credential)
        });

    }
    console.log(loggedInUser);

    return (
        <div>
            <button onClick={handleGoogleSignIn}>Google Sign In </button>
        </div>
    );
};

export default Login;