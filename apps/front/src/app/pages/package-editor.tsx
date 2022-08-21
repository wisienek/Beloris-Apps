import * as React from 'react';
import { Grid } from '@mui/material';
import {
  WizardStepper,
  StepperNavigation,
} from '../components/single/wizard-stepper';
import {
  UploaderWizard,
  VersionSelector,
} from '../components/combined/package-editor-wizard';
import * as _ from 'lodash';
import { ApiRoutes } from '../api/api-routes.enum';
import useFetch from 'react-fetch-hook';
import { VersionDto } from '@bella/dto';

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
    name: 'Wybierz pliki',
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
  const [version, setVersion] = React.useState<
    Record<'major' | 'minor', number>
  >({ major: 0, minor: 0 });
  const [isCurrentVersion, setIsCurrentVersion] =
    React.useState<boolean>(false);

  const { data: versionHistory } = useFetch<VersionDto[]>(
    ApiRoutes.VERSION_HISTORY,
  );
  const { data: currentVersion } = useFetch<VersionDto>(ApiRoutes.VERSION);

  const handleVersionChange = (e: any, type: 'major' | 'minor') => {
    const newValue = parseInt(e.target.value);
    if (!newValue || newValue < 0 || version[type] === newValue) return;

    setVersion({ ...version, [type]: newValue });
  };

  const handleCurrentVersionChange = () => {
    setIsCurrentVersion(!isCurrentVersion);
  };

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
    if (!stepMap.find((step) => step.id === activeStep).isOptional) {
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
          {activeStep === 1 && (
            <VersionSelector
              handleChange={handleVersionChange}
              version={version}
              currentVersion={currentVersion}
              versionHistory={versionHistory}
              isCurrentVersion={isCurrentVersion}
              handleCurrentVersionChange={handleCurrentVersionChange}
            />
          )}
          {activeStep === 2 && <UploaderWizard isPackage={true} />}
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
