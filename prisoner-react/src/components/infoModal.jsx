import React from 'react';
import Modal from 'react-modal';
import * as stylex from "@stylexjs/stylex";

Modal.setAppElement('#root');

const styles = stylex.create({

    h2: {
        color: 'black',
    },
    p: {
        color: 'black',
    },
    btn: {
        backgroundColor: 'black',
        ':hover': {
            textDecoration: 'underline',
        },
        ':focus-visible': {
            textDecoration: 'underline',
        },
    }
});


const InfoModal = ({ isOpen, onRequestClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '600px',
                }
            }}
        >
            <h2 {...stylex.props(styles.h2)}>The 100 Prisoners Problem</h2>
            <p {...stylex.props(styles.p)}>
                The 100 prisoners problem is a thought experiment in probability theory and combinatorics.
                In this problem, 100 numbered prisoners must find their own number in one of 100 boxes to survive.
                The boxes are randomly assigned numbers from 1 to 100, with each number appearing exactly once.
                Each prisoner may open up to 50 boxes, but must close them back as they were.
                The challenge is for all prisoners to find their numbers within the boxes they choose.
            </p>
            <p {...stylex.props(styles.p)}>
                A successful strategy involves prisoners starting with the box labeled with their own number,
                then continuing to open the box corresponding to the number found within the last box. This creates a cycle that,
                if it returns to the original number within 50 moves, will save them.
                Surprisingly, the probability of all prisoners finding their own number this way is about 30%.
            </p>
            <button {...stylex.props(styles.btn)} onClick={onRequestClose} style={{ marginTop: '20px', padding: '10px 20px' }}>Close</button>
        </Modal>
    );
};

export default InfoModal;
