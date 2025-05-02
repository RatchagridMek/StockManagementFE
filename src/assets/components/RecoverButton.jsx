import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';

const RecoverButton = styled(Button)(({ theme }) => ({
    color: 'white',
    backgroundColor: green["A400"],
    '&:hover': {
      backgroundColor: green["A700"],
    },
  }));

  export default RecoverButton;