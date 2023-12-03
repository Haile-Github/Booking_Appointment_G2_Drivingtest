import React, { useState,useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs,Timestamp, Firestore } from 'firebase/firestore';
import './App.css'

// Replace this with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGJ9Sz8Mxqj_b8-LtSuBoW6QVuUkmUSxg",
    authDomain: "driving-test-web.firebaseapp.com",
    databaseURL: "https://driving-test-web-default-rtdb.firebaseio.com",
    projectId: "driving-test-web",
    storageBucket: "driving-test-web.appspot.com",
    messagingSenderId: "290019892652",
    appId: "1:290019892652:web:51125e1b47b3ce91706e09",
    measurementId: "G-NF2P3KRSXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const App: React.FC = () => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]); //to read timestamp from database




//  reading available slots from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db: Firestore = getFirestore(app);
        const appointmentsCollection = collection(db, 'BookAppointment');

        const querySnapshot = await getDocs(appointmentsCollection);

        const timestampsArray: Timestamp[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.timestamp instanceof Timestamp) {
            timestampsArray.push(data.timestamp);
          }
        });

        setTimestamps(timestampsArray);
      } catch (error) {
        console.error('Error fetching timestamps:', error.message);
      }
    };

    fetchData();
  }, []);
// reading available slots finishing line




//book appointment

const bookAppointment = async () => {
  try {
    // Validate time and date before proceeding
    if (!time || !date || time === 'default' || date === 'default') {
      alert( 'Please fill in both time and date fields.');
      return;
    }

    const db: Firestore = getFirestore(app);
    const appointmentsCollection = collection(db, 'BookAppointment');

    // Create a Timestamp for the selected date and time
    const timestamp: Timestamp = Timestamp.fromDate(new Date(`${date}T${time}:00`));

    // Save the appointment to Firestore
    await addDoc(appointmentsCollection, {
      timestamp,
    });

    alert('Appointment booked successfully! Thank you!');
  } catch (error) {
    console.error('Error booking appointment:', error.message);
  }
};




//

  

  



  return (
    <div className='app'>

    

<div className='timeslot'>
      <h2>Available date and time slots for G2 driving test based on trainer's schedule</h2>

      <ul>
        {timestamps.map((timestamp, index) => (
          <li key={index}>{timestamp.toDate().toString()}</li>
        ))}
      </ul>
    </div>








    
    <div className='Booking'>
      <h2>Appointment Booking</h2>
      
     
      <label htmlFor="date">Select a date:</label>
      <input
        type="date"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <label htmlFor="time">Select a time:</label>
      <input
        type="time"
        id="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      

      <button type='button' className="gbutton" onClick={bookAppointment}>Book Appointment</button>


    

    </div>
   

    </div>
  );
};

export default App;
