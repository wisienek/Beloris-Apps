import * as React from 'react';
import { Grid } from '@mui/material';

import {
  WizardStepper,
  StepperNavigation,
} from '../components/single/wizard-stepper';

import VersionSelector from '../components/package-editor/version-wizard';
import { FileWizard } from '../components/package-editor/file-wizard';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from '../components/package-editor/package-editor-state';
import UploaderWizard from '../components/package-editor/uploader-wizard';

const PackageEditorPage = () => {
  const {
    isStepSkipped,
    activeStep,
    stepMap,
    handleNext,
    handleBack,
    handleSkip,
    handleReset,
  } = React.useContext<PackageEditorStateValue>(PackageEditorStateContext);

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
          {activeStep === 2 && <FileWizard />}
          {activeStep === 4 && <UploaderWizard />}
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
