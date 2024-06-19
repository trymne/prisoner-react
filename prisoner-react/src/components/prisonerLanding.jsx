import React, { useMemo, useState, useRef, useEffect } from "react";
import * as stylex from "@stylexjs/stylex"
import Swal from "sweetalert2";
import Box from "./box";
import InfoModal from "./infoModal";

const styles = stylex.create({
    h1: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        color: "black",
    },
    main: {
        backgroundColor: "#f5f5f5",
        color: "black",
    },
    boxCont: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        maxWidth: 800,
    },
    startSimBtn: {
        padding: "8px 16px",
        color: "#f5f5f5",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        marginBottom: 16,
        ':hover': {
            textDecoration: 'underline',
        },
        ':focus-visible': {
            textDecoration: 'underline',
        },

    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    range: {
        marginBottom: 16,
    },
    infoBtn: {
        padding: "8px 16px",
        backgroundColor: "unset",
        color: "rgb(196, 55, 224)",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        marginBottom: 16,
        ':hover': {
            textDecoration: 'underline',
        },
        ':focus-visible': {
            textDecoration: 'underline',
        },
    }

});

const Landing = () => {
    const defaultTime = 200;
    const [simulationSpeed, setSimulationSpeed] = useState(800)
    const [currentPrisoner, setCurrentPrisoner] = useState(1);
    const guessesLeft = 50;
    const currentSlipRef = useRef(null);
    const prisonerRef = useRef(currentPrisoner);
    const guessesLeftRef = useRef(guessesLeft);
    const [guessedBoxes, setGuessedBoxes] = useState(new Array(100).fill(false));
    const [prisonerFailed, setPrisonerFailed] = useState(false);
    const simulation = useRef(false);
    const defaultTimeRef = useRef(defaultTime);
    const stopSimultion = useRef(false);


    //Modal stuff
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => {
        setModalIsOpen(true);
    };
    const closeModal = () => {
        setModalIsOpen(false);
    };


    const randomArray = useMemo(() => {
        return Array.from({ length: 100 }, (_, i) => i + 1).sort(() => 0.5 - Math.random());
    }, []);

    if (prisonerRef.current === 1 && guessesLeftRef.current === 50) {
        for (let i = 0; i < 100; i += 10) {
            console.log(`[${randomArray.slice(i, i + 10).join(", ")}]`);
        }
    }
    // Update the ref every time currentPrisoner changes
    useEffect(() => {
        prisonerRef.current = currentPrisoner;
    }, [currentPrisoner]);

    const boxClicked = (boxNr, slipNr) => {
        if (slipNr === prisonerRef.current) {
            //resetting the array stating the boxes that have been guessed (used for rendering the boxes)
            guessesLeftRef.current = guessesLeft;
            setGuessedBoxes(prev => {
                const newGuessed = [...prev];
                newGuessed[boxNr - 1] = true;
                return newGuessed;
            });

            currentSlipRef.current = null;

            if (!simulation.current) {
                Swal.fire({
                    title: `Prisoner ${prisonerRef.current} guessed correctly`,
                    icon: "success",
                }).then((result) => {
                    if (result) {
                        prisonerRef.current++;
                        setGuessedBoxes(new Array(100).fill(false));
                    }
                });
            }
        } else {
            if (guessesLeftRef.current < 2 && !simulation.current) {
                Swal.fire({
                    title: `Prisoner ${prisonerRef.current} failed`,
                    icon: "error",
                }).then((result) => {
                    if (result.isConfirmed) {
                        resetSimulation();
                    }
                });
                return
            }
            currentSlipRef.current = slipNr;
            guessesLeftRef.current--;
            setGuessedBoxes(prev => {
                const newGuessed = [...prev];
                newGuessed[boxNr - 1] = true;
                return newGuessed;
            });
        }

    };

    const changeTimeRef = (e) => {
        setSimulationSpeed(e.target.value);
        defaultTimeRef.current = 1000 - e.target.value;
    };

    const resetSimulation = () => {
        console.log("Simulation reset");
        setPrisonerFailed(false);
        prisonerRef.current = 1;
        guessesLeftRef.current = guessesLeft;
        currentSlipRef.current = null;
        setGuessedBoxes(new Array(100).fill(false));
        randomArray.sort(() => 0.5 - Math.random());
        simulation.current = false;
        stopSimultion.current = true;
    };

    const runSimulation = () => {
        let i = 0;
        stopSimultion.current = false;
        simulateClick(i);  // Start the simulation with initial index
    };

    const simulateClick = (i) => {
        if (stopSimultion.current) return;
        if (guessesLeftRef.current > 0) {
            handlePrisonerGuess(i);
        } else {
            handlePrisonerFailure();
        }
    };

    const handlePrisonerGuess = (i) => {
        if (guessesLeftRef.current === 50 && simulation.current) {
            if (prisonerRef.current === 100) {
                handleAllPrisonersGuessedCorrectly();
                return;
            }
            prisonerGuessedCorrectly();
            setTimeout(() => simulateClick(i), defaultTimeRef.current);
        } else {
            continueSimulation(i);
        }
    };

    const handleAllPrisonersGuessedCorrectly = () => {
        console.log("All prisoners guessed correctly");
        Swal.fire({
            title: "All prisoners guessed correctly",
            icon: "success",
        });
    };

    const prisonerGuessedCorrectly = () => {
        console.log(`Prisoner ${prisonerRef.current} guessed correctly`);
        setGuessedBoxes(new Array(100).fill(false));
        prisonerRef.current++;
        let nextSlipNr = randomArray[prisonerRef.current - 1];
        console.log(`Prisoner ${prisonerRef.current} is guessing slip ${nextSlipNr}`);
        boxClicked(prisonerRef.current, nextSlipNr);
    };

    const continueSimulation = (i) => {
        simulation.current = true;
        const nextBoxNr = !currentSlipRef.current ? prisonerRef.current : currentSlipRef.current;
        const nextSlipNr = randomArray[nextBoxNr - 1];
        boxClicked(nextBoxNr, nextSlipNr);
        i++;
        setTimeout(() => simulateClick(i), defaultTimeRef.current);
    };

    const handlePrisonerFailure = () => {
        console.log(`Prisoner ${prisonerRef.current} failed`);
        Swal.fire({
            title: `Prisoner ${prisonerRef.current} failed`,
            icon: "error",
        }).then((result) => {
            if (result.isConfirmed) {
                resetSimulation();
            }
        });
        setPrisonerFailed(true);
    };

    return (
        <div {...stylex.props(styles.main)}>
            <h1 {...stylex.props(styles.h1)}>Welcome to Prisoner's Dilemma</h1>
            <button onClick={openModal} {...stylex.props(styles.infoBtn)} >Learn About the 100 Prisoners Problem</button>
            <InfoModal isOpen={modalIsOpen} onRequestClose={closeModal} />
            <p>Current prisoner: {prisonerRef.current}</p>
            <p>Guesses left: {guessesLeftRef.current}</p>
            <p>Current Slip: {currentSlipRef.current}</p>
            {
                simulation.current ? <button className="project-links" {...stylex.props(styles.startSimBtn)} onClick={resetSimulation}>Reset simulation</button>
                    : <button className="project-links" {...stylex.props(styles.startSimBtn)} onClick={runSimulation}>Start simulation</button>
            }
            <form>
                <label {...stylex.props(styles.label)} htmlFor="sim-speed">Choose simulation speed</label>
                <input {...stylex.props(styles.range)} id="sim-speed" value={simulationSpeed} type="range" min="10" max="1000" onChange={(e) => changeTimeRef(e)} />
            </form>
            <div {...stylex.props(styles.boxCont)}>
                {randomArray.map((slipNr, index) => (
                    <Box key={index} currentPrisoner={prisonerRef.current} clicked={boxClicked} boxNr={index + 1} slipNr={slipNr} opened={guessedBoxes[index]} />
                ))}
            </div>
            {prisonerFailed && <p>Prisoner {prisonerRef.current} failed</p>}
        </div>
    );
};

export default Landing;
