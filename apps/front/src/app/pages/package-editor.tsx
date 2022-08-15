import * as React from 'react';
import { Grid } from '@mui/material';
import {
  WizardStepper,
  StepperNavigation,
} from '../components/single/wizard-stepper';
import { VersionSelector } from '../components/combined/package-editor-wizard';
import * as _ from 'lodash';

export interface IStep {
  id: number;
  name: string;
  isOptional?: boolean;
  completed?: boolean;
}

const stepMap: IStep[] = [
  {
    id: 1,
    name: 'Wybierz wersję',
  },
  {
    id: 2,
    name: 'Prześlij paczkę',
    isOptional: true,
  },
  {
    id: 3,
    name: 'Wprowadź zmiany',
    isOptional: true,
  },
  {
    id: 4,
    name: 'Podpisz i wyślij',
  },
];

const PackageEditorPage = () => {
  const [activeStep, setActiveStep] = React.useState(1);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    const min = _.minBy(stepMap, 'id').id;

    if (activeStep - 1 >= min)
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (stepMap.find((step) => step.id === activeStep).isOptional) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    const min = _.minBy(stepMap, 'id').id;

    setActiveStep(min);
  };

  return (
    <Grid
      container
      columns={1}
      justifyContent="space-around"
      sx={{
        backgroundColor: 'white',
        pt: '2vh',
        pb: '4vh',
        overflow: 'hidden',
      }}
    >
      <Grid
        container
        display="flex"
        flexDirection="row"
        mt={2}
        sx={{
          width: '60%',
          height: '100%',
        }}
      >
        <Grid
          item
          sx={{
            width: '100%',
          }}
        >
          <WizardStepper
            isStepSkipped={isStepSkipped}
            activeStep={activeStep}
            stepMap={stepMap}
          />
        </Grid>
        <Grid
          container
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {activeStep === 1 && <VersionSelector />}
        </Grid>
        <Grid
          item
          sx={{
            alignSelf: 'flex-end',
            width: '100%',
          }}
        >
          <StepperNavigation
            handleNext={handleNext}
            handleBack={handleBack}
            handleSkip={handleSkip}
            handleReset={handleReset}
            activeStep={activeStep}
            stepMap={stepMap}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PackageEditorPage;
