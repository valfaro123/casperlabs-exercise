import React from 'react'
import { useState, useEffect } from 'react'
import { TIMEZONES } from '../timezones'
import axios from 'axios';


function WorldTime() {
    const [currentDateTime,setCurrentDateTime] = useState([]);
    const [timezoneIsSelected,setTimezoneIsSelected] = useState(false);
    const [selectedTimezone,setSelectedTimezone] = useState("");


    useEffect(()=>{
        if(timezoneIsSelected){
            //set to every second rather than every 5th to improve feel of app
            const interval=setInterval(()=>{
                getCurrentTime(selectedTimezone)
            },1000)
            
            return()=>clearInterval(interval);
        }
    },[selectedTimezone])

    const handleSelectTimezone = (e) => {
        let currentTimezone = e.target.value;
        if(currentTimezone!== "No Selection"){
            getCurrentTime(currentTimezone);
            setSelectedTimezone(currentTimezone);
            setTimezoneIsSelected(true);
        }
    }

    const formatCurrentTime = (currentRawTimezoneData) => {
        //split iso data 
        let timezoneDataArray = currentRawTimezoneData.split('T');
        //remove milliseconds
        timezoneDataArray[1] = timezoneDataArray[1].substring(0,8);
        return timezoneDataArray;
    }

    const getCurrentTime = async (currentTimezone) => {
        try{
            const currentRawTimezoneData = await axios.get(`https://worldtimeapi.org/api/timezone/${currentTimezone}`);

            let formattedCurrentTime = formatCurrentTime(currentRawTimezoneData.data.datetime);
            
            setCurrentDateTime(formattedCurrentTime);

        }catch(err){
            console.log(err.message);
        }
    }

    return (
        <div className="text-center">
            {
                timezoneIsSelected ? 
                <div>
                    <h1 className='text-6xl mb-3 font-orbitron'>{currentDateTime[0]}</h1>
                    <h1 className='text-6xl mb-3 font-orbitron'>{currentDateTime[1]}</h1>
                    <h2 className='text-4xl'>{selectedTimezone}</h2>
                </div> : <h1 className='text-6xl'>Please select your timezone</h1>
            }
            <form>
                <label>Timezone
                    <select className='text-black mx-3 my-6' onChange={handleSelectTimezone}>
                        {
                            TIMEZONES.map( timezone => {return( <option key={timezone} value={timezone}>{timezone}</option>)})
                        }
                    </select>
                </label>
            </form>
        </div>
    )
}

export default WorldTime