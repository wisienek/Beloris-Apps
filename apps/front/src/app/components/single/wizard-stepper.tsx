import * as React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from '@mui/material';
import { IStep } from '../../pages/package-editor';

export interface WizardStepperArgs {
  stepMap: IStep[];
  activeStep: number;
  isStepSkipped: (idx: number) => boolean;
}

export interface WizardStepperNavigationArgs {
  stepMap: IStep[];
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
  handleSkip: () => void;
  handleReset: () => void;
}

const WizardStepper = ({
  activeStep,
  isStepSkipped,
  stepMap,
}: WizardStepperArgs) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep - 1}>
        {stepMap.map((step, index) => {
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          if (step?.isOptional)
            labelProps.optional = (
              <Typography variant="caption">Opcjonalne</Typography>
            );

          if (isStepSkipped(index)) step.completed = false;

          return (
            <Step key={step.name + step.id} completed={step.completed}>
              <StepLabel {...labelProps}>{step.name}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Typography sx={{ mt: 2, mb: 1 }}>Krok {activeStep}</Typography>
    </Box>
  );
};

const StepperNavigation = ({
  handleReset,
  activeStep,
  handleBack,
  stepMap,
  handleSkip,
  handleNext,
}: WizardStepperNavigationArgs) => {
  return activeStep === stepMap.length ? (
    <React.Fragment>
      <Typography sx={{ mt: 2, mb: 1 }}>
        Wszystko zrobione, to koniec!
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleReset}>Reset</Button>
      </Box>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 1}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Powrót
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {stepMap.find((step) => step.id === activeStep)?.isOptional && (
          <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
            Pomiń
          </Button>
        )}
        <Button onClick={handleNext}>
          {activeStep === stepMap.length - 1 ? 'Zakończ' : 'Dalej'}
        </Button>
      </Box>
    </React.Fragment>
  );
};

export { WizardStepper, StepperNavigation };
