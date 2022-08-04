import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function NoVersionModal() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Wersja 0.0
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Wygląda na to, że nie masz zainstalowanej jeszcze paczki. <br />
          Pobierz forge i zainstaluj z tego linku: <br />
          <Link
            onClick={() =>
              window.api.utilities.openExternalLink(
                'https://files.minecraftforge.net/net/minecraftforge/forge/index_1.12.2.html',
              )
            }
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            https://files.minecraftforge.net/net/minecraftforge/forge/index_1.12.2.html
          </Link>
        </Typography>
      </Box>
    </Modal>
  );
}
