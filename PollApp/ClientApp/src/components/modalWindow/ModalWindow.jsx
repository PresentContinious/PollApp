import React from 'react';
import {Modal, Box} from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    maxHeight: '95vh',
    minHeight: 700,
    bgcolor: '#f6f3f3',
    border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    overflow: 'scroll',
    p: 4,
};

const ModalWindow = ({children, setOpen, isOpen}) => {
    const handleClose = () => {
        setOpen && setOpen(false);
    };

    return (
        <div>
            <Modal
                open={!!isOpen}
                onClose={handleClose}
            >
                <Box sx={style}>
                    {children}
                </Box>
            </Modal>
        </div>
    );
}

export default ModalWindow;