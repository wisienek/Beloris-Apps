import TransferList from '../../single/transfer-list';
import { Dispatch, SetStateAction } from 'react';

export interface FileSelectorArgs {
  filesMap: Record<number, string>;
  setSelectedFiles: Dispatch<SetStateAction<number[]>>;
  accept: () => void;
}

const FileSelector = ({
  filesMap,
  setSelectedFiles,
  accept,
}: FileSelectorArgs) => {
  return (
    <TransferList
      allItems={filesMap}
      selectedLeft={Object.keys(filesMap).map(Number)}
      selectedRight={[]}
      setParentRight={(numbers) => setSelectedFiles(numbers)}
      accept={accept}
    />
  );
};
export default FileSelector;
