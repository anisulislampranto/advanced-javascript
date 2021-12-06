import React from 'react';
import { initializeApp } from 'firebase/app'; 
import { GoogleAuthProvider,signInWithPopup,getAuth } from "firebase/auth";
import firebaseConfig from './Firebase/Firebase.config';


const Login = () => {

    const app = initializeApp(firebaseConfig)
    const handleGoogleSignIn =()=>{
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user, token)
            // ...
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, email, credential)
        });

    }

    return (
        <div>
            <button onClick={handleGoogleSignIn}>Google Sign In </button>
        </div>
    );
};

export default Login;