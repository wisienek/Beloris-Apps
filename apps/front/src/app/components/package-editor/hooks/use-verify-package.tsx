import { useState, useEffect, useContext } from 'react';
import { PackageEditorStateContext, PackageEditorStateValue } from '../sections/package-editor.state';

export const useVerifyPackage = () => {
  const { version, isPackage, files } = useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const [toDo, setTodo] = useState<string[]>([]);

  const reVerify = () => {
    const newTodo = [...toDo];

    if (isNaN(version?.major) || version?.major === undefined || version.major === 0 || isNaN(version?.minor))
      newTodo.push(`Musisz ustalić poprawnå wersję!`);

    if (!isPackage && files.length === 0) newTodo.push(`Brak plików do przesłania!`);

    console.log(newTodo);
    setTodo(newTodo);
  };

  useEffect(() => {
    reVerify();
  }, [version, isPackage, files]);

  return { toDo };
};
