import React, { useContext } from 'react';
import useFetch from 'react-fetch-hook';
import * as _ from 'lodash';

import { ApiRoutes } from '@bella/data';
import { FileUploadDto, UploadPackageInfo, VersionDto } from '@bella/dto';

import { ErrorContext } from '../../combined/error-box';
import { ErrorSeverity } from '../../single/error-message';
import { IStep } from '../../single/wizard-stepper';

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

export interface PackageEditorStateValue {
  // stepper
  isStepSkipped: (step: number) => boolean;
  activeStep: number;
  stepMap: IStep[];
  handleNext: () => void;
  handleBack: () => void;
  handleSkip: () => void;
  handleReset: () => void;
  // data
  version: Record<'major' | 'minor', number>;
  handleVersionChange: (event: any, version: 'major' | 'minor') => void;
  versionHistory: VersionDto[] | undefined;
  currentVersion: VersionDto | undefined;
  isCurrentVersion: boolean;
  handleCurrentVersionChange: () => void;
  isPackage: boolean;
  files: Array<FileUploadDto | UploadPackageInfo>;
  setFiles: React.Dispatch<
    React.SetStateAction<Array<FileUploadDto | UploadPackageInfo>>
  >;
}

export const PackageEditorStateContext =
  React.createContext<PackageEditorStateValue>({
    isStepSkipped: (step: number) => false,
    activeStep: 0,
    stepMap,
    handleNext: () => null,
    handleBack: () => null,
    handleSkip: () => null,
    handleReset: () => null,
    version: { major: null, minor: null },
    handleVersionChange: (event: any, version: 'major' | 'minor') => null,
    versionHistory: undefined,
    currentVersion: undefined,
    isCurrentVersion: false,
    handleCurrentVersionChange: () => null,
    isPackage: false,
    files: [],
    setFiles: () => null,
  });

const PackageEditorStateContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { addError } = useContext(ErrorContext);

  const [activeStep, setActiveStep] = React.useState(1);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [version, setVersion] = React.useState<
    Record<'major' | 'minor', number>
  >({ major: 0, minor: 0 });

  const [isCurrentVersion, setIsCurrentVersion] =
    React.useState<boolean>(false);

  const [files, setFiles] =
    React.useState<Array<FileUploadDto | UploadPackageInfo>>(null);

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
    // isPackageBuilder && no package
    if (activeStep === 2 && (!files || files?.length === 0)) {
      addError(
        ErrorSeverity.WARNING,
        `Aby przejśc dalej musisz wybrac pliki / zbudowac paczkę`,
        false,
        null,
        `Brak plików!`,
      );
      return;
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) =>
      prevActiveStep === 2 && version.minor <= 1
        ? prevActiveStep + 2
        : prevActiveStep + 1,
    );
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    const min = _.minBy(stepMap, 'id').id;

    if (activeStep - 1 >= min)
      setActiveStep((prevActiveStep) =>
        activeStep === 4 && version.minor <= 1
          ? prevActiveStep - 2
          : prevActiveStep - 1,
      );
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
    <PackageEditorStateContext.Provider
      value={{
        isStepSkipped,
        activeStep,
        stepMap,
        handleNext,
        handleBack,
        handleSkip,
        handleReset,
        version,
        handleVersionChange,
        versionHistory,
        currentVersion,
        isCurrentVersion,
        handleCurrentVersionChange,
        isPackage: version.minor <= 1,
        files,
        setFiles,
      }}
    >
      {children}
    </PackageEditorStateContext.Provider>
  );
};

export default PackageEditorStateContextProvider;
