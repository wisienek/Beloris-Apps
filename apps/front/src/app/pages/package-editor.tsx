import { useContext } from 'react';
import { Grid } from '@mui/material';
import VersionSelector from '../components/package-editor/sections/version-wizard';
import UploaderWizard from '../components/package-editor/sections/uploader-wizard';
import { FileWizard } from '../components/package-editor/sections/file-wizard';
import FileOptions from '../components/package-editor/sections/file-options';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from '../components/package-editor/sections/package-editor-state';
import {
  WizardStepper,
  StepperNavigation,
} from '../components/single/wizard-stepper';

const PackageEditorPage = () => {
  const {
    isStepSkipped,
    activeStep,
    stepMap,
    handleNext,
    handleBack,
    handleSkip,
    handleReset,
  } = useContext<PackageEditorStateValue>(PackageEditorStateContext);

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
          {activeStep === 1 ? <VersionSelector /> : null}
          {activeStep === 2 ? <FileWizard /> : null}
          {activeStep === 3 ? <FileOptions /> : null}
          {activeStep === 4 ? <UploaderWizard /> : null}
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
