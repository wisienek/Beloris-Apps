import * as React from 'react';

import { Backdrop, Box, Modal, Fade } from '@mui/material';
import Title from './title';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface ModalArgs {
  open: boolean;
  toggleOpen: (state: boolean) => void;
  title: string;
  body: React.ReactNode;
}

export default function TransitionsModal({
  title,
  body,
  open,
  toggleOpen,
}: ModalArgs) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => toggleOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Title id="transition-modal-title">{title}</Title>
          {body}
        </Box>
      </Fade>
    </Modal>
  );
}
