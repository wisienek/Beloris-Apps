import { styled } from '@mui/material/styles';
import { OutlinedInput } from '@mui/material/';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[5]};
    padding-right: ${theme.spacing(0.7)};
`,
);

export default OutlinedInputWrapper;
