import React, { useEffect, useState } from "react";

const HalvingCountdown = () => {
    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    const [diffTime, setDiffTime] = useState<number | null>(0);
    const halvingTime = new Date('2024/4/21/06:16:08').getTime();
    const [daysLeft, setDaysLeft] = useState(0)
    const [hoursLeft, setHoursLeft] = useState(0)
    const [minutesLeft, setMinutesLeft] = useState(0)
    const [secondsLeft, setSecondsLeft] = useState(0)
    const [openModal, setOpenModal] = useState(false);

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
        {/* <div>현재시간 : {currentTime}</div>
        <div> 4번째 반감기 : {halvingTime}</div>
        <div> 남은기간 : {diffTime}</div> */}
        <div> Days : {daysLeft} / Hours : {hoursLeft} / Minutes: {minutesLeft} / Seconds : {secondsLeft}</div>
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            {/* <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    {daysLeft}
                </span>
                days
            </div> */}
            {/* <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    {hoursLeft}
                </span>
                hours
            </div> */}
            {/* <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    {minutesLeft}
                </span>
                min
            </div> */}
            {/* <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    {secondsLeft}
                </span>
                sec
            </div> */}
        </div>

        {/*days / hours / minutes / seconds 다 따로 테일윈드로 꾸미기 */}
        {/* Open the modal using document.getElementById('ID').showModal() method */}


        {/* <button className="btn" onClick={() => {
            const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
            if (modal) modal.showModal();
        }}>open modal</button>
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog> */}
    </>)
}
export default HalvingCountdown;