import { Button } from '@mui/material';

function CreateButton({ text, onClick }) {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: '#373B44', // dark gray
        color: '#FFFFFF',           // white text
        borderRadius: '10px',       // rounded corners
        padding: '5px 40px',
        fontSize: '1rem',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#2F323A', // slightly darker on hover
        },
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

export default CreateButton;