import React, { useEffect, useState } from "react";

const HalvingCountdown = () => {
    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    const [diffTime, setDiffTime] = useState<number | null>(0);
    const halvingTime = new Date('2024/4/21/06:16:08').getTime();
    const [daysLeft, setDaysLeft] = useState(0)
    const [hoursLeft, setHoursLeft] = useState(0)
    const [minutesLeft, setMinutesLeft] = useState(0)
    const [secondsLeft, setSecondsLeft] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 1000)
        return () => clearInterval(interval);
    }, [])

    //halvingTime - currentTime 코드
    useEffect(() => {
        //console.log(currentTime);
        setDiffTime(halvingTime - currentTime);
    }, [currentTime])


    //getTime으로 한거 다시 형변환?
    useEffect(() => {
        if (diffTime !== null) {
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
            setDaysLeft(days);
            setHoursLeft(hours);
            setMinutesLeft(minutes);
            setSecondsLeft(seconds);
        }
    }, [currentTime])

    return (<>
        <div>현재시간 : {currentTime}</div>
        <div> 4번째 반감기 : {halvingTime}</div>
        <div> 남은기간 : {diffTime}</div>
        <div> Days : {daysLeft} / Hours : {hoursLeft} / Minutes: {minutesLeft} / Seconds : {secondsLeft}</div>
        {/*days / hours / minutes / seconds 다 따로 테일윈드로 꾸미기 */}
    </>)
}
export default HalvingCountdown;